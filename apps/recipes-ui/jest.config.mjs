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
//     '^@repo/recipes-codegen/(.*)$': '<rootDir>/../../packages/recipes-codegen/dist/$1',
//   },
// };


export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jest-fixed-jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  // moduleNameMapper: {
  //   '^@src/(.*)$': '<rootDir>/src/$1',
  //   '^@repo/recipes-codegen/(.*)$': [
  //     '<rootDir>/../../packages/recipes-codegen/dist-cjs/api/$1/$1',
  //     '<rootDir>/../../packages/recipes-codegen/dist-cjs/api/$1/$1.msw.js',
  //     '<rootDir>/../../packages/recipes-codegen/dist-cjs/$1'
  //   ],
  //   '^@repo/recipes-codegen/mswUsers$': '<rootDir>/../../packages/recipes-codegen/dist/api/users/users.msw.js',
  //   '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  // },
  moduleNameMapper: {
  '^@src/(.*)$': '<rootDir>/src/$1',
  '^@repo/recipes-codegen/mswUsers$': '<rootDir>/../../packages/recipes-codegen/dist-cjs/api/users/users.msw.js',
  '^@repo/recipes-codegen/mswRecipes$': '<rootDir>/../../packages/recipes-codegen/dist-cjs/api/recipes/recipes.msw.js',
  // fallback for other imports
      '^@repo/recipes-codegen/(.*)$': [
      '<rootDir>/../../packages/recipes-codegen/dist-cjs/api/$1/$1',
      '<rootDir>/../../packages/recipes-codegen/dist-cjs/$1'
    ],
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
},
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.test.json' }],
  },
  setupFilesAfterEnv: ['<rootDir>/src/mocks/jest.setup.ts'],
}
