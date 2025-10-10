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
    this.prisma.userFollow.findMany({ where: {} });
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
        id: true,
        imageUrl: true,
        measurementFormat: true,
        numberFormat: true,
        uiTheme: true,
        updatedAt: true,
      },
    });
  }
}
