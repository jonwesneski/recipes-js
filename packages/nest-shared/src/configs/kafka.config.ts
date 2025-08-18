import { ConfigType, registerAs } from '@nestjs/config';
import {
  ConsumerConfig,
  KafkaConfig,
  Partitioners,
  ProducerConfig,
} from 'kafkajs';

export const kafkaProducerConfig = registerAs('kafkaProducerConfig', () => ({
  base: {
    brokers: process.env.KAFKA_BROKER_URLS?.split(',') || [],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: process.env.CONFLUENT_KEY!,
      password: process.env.CONFLUENT_SECRET!,
    },
    connectionTimeout: 45000,
    clientId: process.env.KAFKA_CLIENT_ID!,
  } as KafkaConfig,
  producer: {
    createPartitioner: Partitioners.DefaultPartitioner,
  } as ProducerConfig,
}));

export type KafkaProducerConfigType = ConfigType<typeof kafkaProducerConfig>;

export const kafkaConsumerConfig = registerAs('kafkaConsumerConfig', () => ({
  base: {
    brokers: process.env.KAFKA_BROKER_URLS?.split(',') || [],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: process.env.CONFLUENT_KEY!,
      password: process.env.CONFLUENT_SECRET!,
    },
    connectionTimeout: 45000,
    clientId: process.env.KAFKA_CLIENT_ID!,
  } as KafkaConfig,
  consumer: {
    groupId: process.env.KAFKA_CONSUMER_GROUP_ID!,
  } as ConsumerConfig,
}));

export type KafkaConsumerConfigType = ConfigType<typeof kafkaConsumerConfig>;
