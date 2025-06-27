import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type JwtGoogleType } from '@repo/zod-schemas';
import { PrismaService } from 'src/common/prisma.service';
import {
  jwtRefreshConfig,
  type JwtRefreshConfigType,
} from './config/jwt-refresh.config';
import { GoogleAuthDto } from './guards';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    @Inject(jwtRefreshConfig.KEY)
    private jwtRefreshTokenConfig: JwtRefreshConfigType,
    private readonly prisma: PrismaService,
  ) {}

  async generateTokens(payload: JwtGoogleType) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.jwtRefreshTokenConfig),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateGoogleUser(user: GoogleAuthDto) {
    let userRecord = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!userRecord) {
      this.logger.log('creating user from gmail');

      const now = new Date();
      const secondsSinceEpoch = Math.floor(now.getTime() / 1000);
      const handle = user.name + secondsSinceEpoch.toString();

      userRecord = await this.prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          handle,
        },
      });
    }
    const tokens = await this.generateTokens({
      sub: userRecord.id,
      email: userRecord.email,
      handle: userRecord.handle,
    });

    return { userRecord, tokens };
  }
}
