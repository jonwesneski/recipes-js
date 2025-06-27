import { TextDecoder, TextEncoder } from 'util';
//need to set these before importing './server'
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as never;

import { server } from './server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
