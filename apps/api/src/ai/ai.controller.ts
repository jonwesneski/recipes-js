import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AiService } from './ai.service.js';

@Controller({
  version: '1',
  path: 'ai',
})
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('nutritional-facts')
  @ApiOkResponse({
    description: '...',
    //type: TagNamesEntity,
  })
  async nutritionalFacts(@Body() body: any /*CreateRecipeDto*/) {
    return await this.aiService.nutritionalFacts(body);
  }
}
