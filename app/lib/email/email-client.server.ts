import { EmailClient } from "@cdv2/email";
import { emailEnv } from "~/lib/env/email-env.server";

export const emailClient = new EmailClient({
  apiKey: emailEnv.CDV2_EMAIL_API_KEY,
  baseUrl: emailEnv.CDV2_EMAIL_BASE_URL,
});

export const EMAIL_FROM = "The AdPharm <no-reply@hq.theadpharm.com>";
export const EMAIL_TO = "digital@theadpharm.com";
