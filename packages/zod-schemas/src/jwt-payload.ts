import { z } from 'zod/v4';

export const jwtGoogleSchema = z.object({
  sub: z.string().nonempty(),
  email: z.email(),
  handle: z.string().nonempty(),
});

export type JwtGoogleType = z.infer<typeof jwtGoogleSchema>;
