import { ConfigType, registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: parseInt(process.env.REFRESH_JWT_EXPIRE_IN || '259200', 10),
    },
  }),
);

export type JwtConfigType = ConfigType<typeof jwtConfig>;
