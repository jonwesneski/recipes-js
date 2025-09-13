import { setupWorker } from 'msw/browser';
import generateMocks from './generateMocks';

export const worker = setupWorker(...generateMocks);
