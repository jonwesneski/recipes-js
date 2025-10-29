import {
  CuisineType,
  DietaryType,
  DifficultyLevelType,
  DishType,
  MealType,
  ProteinType,
} from '@repo/database';
import { BaseQueryDto } from '@src/common';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class GetRecipesDto extends BaseQueryDto {
  @IsOptional()
  @IsString()
  userId?: string;
  @IsOptional()
  @IsEnum(MealType)
  meal?: MealType;
  @IsOptional()
  @IsEnum(CuisineType)
  cuisine?: CuisineType;
  @IsOptional()
  @IsEnum(DishType)
  dish?: DishType;
  @IsOptional()
  @IsArray()
  @IsEnum(DietaryType, { each: true })
  diets?: DietaryType;
  @IsOptional()
  @IsArray()
  @IsEnum(ProteinType, { each: true })
  proteins?: ProteinType;
  @IsOptional()
  @IsEnum(DifficultyLevelType)
  difficultyLevel?: DifficultyLevelType;
}
