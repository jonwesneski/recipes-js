import { ApiProperty } from '@nestjs/swagger';
import { MeasurementUnit, Prisma } from '@repo/database';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { OmitPrismaFieldsDto } from 'src/common/utilityTypes';

export class EquipmentDto
  implements OmitPrismaFieldsDto<Prisma.EquipmentCreateInput, 'recipe'>
{
  @ApiProperty({ type: String })
  name: string;
}

export class NutritionalFactsDto
  implements OmitPrismaFieldsDto<Prisma.NutritionalFactsCreateInput, 'recipe'>
{
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  servings: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  servingAmount: number | null;
  @IsOptional()
  @IsEnum(MeasurementUnit)
  @ApiProperty({ enum: MeasurementUnit, nullable: true })
  servingUnit: MeasurementUnit | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  proteinInG: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  totalFatInG: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  carbohydratesInG: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  fiberInG: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  sugarInG: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  sodiumInMg: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  cholesterolInMg: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  saturatedFatInG: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  transFatInG: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  potassiumInMg: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  vitaminAInIU: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  vitaminCInMg: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  calciumInMg: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  ironInMg: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  vitaminDInIU: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  vitaminB6InMg: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  vitaminB12InMg: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  magnesiumInMg: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  folateInMcg: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  thiaminInMg: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  riboflavinInMg: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  niacinInMg: number | null;
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ type: Number, nullable: true })
  caloriesInKcal: number | null;
}

export class CreateIngredientDto
  implements
    OmitPrismaFieldsDto<Prisma.IngredientCreateInput, 'step' | 'displayOrder'>
{
  @IsNumber()
  @Min(0)
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

export class CreateStepDto
  implements
    OmitPrismaFieldsDto<
      Prisma.StepUncheckedCreateWithoutRecipeInput,
      'displayOrder' | 'recipeId' | 'ingredients' | 'instructions'
    >
{
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  instruction: string;
  @IsArray()
  @ApiProperty({ type: [CreateIngredientDto] })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateIngredientDto)
  ingredients: CreateIngredientDto[];
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  base64Image: string;
}

export class CreateRecipeDto
  implements
    OmitPrismaFieldsDto<
      Prisma.RecipeUncheckedCreateInput,
      | 'equipments'
      | 'nutritionalFacts'
      | 'userId'
      | 'steps'
      | 'tags'
      | 'imageUrl'
    >
{
  @IsString()
  @IsNotEmpty({ message: 'should not be empty' })
  @ApiProperty({ type: String })
  name: string;
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  description: string | null;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  base64Image: string | null;
  @IsInt()
  @IsOptional()
  @Min(0)
  @ApiProperty({ type: Number, nullable: true })
  preparationTimeInMinutes: number | null;
  @IsInt()
  @IsOptional()
  @Min(0)
  @ApiProperty({ type: Number, nullable: true })
  cookingTimeInMinutes: number | null;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  @ApiProperty({ type: [CreateStepDto] })
  steps: CreateStepDto[];
  @IsOptional()
  @ValidateNested()
  @Type(() => NutritionalFactsDto)
  @ApiProperty({ type: NutritionalFactsDto, nullable: true })
  nutritionalFacts: NutritionalFactsDto | null;
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  tags: string[];
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  equipments: string[];
  @IsBoolean()
  @ApiProperty({ type: Boolean })
  isPublic: boolean;
}
