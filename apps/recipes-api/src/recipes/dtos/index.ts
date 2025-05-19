import { Prisma } from '@repo/database/generated/prisma/client';

type OmitFields<T, K extends keyof any> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | K
>;

export class NutritionalFactsDto
  implements OmitFields<Prisma.NutrionalFactsCreateInput, 'recipe'>
{
  proteinInG?: number | null | undefined;
  fatInG?: number | null | undefined;
  carbsInG?: number | null | undefined;
  fiberInG?: number | null | undefined;
  sugarInG?: number | null | undefined;
  sodiumInMg?: number | null | undefined;
  cholesterolInMg?: number | null | undefined;
  saturatedFatInG?: number | null | undefined;
  transFatInG?: number | null | undefined;
  potassiumInMg?: number | null | undefined;
  vitaminAInIU?: number | null | undefined;
  vitaminCInMg?: number | null | undefined;
  calciumInMg?: number | null | undefined;
  ironInMg?: number | null | undefined;
  vitaminDInIU?: number | null | undefined;
  vitaminB6InMg?: number | null | undefined;
  vitaminB12InMg?: number | null | undefined;
  magnesiumInMg?: number | null | undefined;
  folateInMcg?: number | null | undefined;
  thiaminInMg?: number | null | undefined;
  riboflavinInMg?: number | null | undefined;
  niacinInMg?: number | null | undefined;
  calories?: number | null | undefined;
  carbohydrates?: number | null | undefined;
  protein?: number | null | undefined;
  fat?: number | null | undefined;
  fiber?: number | null | undefined;
  sugar?: number | null | undefined;
}

export class IngredientDto
  implements OmitFields<Prisma.IngredientCreateInput, 'step'>
{
  amount: number;
  unit: string;
  name: string;
}

export class StepDto
  implements
    OmitFields<
      Prisma.StepUncheckedCreateWithoutRecipeInput,
      'recipeId' | 'ingredients' | 'instructions'
    >
{
  instruction?: string;
  ingredients?: IngredientDto[] | undefined;
}

export class CreateRecipeDto
  implements
    OmitFields<
      Prisma.RecipeUncheckedCreateInput,
      'nutritionalFacts' | 'user' | 'steps' | 'tags'
    >
{
  name: string;
  slug: string;
  description?: string | null | undefined;
  preparationTimeInMinutes?: number | null | undefined;
  cookingTimeInMinutes?: number | null | undefined;
  steps: StepDto[]; //Prisma.StepCreateNestedManyWithoutRecipeInput | undefined;
  nutritionalFacts?: NutritionalFactsDto | undefined;
  tags: string[];
  userId: string;
}
