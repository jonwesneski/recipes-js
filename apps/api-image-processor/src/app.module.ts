import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka-consumer.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
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
    ]),
  ],
  providers: [KafkaService],
})
export class AppModule {}
