import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { throwIfConflict, throwIfNotFound } from 'src/common';
import { parseHelper } from 'src/common/header.decorators';
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

  @Post()
  @ApiBody({ type: CreateRecipeDto })
  @UseGuards(JwtGuard)
  async createRecipe(
    // TODO: can't get this to work in jest
    //@JwtDecodedHeader() jwtDecodedHeader: JwtGoogleType,
    @Body() body: CreateRecipeDto,
    @Req() req: Request,
  ): Promise<RecipeEntity> {
    try {
      const token = parseHelper(req.headers); // Using since JwtDecodedHeader is not working in jest
      return await this.recipesService.createRecipe(token.sub, body);
    } catch (error) {
      throwIfConflict(error, `Recipe with name "${body.name}" already exists.`);
      throw error;
    }
  }

  @Patch(':id')
  @ApiBody({ type: EditRecipeDto })
  @ApiParam({ name: 'id', type: String, description: 'id of recipe' })
  @UseGuards(JwtGuard)
  async updateRecipe(
    @Param('id') id: string,
    // TODO: can't get this to work in jest
    //@JwtDecodedHeader() jwtDecodedHeader: JwtGoogleType,
    @Body() body: EditRecipeDto,
    @Req() req: Request,
  ): Promise<RecipeEntity> {
    const token = parseHelper(req.headers); // Using since JwtDecodedHeader is not working in jest
    try {
      return await this.recipesService.updateRecipe(token.sub, id, body);
    } catch (error) {
      throwIfConflict(error);
      throw error;
    }
  }
}
