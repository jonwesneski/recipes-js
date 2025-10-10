import { z } from 'zod/v4';

export const NotificationRecipeAddedSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  preparationTimeInMinutes: z.number().int().positive().nullable(),
  cookingTimeInMinutes: z.number().int().positive().nullable(),
  user: z.object({
    handle: z.string(),
  }),
});

export type NotificationRecipeAddedSchemaType = z.infer<
  typeof NotificationRecipeAddedSchema
>;
