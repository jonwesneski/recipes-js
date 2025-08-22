import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AwsModule,
  ImageReviewProcessorModule,
  KafkaProducerModule,
  RecipeRepositoryModule,
  RekognitionService,
  S3Service,
} from '@repo/nest-shared';
import { KafkaProducerService } from '@src/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AwsModule,
    KafkaProducerModule,
    RecipeRepositoryModule,
    ImageReviewProcessorModule,
  ],
  controllers: [RecipesController],
  providers: [
    RecipesService,
    RekognitionService,
    S3Service,
    {
      provide: KafkaProducerService,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        if (configService.get('SWAGGER_ONLY')) {
          return null;
        }

        return await KafkaProducerService.createInstance(
          configService.getOrThrow('kafkaProducerConfig'),
        );
      },
    },
  ],
})
export class RecipesModule {}
