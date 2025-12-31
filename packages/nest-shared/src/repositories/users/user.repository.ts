import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClientKnownRequestError } from '@repo/database';
import { PrismaQueryParams, PrismaService } from '../../services';
import { UserUpdateType } from './types';

export type UserPrismaType = Prisma.UserGetPayload<{
  select: {
    id: true;
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

const NutritionalFactsInclude = {
  omit: {
    id: true,
    createdAt: true,
    updatedAt: true,
    recipeId: true,
  },
} as const;
const UserAccountInclude = {
  include: {
    predefinedDailyNutrition: {
      select: {
        id: true,
        name: true,
        nutritionalFacts: NutritionalFactsInclude,
      },
    },
    customDailyNutrition: NutritionalFactsInclude,
  },
  omit: {
    predefinedDailyNutritionId: true,
    customDailyNutritionId: true,
  },
} as const;
export type UserAccountPrismaType = Prisma.UserGetPayload<
  typeof UserAccountInclude
>;

export type GetFollowersQueryParams = PrismaQueryParams & {
  id: string;
};

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: string, requestedUser?: string): Promise<UserType> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id },
      select: {
        id: true,
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
            ? {
                where: { userId: requestedUser },
                select: { id: true },
                take: 1,
              }
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
      ...UserAccountInclude,
    });
  }

  async updateUserAccount(
    id: string,
    user: UserUpdateType,
  ): Promise<UserAccountPrismaType> {
    const { predefinedDailyNutritionId, customDailyNutrition, ...rest } = user;
    const attempts = [{ delete: true }, undefined];
    const buildData = (i: number) => {
      return {
        ...rest,
        customDailyNutrition: customDailyNutrition
          ? {
              upsert: {
                where: { id: customDailyNutrition.id },
                update: customDailyNutrition,
                create: customDailyNutrition,
              },
            }
          : attempts[i],
        predefinedDailyNutrition: predefinedDailyNutritionId
          ? {
              connect: { id: predefinedDailyNutritionId },
            }
          : undefined,
      };
    };
    for (let i = 0; i < attempts.length; i++) {
      try {
        return await this.prisma.user.update({
          where: { id },
          data: buildData(i),
          ...UserAccountInclude,
        });
      } catch (error) {
        if (
          !(error instanceof PrismaClientKnownRequestError) ||
          error.code !== 'P2025' ||
          !(error.meta?.cause as string).includes("UserCustomDailyNutrition'.")
        ) {
          throw error;
        } else if (i === attempts.length - 1) {
          throw error;
        }
      }
    }
    throw new Error('Unreachable code');
  }

  async isRequestedUserFollowing(requestedUserId: string, followingId: string) {
    const row = await this.prisma.userFollow.findFirst({
      where: { userId: requestedUserId, followingId },
      select: {
        id: true,
      },
    });
    return !!row;
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

  async getFollowings(params: GetFollowersQueryParams) {
    const followings = await this.prisma.userFollow.findMany({
      where: { userId: params.id },
      cursor: params.cursorId ? { id: params.cursorId } : undefined,
      skip: params.cursorId ? 1 : params.skip,
      select: {
        id: true,
        following: { select: { id: true, handle: true, imageUrl: true } },
      },
    });
    return {
      data: followings.map((f) => f.following),
      pagination: {
        totalRecords: await this.prisma.userFollow.count({
          where: { userId: params.id },
        }),
        currentCursor:
          followings.length > 0 ? followings[0].id : params.cursorId || null,
        nextCursor:
          followings.length > 0 ? followings[followings.length - 1].id : null,
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
