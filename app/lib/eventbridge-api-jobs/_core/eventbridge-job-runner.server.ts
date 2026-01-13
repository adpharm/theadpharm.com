import type { ActionFunctionArgs } from "react-router";
import { type EventBridgeEvent } from "aws-lambda";
import { db } from "~/lib/db/index.server";
import { eventbridgeRawEventsTable } from "~/lib/db/schemas/eventbridge-schema";
import { and, eq } from "drizzle-orm";
import { serverError, serverResponse } from "~/lib/router/server-responses.server";
import { eventBridgeBaseDetailSchema } from "~/lib/aws/eventbridge/detail-schemas-utils";
import { awsEventbridgeEnv } from "~/lib/env/aws-eventbridge-env.server";
import jobHandlerMap from "~/lib/eventbridge-api-jobs/_core/eventbridge-job-map";

export async function eventbridgeApiActionHandler({ request }: ActionFunctionArgs) {
  // must be a POST request
  if (request.method !== "POST") {
    throw new Error("Method not allowed");
  }

  //
  // API Protection: Basic Auth
  //
  const auth = request.headers.get("Authorization");
  const expectedBasicAuth = btoa(
    `${awsEventbridgeEnv.EVENTBRIDGE_HANDLER_BASIC_USERNAME}:${awsEventbridgeEnv.EVENTBRIDGE_HANDLER_BASIC_PASSWORD}`
  );
  if (auth !== `Basic ${expectedBasicAuth}`) {
    console.error(":::Unauthorized");
    throw serverError(401);
  }

  // must have a body
  const body: EventBridgeEvent<string, any> = await request.json();

  //
  // parse the event detail input data
  //   use the base detail schema because we don't need to validate the data, that's done in each specific action
  //
  const { error, data: eventbridgeEventDetail_unsafe, success } = eventBridgeBaseDetailSchema.safeParse(body.detail);

  if (!eventbridgeEventDetail_unsafe || !success) {
    console.error(":::error parsing eventbridge api job detail");
    console.error(error);

    // a 400 error will not be retried by eventbridge
    // this is intentional, because if the schema is invalid, we want to fail fast
    // and not retry the event.
    //
    // Eventbridge retries events associated with error codes 401, 407, 409, 429, and 5xx.
    // Does not retry events associated with error codes 1xx, 2xx, 3xx, and 4xx (other than those noted above).
    //
    return serverError(400, "Invalid event detail");
  }

  //
  // parse the event detail data
  //
  // don't destructure the parsedData, we need to pass it to the action
  //
  const my_metadata = eventbridgeEventDetail_unsafe.my_metadata;
  // const data = eventbridgeEventDetail_unsafe.data;
  // const resourceId = data.resourceId;
  const eventId = my_metadata.id;
  const jobDirectoryNameAndDetailType = body["detail-type"];

  // if (!resourceId) {
  //   console.error(":::resourceId is required in the event detail data");
  //   throw new Error("Resource ID is required");
  // }

  //
  // Check if the event was processed successfully or is currently being processed
  //   we have to do this because eventbridge has a 5s timeout for api destinations
  //   and we want to make this function idempotent
  //
  const in_progressOrSuccessfulEvent = (
    await db
      .select()
      .from(eventbridgeRawEventsTable)
      .where(
        and(
          // where the event_id is the same as the one in the event
          eq(eventbridgeRawEventsTable.event_id, eventId),
          // and...
          eq(eventbridgeRawEventsTable.detail_type, jobDirectoryNameAndDetailType)
        )
      )
  ).at(0);

  const MAX_TIMES_IN_PROGRESS = 3;

  //
  // if "in_progress", return an error code so eventbridge will retry
  //
  if (
    in_progressOrSuccessfulEvent?.status === "in_progress" &&
    in_progressOrSuccessfulEvent.current_times_in_progress < MAX_TIMES_IN_PROGRESS
  ) {
    const msg = `:::Skipping this invocation. Event with id ${eventId} and detail type ${jobDirectoryNameAndDetailType} is marked as "in_progress". Eventbridge will retry.`;
    console.log(msg);
    // if we're stuck in_progress, we want to increment the current_times_in_progress
    await db
      .update(eventbridgeRawEventsTable)
      .set({ current_times_in_progress: in_progressOrSuccessfulEvent.current_times_in_progress + 1 })
      .where(
        and(
          eq(eventbridgeRawEventsTable.event_id, eventId),
          eq(eventbridgeRawEventsTable.detail_type, jobDirectoryNameAndDetailType)
        )
      );
    throw serverError(409, msg);
  }

  //
  // if "success", return a success code so eventbridge will not retry
  //
  if (in_progressOrSuccessfulEvent?.status === "success") {
    const msg = `:::Skipping this invocation. Event with id ${eventId} and detail type ${jobDirectoryNameAndDetailType} is marked as "${in_progressOrSuccessfulEvent.status}". Eventbridge will not retry.`;
    console.log(msg);
    throw serverResponse({ message: msg });
  }

  //
  // Immediately save the raw event to the DB with status "in_progress"
  //   if it was failed, we want to update the status to "in_progress"
  //
  await db
    .insert(eventbridgeRawEventsTable)
    .values({
      // resource_id: resourceId,
      event_id: eventId,
      raw_event_payload: body,
      status: "in_progress",
      detail_type: jobDirectoryNameAndDetailType,
      current_times_in_progress: 0,
    })
    .onConflictDoUpdate({
      target: [eventbridgeRawEventsTable.event_id, eventbridgeRawEventsTable.detail_type],
      set: {
        status: "in_progress",
        current_times_in_progress: 0,
      },
    });

  //
  // Wrap the processing in a try/catch so we can update the eventbridge raw event to failed
  // if the processing fails
  //
  try {
    //
    // Process the event based on the detail type
    //
    // get the handler from the handler map
    const handler = jobHandlerMap[jobDirectoryNameAndDetailType];
    if (!handler) throw new Response(`Unknown job directory name: ${jobDirectoryNameAndDetailType}`, { status: 400 });

    // call the handler
    await handler(eventbridgeEventDetail_unsafe, request);

    // await match(detailType)
    //   .with("figma-image-extractor-started", async () => {
    //     console.log(":::Event received: figma-image-extractor-started");
    //     // trigger the figma image extractor job
    //     await figmaImageExtractorJob(parsedData);
    //   })
    //   .with("figma-image-extractor-completed-successfully", async () => {
    //     console.log(":::Event received: figma-image-extractor-completed-successfully");
    //     console.log(":::No action needed for event 'figma-image-extractor-completed-successfully'");
    //   })
    //   .exhaustive();

    //
    // Update the eventbridge raw event to success
    //
    await db
      .update(eventbridgeRawEventsTable)
      .set({ status: "success" })
      .where(
        and(
          eq(eventbridgeRawEventsTable.event_id, eventId),
          eq(eventbridgeRawEventsTable.detail_type, jobDirectoryNameAndDetailType)
        )
      );

    return serverResponse({
      message: `Job with detail type "${jobDirectoryNameAndDetailType}" completed successfully`,
    });
  } catch (error) {
    console.error(`:::error processing job with detail type "${jobDirectoryNameAndDetailType}"`);
    console.error(error);

    //
    // Update the eventbridge raw event to failed
    //
    await db
      .update(eventbridgeRawEventsTable)
      .set({ status: "failed" })
      .where(
        and(
          eq(eventbridgeRawEventsTable.event_id, eventId),
          eq(eventbridgeRawEventsTable.detail_type, jobDirectoryNameAndDetailType)
        )
      );

    // rethrow the error
    throw error;
  }
}
