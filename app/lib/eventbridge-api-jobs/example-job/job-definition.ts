import { z } from "zod";
import { eventBridgeBaseDetailSchema } from "~/lib/aws/eventbridge/detail-schemas-utils";
import type { JobDefinition } from "~/lib/eventbridge-api-jobs/_core/eventbridge-job-utils";

export const exampleJobDefinition = {
  jobDirectoryName: "example-job",
  eventbridgeEventDetailSchema: eventBridgeBaseDetailSchema.extend({
    data: z.object({}),
  }),
} as const satisfies JobDefinition;
