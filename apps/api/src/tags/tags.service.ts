import { Injectable } from '@nestjs/common';
import {
  type PrismaQueryParams,
  type PrismaResults,
  PrismaService,
} from 'src/common/prisma.service';

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
    const count = await this.prisma.tag.count();

    return {
      data: tags.map((tag) => tag.name),
      pagination: {
        totalRecords: count,
        currentCursor: tags[0].id,
        nextCursor: tags.length > 0 ? tags[tags.length - 1].id : null,
      },
    };
  }
}
