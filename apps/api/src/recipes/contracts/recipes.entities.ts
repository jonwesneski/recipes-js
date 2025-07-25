import { ApiProperty } from '@nestjs/swagger';
import { MeasurementUnit, Prisma } from '@repo/database';
import { RecipeMinimalType, RecipeType } from '../recipes.service';

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
  servings: number | null;
  @ApiProperty({ type: Number, nullable: true })
  servingAmount: number | null;
  @ApiProperty({ enum: MeasurementUnit, nullable: true })
  servingUnit: MeasurementUnit | null;
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
  implements OmitFields<Prisma.IngredientCreateInput, 'step' | 'displayOrder'>
{
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({ type: Number })
  amount: number;
  @ApiProperty({ enum: MeasurementUnit })
  unit: MeasurementUnit;
  @ApiProperty()
  name: string;
}

export class StepEntity
  implements
    Omit<
      Prisma.StepUncheckedCreateWithoutRecipeInput,
      'displayOrder' | 'ingredients' | 'instructions'
    >
{
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({ type: String, nullable: true })
  instruction: string | null;
  @ApiProperty({ type: [IngredientEntity] })
  ingredients: IngredientEntity[];
  @ApiProperty({ type: String, nullable: true })
  imageUrl: string | null;
}

export class TagsType {
  name: string;
}

export class UserEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  handle: string;
}

export class RecipeEntity implements RecipeType {
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: String, nullable: true })
  description: string | null;
  @ApiProperty({ type: Number, nullable: true })
  preparationTimeInMinutes: number | null;
  @ApiProperty({ type: Number, nullable: true })
  cookingTimeInMinutes: number | null;
  @ApiProperty({ type: String, nullable: true })
  imageUrl: string | null;
  @ApiProperty({ type: [EquipmentEntity] })
  equipments: EquipmentEntity[];
  @ApiProperty({ type: [StepEntity] })
  steps: StepEntity[];
  @ApiProperty({ type: NutritionalFactsEntity, nullable: true })
  nutritionalFacts: NutritionalFactsEntity | null;
  @ApiProperty({ type: [String] })
  tags: string[];
  @ApiProperty({ type: UserEntity })
  user: UserEntity;
  @ApiProperty()
  isPublic: boolean;
}

export class RecipeMinimalEntity implements RecipeMinimalType {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: String, nullable: true })
  description: string | null;
  @ApiProperty()
  imageUrl: string;
  @ApiProperty({ type: [String] })
  tags: string[];
  @ApiProperty({ type: UserEntity })
  user: UserEntity;
}
