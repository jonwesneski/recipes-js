import { z } from 'zod/v4';

export const GeneratedTagsSchema = z.array(z.string());

export type GeneratedTagsType = z.infer<typeof GeneratedTagsSchema>;
