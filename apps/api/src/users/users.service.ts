import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClientKnownRequestError } from '@repo/database';
import { PrismaQueryParams, PrismaService } from '@repo/nest-shared';
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

export type GetFollowersQueryParams = PrismaQueryParams & {
  id: string;
};

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
    const amIFollowing =
      id === requestedUser
        ? undefined
        : user.followers && user.followers.length > 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- only using followers to determine amIFollowing
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

  async getFollowerIds(id: string) {
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

  async getFollowers(params: GetFollowersQueryParams) {
    const followers = await this.prisma.userFollow.findMany({
      where: { userId: params.id },
      cursor: params.cursorId ? { id: params.cursorId } : undefined,
      skip: params.cursorId ? 1 : params.skip,
      select: {
        id: true,
        following: { select: { id: true, handle: true, imageUrl: true } },
      },
    });
    return {
      data: followers.map((f) => f.following),
      pagination: {
        totalRecords: await this.prisma.userFollow.count({
          where: { userId: params.id },
        }),
        currentCursor:
          followers.length > 0 ? followers[0].id : params.cursorId || null,
        nextCursor:
          followers.length > 0 ? followers[followers.length - 1].id : null,
      },
    };
  }

  async followUser(id: string, requestedUser: string, isFollowing: boolean) {
    if (isFollowing) {
      await this.prisma.userFollow.createMany({
        data: { userId: requestedUser, followingId: id },
        skipDuplicates: true, // Ignoring if it already exists
      });
    } else {
      try {
        await this.prisma.userFollow.delete({
          where: {
            userId_followingId: { userId: requestedUser, followingId: id },
          },
        });
      } catch (error) {
        if (
          !(error instanceof PrismaClientKnownRequestError) ||
          error.code !== 'P2025'
        ) {
          throw error;
        }
      }
    }
  }
}
