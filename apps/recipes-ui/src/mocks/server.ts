import { getUsersMock } from '@repo/recipes-codegen/mswUsers';
import { setupServer } from 'msw/node';

export const server = setupServer(...getUsersMock());
