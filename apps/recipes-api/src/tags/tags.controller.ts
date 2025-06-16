import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
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
  async tagNameList(): Promise<TagNamesEntity> {
    const tagNames = await this.tagsService.getTagNames();
    return {
      data: tagNames,
      pagination: {
        total_records: tagNames.length, // todo: grab from db
        current_page: 1,
        total_pages: 1,
        next_page: null,
        prev_page: null,
      },
    };
  }
}
