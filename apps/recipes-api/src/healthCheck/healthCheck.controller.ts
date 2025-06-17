import { Controller, Get, Inject, Res } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Response } from 'express';
import { PrismaOrmHealthIndicatorService } from './prismaOrmHealthIndicator.service';

@Controller()
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    @Inject(PrismaOrmHealthIndicatorService)
    private db: PrismaOrmHealthIndicatorService,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get('status')
  status(@Res() res: Response) {
    res.status(200).end();
  }

  @Get('health')
  @HealthCheck()
  async check() {
    let diskPath = '/';
    if (process.platform === 'win32') {
      diskPath = 'C:\\';
    }

    return await this.health.check([
      //   () => this.http.pingCheck('basic check for some-api', 'http://some-api'),
      () =>
        this.disk.checkStorage('diskStorage', {
          thresholdPercent: 0.5,
          path: diskPath,
        }),
      () => this.db.checkDb('recipes-db'),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
    ]);
  }
}
