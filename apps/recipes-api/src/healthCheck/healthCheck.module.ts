import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaService } from 'src/common';
import { HealthCheckController } from './healthCheck.controller';
import { PrismaOrmHealthIndicatorService } from './prismaOrmHealthIndicator.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthCheckController],
  providers: [PrismaService, PrismaOrmHealthIndicatorService],
})
export class HealthCheckModule {}
