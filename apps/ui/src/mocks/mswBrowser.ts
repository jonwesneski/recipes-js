import { getRecipesMock } from '@repo/codegen/mswRecipes';
import { getTagsMock } from '@repo/codegen/mswTags';
import { getUsersMock } from '@repo/codegen/mswUsers';
import { setupWorker } from 'msw/browser';

export const worker = setupWorker(
  ...getUsersMock(),
  ...getRecipesMock(),
  ...getTagsMock(),
);
