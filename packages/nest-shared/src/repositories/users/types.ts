import { NutritionalFacts, Prisma } from '@repo/database';

type UserCreateType = Prisma.UserGetPayload<{
  omit: {
    id: true;
    createdAt: true;
    updatedAt: true;
    customDailyNutritionId: true;
  };
}> & {
  customDailyNutrition:
    | Omit<NutritionalFacts, 'createdAt' | 'updatedAt' | 'recipeId'>
    | null
    | undefined;
};
export type UserUpdateType = Partial<UserCreateType>;
