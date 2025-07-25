// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'jsdom',
//   transform: {
//     '^.+\\.(ts|tsx)$': ['ts-jest', {
//       tsconfig: 'tsconfig.test.json',
//     }],
//   },
//   transformIgnorePatterns: ['/node_modules/'],
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//   moduleNameMapper: {
//     '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
//     '^@src/(.*)$': '<rootDir>/src/$1',
//     '^@repo/codegen/(.*)$': '<rootDir>/../../packages/codegen/dist/$1',
//   },
// };

export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jest-fixed-jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@repo/codegen/mswUsers$':
      '<rootDir>/../../packages/codegen/dist-cjs/api/users/users.msw.js',
    '^@repo/codegen/mswRecipes$':
      '<rootDir>/../../packages/codegen/dist-cjs/api/recipes/recipes.msw.js',
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
