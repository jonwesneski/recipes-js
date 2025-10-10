import { Injectable } from '@nestjs/common';
import { NotificationRecipeAddedSchemaType } from '@repo/zod-schemas';
import { UsersService } from '@src/users';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsGateway: NotificationsGateway,
    private readonly usersService: UsersService,
  ) {}

  async recipeAdded(
    userId: string,
    message: NotificationRecipeAddedSchemaType,
  ) {
    await this.usersService.getFollowers(userId);
    const emitted = this.notificationsGateway.recipeAdded(userId, message);
    if (!emitted) {
      // todo email
    }
  }
}
