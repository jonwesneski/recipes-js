import { z } from 'zod/v4';

export const specificPrimitiveToStringSchema = z
  .union([z.string(), z.number(), z.boolean()])
  .pipe(z.coerce.string());
