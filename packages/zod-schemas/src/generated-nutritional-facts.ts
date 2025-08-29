import { MeasurementUnit } from '@repo/database';
import { z } from 'zod/v4';

export const GeneratedNutritionalFactsSchema = z.object({
  servings: z.number().positive().optional(),
  servingAmount: z.number().positive().optional(),
  servingUnit: z.enum(MeasurementUnit).optional(),
  caloriesInKcal: z.number().positive().optional(),
  calciumInMg: z.number().positive().optional(),
  carbohydratesInG: z.number().positive().optional(),
  cholesterolInMg: z.number().positive().optional(),
  fiberInG: z.number().positive().optional(),
  folateInMcg: z.number().positive().optional(),
  ironInMg: z.number().positive().optional(),
  magnesiumInMg: z.number().positive().optional(),
  niacinInMg: z.number().positive().optional(),
  potassiumInMg: z.number().positive().optional(),
  proteinInG: z.number().positive().optional(),
  riboflavinInMg: z.number().positive().optional(),
  saturatedFatInG: z.number().positive().optional(),
  sodiumInMg: z.number().positive().optional(),
  sugarInG: z.number().positive().optional(),
  thiaminInMg: z.number().positive().optional(),
  totalFatInG: z.number().positive().optional(),
  vitaminAInIU: z.number().positive().optional(),
  vitaminB12InMg: z.number().positive().optional(),
  vitaminB6InMg: z.number().positive().optional(),
  vitaminCInMg: z.number().positive().optional(),
  vitaminDInIU: z.number().positive().optional(),
});

export type GeneratedNutiritionalFactsType = z.infer<
  typeof GeneratedNutritionalFactsSchema
>;
