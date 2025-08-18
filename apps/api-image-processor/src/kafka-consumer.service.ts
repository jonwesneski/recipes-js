import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import type { KafkaMessage } from 'kafkajs';

@Injectable()
export class KafkaService {
  @MessagePattern('new_recipe_image')
  async consumeNewRecipeImage(message: KafkaMessage) {
    console.log('Received message:', message.value?.toString());
    // Process the message here
  }

  @MessagePattern('new_recipe_step_image')
  async consumeNewRecipeStepImage(message: KafkaMessage) {
    console.log('Received message:', message.value?.toString());
    // Process the message here
  }
}
