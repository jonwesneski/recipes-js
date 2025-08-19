import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  type KafkaProducerConfigType,
  type RecipeTopics,
} from '@repo/nest-shared';
import { Kafka, Message, type Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleDestroy {
  private constructor(private readonly _producer: Producer) {}

  public static async createInstance(config: KafkaProducerConfigType) {
    const producer = new Kafka(config.base).producer(config.producer);
    await producer.connect();
    return new KafkaProducerService(producer);
  }

  public async sendMessage(topic: RecipeTopics, message: Message) {
    return await this._producer.send({
      topic,
      messages: [message],
    });
  }

  public async onModuleDestroy() {
    await this._producer.disconnect();
  }
}
