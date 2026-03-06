import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { BookmarkOwnerError } from '@repo/nest-shared';
import type { JwtGoogleType, PartialJwtGoogleType } from '@repo/zod-schemas';
import { JwtGuard } from '@src/auth/guards';
import { throwIfConflict, throwIfNotFound } from '@src/common';
import { JwtDecoded } from '@src/common/header.decorators';
import {
  BadRequestRecipeResponse,
  CreateRecipeDto,
  GetRecipeDto,
  PatchRecipeDto,
  RecipeListResponse,
  RecipeResponse,
} from './contracts';
import { PutBookmarkRecipeDto } from './contracts/bookmark-recipe.dto';
import { GetRecipesDto } from './contracts/get-recipes.dto';
import { RecipesService } from './recipes.service';

@Controller({
  path: 'recipes',
  version: '1',
})
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post('/search')
  @ApiBody({ type: GetRecipesDto })
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Search for recipes',
    type: RecipeListResponse,
  })
  async recipesList(
    @Body() bodyQuery: GetRecipesDto,
  ): Promise<RecipeListResponse> {
    return this.recipesService.getRecipes(bodyQuery);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The recipe record',
    type: RecipeResponse,
  })
  @ApiParam({ name: 'id', type: String, description: 'id of recipe' })
  async recipe(
    @JwtDecoded(false) jwtDecoded: PartialJwtGoogleType,
    @Param('id') id: string,
    @Query() query: GetRecipeDto,
  ): Promise<RecipeResponse> {
    const byOwner = query.byOwner;
    if (byOwner && !jwtDecoded.sub) {
      throw new NotFoundException();
    }

    try {
      return await this.recipesService.getRecipe(id, byOwner, jwtDecoded.sub);
    } catch (error) {
      throwIfNotFound(error);
      throw error;
    }
  }

  @Post()
  @ApiBody({ type: CreateRecipeDto })
  @ApiOkResponse({ type: RecipeResponse })
  @ApiBadRequestResponse({ type: BadRequestRecipeResponse })
  @UseGuards(JwtGuard)
  async createRecipe(
    @JwtDecoded() jwtDecoded: JwtGoogleType,
    @Body() body: CreateRecipeDto,
  ): Promise<RecipeResponse> {
    try {
      return await this.recipesService.createRecipe(jwtDecoded.sub, body);
    } catch (error) {
      throwIfConflict(error, `Recipe with name "${body.name}" already exists.`);
      throw error;
    }
  }

  @Patch(':id')
  @ApiBody({ type: PatchRecipeDto })
  @ApiParam({ name: 'id', type: String, description: 'id of recipe' })
  @UseGuards(JwtGuard)
  async updateRecipe(
    @Param('id') id: string,
    @JwtDecoded() jwtDecoded: JwtGoogleType,
    @Body() body: PatchRecipeDto,
  ): Promise<RecipeResponse> {
    try {
      return await this.recipesService.updateRecipe(jwtDecoded.sub, id, body);
    } catch (error) {
      throwIfConflict(error);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiParam({ name: 'id', type: String, description: 'id of recipe' })
  @UseGuards(JwtGuard)
  async deleteRecipe(
    @Param('id') id: string,
    @JwtDecoded() jwtDecoded: JwtGoogleType,
  ): Promise<void> {
    try {
      await this.recipesService.deleteRecipe(id, jwtDecoded.sub);
    } catch (error) {
      throwIfNotFound(error);
      throw error;
    }
  }

  @Put(':id/bookmark')
  @HttpCode(204)
  @ApiNoContentResponse({ description: '(un)bookmarked a recipe' })
  @ApiBody({ type: PutBookmarkRecipeDto })
  @ApiParam({ name: 'id', type: String, description: 'id of recipe' })
  @UseGuards(JwtGuard)
  async bookmarkRecipe(
    @Param('id') id: string,
    @JwtDecoded() jwtDecoded: JwtGoogleType,
    @Body() body: PutBookmarkRecipeDto,
  ) {
    try {
      return await this.recipesService.bookmarkRecipe(id, jwtDecoded.sub, body);
    } catch (error) {
      if (error instanceof BookmarkOwnerError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
