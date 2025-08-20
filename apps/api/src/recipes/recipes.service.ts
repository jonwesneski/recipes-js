import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ImageReviewProcessorService,
  RecipeCreateType,
  type RecipeMinimalType,
  RecipeRepository,
  type RecipeType,
  RecipeUpdateType,
} from '@repo/nest-shared';
import { KafkaProducerService } from '@src/common';
import {
  CreateRecipeDto,
  CreateStepDto,
  PatchRecipeDto,
  PatchStepDto,
} from './contracts';

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

@Injectable()
export class RecipesService {
  private readonly useKafka: boolean;
  constructor(
    private readonly configService: ConfigService,
    private readonly recipeRepository: RecipeRepository,
    private readonly imageReviewProcessorService: ImageReviewProcessorService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {
    this.useKafka = this.configService.get<boolean>('USE_KAFKA', false);
  }

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

    await this.processImages(data, recipe);

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

  private async processImages(
    data: CreateRecipeDto | PatchRecipeDto,
    recipe: RecipeType,
  ) {
    if (this.useKafka) {
      await Promise.all([
        data.base64Image
          ? this.kafkaProducerService.sendMessage('new_recipe_image', {
              key: recipe.user.id,
              value: JSON.stringify({
                recipeId: recipe.id,
                base64Image: data.base64Image,
              }),
            })
          : undefined,
        ...(data.steps ?? []).map(
          (step: CreateStepDto | PatchStepDto, i: number) =>
            this.kafkaProducerService.sendMessage('new_recipe_step_image', {
              key: recipe.user.id,
              value: JSON.stringify({
                recipeId: recipe.id,
                stepId: recipe.steps[i].id,
                stepIndex: i,
                base64Image: step.base64Image,
              }),
            }),
        ),
      ]);
    } else {
      await Promise.all([
        data.base64Image
          ? this.imageReviewProcessorService.processRecipeImage(
              recipe.user.id,
              { recipeId: recipe.id, base64Image: data.base64Image },
            )
          : undefined,
        ...(data.steps ?? []).map(
          (step: CreateStepDto | PatchStepDto, i: number) => {
            if (step.base64Image) {
              return this.imageReviewProcessorService.processRecipeStepImage(
                recipe.user.id,
                {
                  recipeId: recipe.id,
                  stepId: recipe.steps[i].id,
                  stepIndex: i,
                  base64Image: step.base64Image,
                },
              );
            }
          },
        ),
      ]);
    }
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

    await this.processImages(data, recipe);

    return recipe;
  }

  private transformToRecipeUpdateType(data: PatchRecipeDto): RecipeUpdateType {
    const { base64Image, ...remaingData } = data;
    const { steps, ...recipeData } = remaingData;
    if (steps) {
      recipeData['steps'] = steps.map((s) => ({
        id: s.id,
        instruction: s.instruction,
        ingredients: s.ingredients,
      }));
    }

    return recipeData as RecipeUpdateType;
  }
}
