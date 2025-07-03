import { Module } from '@nestjs/common';
import { AwsModule } from 'src/common/aws.module';
import { PrismaService } from 'src/common/prisma.service';
import { S3Service } from 'src/common/s3.service';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  imports: [AwsModule],
  controllers: [RecipesController],
  providers: [RecipesService, PrismaService, S3Service],
})
export class RecipesModule {}
