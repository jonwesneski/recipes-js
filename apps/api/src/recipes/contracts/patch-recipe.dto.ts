import { ApiProperty } from '@nestjs/swagger';
import { MeasurementUnit, Prisma } from '@repo/database';
import { IsNullable } from '@src/common/custom.class-validators';
import { OmitPrismaFieldsDto } from '@src/common/utilityTypes';
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
import { NutritionalFactsDto } from './create-recipe.dto';

export class PatchIngredientDto
  implements
    OmitPrismaFieldsDto<Prisma.IngredientCreateInput, 'step' | 'displayOrder'>
{
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  id?: string;
  @IsNumber()
  @Min(0)
  @ApiProperty({ type: Number })
  amount: number;
  @IsBoolean()
  @ApiProperty()
  isFraction: boolean;
  @IsEnum(MeasurementUnit)
  @IsNullable()
  @ApiProperty({ enum: MeasurementUnit, nullable: true })
  unit: MeasurementUnit | null;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  name: string;
}

export class PatchStepDto
  implements
    OmitPrismaFieldsDto<
      Prisma.StepUncheckedCreateWithoutRecipeInput,
      'displayOrder' | 'recipeId' | 'ingredients' | 'instructions'
    >
{
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: false })
  id?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, required: false })
  instruction?: string;
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => PatchIngredientDto)
  @ApiProperty({ type: [PatchIngredientDto] })
  @Type(() => PatchIngredientDto)
  ingredients?: PatchIngredientDto[];
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, nullable: true })
  base64Image?: string | null;
}

export class PatchRecipeDto
  implements
    OmitPrismaFieldsDto<
      Prisma.RecipeUncheckedUpdateInput,
      | 'equipments'
      | 'nutritionalFacts'
      | 'userId'
      | 'steps'
      | 'tags'
      | 'imageUrl'
    >
{
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: false })
  name?: string;
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true, required: false })
  description?: string | null;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  base64Image?: string;
  @IsInt()
  @IsOptional()
  @Min(0)
  @ApiProperty({ type: Number, nullable: true, required: false })
  preparationTimeInMinutes?: number | null;
  @IsInt()
  @IsOptional()
  @Min(0)
  @ApiProperty({ type: Number, nullable: true, required: false })
  cookingTimeInMinutes?: number | null;
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => PatchStepDto)
  @ApiProperty({ type: [PatchStepDto], required: false })
  @Type(() => PatchStepDto)
  steps?: PatchStepDto[];
  @IsOptional()
  @ValidateNested()
  @Type(() => NutritionalFactsDto)
  @ApiProperty({ type: NutritionalFactsDto, nullable: true, required: false })
  nutritionalFacts?: NutritionalFactsDto;
  @IsOptional()
  @IsNumber()
  @Min(0)
  @IsNullable()
  @ApiProperty({ type: Number, nullable: true, required: false })
  servings?: number | null;
  @IsOptional()
  @IsNumber()
  @Min(0)
  @IsNullable()
  @ApiProperty({ type: Number, nullable: true, required: false })
  servingAmount?: number | null;
  @IsOptional()
  @IsEnum(MeasurementUnit)
  @IsNullable()
  @ApiProperty({ enum: MeasurementUnit, nullable: true, required: false })
  servingUnit?: MeasurementUnit | null;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false })
  tags?: string[];
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false })
  equipments?: string[];
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  isPublic?: boolean;
}
