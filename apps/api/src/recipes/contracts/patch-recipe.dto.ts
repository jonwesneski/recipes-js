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

export class AddIngredientDto {
  @IsInt()
  @Min(0)
  @ApiProperty({ type: Number })
  displayOrder: number;
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

export class UpdateIngredientDto extends AddIngredientDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  id: string;
}

export class IngredientOperationsDto {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddIngredientDto)
  @ApiProperty({ type: [AddIngredientDto], required: false })
  add?: AddIngredientDto[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateIngredientDto)
  @ApiProperty({ type: [UpdateIngredientDto], required: false })
  update?: UpdateIngredientDto[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false })
  remove?: string[];
}

export class AddStepDto {
  @IsInt()
  @Min(0)
  @ApiProperty({ type: Number })
  displayOrder: number;
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true, required: false })
  instruction?: string | null;
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddIngredientDto)
  @ApiProperty({ type: [AddIngredientDto], required: false })
  ingredients?: AddIngredientDto[];
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, nullable: true, required: false })
  base64Image?: string | null;
}

export class UpdateStepDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  id: string;
  @IsInt()
  @Min(0)
  @ApiProperty({ type: Number })
  displayOrder: number;
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true, required: false })
  instruction?: string | null;
  @IsOptional()
  @ValidateNested()
  @Type(() => IngredientOperationsDto)
  @ApiProperty({ type: IngredientOperationsDto, required: false })
  ingredients?: IngredientOperationsDto;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, nullable: true, required: false })
  base64Image?: string | null;
}

export class StepOperationsDto {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddStepDto)
  @ApiProperty({ type: [AddStepDto], required: false })
  add?: AddStepDto[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateStepDto)
  @ApiProperty({ type: [UpdateStepDto], required: false })
  update?: UpdateStepDto[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false })
  remove?: string[];
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
  @ApiProperty({ type: String, nullable: true, required: false })
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
  @ValidateNested()
  @Type(() => StepOperationsDto)
  @ApiProperty({ type: StepOperationsDto, required: false })
  steps?: StepOperationsDto;
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
