import { setupServer } from 'msw/node';
import generateMocks from './generateMocks';

export const server = setupServer(...generateMocks);
