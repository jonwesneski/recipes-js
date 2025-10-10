import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NotificationRecipeAddedSchemaType } from '@repo/zod-schemas';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      const configService = new ConfigService();
      const allowedOriginsString = configService.get<string>('CORS_ORIGINS');
      const allowedOrigins = allowedOriginsString
        ? allowedOriginsString.split(',')
        : [];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Server;

  private connectedClients: { [key: string]: Socket } = {};

  handleConnection(client: any) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('register')
  handleRegister(client: Socket, userId: string) {
    this.connectedClients[userId] = client;
    this.logger.log(`User registered: ${userId}`);
  }

  handleDisconnect(client: any) {
    const userId = Object.keys(this.connectedClients).find(
      (key) => this.connectedClients[key] === client,
    );
    if (userId) {
      delete this.connectedClients[userId];
      this.logger.debug(`Client disconnected: ${userId}`);
    }
  }

  recipeAdded(
    followerIds: string[],
    message: NotificationRecipeAddedSchemaType,
  ): string[] {
    const idsNotEmitted: string[] = [];
    for (const id of followerIds) {
      const client = this.connectedClients[id];
      if (client) {
        client.emit('recipeAdded', message);
        this.logger.log(`emitted recipeAdded: ${message.id}`);
      } else {
        idsNotEmitted.push(id);
      }
    }

    return idsNotEmitted;
  }
}
