import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { awsConfig } from './config/aws.config';

@Module({
  imports: [ConfigModule.forFeature(awsConfig)],
  controllers: [],
  providers: [],
  exports: [ConfigModule.forFeature(awsConfig)],
})
export class AwsModule {}
