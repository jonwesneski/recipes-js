import { Prisma } from '@repo/database/generated/prisma/client';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

type OmitFields<T, K extends keyof any> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | K
>;

export class NutritionalFactsDto
  implements OmitFields<Prisma.NutritionalFactsCreateInput, 'recipe'>
{
  @IsNumber()
  @IsPositive()
  @IsOptional()
  proteinInG?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  totalFatInG?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  carbsInG?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  fiberInG?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  sugarInG?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  sodiumInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  cholesterolInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  saturatedFatInG?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  transFatInG?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  potassiumInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  vitaminAInIU?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  vitaminCInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  calciumInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  ironInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  vitaminDInIU?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  vitaminB6InMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  vitaminB12InMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  magnesiumInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  folateInMcg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  thiaminInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  riboflavinInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  niacinInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  caloriesInKcal?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  carbohydrates?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  protein?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  fat?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  fiber?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  sugar?: number | null;
}

export class IngredientDto
  implements OmitFields<Prisma.IngredientCreateInput, 'step'>
{
  @IsNumber()
  @IsPositive()
  amount: number;
  @IsString()
  unit: string;
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class StepDto
  implements
    OmitFields<
      Prisma.StepUncheckedCreateWithoutRecipeInput,
      'recipeId' | 'ingredients' | 'instructions'
    >
{
  @IsString()
  @IsOptional()
  instruction?: string;
  @IsArray()
  ingredients: IngredientDto[];
}

export class CreateRecipeDto
  implements
    OmitFields<
      Prisma.RecipeUncheckedCreateInput,
      'nutritionalFacts' | 'user' | 'steps' | 'tags'
    >
{
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  slug: string;
  @IsString()
  @IsOptional()
  description?: string | null;
  @IsInt()
  @IsOptional()
  @IsPositive()
  preparationTimeInMinutes?: number | null;
  @IsInt()
  @IsOptional()
  @IsPositive()
  cookingTimeInMinutes?: number | null;
  @IsArray()
  steps: StepDto[];
  nutritionalFacts?: NutritionalFactsDto | null;
  @IsArray()
  @IsString({ each: true })
  tags: string[];
  @IsString()
  @IsNotEmpty()
  userId: string;
}
