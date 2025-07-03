import { ConfigType, registerAs } from '@nestjs/config';

export const awsConfig = registerAs('awsConfig', () => ({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
  cloudFrontBaseUrl: process.env.AWS_CLOUDFRONT_BASE_URL!,
}));

export type AwsConfigType = ConfigType<typeof awsConfig>;
