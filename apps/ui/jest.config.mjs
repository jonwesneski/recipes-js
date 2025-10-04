export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jest-fixed-jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@repo/codegen/mswAi$':
      '<rootDir>/../../packages/codegen/dist-cjs/api/ai/ai.msw.js',
    '^@repo/codegen/mswHealthCheck$':
      '<rootDir>/../../packages/codegen/dist-cjs/api/health-check/health-check.msw.js',
    '^@repo/codegen/mswRecipes$':
      '<rootDir>/../../packages/codegen/dist-cjs/api/recipes/recipes.msw.js',
    '^@repo/codegen/mswTags$':
      '<rootDir>/../../packages/codegen/dist-cjs/api/tags/tags.msw.js',
    '^@repo/codegen/mswUsers$':
      '<rootDir>/../../packages/codegen/dist-cjs/api/users/users.msw.js',
    // fallback for other imports
    '^@repo/codegen/(.*)$': [
      '<rootDir>/../../packages/codegen/dist-cjs/api/$1/$1',
      '<rootDir>/../../packages/codegen/dist-cjs/$1',
    ],
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      { useESM: true, tsconfig: 'tsconfig.test.json' },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/src/mocks/jest.setup.ts'],
};
