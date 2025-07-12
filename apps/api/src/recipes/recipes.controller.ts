import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { throwIfConflict, throwIfNotFound } from 'src/common';
import { CreateRecipeDto, EditRecipeDto, RecipeEntity } from './contracts';
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

  @Get(':userId/:id')
  @ApiOkResponse({
    description: 'The recipe record',
    type: RecipeEntity,
  })
  @ApiParam({ name: 'userId', type: String, description: 'User of recipe' })
  @ApiParam({ name: 'id', type: String, description: 'id of recipe' })
  async recipe(
    @Param('userId') userId: string,
    @Param('id') id: string,
  ): Promise<RecipeEntity> {
    try {
      return await this.recipesService.getRecipe(userId, id);
    } catch (error) {
      throwIfNotFound(error);
      throw error;
    }
  }

  @Post(':userId')
  @ApiBody({ type: CreateRecipeDto })
  @ApiParam({ name: 'userId', type: String, description: 'User of recipe' })
  @UseGuards(JwtGuard)
  async createRecipe(
    @Param('userId') userId: string,
    @Body() body: CreateRecipeDto,
  ): Promise<RecipeEntity> {
    try {
      return await this.recipesService.createRecipe(userId, body);
    } catch (error) {
      throwIfConflict(error, `Recipe with name "${body.name}" already exists.`);
      throw error;
    }
  }

  @Patch(':userId/:id')
  @ApiBody({ type: EditRecipeDto })
  @ApiParam({ name: 'userId', type: String, description: 'User of recipe' })
  @ApiParam({ name: 'id', type: String, description: 'id of recipe' })
  @UseGuards(JwtGuard)
  async updateRecipe(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() body: EditRecipeDto,
  ): Promise<RecipeEntity> {
    try {
      return await this.recipesService.updateRecipe(userId, id, body);
    } catch (error) {
      throwIfConflict(error);
      throw error;
    }
  }
}
