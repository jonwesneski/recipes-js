import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@repo/database';
import { RecipeMinimalType, RecipeType } from '../../recipes.service';

type OmitFields<T, K extends keyof any> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | K
>;

export class EquipmentEntity
  implements OmitFields<Prisma.EquipmentCreateInput, 'recipe'>
{
  @ApiProperty({ type: String })
  name: string;
}

export class NutritionalFactsEntity
  implements OmitFields<Prisma.NutritionalFactsCreateInput, 'recipe'>
{
  @ApiProperty({ type: Number, nullable: true })
  proteinInG: number | null;
  @ApiProperty({ type: Number, nullable: true })
  totalFatInG: number | null;
  @ApiProperty({ type: Number, nullable: true })
  carbohydratesInG: number | null;
  @ApiProperty({ type: Number, nullable: true })
  fiberInG: number | null;
  @ApiProperty({ type: Number, nullable: true })
  sugarInG: number | null;
  @ApiProperty({ type: Number, nullable: true })
  sodiumInMg: number | null;
  @ApiProperty({ type: Number, nullable: true })
  cholesterolInMg: number | null;
  @ApiProperty({ type: Number, nullable: true })
  saturatedFatInG: number | null;
  @ApiProperty({ type: Number, nullable: true })
  transFatInG: number | null;
  @ApiProperty({ type: Number, nullable: true })
  potassiumInMg: number | null;
  @ApiProperty({ type: Number, nullable: true })
  vitaminAInIU: number | null;
  @ApiProperty({ type: Number, nullable: true })
  vitaminCInMg: number | null;
  @ApiProperty({ type: Number, nullable: true })
  calciumInMg: number | null;
  @ApiProperty({ type: Number, nullable: true })
  ironInMg: number | null;
  @ApiProperty({ type: Number, nullable: true })
  vitaminDInIU: number | null;
  @ApiProperty({ type: Number, nullable: true })
  vitaminB6InMg: number | null;
  @ApiProperty({ type: Number, nullable: true })
  vitaminB12InMg: number | null;
  @ApiProperty({ type: Number, nullable: true })
  magnesiumInMg: number | null;
  @ApiProperty({ type: Number, nullable: true })
  folateInMcg: number | null;
  @ApiProperty({ type: Number, nullable: true })
  thiaminInMg: number | null;
  @ApiProperty({ type: Number, nullable: true })
  riboflavinInMg: number | null;
  @ApiProperty({ type: Number, nullable: true })
  niacinInMg: number | null;
  @ApiProperty({ type: Number, nullable: true })
  caloriesInKcal: number | null;
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
  recipeId: number;
  @ApiProperty({ type: String, nullable: true })
  instruction: string | null;
  @ApiProperty({ type: [IngredientEntity] })
  ingredients: IngredientEntity[];
}

export class TagsType {
  name: string;
}

export class RecipeEntity implements RecipeType {
  @ApiProperty({ type: [EquipmentEntity] })
  equipments: EquipmentEntity[];
  @ApiProperty({ type: [StepEntity] })
  steps: StepEntity[];
  @ApiProperty({ type: NutritionalFactsEntity, nullable: true })
  nutritionalFacts: NutritionalFactsEntity | null;
  @ApiProperty({ type: [String] })
  tags: string[];
  @ApiProperty()
  id: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  name: string;
  @ApiProperty()
  slug: string;
  @ApiProperty({ type: String, nullable: true })
  description: string | null;
  @ApiProperty({ type: Number, nullable: true })
  preparationTimeInMinutes: number | null;
  @ApiProperty({ type: Number, nullable: true })
  cookingTimeInMinutes: number | null;
  @ApiProperty()
  userId: string;
}

export class RecipeMinimalEntity implements RecipeMinimalType {
  @ApiProperty()
  name: string;
  @ApiProperty()
  slug: string;
  @ApiProperty({ type: String, nullable: true })
  description: string | null;
  @ApiProperty({ type: [String] })
  tags: string[];
  @ApiProperty()
  userId: string;
}
