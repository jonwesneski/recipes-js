import { Module } from '@nestjs/common';
import { KafkaService } from './kafka-consumer.service';

@Module({
  providers: [KafkaService],
})
export class AppModule {}
