import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AiController],
  providers: [
    {
      provide: AiService,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return await AiService.createInstance(
          configService.getOrThrow('GOOGLE_AI_STUDIO_API_KEY'),
        );
      },
    },
  ],
})
export class AiModule {}
