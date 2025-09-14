import { ConfigType, registerAs } from '@nestjs/config';

export const awsConfig = registerAs('awsConfig', () => ({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
  cloudFrontBaseUrl: process.env.AWS_CLOUDFRONT_BASE_URL!,
  s3EndpointUrl: process.env.AWS_S3_ENDPOINT_URL,
  s3BucketName: process.env.AWS_S3_BUCKET_NAME!,
}));

export type AwsConfigType = ConfigType<typeof awsConfig>;
