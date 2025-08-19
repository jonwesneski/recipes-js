import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecipeRepository } from 'src/repositories';
import { awsConfig } from '../configs/aws.config';
import { ImageReviewProcessorService } from './image-review-processor.service';
import { PrismaService } from './prisma.service';
import { RekognitionService } from './rekognition.service';
import { S3Service } from './s3.service';

@Module({
  imports: [ConfigModule.forRoot(), ConfigModule.forFeature(awsConfig)],
  controllers: [],
  providers: [
    ImageReviewProcessorService,
    PrismaService,
    RecipeRepository,
    RekognitionService,
    S3Service,
  ],
  exports: [
    ConfigModule.forFeature(awsConfig),
    ImageReviewProcessorService,
    PrismaService,
    RecipeRepository,
    RekognitionService,
    S3Service,
  ],
})
export class ImageReviewProcessorModule {}
