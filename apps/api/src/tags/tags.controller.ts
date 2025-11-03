import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { TagsQueryDto } from './contracts';
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
  async tagNameList(@Query() query: TagsQueryDto): Promise<TagNamesResponse> {
    return await this.tagsService.getTagNames(query, query.includes);
  }
}
