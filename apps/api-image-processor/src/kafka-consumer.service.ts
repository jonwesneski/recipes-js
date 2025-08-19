import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, type Consumer, type KafkaMessage } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly _consumer: Consumer;

  constructor(private configService: ConfigService) {
    this._consumer = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID'),
      brokers: this.configService
        .getOrThrow<string>('KAFKA_BROKER_URLS')
        .split(','),
      sasl: {
        mechanism: 'plain',
        username: this.configService.getOrThrow<string>('KAFKA_KEY'),
        password: this.configService.getOrThrow<string>('KAFKA_SECRET'),
      },
      ssl: true,
      connectionTimeout: 45000,
    }).consumer({
      groupId: this.configService.getOrThrow<string>('KAFKA_CONSUMER_GROUP_ID'),
    });
  }
  async onModuleDestroy() {
    await this._consumer.disconnect();
  }

  async onModuleInit() {
    await this._consumer.connect();

    await this._consumer.subscribe({
      topic: 'new_recipe_image',
      fromBeginning: true,
    });
    await this._consumer.subscribe({
      topic: 'new_recipe_step_image',
      fromBeginning: true,
    });

    await this._consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        // Call the appropriate method based on the topic
        if (topic === 'new_recipe_image') {
          await this.consumeNewRecipeImage(message);
        } else if (topic === 'new_recipe_step_image') {
          await this.consumeNewRecipeStepImage(message);
        }
      },
    });
  }

  async consumeNewRecipeImage(message: KafkaMessage) {
    console.log('Received message:', message.value?.toString());
  }

  async consumeNewRecipeStepImage(message: KafkaMessage) {
    console.log('Received message:', message.value?.toString());
  }
}
