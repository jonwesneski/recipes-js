import { Injectable } from '@nestjs/common';
import {
  type PrismaQueryParams,
  type PrismaResults,
  PrismaService,
} from 'src/common/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTagNames({
    cursorId = 1,
  }: PrismaQueryParams): Promise<PrismaResults<string[]>> {
    const tags = await this.prisma.tag.findMany({ cursor: { id: cursorId } });
    const count = await this.prisma.tag.count();
    const latestCursor = cursorId + tags.length;
    const possibleNextCursor = latestCursor + 1;

    return {
      data: tags.map((tag) => tag.name),
      pagination: {
        totalRecords: count,
        currentCursor: cursorId,
        nextCursor: possibleNextCursor < count ? possibleNextCursor : null,
      },
    };
  }
}
