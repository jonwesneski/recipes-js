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
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.test.json' }],
  },
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@repo/recipes-codegen/(.*)$': '<rootDir>/../../packages/recipes-codegen/dist-cjs/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
}
