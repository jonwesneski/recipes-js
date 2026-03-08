import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ImageReviewProcessorService,
  RecipeCreateType,
  RecipeRepository,
  type RecipeType,
  RecipeUpdateType,
  S3Service,
} from '@repo/nest-shared';
import { KafkaProducerService } from '@src/common';
import { recipesDtoToQueryParams } from '@src/common/transforms';
import { NotificationsService } from '@src/notifications/notifications.service';
import {
  CreateRecipeDto,
  PatchRecipeDto,
  RecipeListResponse,
} from './contracts';
import { PutBookmarkRecipeDto } from './contracts/bookmark-recipe.dto';
import { GetRecipesDto } from './contracts/get-recipes.dto';

@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);

  private readonly useKafka: boolean;
  constructor(
    private readonly configService: ConfigService,
    private readonly recipeRepository: RecipeRepository,
    private readonly imageReviewProcessorService: ImageReviewProcessorService,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly notificationsService: NotificationsService,
    private readonly s3Service: S3Service,
  ) {
    this.useKafka = this.configService.get<boolean>('USE_KAFKA', false);
  }

  async getRecipes(params: GetRecipesDto): Promise<RecipeListResponse> {
    return await this.recipeRepository.getPublicRecipes(
      recipesDtoToQueryParams(params),
    );
  }

  async getPublicRecipe(id: string, userId?: string): Promise<RecipeType> {
    return await this.recipeRepository.getPublicRecipe(id, userId);
  }

  async getRecipe(
    id: string,
    byOwner: boolean,
    userId?: string,
  ): Promise<RecipeType> {
    if (byOwner && userId) {
      return await this.recipeRepository.getRecipe(id, userId);
    }
    return await this.recipeRepository.getPublicRecipe(id, userId);
  }

  async createRecipe(
    userId: string,
    data: CreateRecipeDto,
  ): Promise<RecipeType> {
    const recipe = await this.recipeRepository.createRecipe(
      userId,
      this.transformToRecipeCreateType(data),
    );

    const stepsWithImages: { stepId: string; base64Image: string }[] =
      data.steps
        .map((step, i) => ({
          stepId: recipe.steps[i].id,
          base64Image: step.base64Image ?? '',
        }))
        .filter((s) => s.base64Image && s.stepId);
    void this.processImages({
      userId,
      recipeId: recipe.id,
      steps: stepsWithImages,
    }).catch((e) => this.logger.error(JSON.stringify(e)));

    void this.notificationsService
      .recipeAdded(userId, recipe)
      .catch((e) => this.logger.error(JSON.stringify(e)));

    return recipe;
  }

  private transformToRecipeCreateType(data: CreateRecipeDto): RecipeCreateType {
    // Do not send base64Image to the repository
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- needed
    const { base64Image, ...remaingData } = data;
    const { steps, ...recipeData } = remaingData;
    recipeData['steps'] = steps.map((s) => ({
      instruction: s.instruction,
      ingredients: s.ingredients,
    }));
    return recipeData as RecipeCreateType;
  }

  private async processImages(params: {
    userId: string;
    recipeId: string;
    base64Image?: string;
    steps: { stepId: string; base64Image: string }[];
  }) {
    if (this.useKafka) {
      await Promise.all([
        params.base64Image
          ? this.kafkaProducerService.sendMessage('new_recipe_image', {
              key: params.userId,
              value: JSON.stringify({
                recipeId: params.recipeId,
                base64Image: params.base64Image,
              }),
            })
          : undefined,
        ...params.steps.map(({ stepId, base64Image }) =>
          this.kafkaProducerService.sendMessage('new_recipe_step_image', {
            key: params.userId,
            value: JSON.stringify({
              recipeId: params.recipeId,
              stepId,
              base64Image,
            }),
          }),
        ),
      ]);
    } else {
      await Promise.all([
        params.base64Image
          ? this.imageReviewProcessorService.processRecipeImage(params.userId, {
              recipeId: params.recipeId,
              base64Image: params.base64Image,
            })
          : undefined,
        ...params.steps.map(({ stepId, base64Image }) =>
          this.imageReviewProcessorService.processRecipeStepImage(
            params.userId,
            { recipeId: params.recipeId, stepId, base64Image },
          ),
        ),
      ]);
    }
  }

  async updateRecipe(
    userId: string,
    id: string,
    data: PatchRecipeDto,
  ): Promise<RecipeType> {
    const { recipe, deletedStepImageUrls } =
      await this.recipeRepository.updateRecipe(
        userId,
        id,
        this.transformToRecipeUpdateType(data),
      );

    const stepsWithImages: { stepId: string; base64Image: string }[] = (
      data.steps?.update ?? []
    )
      .filter((s) => !!s.base64Image)
      .map((s) => ({ stepId: s.id, base64Image: s.base64Image! }));
    void this.processImages({
      userId,
      recipeId: id,
      steps: stepsWithImages,
    }).catch((e) => this.logger.error(JSON.stringify(e)));

    void this.deleteImages(deletedStepImageUrls).catch((e) =>
      this.logger.error(JSON.stringify(e)),
    );

    return recipe;
  }

  private async deleteImages(deletedStepImageUrls: string[]) {
    await this.s3Service.deleteFiles(deletedStepImageUrls);
  }

  private transformToRecipeUpdateType(data: PatchRecipeDto): RecipeUpdateType {
    // Do not send base64Image to the repository
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- needed
    const { base64Image, ...remainingData } = data;
    remainingData.steps?.add?.forEach((s) => {
      s.base64Image = undefined;
    });
    remainingData.steps?.update?.forEach((s) => {
      s.base64Image = undefined;
    });
    return remainingData as RecipeUpdateType;
  }

  async deleteRecipe(id: string, userId: string): Promise<void> {
    await this.recipeRepository.delete(id, userId);
  }

  async bookmarkRecipe(
    recipeId: string,
    userId: string,
    body: PutBookmarkRecipeDto,
  ) {
    await this.recipeRepository.bookmark(recipeId, userId, body.bookmark);
  }
}
