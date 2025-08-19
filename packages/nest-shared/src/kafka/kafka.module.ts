import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { kafkaConsumerConfig, kafkaProducerConfig } from './config';

@Module({
  imports: [ConfigModule.forFeature(kafkaProducerConfig)],
  controllers: [],
  providers: [],
  exports: [ConfigModule.forFeature(kafkaProducerConfig)],
})
export class KafkaProducerModule {}

@Module({
  imports: [ConfigModule.forFeature(kafkaConsumerConfig)],
  controllers: [],
  providers: [],
  exports: [ConfigModule.forFeature(kafkaConsumerConfig)],
})
export class KafkaConsumerModule {}
