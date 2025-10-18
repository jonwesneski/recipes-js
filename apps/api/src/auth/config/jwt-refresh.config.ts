import { ConfigType, registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export const jwtRefreshConfig = registerAs(
  'jwt-refresh',
  (): JwtSignOptions => ({
    secret: process.env.REFRESH_JWT_SECRET,
    expiresIn: parseInt(process.env.REFRESH_JWT_EXPIRE_IN || '259200', 10),
  }),
);

export type JwtRefreshConfigType = ConfigType<typeof jwtRefreshConfig>;
