import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../services/prisma.service';
import { RecipeRepository } from './recipe.repository';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [PrismaService, RecipeRepository],
  exports: [PrismaService, RecipeRepository],
})
export class RecipeRepositoryModule {}
