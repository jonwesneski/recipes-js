import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class PrismaOrmHealthIndicatorService extends HealthIndicatorService {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async checkDb(databaseName: string) {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return this.check(databaseName).up();
    } catch (e) {
      return this.check(databaseName).down(e);
    }
  }
}
