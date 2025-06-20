import { ConfigType, registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export const jwtRefreshConfig = registerAs(
  'jwt-refresh',
  (): JwtSignOptions => ({
    secret: process.env.REFRESH_JWT_SECRET,

    expiresIn: process.env.REFRESH_JWT_EXPIRE_IN || '3d',
  }),
);

export type JwtRefreshConfigType = ConfigType<typeof jwtRefreshConfig>;
