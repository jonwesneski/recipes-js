import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtGuard } from '@src/auth/guards';
import { throwIfConflict, throwIfNotFound } from '@src/common';
import { parseHelper } from '@src/common/header.decorators';
import { type Request } from 'express';
import {
  BadRequestRecipeEntity,
  CreateRecipeDto,
  PatchRecipeDto,
  QueryParamsDto,
  RecipeEntity,
} from './contracts';
import { RecipesService } from './recipes.service';

@Controller({
  path: 'recipes',
  version: '1',
})
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOkResponse({
    description: 'The recipe records',
    type: RecipeEntity,
    isArray: true,
  })
  async recipesList() {
    return this.recipesService.getRecipes();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The recipe record',
    type: RecipeEntity,
  })
  @ApiParam({ name: 'id', type: String, description: 'id of recipe' })
  async recipe(
    // TODO: can't get this to work in jest
    //@JwtDecodedHeader() jwtDecodedHeader: JwtGoogleType,
    @Param('id') id: string,
    @Req() request: Request,
    @Query() query: QueryParamsDto,
  ): Promise<RecipeEntity> {
    let userId: string | undefined;
    try {
      if (query.byOwner) {
        // TODO: Remove when this works in jest: JwtDecodedHeader.
        userId = parseHelper(request).sub;
      }
      return await this.recipesService.getRecipe(id, userId);
    } catch (error) {
      throwIfNotFound(error);
      throw error;
    }
  }

  @Post()
  @ApiBody({ type: CreateRecipeDto })
  @ApiOkResponse({ type: RecipeEntity })
  @ApiBadRequestResponse({ type: BadRequestRecipeEntity })
  @UseGuards(JwtGuard)
  async createRecipe(
    // TODO: can't get this to work in jest
    //@JwtDecodedHeader() jwtDecodedHeader: JwtGoogleType,
    @Body() body: CreateRecipeDto,
    @Req() req: Request,
  ): Promise<RecipeEntity> {
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
  ): Promise<RecipeEntity> {
    const token = parseHelper(req); // Using since JwtDecodedHeader is not working in jest
    try {
      return await this.recipesService.updateRecipe(token.sub, id, body);
    } catch (error) {
      throwIfConflict(error);
      throw error;
    }
  }
}
