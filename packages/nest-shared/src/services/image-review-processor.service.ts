import { Injectable, Logger } from '@nestjs/common';
import { NewRecipeMessageType, NewRecipeStepMessageType } from '../kafka/types';
import { RecipeRepository } from '../repositories/recipe.repository';
import { RekognitionService } from './rekognition.service';
import { S3Service } from './s3.service';

const ACCEPTABLE_LABELS = {
  Food: true,
  Fruit: true,
  Vegetable: true,
};

@Injectable()
export class ImageReviewProcessorService {
  private readonly logger = new Logger(ImageReviewProcessorService.name);

  constructor(
    private readonly recognitionService: RekognitionService,
    private readonly recipeRepository: RecipeRepository,
    private readonly s3Service: S3Service,
  ) {}

  async isValidFoodImage(imageBytes: Buffer<ArrayBuffer>): Promise<boolean> {
    // todo: I may move this method into image-review-processor.service.ts
    const { labels, moderationLabels } =
      await this.recognitionService.detectAllLabels(imageBytes);
    this.logger.log(
      `Detected labels: ${labels.map((label) => label.Name).join(', ')}`,
    );
    if (moderationLabels?.length) {
      this.logger.warn(
        `Image contains moderation labels: ${moderationLabels.map((label) => label.Name).join(', ')}`,
      );
      return false;
    }

    const nonFoods: string[] = [];
    for (const label of labels) {
      if (label.Name) {
        if (ACCEPTABLE_LABELS[label.Name] || label.Name?.includes('Food')) {
          return true;
        }
        nonFoods.push(label.Name);
      }
    }

    this.logger.warn(
      `Image does not contain food or ingredients, found: ${nonFoods.join(', ')}`,
    );
    return false;
  }

  public async processRecipeImage(
    userId: string,
    recipeMessage: NewRecipeMessageType,
  ) {
    const imageBuffer = Buffer.from(recipeMessage.base64Image, 'base64');
    if (await this.isValidFoodImage(imageBuffer)) {
      const s3BucketKeyName = this.makeBucketKeyName(
        userId,
        recipeMessage.recipeId,
      );
      const s3ImageUrl = await this.s3Service.uploadFile(
        s3BucketKeyName,
        imageBuffer,
        'image/jpg',
      );
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
    if (await this.isValidFoodImage(imageBuffer)) {
      const s3BucketKeyName = this.makeBucketKeyName(
        userId,
        recipeStepMessage.recipeId,
        recipeStepMessage.stepIndex,
      );
      const s3ImageUrl = await this.s3Service.uploadFile(
        s3BucketKeyName,
        imageBuffer,
        'image/jpg',
      );
      await this.recipeRepository.addImageToRecipeStep(
        recipeStepMessage.stepId,
        s3ImageUrl,
      );
    }
  }

  makeBucketKeyName(userId: string, id: string, stepIndex?: number) {
    var s3BucketKeyName = `${userId}/${id}`;
    if (stepIndex !== undefined) {
      s3BucketKeyName += `/step-${stepIndex}.jpg`;
    } else {
      s3BucketKeyName += `/main.jpg`;
    }
    return s3BucketKeyName;
  }
}
