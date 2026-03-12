import { z } from "zod";

const emailEnvSchema = z.object({
  CDV2_EMAIL_API_KEY: z.string(),
  CDV2_EMAIL_BASE_URL: z.string().url(),
});

export const emailEnv = emailEnvSchema.parse(process.env);
