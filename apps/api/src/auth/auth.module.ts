import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@repo/nest-shared';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { googleOAuthConfig } from './config/google-oauth.config';
import { jwtRefreshConfig } from './config/jwt-refresh.config';
import { jwtConfig } from './config/jwt.config';
import { GoogleStrategy, JwtGuard, JwtGuardStrategy } from './guards';

@Module({
  imports: [
    ConfigModule.forFeature(googleOAuthConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(jwtRefreshConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtGuardStrategy,
    JwtGuard,
    GoogleStrategy,
    PrismaService,
  ],
})
export class AuthModule {}
