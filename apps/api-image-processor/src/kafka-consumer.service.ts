import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ImageReviewProcessorService,
  NEW_RECIPE_IMAGE_TOPIC,
  NEW_RECIPE_STEP_IMAGE_TOPIC,
  NewRecipeMessageType,
  NewRecipeStepMessageType,
  RecipeMessageTypes,
} from '@repo/nest-shared';
import { Kafka, type Consumer, type KafkaMessage } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly _consumer: Consumer;

  constructor(
    private readonly imageReviewService: ImageReviewProcessorService,
    private configService: ConfigService,
  ) {
    const brokerString =
      this.configService.getOrThrow<string>('KAFKA_BROKER_URLS');
    let security = {};
    if (!brokerString.includes('localhost')) {
      security = {
        sasl: {
          mechanism: 'plain',
          username: this.configService.getOrThrow<string>('KAFKA_KEY'),
          password: this.configService.getOrThrow<string>('KAFKA_SECRET'),
        },
        ssl: true,
      };
    }
    this._consumer = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID'),
      brokers: this.configService
        .getOrThrow<string>('KAFKA_BROKER_URLS')
        .split(','),
      ...security,
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
      topic: NEW_RECIPE_IMAGE_TOPIC,
      fromBeginning: true,
    });
    await this._consumer.subscribe({
      topic: NEW_RECIPE_STEP_IMAGE_TOPIC,
      fromBeginning: true,
    });

    await this._consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (topic === NEW_RECIPE_IMAGE_TOPIC) {
          await this.consumeNewRecipeImage(message);
        } else if (topic === NEW_RECIPE_STEP_IMAGE_TOPIC) {
          await this.consumeNewRecipeStepImage(message);
        }
      },
    });
  }

  async consumeNewRecipeImage(message: KafkaMessage) {
    if (!message.key) {
      throw new Error('Message key is undefined');
    }

    const data = this.parseMessage<NewRecipeMessageType>(message);
    await this.imageReviewService.processRecipeImage(
      message.key!.toString(),
      data,
    );
  }

  async consumeNewRecipeStepImage(message: KafkaMessage) {
    if (!message.key) {
      // TODO: figure out what kind of exception I should throw here
      //  or should I just log and return. Same goes for the throws below
      throw new Error('Message key is undefined');
    }

    const data = this.parseMessage<NewRecipeStepMessageType>(message);
    await this.imageReviewService.processRecipeStepImage(
      message.key.toString(),
      data,
    );
  }

  private parseMessage<T extends RecipeMessageTypes>(message: KafkaMessage): T {
    if (!message.value) {
      throw new Error('Message value is undefined');
    }
    try {
      return JSON.parse(message.value.toString()) as T;
    } catch (error) {
      throw new Error(`Failed to parse message: ${error.message}`);
    }
  }
}
