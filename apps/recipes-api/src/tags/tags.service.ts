import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

export type PrismaQueryParams = {
  cursorId?: number;
  take?: number;
  skip?: number;
};

export type PrismaResults<T> = {
  data: T;
  pagination: {
    totalRecords: number;
    currentCursor: number;
    nextCursor: number | null;
  };
};

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
