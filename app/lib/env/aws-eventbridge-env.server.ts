import { z } from "zod";

/**
 * Server environment variables
 *
 * Those prefixed with `PUBLIC_` are available to the client
 */
const awsEventbridgeEnvSchema = z.object({
  /**
   * The EventBridge handler basic username
   */
  EVENTBRIDGE_HANDLER_BASIC_USERNAME: z.string(),
  /**
   * The EventBridge handler basic password
   */
  EVENTBRIDGE_HANDLER_BASIC_PASSWORD: z.string(),
  /**
   * The EventBridge bus name
   */
  EVENT_BRIDGE_BUS_NAME: z.string(),
  /**
   * The EventBridge source name to trigger the app eventbridge event handler
   */
  EVENTBRIDGE_SOURCE_NAME_TO_TRIGGER_APP_EVENTBRIDGE_HANDLER: z.string(),
});

const awsEventbridgeEnv = awsEventbridgeEnvSchema.parse({
  ...process.env,
});

export { awsEventbridgeEnv };
