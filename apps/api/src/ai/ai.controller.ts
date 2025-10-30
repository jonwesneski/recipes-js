import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { JwtGuard } from '@src/auth/guards';
import { NutritionalFactsResponse, RecipeListResponse } from '@src/recipes';
import { AiService } from './ai.service';
import { GenerateCategoriesDto } from './contracts/generate-categories.dto';
import { GeneratedCategoriesResponse } from './contracts/generate-categories.response';
import { GenerateNutritionalFactsDto } from './contracts/generate-nutritional-facts.dto';
import { GetRecipesSearchDto } from './contracts/get-recipes.dto';

@Controller({
  version: '1',
  path: 'ai',
})
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('nutritional-facts')
  @HttpCode(200)
  @ApiBody({ type: GenerateNutritionalFactsDto, isArray: true })
  @ApiOkResponse({
    description: 'The generated nutritional facts',
    type: NutritionalFactsResponse,
  })
  @UseGuards(JwtGuard)
  async nutritionalFacts(@Body() body: GenerateNutritionalFactsDto[]) {
    return await this.aiService.nutritionalFacts(body);
  }

  @Post('categories')
  @HttpCode(200)
  @ApiBody({ type: GenerateCategoriesDto })
  @ApiOkResponse({
    description: 'The generated categories',
    type: GeneratedCategoriesResponse,
  })
  @UseGuards(JwtGuard)
  async categories(@Body() body: GenerateCategoriesDto) {
    return await this.aiService.categories(body);
  }

  @Get('recipes-search')
  @ApiBody({ type: GenerateCategoriesDto })
  @ApiOkResponse({
    description: 'The generated categories',
    type: RecipeListResponse,
  })
  async recipesSearch(@Query() body: GetRecipesSearchDto) {
    return await this.aiService.recipesSearch(body);
  }
}
