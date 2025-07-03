import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [],
  controllers: [TagsController],
  providers: [TagsService, PrismaService],
})
export class TagsModule {}
