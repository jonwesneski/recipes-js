import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { PrismaService } from '@repo/nest-shared';
import { PatchUserDto } from './contracts';

type UserPrismaType = Prisma.UserGetPayload<{
  include: {
    diet: true;
  };
}>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: string): Promise<UserPrismaType> {
    return await this.prisma.user.findFirstOrThrow({
      where: { id },
      include: { diet: true },
    });
  }

  async updateUser(id: string, user: PatchUserDto): Promise<UserPrismaType> {
    return await this.prisma.user.update({
      where: { id },
      data: user,
      include: { diet: true },
    });
  }

  async getFollowers(id: string) {
    // todo: update after adding allow email notification field/column
    return await this.prisma.user.findFirstOrThrow({
      where: { id },
      include: {
        followers: {
          omit: { id: true, createdAt: true, updatedAt: true, userId: true },
        },
      },
      omit: {
        createdAt: true,
        email: true,
        handle: true,
        id: true,
        imageUrl: true,
        measurementFormat: true,
        name: true,
        numberFormat: true,
        uiTheme: true,
        updatedAt: true,
      },
    });
  }
}
