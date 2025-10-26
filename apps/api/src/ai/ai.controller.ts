import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { JwtGuard } from '@src/auth/guards';
import { NutritionalFactsResponse } from '@src/recipes';
import { AiService } from './ai.service';
import { GenerateClassifiersDto } from './contracts/generate-classifiers.dto';
import { GeneratedClassifiersResponse } from './contracts/generate-classifiers.response';
import { GenerateNutritionalFactsDto } from './contracts/generate-nutritional-facts.dto';

@Controller({
  version: '1',
  path: 'ai',
})
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('nutritional-facts')
  @ApiBody({ type: GenerateNutritionalFactsDto, isArray: true })
  @ApiOkResponse({
    description: 'The generated nutritional facts',
    type: NutritionalFactsResponse,
  })
  @UseGuards(JwtGuard)
  async nutritionalFacts(@Body() body: GenerateNutritionalFactsDto[]) {
    return await this.aiService.nutritionalFacts(body);
  }

  @Post('classifiers')
  @ApiBody({ type: GenerateClassifiersDto })
  @ApiOkResponse({
    description: 'The generated classifiers',
    type: GeneratedClassifiersResponse,
  })
  @UseGuards(JwtGuard)
  async tags(@Body() body: GenerateClassifiersDto) {
    return await this.aiService.classifiers(body);
  }
}
