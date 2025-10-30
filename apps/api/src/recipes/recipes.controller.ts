import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
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
import { JwtGuard } from '@src/auth/guards';
import { throwIfConflict, throwIfNotFound } from '@src/common';
import { parseHelper } from '@src/common/header.decorators';
import { type Request } from 'express';
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
    // TODO: can't get this to work in jest
    //@JwtDecodedHeader() jwtDecodedHeader: JwtGoogleType,
    @Param('id') id: string,
    @Req() request: Request,
    @Query() query: GetRecipeDto,
  ): Promise<RecipeResponse> {
    let userId: string | undefined;
    try {
      if (query.byOwner) {
        // TODO: Remove when this works in jest: JwtDecodedHeader.
        userId = parseHelper(request).sub;
        if (!userId) {
          throw new NotFoundException();
        }
      }
      return await this.recipesService.getRecipe(id, userId);
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
    // TODO: can't get this to work in jest
    //@JwtDecodedHeader() jwtDecodedHeader: JwtGoogleType,
    @Body() body: CreateRecipeDto,
    @Req() req: Request,
  ): Promise<RecipeResponse> {
    try {
      const token = parseHelper(req); // Using since JwtDecodedHeader is not working in jest
      return await this.recipesService.createRecipe(token.sub, body);
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
    // TODO: can't get this to work in jest
    //@JwtDecodedHeader() jwtDecodedHeader: JwtGoogleType,
    @Body() body: PatchRecipeDto,
    @Req() req: Request,
  ): Promise<RecipeResponse> {
    const token = parseHelper(req); // Using since JwtDecodedHeader is not working in jest
    try {
      return await this.recipesService.updateRecipe(token.sub, id, body);
    } catch (error) {
      throwIfConflict(error);
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
    // TODO: can't get this to work in jest
    //@JwtDecodedHeader() jwtDecodedHeader: JwtGoogleType,
    @Body() body: PutBookmarkRecipeDto,
    @Req() req: Request,
  ) {
    const token = parseHelper(req); // Using since JwtDecodedHeader is not working in jest
    try {
      return await this.recipesService.bookmarkRecipe(id, token.sub, body);
    } catch (error) {
      if (error instanceof BookmarkOwnerError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
