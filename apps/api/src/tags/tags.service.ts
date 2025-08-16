import { Injectable } from '@nestjs/common';
import {
  type PrismaQueryParams,
  type PrismaResults,
  PrismaService,
} from '@repo/nest-shared';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTagNames(
    params: PrismaQueryParams,
  ): Promise<PrismaResults<string[]>> {
    const tags = await this.prisma.tag.findMany({
      cursor: params.cursorId ? { id: params.cursorId } : undefined,
      skip: params.cursorId ? 1 : undefined,
    });
    const totalRecords = await this.prisma.tag.count();
    const tagsFound = tags.length > 0;
    return {
      data: tags.map((tag) => tag.name),
      pagination: {
        totalRecords,
        currentCursor: tagsFound ? tags[0].id : null,
        nextCursor: tagsFound ? tags[tags.length - 1].id : null,
      },
    };
  }
}
