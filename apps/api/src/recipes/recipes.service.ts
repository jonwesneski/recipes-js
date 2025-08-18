import { Injectable } from '@nestjs/common';
import {
  RecipeCreateType,
  type RecipeMinimalType,
  RecipeRepository,
  type RecipeType,
  RecipeUpdateType,
  RekognitionService,
  S3Service,
} from '@repo/nest-shared';
import { KafkaProducerService } from '@src/common';
import { CreateRecipeDto, PatchRecipeDto } from './contracts';

type ImageDto = {
  imageBuffer: Buffer<ArrayBuffer>;
  s3BucketKeyName: string;
  s3ImageUrl: string;
};

type RecipeStepImageDto = {
  id: string;
  image: ImageDto;
};

type RecipeImagesDto = {
  userId: string;
  id: string;
  image?: ImageDto;
  steps: RecipeStepImageDto[];
};

let tryItOut = true;

@Injectable()
export class RecipesService {
  constructor(
    private readonly recipeRepository: RecipeRepository,
    private readonly recognitionService: RekognitionService,
    private readonly s3Service: S3Service,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  async getRecipes(): Promise<RecipeMinimalType[]> {
    return await this.recipeRepository.getRecipes();
  }

  async getRecipe(id: string): Promise<RecipeType> {
    return await this.recipeRepository.getRecipe(id);
  }

  async createRecipe(
    userId: string,
    data: CreateRecipeDto,
  ): Promise<RecipeType> {
    const recipe = await this.recipeRepository.createRecipe(
      userId,
      this.transformToRecipeCreateType(data),
    );
    if (tryItOut) {
      const stepImages = data.steps.reduce(
        (acc, step, i) => {
          if (step.base64Image) {
            acc.push({
              id: recipe.steps[i].id,
              base64Image: step.base64Image,
            });
          }
          return acc;
        },
        [] as { id: string; base64Image: string }[],
      );

      await Promise.all([
        data.base64Image
          ? this.kafkaProducerService.sendMessage('new_recipe_image', {
              key: recipe.id,
              value: data.base64Image,
            })
          : null,
        ...stepImages.map((stepImage) =>
          this.kafkaProducerService.sendMessage('new_recipe_step_image', {
            key: stepImage.id,
            value: stepImage.base64Image,
          }),
        ),
      ]);
    } else {
      const images = this.makeImagesDto(data, recipe);
      if (images.image?.imageBuffer) {
        await this.recognitionService.isValidFoodImage(
          images.image.imageBuffer,
        );
        await this.s3Service.uploadFile(
          images.image.s3BucketKeyName,
          images.image.imageBuffer,
        );

        await Promise.all([
          images.image
            ? this.recipeRepository.addImageToRecipe(
                recipe.id,
                images.image.s3ImageUrl,
              )
            : null,
          ...images.steps.map((step) =>
            this.recipeRepository.addImageToRecipeStep(
              step.id,
              step.image.s3ImageUrl,
            ),
          ),
        ]);
      }
    }

    return recipe;
  }

  private transformToRecipeCreateType(data: CreateRecipeDto): RecipeCreateType {
    const { base64Image, ...remaingData } = data;
    const { steps, ...recipeData } = remaingData;
    recipeData['steps'] = steps.map((s) => ({
      instruction: s.instruction,
      ingredients: s.ingredients,
    }));
    return recipeData as RecipeCreateType;
  }

  private makeImagesDto(
    data: CreateRecipeDto | PatchRecipeDto,
    recipeRecord: RecipeType,
  ) {
    // todo: this might exist in image-review processor

    const images: RecipeImagesDto = {
      userId: recipeRecord.user.id,
      id: recipeRecord.id,
      steps: [],
    };
    if (data.base64Image) {
      const { s3BucketKeyName, s3ImageUrl } = this.s3Service.makeS3ImageUrl(
        recipeRecord.user.id,
        recipeRecord.id,
      );
      images.image = {
        imageBuffer: Buffer.from(data.base64Image, 'base64'),
        s3BucketKeyName,
        s3ImageUrl,
      };
    }
    if (data?.steps && data.steps.length > 0) {
      images.steps.push(
        ...data.steps.reduce((acc, s, i) => {
          if (s.base64Image) {
            const { s3BucketKeyName, s3ImageUrl } =
              this.s3Service.makeS3ImageUrl(
                recipeRecord.user.id,
                recipeRecord.id,
                i,
              );
            acc.push({
              id: recipeRecord.steps[i].id,
              image: {
                imageBuffer: Buffer.from(s.base64Image, 'base64'),
                s3BucketKeyName,
                s3ImageUrl,
              },
            });
          }

          return acc;
        }, [] as RecipeStepImageDto[]),
      );
    }

    return images;
  }

  async updateRecipe(
    userId: string,
    id: string,
    data: PatchRecipeDto,
  ): Promise<RecipeType> {
    const recipe = await this.recipeRepository.updateRecipe(
      userId,
      id,
      this.transformToRecipeUpdateType(data),
    );

    if (data.base64Image) {
      const images = this.makeImagesDto(data, recipe);
      if (images.image?.imageBuffer) {
        await this.recognitionService.isValidFoodImage(
          images.image.imageBuffer,
        );
        await this.s3Service.uploadFile(
          images.image.s3BucketKeyName,
          images.image.imageBuffer,
        );
      }
    }

    return recipe;
  }

  private transformToRecipeUpdateType(data: PatchRecipeDto): RecipeUpdateType {
    const { base64Image, ...remaingData } = data;
    const { steps, ...recipeData } = remaingData;
    if (steps) {
      recipeData['steps'] = steps.map((s) => ({
        instruction: s.instruction,
        ingredients: s.ingredients,
      }));
    }

    return recipeData as RecipeUpdateType;
  }
}
