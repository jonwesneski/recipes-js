import { z } from 'zod/v4';
import {
  CuisineTypeSchema,
  DietaryTypeSchema,
  DifficultyLevelTypeSchema,
  DishTypeSchema,
  MealTypeSchema,
  ProteinTypeSchema,
} from './recipe-categories';

export const GeneratedCategoriesSchema = z.object({
  cuisine: CuisineTypeSchema,
  diets: z.array(DietaryTypeSchema),
  dish: DishTypeSchema,
  meal: MealTypeSchema,
  proteins: z.array(ProteinTypeSchema),
  difficultyLevel: DifficultyLevelTypeSchema,
  tags: z.array(z.string()),
});

export type GeneratedCategoriesType = z.infer<typeof GeneratedCategoriesSchema>;
