// TODO: add this to api app as well. I want to feature flag this thing incase I want to turn kafka off
import { Injectable, Logger } from '@nestjs/common';
import { NewRecipeMessageType, NewRecipeStepMessageType } from '../kafka/types';
import { RecipeRepository } from '../repositories/recipe.repository';
import { RekognitionService } from './rekognition.service';
import { S3Service } from './s3.service';

@Injectable()
export class ImageReviewProcessorService {
  private readonly logger = new Logger(ImageReviewProcessorService.name);

  constructor(
    private readonly recognitionService: RekognitionService,
    private readonly recipeRepository: RecipeRepository,
    private readonly s3Service: S3Service,
  ) {}

  public async processRecipeImage(
    userId: string,
    recipeMessage: NewRecipeMessageType,
  ) {
    const imageBuffer = Buffer.from(recipeMessage.base64Image, 'base64');
    if (await this.recognitionService.isValidFoodImage(imageBuffer)) {
      const { s3BucketKeyName, s3ImageUrl } = this.s3Service.makeS3ImageUrl(
        userId,
        recipeMessage.recipeId,
      );
      await this.s3Service.uploadFile(s3BucketKeyName, imageBuffer);
      await this.recipeRepository.addImageToRecipe(
        recipeMessage.recipeId,
        s3ImageUrl,
      );
    }
  }

  public async processRecipeStepImage(
    userId: string,
    recipeStepMessage: NewRecipeStepMessageType,
  ) {
    const imageBuffer = Buffer.from(recipeStepMessage.base64Image, 'base64');
    if (await this.recognitionService.isValidFoodImage(imageBuffer)) {
      const { s3BucketKeyName, s3ImageUrl } = this.s3Service.makeS3ImageUrl(
        userId,
        recipeStepMessage.recipeId,
        recipeStepMessage.stepIndex,
      );
      await this.s3Service.uploadFile(s3BucketKeyName, imageBuffer);
      await this.recipeRepository.addImageToRecipeStep(
        recipeStepMessage.stepId,
        s3ImageUrl,
      );
    }
  }
}
