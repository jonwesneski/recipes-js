import { ApiProperty } from '@nestjs/swagger';
import {
  CuisineType,
  DietaryType,
  DifficultyLevelType,
  DishType,
  MealType,
  ProteinType,
} from '@repo/database';
import { BaseQueryDto, createExpressionDto } from '@src/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DietsExpressionDto extends createExpressionDto(
  DietaryType,
  'DietaryType',
) {}
export class ProteinsExpressionDto extends createExpressionDto(
  ProteinType,
  'ProteinType',
) {}
export class RecipeFiltersDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  userId?: string;
  @IsOptional()
  @IsEnum(MealType, { each: true })
  @IsArray()
  @ApiProperty({
    enum: MealType,
    enumName: 'MealType',
    required: false,
    isArray: true,
  })
  meals?: MealType[];
  @IsOptional()
  @IsEnum(CuisineType, { each: true })
  @IsArray()
  @ApiProperty({
    enum: CuisineType,
    enumName: 'CuisineType',
    required: false,
    isArray: true,
  })
  cuisines?: CuisineType[];
  @IsOptional()
  @IsEnum(DishType, { each: true })
  @IsArray()
  @ApiProperty({
    enum: DishType,
    enumName: 'DishType',
    required: false,
    isArray: true,
  })
  dishes?: DishType[];
  @IsOptional()
  @IsEnum(DifficultyLevelType, { each: true })
  @IsArray()
  @ApiProperty({
    enum: DifficultyLevelType,
    enumName: 'DifficultyLevelType',
    required: false,
    isArray: true,
  })
  difficultyLevel?: DifficultyLevelType[];
  @IsOptional()
  @ValidateNested()
  @ApiProperty({
    type: DietsExpressionDto,
    required: false,
  })
  @Type(() => DietsExpressionDto)
  diets?: DietsExpressionDto;
  @IsOptional()
  @ValidateNested()
  @ApiProperty({
    type: ProteinsExpressionDto,
    required: false,
  })
  @Type(() => ProteinsExpressionDto)
  proteins?: ProteinsExpressionDto;
}

export class GetRecipesDto {
  @IsOptional()
  @ValidateNested()
  @ApiProperty({ type: RecipeFiltersDto, required: false })
  @Type(() => RecipeFiltersDto)
  filters?: RecipeFiltersDto;

  @IsOptional()
  @ValidateNested()
  @ApiProperty({ type: BaseQueryDto, required: false })
  @Type(() => BaseQueryDto)
  pagination?: BaseQueryDto;
}
