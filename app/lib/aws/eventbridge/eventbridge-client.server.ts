import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { fromSSO } from "@aws-sdk/credential-providers";

export const eventbridgeClient = new EventBridgeClient({
  region: "ca-central-1",
  credentials: process.env.NODE_ENV === "production" ? undefined : fromSSO({ profile: "pharmer" }),
});
