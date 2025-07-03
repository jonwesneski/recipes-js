import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@repo/database';

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
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
}
