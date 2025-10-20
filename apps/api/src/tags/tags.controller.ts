import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { BaseQueryDto } from '@src/common';
import { TagNamesResponse } from './contracts/tags.response';
import { TagsService } from './tags.service';

@Controller({
  version: '1',
})
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('tag-names')
  @ApiOkResponse({
    description: 'All tag names',
    type: TagNamesResponse,
  })
  async tagNameList(@Query() query: BaseQueryDto): Promise<TagNamesResponse> {
    return await this.tagsService.getTagNames(query);
  }
}
