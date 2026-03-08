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

    await this.processImages(data, recipe);
    void this.notificationsService
      .recipeAdded(userId, recipe)
      .catch((e) => this.logger.error(JSON.stringify(e)));

    return recipe;
  }

  private transformToRecipeCreateType(data: CreateRecipeDto): RecipeCreateType {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- do not base64Image here
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
    // For CreateRecipeDto: steps is a flat array, match by index.
    // For PatchRecipeDto: steps is StepOperationsDto; only process update steps
    // (they have known IDs). Add steps' IDs aren't available here.
    const stepsWithImages: { stepId: string; base64Image: string }[] =
      Array.isArray(data.steps)
        ? data.steps
            .map((step, i) => ({
              stepId: recipe.steps[i]?.id ?? '',
              base64Image: step.base64Image ?? '',
            }))
            .filter((s) => s.base64Image && s.stepId)
        : ((data as PatchRecipeDto).steps?.update ?? [])
            .filter(
              (s): s is typeof s & { base64Image: string } => !!s.base64Image,
            )
            .map((s) => ({ stepId: s.id, base64Image: s.base64Image }));

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
        ...stepsWithImages.map(({ stepId, base64Image }) =>
          this.kafkaProducerService.sendMessage('new_recipe_step_image', {
            key: recipe.user.id,
            value: JSON.stringify({ recipeId: recipe.id, stepId, base64Image }),
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
        ...stepsWithImages.map(({ stepId, base64Image }) =>
          this.imageReviewProcessorService.processRecipeStepImage(
            recipe.user.id,
            { recipeId: recipe.id, stepId, base64Image },
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

    void this.processImages(data, recipe).catch((e) =>
      this.logger.error(JSON.stringify(e)),
    );
    void this.deleteImages(deletedStepImageUrls).catch((e) =>
      this.logger.error(JSON.stringify(e)),
    );

    return recipe;
  }

  private async deleteImages(deletedStepImageUrls: string[]) {
    await this.s3Service.deleteFiles(deletedStepImageUrls);
  }

  private transformToRecipeUpdateType(data: PatchRecipeDto): RecipeUpdateType {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- do not send base64Image to the repository
    const { base64Image, ...remainingData } = data;
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
