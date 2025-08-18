import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AwsModule,
  KafkaProducerModule,
  PrismaService,
  RecipeRepository,
  RekognitionService,
  S3Service,
} from '@repo/nest-shared';
import { KafkaProducerService } from '@src/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  imports: [AwsModule, KafkaProducerModule],
  controllers: [RecipesController],
  providers: [
    RecipesService,
    RecipeRepository,
    RekognitionService,
    PrismaService,
    S3Service,
    {
      provide: KafkaProducerService,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return await KafkaProducerService.createInstance(
          configService.getOrThrow('kafkaProducerConfig'),
        );
      },
    },
  ],
})
export class RecipesModule {}
