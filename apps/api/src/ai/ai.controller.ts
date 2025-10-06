import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { JwtGuard } from '@src/auth/guards';
import { NutritionalFactsEntity } from '@src/recipes';
import { AiService } from './ai.service';
import { GenerateNutritionalFactsDto } from './contracts/generate-nutritional-facts.dto';
import { GenerateTagsDto } from './contracts/generate-tags.dto';

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
  @UseGuards(JwtGuard)
  async nutritionalFacts(@Body() body: GenerateNutritionalFactsDto[]) {
    return await this.aiService.nutritionalFacts(body);
  }

  @Post('tags')
  @ApiBody({ type: GenerateTagsDto })
  @ApiOkResponse({
    description: 'The generated tags',
    type: [String],
  })
  @UseGuards(JwtGuard)
  async tags(@Body() body: GenerateTagsDto) {
    return await this.aiService.tags(body);
  }
}
