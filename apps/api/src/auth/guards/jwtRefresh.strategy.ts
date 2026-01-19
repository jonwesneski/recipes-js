import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshGuardStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies['refresh_token'] as string;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_JWT_SECRET!,
      //expiresIn: '3d'
    });
  }

  validate(req: Request, payload: any) {
    // console.log('payload', payload);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const refreshToken = (req.cookies['refresh_token'] ??
      req.get('Authorization')?.replace('Bearer', '').trim()) as string;
    return { ...payload, refreshToken };
  }
}
