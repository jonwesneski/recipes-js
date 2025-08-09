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
import { NutritionalFactsDto } from './create-recipe.dto';

export class EditIngredientDto
  implements
    OmitPrismaFieldsDto<Prisma.IngredientCreateInput, 'step' | 'displayOrder'>
{
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;
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

export class EditStepDto
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
  @Type(() => EditIngredientDto)
  @ApiProperty({ type: [EditIngredientDto] })
  @Type(() => EditIngredientDto)
  ingredients?: EditIngredientDto[];
}

export class EditRecipeDto
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
  @Type(() => EditStepDto)
  @ApiProperty({ type: [EditStepDto], required: false })
  @Type(() => EditStepDto)
  steps?: EditStepDto[];
  @IsOptional()
  @ValidateNested()
  @Type(() => NutritionalFactsDto)
  @ApiProperty({ type: NutritionalFactsDto, nullable: true, required: false })
  nutritionalFacts?: NutritionalFactsDto;
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
