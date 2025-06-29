import { ApiProperty } from '@nestjs/swagger';
import { MeasurementUnit, Prisma } from '@repo/database';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

type OmitFields<T, K extends keyof any> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | K
>;

export class EquipmentDto
  implements OmitFields<Prisma.EquipmentCreateInput, 'Recipe'>
{
  @ApiProperty({ type: String })
  name: string;
}

export class NutritionalFactsDto
  implements OmitFields<Prisma.NutritionalFactsCreateInput, 'Recipe'>
{
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  servings?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  servingAmount?: number | null;
  @IsOptional()
  @IsEnum(MeasurementUnit)
  @ApiProperty({ enum: MeasurementUnit, nullable: true })
  servingUnit?: MeasurementUnit | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  proteinInG?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  totalFatInG?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  carbsInG?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  fiberInG?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  sugarInG?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  sodiumInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  cholesterolInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  saturatedFatInG?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  transFatInG?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  potassiumInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  vitaminAInIU?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  vitaminCInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  calciumInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  ironInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  vitaminDInIU?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  vitaminB6InMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  vitaminB12InMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  magnesiumInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  folateInMcg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  thiaminInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  riboflavinInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  niacinInMg?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  caloriesInKcal?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  carbohydrates?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  protein?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  fat?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  fiber?: number | null;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  sugar?: number | null;
}

export class IngredientDto
  implements OmitFields<Prisma.IngredientCreateInput, 'Step'>
{
  @IsNumber()
  @IsPositive()
  @ApiProperty({ type: Number })
  amount: number;
  @IsEnum(MeasurementUnit)
  @ApiProperty({ enum: MeasurementUnit })
  unit: MeasurementUnit;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
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
  @ApiProperty({ type: String, nullable: true })
  instruction?: string;
  @IsArray()
  @ApiProperty({ type: [IngredientDto] })
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
  @ApiProperty({ type: String })
  name: string;
  @IsNotEmpty()
  @ApiProperty({ type: String })
  slug: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  description?: string | null;
  @IsInt()
  @IsOptional()
  @IsPositive()
  @ApiProperty({ type: Number, nullable: true })
  preparationTimeInMinutes?: number | null;
  @IsInt()
  @IsOptional()
  @IsPositive()
  @ApiProperty({ type: Number, nullable: true })
  cookingTimeInMinutes?: number | null;
  @IsArray()
  @ApiProperty({ type: [StepDto] })
  steps: StepDto[];
  @IsOptional()
  @ValidateNested()
  @Type(() => NutritionalFactsDto)
  @ApiProperty({ type: NutritionalFactsDto, nullable: true })
  nutritionalFacts?: NutritionalFactsDto | null;
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  tags: string[];
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  userHandle: string;
}
