import { z } from "zod";

/**
 * Job definition
 */
export type JobDefinition = {
  jobDirectoryName: string;
  eventbridgeEventDetailSchema: z.ZodTypeAny;
};
