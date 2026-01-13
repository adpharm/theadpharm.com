import { z } from "zod";

/**
 * The base detail schema for all eventbridge events
 *
 * This is used to parse the eventbridge event body
 *
 * It is not used to validate the data, that's done in each specific action
 *
 * It is used to get the my_metadata and data from the eventbridge event body
 */
export const eventBridgeBaseDetailSchema = z.object({
  my_metadata: z.object({
    id: z.string(),
    timestamp: z.string(),
    retry_count: z.number(),
    // detail_type: z.string(),
  }),

  data: z.any(),
});
