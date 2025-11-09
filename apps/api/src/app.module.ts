import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { HealthCheckModule } from './healthCheck';
import { NotificationsModule } from './notifications/notifications.module';
import { RecipesModule } from './recipes';
import { TagsModule } from './tags';
import { UsersModule } from './users';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.SWAGGER_ONLY === 'true' ? '.env.test' : undefined,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.cookies.access_token',
          ],
          censor: '******',
        },
      },
    }),
    AiModule,
    AuthModule,
    HealthCheckModule,
    NotificationsModule,
    RecipesModule,
    TagsModule,
    UsersModule,
  ],
})
export class AppModule {}
