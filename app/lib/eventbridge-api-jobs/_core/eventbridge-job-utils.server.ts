import { PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { eventbridgeClient } from "~/lib/aws/eventbridge/eventbridge-client.server";
import { awsEventbridgeEnv } from "~/lib/env/aws-eventbridge-env.server";
import { z } from "zod";
import type { JobDefinition } from "./eventbridge-job-utils";

export async function sendEventbridgeEvent<JD extends JobDefinition>(
  jobDefinition: JD,
  eventbridgeEventDetailData: z.infer<JD["eventbridgeEventDetailSchema"]>
) {
  //
  // Signal the eventbridge that the event has been processed successfully
  //
  const cmd = new PutEventsCommand({
    Entries: [
      {
        EventBusName: awsEventbridgeEnv.EVENT_BRIDGE_BUS_NAME,
        Source: awsEventbridgeEnv.EVENTBRIDGE_SOURCE_NAME_TO_TRIGGER_APP_EVENTBRIDGE_HANDLER,
        // DetailType: getEnumVal(eventbridgeRawEventsDetailTypeEnum, detailType),
        DetailType: jobDefinition.jobDirectoryName,
        Detail: JSON.stringify(
          eventbridgeEventDetailData
          // eventbridgeDetailSchemas[detailType].parse({
          //   my_metadata: {
          //     id,
          //     timestamp: new Date().toISOString(),
          //     retry_count: 0,
          //   },
          //   data,
          // } satisfies z.infer<(typeof eventbridgeDetailSchemas)[typeof detailType]>)
        ),
        Time: new Date(),
      },
    ],
  });

  const res = await eventbridgeClient.send(cmd);

  const eventId = res.Entries?.[0]?.EventId;

  if (!eventId) {
    throw new Error(`Failed to send to eventbridge to signal ${jobDefinition.jobDirectoryName} job`);
  }

  console.log(`:::sent to eventbridge to signal ${jobDefinition.jobDirectoryName} job. EventId: ${eventId}`);

  return eventId;
}
