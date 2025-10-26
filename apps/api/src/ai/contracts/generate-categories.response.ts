import { ApiProperty } from '@nestjs/swagger';
import {
  CuisineType,
  DietaryType,
  DifficultyLevelType,
  DishType,
  MealType,
  ProteinType,
} from '@repo/database';
import { GeneratedCategoriesType } from '@repo/zod-schemas';

export class GeneratedCategoriesResponse implements GeneratedCategoriesType {
  @ApiProperty({ enum: CuisineType, enumName: 'CuisineType' })
  cuisine: CuisineType;
  @ApiProperty({ enum: DietaryType, enumName: 'DietaryType', isArray: true })
  diets: DietaryType[];
  @ApiProperty({ enum: DishType, enumName: 'DishType' })
  dish: DishType;
  @ApiProperty({ enum: MealType, enumName: 'MealType' })
  meal: MealType;
  @ApiProperty({ enum: ProteinType, enumName: 'ProteinType', isArray: true })
  proteins: ProteinType[];
  @ApiProperty({ enum: DifficultyLevelType, enumName: 'DifficultyLevelType' })
  difficultyLevel: DifficultyLevelType;
  @ApiProperty({ type: String, isArray: true })
  tags: string[];
}
