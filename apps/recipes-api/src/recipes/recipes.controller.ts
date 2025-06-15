import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { PrismaClientKnownRequestError } from '@repo/database';
import { CreateRecipeDto } from './contracts/recipes/recipes.dto';
import { RecipeEntity } from './contracts/recipes/recipes.entities';
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

  @Get(':slug')
  @ApiOkResponse({
    description: 'The recips record',
    type: RecipeEntity,
  })
  @ApiParam({ name: 'slug', type: String, description: 'Slug of recipe' })
  async recipe(@Param('slug') slug: string): Promise<RecipeEntity> {
    try {
      return await this.recipesService.getRecipe(slug);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException();
        }
      }
      throw error;
    }
  }

  @Post()
  async createRecipe(@Body() body: CreateRecipeDto): Promise<RecipeEntity> {
    try {
      return await this.recipesService.createRecipe(body);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Recipe with slug "${body.slug}" already exists.`,
          );
        }
      }
      throw error;
    }
  }
}
