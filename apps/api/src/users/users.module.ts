import { Module } from '@nestjs/common';
import { PrismaService } from '@repo/nest-shared';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
