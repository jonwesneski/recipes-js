import { ApiProperty } from '@nestjs/swagger';
import {
  CuisineType,
  DietaryType,
  DifficultyLevelType,
  DishType,
  MealType,
  ProteinType,
} from '@repo/database';
import { GeneratedClassifiersType } from '@repo/zod-schemas';

export class GeneratedClassifiersResponse implements GeneratedClassifiersType {
  @ApiProperty({ enum: CuisineType, enumName: 'CuisineType' })
  cuisine: string;
  @ApiProperty({ enum: DietaryType, enumName: 'DietaryType', isArray: true })
  diets: string[];
  @ApiProperty({ enum: DishType, enumName: 'DishType' })
  dish: string;
  @ApiProperty({ enum: MealType, enumName: 'MealType' })
  meal: string;
  @ApiProperty({ enum: ProteinType, enumName: 'ProteinType', isArray: true })
  proteins: string[];
  @ApiProperty({ enum: DifficultyLevelType, enumName: 'DifficultyLevelType' })
  difficultyLevel: string;
  @ApiProperty({ type: String, isArray: true })
  tags: string[];
}
