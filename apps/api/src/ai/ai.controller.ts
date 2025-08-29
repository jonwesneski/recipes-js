import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { NutritionalFactsEntity } from '@src/recipes';
import { AiService } from './ai.service';
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
    type: NutritionalFactsEntity,
  })
  async nutritionalFacts(@Body() body: GenerateNutritionalFactsDto[]) {
    return await this.aiService.nutritionalFacts(body);
  }
}
