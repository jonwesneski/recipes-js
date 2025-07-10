import path from 'node:path';
// eslint-disable-next-line import/order -- these need to be imported first
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: path.resolve(__dirname),
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.extends('@repo/eslint-config/next'),
  {
    languageOptions: {
      //globals: globals.browser, // or node, etc.
      //parser: tseslint.parser,
      parserOptions: {
        //root: true,
        project: './tsconfig.json', // Point to your tsconfig.json
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'import/order': 'off', // prettier orders how it feels like, and sometimes certain imports need to happen first
      'next/no-html-link-for-pages': 'off',
      'no-console': 'off',
      'prefer-named-capture-group': 'off',
      'react/hook-use-state': 'off',
      'react/jsx-curly-brace-presence': 'off',
      'react-hooks/exhaustive-deps': 'off', // Getting a version incompatibility issue with this for now
    },
  },
];
