import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTagNames(): Promise<string[]> {
    const tags = await this.prisma.tag.findMany();
    return tags.map((tag) => tag.name);
  }
}
