import { Module } from '@nestjs/common';
import {
  PrismaService,
  RecipeRepository,
  RekognitionService,
  S3Service,
} from '@repo/nest-shared';
import { AwsModule } from 'src/common/aws.module';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  imports: [AwsModule],
  controllers: [RecipesController],
  providers: [
    RecipesService,
    RecipeRepository,
    RekognitionService,
    PrismaService,
    S3Service,
  ],
})
export class RecipesModule {}
