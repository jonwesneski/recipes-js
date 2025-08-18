import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { awsConfig } from '../configs/aws.config';

@Module({
  imports: [ConfigModule.forFeature(awsConfig)],
  controllers: [],
  providers: [],
  exports: [ConfigModule.forFeature(awsConfig)],
})
export class AwsModule {}
