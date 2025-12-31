import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { PrismaQueryParams, UserRepository } from '@repo/nest-shared';
import { PatchUserDto } from './contracts';

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
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(id: string, requestedUser?: string): Promise<UserType> {
    return await this.userRepository.getUser(id, requestedUser);
  }

  async getUserAccount(id: string): Promise<UserAccountPrismaType> {
    return await this.userRepository.getUserAccount(id);
  }

  async updateUserAccount(
    id: string,
    user: PatchUserDto,
  ): Promise<UserAccountPrismaType> {
    return await this.userRepository.updateUserAccount(id, user);
  }

  async getFollowerIds(id: string) {
    return await this.userRepository.getFollowerIds(id);
  }

  async getFollowings(params: GetFollowersQueryParams) {
    return await this.userRepository.getFollowings(params);
  }

  async followUser(id: string, requestedUser: string, isFollowing: boolean) {
    await this.userRepository.followUser(id, requestedUser, isFollowing);
  }
}
