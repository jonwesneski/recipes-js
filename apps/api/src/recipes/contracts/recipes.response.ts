import { ApiProperty } from '@nestjs/swagger';
import {
  CuisineType,
  DietaryType,
  DifficultyLevelType,
  DishType,
  MealType,
  MeasurementUnit,
  Prisma,
  ProteinType,
} from '@repo/database';
import { type RecipeMinimalType, type RecipeType } from '@repo/nest-shared';
import { PaginationResponse } from '@src/common/common.responses';
import { OmitPrismaFieldsEntity } from '@src/common/utilityTypes';

export class NutritionalFactsResponse
  implements
    OmitPrismaFieldsEntity<Prisma.NutritionalFactsCreateInput, 'recipe'>
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

export class IngredientResponse
  implements
    OmitPrismaFieldsEntity<
      Prisma.IngredientCreateInput,
      'step' | 'displayOrder'
    >
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
  isFraction: boolean;
  @ApiProperty({ enum: MeasurementUnit, nullable: true })
  unit: MeasurementUnit | null;
  @ApiProperty()
  name: string;
}

export class StepResponse
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
  @ApiProperty({ type: [IngredientResponse] })
  ingredients: IngredientResponse[];
  @ApiProperty({ type: String, nullable: true })
  imageUrl: string | null;
}

export class TagsType {
  name: string;
}

export class RecipeUserResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  handle: string;
  @ApiProperty()
  @ApiProperty({ type: String, nullable: true })
  imageUrl: string | null;
}

export class RecipeResponse implements RecipeType {
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
  @ApiProperty({ type: 'integer', nullable: true })
  preparationTimeInMinutes: number | null;
  @ApiProperty({ type: 'integer', nullable: true })
  cookingTimeInMinutes: number | null;
  @ApiProperty({ type: String, nullable: true })
  imageUrl: string | null;
  @ApiProperty({ type: [String] })
  equipments: string[];
  @ApiProperty({ type: [StepResponse] })
  steps: StepResponse[];
  @ApiProperty({ type: NutritionalFactsResponse, nullable: true })
  nutritionalFacts: NutritionalFactsResponse | null;
  @ApiProperty({ type: [String] })
  tags: string[];
  @ApiProperty({ enum: MealType, enumName: 'MealType', nullable: true })
  meal: MealType | null;
  @ApiProperty({ enum: CuisineType, enumName: 'CuisineType', nullable: true })
  cuisine: CuisineType | null;
  @ApiProperty({
    enum: DietaryType,
    isArray: true,
    enumName: 'DietaryType',
  })
  diets: DietaryType[];
  @ApiProperty({ enum: DishType, enumName: 'DishType', nullable: true })
  dish: DishType | null;
  @ApiProperty({
    enum: ProteinType,
    isArray: true,
    enumName: 'ProteinType',
  })
  proteins: ProteinType[];
  @ApiProperty({
    enum: DifficultyLevelType,
    enumName: 'DifficultyLevelType',
    nullable: true,
  })
  difficultyLevel: DifficultyLevelType | null;
  @ApiProperty({ type: RecipeUserResponse })
  user: RecipeUserResponse;
  @ApiProperty({ type: Boolean, required: false })
  isPublic?: boolean;
  @ApiProperty({ type: Boolean, required: false })
  bookmarked?: boolean;
}

export class BadRequestIngredientResponse {
  @ApiProperty({ type: String, required: false })
  amount: string;
  @ApiProperty({ type: String, required: false })
  unit: string;
  @ApiProperty({ type: String, required: false })
  name: string;
}

export class BadRequestStepResponse {
  @ApiProperty({ type: String, required: false })
  instruction?: string;
  @ApiProperty({ type: [BadRequestIngredientResponse], required: false })
  ingredients?: BadRequestIngredientResponse[];
  @ApiProperty({ type: String })
  base64Image?: string;
}

export class BadRequestNutritionalFactsResponse {
  @ApiProperty({ type: String, required: false })
  servings?: string;
  @ApiProperty({ type: String, required: false })
  servingAmount?: string;
  @ApiProperty({ type: String, required: false })
  servingUnit?: string;
  @ApiProperty({ type: String, required: false })
  proteinInG?: string;
  @ApiProperty({ type: String, required: false })
  totalFatInG?: string;
  @ApiProperty({ type: String, required: false })
  carbohydratesInG?: string;
  @ApiProperty({ type: String, required: false })
  fiberInG?: string;
  @ApiProperty({ type: String, required: false })
  sugarInG?: string;
  @ApiProperty({ type: String, required: false })
  sodiumInMg?: string;
  @ApiProperty({ type: String, required: false })
  cholesterolInMg?: string;
  @ApiProperty({ type: String, required: false })
  saturatedFatInG?: string;
  @ApiProperty({ type: String, required: false })
  transFatInG?: string;
  @ApiProperty({ type: String, required: false })
  potassiumInMg?: string;
  @ApiProperty({ type: String, required: false })
  vitaminAInIU?: string;
  @ApiProperty({ type: String, required: false })
  vitaminCInMg?: string;
  @ApiProperty({ type: String, required: false })
  calciumInMg?: string;
  @ApiProperty({ type: String, required: false })
  ironInMg?: string;
  @ApiProperty({ type: String, required: false })
  vitaminDInIU?: string;
  @ApiProperty({ type: String, required: false })
  vitaminB6InMg?: string;
  @ApiProperty({ type: String, required: false })
  vitaminB12InMg?: string;
  @ApiProperty({ type: String, required: false })
  magnesiumInMg?: string;
  @ApiProperty({ type: String, required: false })
  folateInMcg?: string;
  @ApiProperty({ type: String, required: false })
  thiaminInMg?: string;
  @ApiProperty({ type: String, required: false })
  riboflavinInMg?: string;
  @ApiProperty({ type: String, required: false })
  niacinInMg?: string;
  @ApiProperty({ type: String, required: false })
  caloriesInKcal?: string;
  @ApiProperty({ type: String, required: false })
  fatInG?: string;
  @ApiProperty({ type: String, required: false })
  fiber?: string;
  @ApiProperty({ type: String, required: false })
  sugar?: string;
}

export class BadRequestRecipeResponse {
  @ApiProperty({ type: String, required: false })
  name?: string;
  @ApiProperty({ type: String, required: false })
  description?: string;
  @ApiProperty({ type: String, required: false })
  base64Image?: string;
  @ApiProperty({ type: String, required: false })
  preparationTimeInMinutes?: string;
  @ApiProperty({ type: String, required: false })
  cookingTimeInMinutes?: string;
  @ApiProperty({ type: [BadRequestStepResponse], required: false })
  steps?: BadRequestStepResponse[];
  @ApiProperty({ type: BadRequestNutritionalFactsResponse, required: false })
  nutritionalFacts?: BadRequestNutritionalFactsResponse;
  @ApiProperty({ type: [String], required: false })
  tags?: string[];
  @ApiProperty({ type: [String], required: false })
  equipments?: string[];
  @ApiProperty({ type: String, required: false })
  isPublic: string;
}

export class RecipeMinimalResponse implements RecipeMinimalType {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: String, nullable: true })
  description: string | null;
  @ApiProperty({ type: 'integer', nullable: true })
  preparationTimeInMinutes: number | null;
  @ApiProperty({ type: 'integer', nullable: true })
  cookingTimeInMinutes: number | null;
  @ApiProperty({ type: String, nullable: true })
  imageUrl: string | null;
  @ApiProperty({ type: [String] })
  tags: string[];
  @ApiProperty({ enum: MealType, enumName: 'MealType', nullable: true })
  meal: MealType | null;
  @ApiProperty({ enum: CuisineType, enumName: 'CuisineType', nullable: true })
  cuisine: CuisineType | null;
  @ApiProperty({
    enum: DietaryType,
    isArray: true,
    enumName: 'DietaryType',
  })
  diets: DietaryType[];
  @ApiProperty({ enum: DishType, enumName: 'DishType', nullable: true })
  dish: DishType | null;
  @ApiProperty({
    enum: ProteinType,
    isArray: true,
    enumName: 'ProteinType',
  })
  proteins: ProteinType[];
  @ApiProperty({
    enum: DifficultyLevelType,
    enumName: 'DifficultyLevelType',
    nullable: true,
  })
  difficultyLevel: DifficultyLevelType | null;
  @ApiProperty({ type: RecipeUserResponse })
  user: RecipeUserResponse;
  @ApiProperty({ type: Boolean, required: false })
  bookmarked?: boolean;
}

export class RecipeListResponse {
  @ApiProperty({ type: [RecipeMinimalResponse] })
  data: RecipeMinimalResponse[];
  @ApiProperty({ type: PaginationResponse })
  pagination: PaginationResponse;
}
