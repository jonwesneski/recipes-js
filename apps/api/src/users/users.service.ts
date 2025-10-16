import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { PrismaService } from '@repo/nest-shared';
import { PatchUserDto } from './contracts';

export type UserPrismaType = Prisma.UserGetPayload<{
  select: {
    handle: true;
    imageUrl: true;
    _count: { select: { followers: true; followings: true; recipes: true } };
  };
}>;
export type UserType = Omit<UserPrismaType, '_count'> & {
  followers: number;
  followings: number;
  recipes: number;
  amIFollowing?: boolean;
};

export type UserAccountPrismaType = Prisma.UserGetPayload<{
  include: {
    diet: true;
  };
}>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: string, requestedUser?: string): Promise<UserType> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id },
      select: {
        createdAt: true,
        handle: true,
        imageUrl: true,
        _count: {
          select: {
            followers: true,
            followings: true,
            recipes: { where: { isPublic: true } },
          },
        },
        followers:
          requestedUser && id !== requestedUser
            ? { where: { userId: requestedUser }, select: { id: true } }
            : undefined,
      },
    });
    let amIFollowing =
      id === requestedUser
        ? undefined
        : user.followers && user.followers.length > 0;

    const { followers, ...rest } = user;
    return {
      ...rest,
      followers: user._count.followers,
      followings: user._count.followings,
      recipes: user._count.recipes,
      amIFollowing,
    };
  }

  async getUserAccount(id: string): Promise<UserAccountPrismaType> {
    return await this.prisma.user.findFirstOrThrow({
      where: { id },
      include: { diet: true },
    });
  }

  async updateUserAccount(
    id: string,
    user: PatchUserDto,
  ): Promise<UserAccountPrismaType> {
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

  async followUser(id: string, requestedUser: string, isFollowing: boolean) {
    if (isFollowing) {
      return await this.prisma.userFollow.create({
        data: { userId: requestedUser, followingId: id },
      });
    } else {
      return await this.prisma.userFollow.delete({
        where: {
          userId_followingId: { userId: requestedUser, followingId: id },
        },
      });
    }
  }
}
