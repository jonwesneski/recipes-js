import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';
//need to set these before importing './server'
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as never;

import { server } from './server';

window.HTMLElement.prototype.scrollIntoView = function () {};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
