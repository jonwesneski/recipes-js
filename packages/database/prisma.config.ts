import config from 'dotenv';
import { defineConfig } from 'prisma/config';

config.config();
export default defineConfig({
  migrations: {
    seed: 'ts-node --transpile-only ./prisma/seed.ts',
  },
});
