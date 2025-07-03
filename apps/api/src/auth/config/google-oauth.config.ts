import { ConfigType, registerAs } from '@nestjs/config';

export const googleOAuthConfig = registerAs('googleOAuth', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_SECRET!,
  callbackUrl: process.env.GOOGLE_CALLBACK_URL!,
}));

export type GoogleOAuthConfigType = ConfigType<typeof googleOAuthConfig>;
