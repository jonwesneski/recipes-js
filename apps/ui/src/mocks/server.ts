import { getUsersMock } from '@repo/codegen/mswUsers';
import { setupServer } from 'msw/node';

export const server = setupServer(...getUsersMock());
