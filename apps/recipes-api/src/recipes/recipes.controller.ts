import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './contracts/recipes/recipes.dto';
import { RecipeEntity } from './contracts/recipes/recipes.entities';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';

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

  @Get(':slug')
  @ApiOkResponse({
    description: 'The recips record',
    type: RecipeEntity,
  })
  @ApiParam({ name: 'slug', type: String, description: 'Slug of recipe' })
  async recipe(@Param('slug') slug: string): Promise<RecipeEntity> {
    return this.recipesService.getRecipe(slug);
  }

  @Post()
  async createRecipe(@Body() body: CreateRecipeDto): Promise<RecipeEntity> {
    return this.recipesService.createRecipe(body);
  }
}
