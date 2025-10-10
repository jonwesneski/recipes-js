import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NotificationRecipeAddedSchemaType } from '@repo/zod-schemas';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
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
    this.logger.debug(`User registered: ${userId}`);
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
    userId: string,
    message: NotificationRecipeAddedSchemaType,
  ): boolean {
    const client = this.connectedClients[userId];
    if (client) {
      client.emit('recipeAdded', message);
      this.logger.log(`emitted recipeAdded: ${message.id}`);
      return true;
    }
    return false;
  }
}
