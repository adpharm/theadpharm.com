import { z } from "zod";

/**
 * AWS S3 environment variables
 */
const awsS3EnvSchema = z.object({
  /**
   * The S3 bucket name
   */
  S3_BUCKET_NAME: z.string(),
  /**
   * The S3 processed uploads folder
   */
  S3_PROCESSED_UPLOADS_FOLDER: z.string(),
  /**
   * The CDN fully qualified domain name
   */
  CDN_FQDN: z.string(),
});

const awsS3Env = awsS3EnvSchema.parse({
  ...process.env,
});

export { awsS3Env };
