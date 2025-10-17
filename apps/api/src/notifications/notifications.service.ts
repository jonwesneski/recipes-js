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
    const { followers } = await this.usersService.getFollowerIds(userId);
    const idsNotEmitted = this.notificationsGateway.recipeAdded(
      followers.map((f) => f.followingId),
      message,
    );
    if (idsNotEmitted.length) {
      // todo: email
    }
  }
}
