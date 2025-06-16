import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { BaseQueryDto } from 'src/common';
import { TagNamesEntity } from './contracts/tags.entities';
import { TagsService } from './tags.service';

@Controller({
  version: '1',
})
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('tag-names')
  @ApiOkResponse({
    description: 'All tag names',
    type: TagNamesEntity,
  })
  async tagNameList(@Query() query: BaseQueryDto): Promise<TagNamesEntity> {
    return await this.tagsService.getTagNames(query);
  }
}
