import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: process.env.KAFKA_BROKER_URLS?.split(',') || [],
          sasl: {
            mechanism: 'plain',
            username: process.env.KAFKA_KEY!,
            password: process.env.KAFKA_SECRET!,
          },
          ssl: true,
          connectionTimeout: 45000,
          clientId: process.env.KAFKA_CLIENT_ID,
        },
        consumer: {
          groupId: process.env.KAFKA_CONSUMER_GROUP_ID!,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
