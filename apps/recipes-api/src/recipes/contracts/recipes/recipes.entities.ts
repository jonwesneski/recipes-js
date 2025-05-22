import { ApiProperty } from '@nestjs/swagger';
import { RecipeType } from '../../recipes.service';
import { Prisma } from '@repo/database';

type OmitFields<T, K extends keyof any> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | K
>;

export class NutritionalFactsEntity
  implements OmitFields<Prisma.NutrionalFactsCreateInput, 'recipe'>
{
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  recipeId: string;
  @ApiProperty({ type: Number })
  proteinInG: number | null;
  @ApiProperty({ type: Number })
  fatInG: number | null;
  @ApiProperty({ type: Number })
  carbsInG: number | null;
  @ApiProperty({ type: Number })
  fiberInG: number | null;
  @ApiProperty({ type: Number })
  sugarInG: number | null;
  @ApiProperty({ type: Number })
  sodiumInMg: number | null;
  @ApiProperty({ type: Number })
  cholesterolInMg: number | null;
  @ApiProperty({ type: Number })
  saturatedFatInG: number | null;
  @ApiProperty({ type: Number })
  transFatInG: number | null;
  @ApiProperty({ type: Number })
  potassiumInMg: number | null;
  @ApiProperty({ type: Number })
  vitaminAInIU: number | null;
  @ApiProperty({ type: Number })
  vitaminCInMg: number | null;
  @ApiProperty({ type: Number })
  calciumInMg: number | null;
  @ApiProperty({ type: Number })
  ironInMg: number | null;
  @ApiProperty({ type: Number })
  vitaminDInIU: number | null;
  @ApiProperty({ type: Number })
  vitaminB6InMg: number | null;
  @ApiProperty({ type: Number })
  vitaminB12InMg: number | null;
  @ApiProperty({ type: Number })
  magnesiumInMg: number | null;
  @ApiProperty({ type: Number })
  folateInMcg: number | null;
  @ApiProperty({ type: Number })
  thiaminInMg: number | null;
  @ApiProperty({ type: Number })
  riboflavinInMg: number | null;
  @ApiProperty({ type: Number })
  niacinInMg: number | null;
  @ApiProperty({ type: Number })
  calories: number | null;
}

export class IngredientEntity
  implements OmitFields<Prisma.IngredientCreateInput, 'step'>
{
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({ type: Number })
  amount: number;
  @ApiProperty()
  unit: string;
  @ApiProperty()
  name: string;
}

export class StepEntity
  implements
    Omit<
      Prisma.StepUncheckedCreateWithoutRecipeInput,
      'ingredients' | 'instructions'
    >
{
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  recipeId: string;
  @ApiProperty()
  instruction: string | null;
  @ApiProperty()
  ingredients: IngredientEntity[];
}

class TagsType {
  name: string;
}

export class RecipeEntity implements RecipeType {
  @ApiProperty({ type: [StepEntity] })
  steps: StepEntity[];
  @ApiProperty({ type: NutritionalFactsEntity })
  nutritionalFacts: NutritionalFactsEntity | null;
  @ApiProperty({ type: [TagsType] })
  tags: { name: string }[];
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  name: string;
  @ApiProperty()
  slug: string;
  @ApiProperty({ type: String })
  description: string | null;
  @ApiProperty({ type: Number })
  preparationTimeInMinutes: number | null;
  @ApiProperty({ type: Number })
  cookingTimeInMinutes: number | null;
  @ApiProperty()
  userId: string;
}
