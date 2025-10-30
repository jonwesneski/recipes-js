import {
  CuisineTypeSchema,
  DietaryTypeSchema,
  DifficultyLevelTypeSchema,
  DishTypeSchema,
  MealTypeSchema,
  ProteinTypeSchema,
} from '@repo/zod-schemas';
import { z } from 'zod/v4';

const SearchParamsOperatorSchema = z.literal(['AND', 'OR', 'NOT']);

export const RecipeSearchParamsSchema = z.object({
  filters: z
    .object({
      meals: z.array(MealTypeSchema).optional(),
      dishes: z.array(DishTypeSchema).optional(),
      cuisine: z.array(CuisineTypeSchema).optional(),
      difficultyLevel: z.array(DifficultyLevelTypeSchema).optional(),
      diets: z.array(DietaryTypeSchema).optional(),
      dietsOperator: SearchParamsOperatorSchema.default('AND'),
      proteins: z.array(ProteinTypeSchema).optional(),
      proteinsOperator: SearchParamsOperatorSchema.default('OR'),
    })
    .optional(),
});
