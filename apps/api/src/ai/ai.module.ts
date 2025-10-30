import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RecipeRepository, RecipeRepositoryModule } from '@repo/nest-shared';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [ConfigModule.forRoot(), RecipeRepositoryModule],
  controllers: [AiController],
  providers: [
    {
      provide: AiService,
      inject: [ConfigService, RecipeRepository],
      useFactory: async (
        configService: ConfigService,
        recipeRepository: RecipeRepository,
      ) => {
        return await AiService.createInstance(
          configService.getOrThrow('GOOGLE_AI_STUDIO_API_KEY'),
          recipeRepository,
        );
      },
    },
  ],
})
export class AiModule {}
