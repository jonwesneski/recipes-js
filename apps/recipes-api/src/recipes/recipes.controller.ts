import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dtos';

@Controller({
  path: 'recipes',
  version: '1',
})
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  async recipesList() {
    return this.recipesService.getRecipe('');
  }

  @Get(':slug')
  async recipe(@Param() params: { slug: string }) {
    return this.recipesService.getRecipe(params.slug);
  }

  @Post()
  async createRecipe(@Body() body: CreateRecipeDto): Promise<any> {
    return this.recipesService.createRecipe(body);
  }
}
