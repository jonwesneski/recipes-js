import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { throwIfConflict, throwIfNotFound } from 'src/common';
import { CreateRecipeDto, RecipeEntity } from './contracts';
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

  @Get(':userHandle/:id')
  @ApiOkResponse({
    description: 'The recipe record',
    type: RecipeEntity,
  })
  @ApiParam({ name: 'userHandle', type: String, description: 'User of recipe' })
  @ApiParam({ name: 'id', type: String, description: 'id of recipe' })
  async recipe(
    @Param('userHandle') userHandle: string,
    @Param('id') id: string,
  ): Promise<RecipeEntity> {
    try {
      return await this.recipesService.getRecipe(userHandle, id);
    } catch (error) {
      throwIfNotFound(error);
      throw error;
    }
  }

  @Post()
  @ApiBody({ type: CreateRecipeDto })
  @UseGuards(JwtGuard)
  async createRecipe(@Body() body: CreateRecipeDto): Promise<RecipeEntity> {
    try {
      return await this.recipesService.createRecipe(body);
    } catch (error) {
      throwIfConflict(error, `Recipe with name "${body.name}" already exists.`);
      throw error;
    }
  }
}
