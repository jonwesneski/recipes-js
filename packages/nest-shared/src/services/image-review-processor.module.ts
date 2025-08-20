import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecipeRepositoryModule } from '../repositories/recipeRepository.module'; // I need to import a lot of these from the actual file rather than a barrel file; it causes a circulary dependency in NestJS
import { AwsModule } from './aws.module';
import { ImageReviewProcessorService } from './image-review-processor.service';
import { RekognitionService } from './rekognition.service';
import { S3Service } from './s3.service';

@Module({
  imports: [ConfigModule.forRoot(), AwsModule, RecipeRepositoryModule],
  controllers: [],
  providers: [ImageReviewProcessorService, RekognitionService, S3Service],
  exports: [
    AwsModule,
    RecipeRepositoryModule,
    ImageReviewProcessorService,
    RekognitionService,
    S3Service,
  ],
})
export class ImageReviewProcessorModule {}
