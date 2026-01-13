import { exampleJobDefinition } from "./job-definition";
import type { eventBridgeBaseDetailSchema } from "~/lib/aws/eventbridge/detail-schemas-utils";
import type { z } from "zod";

export default async function jobHandler(
  eventbridgeEventDetail_unsafe: z.infer<typeof eventBridgeBaseDetailSchema>,
  request: Request
): Promise<void> {
  //
  // parse the data
  //
  const { data, my_metadata } = exampleJobDefinition.eventbridgeEventDetailSchema.parse(eventbridgeEventDetail_unsafe);

  console.log(":::example-job", data, my_metadata);

  return;
}
