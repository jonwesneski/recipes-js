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
  cuisine: CuisineTypeSchema.nullable(),
  diets: z.array(DietaryTypeSchema),
  dish: DishTypeSchema.nullable(),
  meal: MealTypeSchema.nullable(),
  proteins: z.array(ProteinTypeSchema),
  difficultyLevel: DifficultyLevelTypeSchema.nullable(),
  tags: z.array(z.string()),
});

export type GeneratedCategoriesType = z.infer<typeof GeneratedCategoriesSchema>;
