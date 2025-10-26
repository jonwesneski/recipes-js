import {
  CuisineType,
  DietaryType,
  DifficultyLevelType,
  DishType,
  MealType,
  ProteinType,
} from '@repo/database';
import { BaseQueryDto } from '@src/common';
import { IsEnum, IsOptional, IsString } from 'class-validator';

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
  @IsEnum(DietaryType)
  diets?: DietaryType;
  @IsOptional()
  @IsEnum(DishType)
  dish?: DishType;
  @IsOptional()
  @IsEnum(ProteinType)
  proteins?: ProteinType;
  @IsOptional()
  @IsEnum(DifficultyLevelType)
  difficultyLevel?: DifficultyLevelType;
}
