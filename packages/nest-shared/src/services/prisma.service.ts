import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@repo/database';

export type PrismaQueryParams = {
  cursorId?: string;
  take?: number;
  skip?: number;
};

export type PrismaResults<T> = {
  data: T;
  pagination: {
    totalRecords: number;
    currentCursor: string | null;
    nextCursor: string | null;
  };
};

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.getOrThrow('DATABASE_URL'),
    });
    super({
      adapter,
    });
  }
}
