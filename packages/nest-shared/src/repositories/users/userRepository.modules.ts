import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../services/prisma.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [PrismaService, UserRepository],
  exports: [PrismaService, UserRepository],
})
export class UserRepositoryModule {}
