import { z } from 'zod/v4';

export const GeneratedClassifiersSchema = z.object({
  cuisine: z.string(),
  diets: z.array(z.string()),
  dish: z.string(),
  meal: z.string(),
  proteins: z.array(z.string()),
  difficultyLevel: z.string(),
  tags: z.array(z.string()),
});

export type GeneratedClassifiersType = z.infer<
  typeof GeneratedClassifiersSchema
>;
