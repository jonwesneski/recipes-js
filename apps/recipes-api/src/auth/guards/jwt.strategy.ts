import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtGuardStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
      //expiresIn: '3d'
    });
  }

  validate(payload: any) {
    // console.log('payload', payload);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return payload;
  }
}
