import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { HealthCheckModule } from './healthCheck';
import { RecipesModule } from './recipes';
import { TagsModule } from './tags';

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
      },
    }),
    AuthModule,
    HealthCheckModule,
    RecipesModule,
    TagsModule,
  ],
})
export class AppModule {}
