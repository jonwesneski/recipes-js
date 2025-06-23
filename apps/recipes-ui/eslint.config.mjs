import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "node:path";
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: path.resolve(__dirname),
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.extends("@repo/eslint-config/next"),
  {
    languageOptions: {
      //globals: globals.browser, // or node, etc.
      //parser: tseslint.parser,
      parserOptions: {
        //root: true,
        project: './tsconfig.json', // Point to your tsconfig.json
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'import/order': 'off', // prettier orders how it feels like, and sometimes certain imports need to happen first
      'no-console': 'off',
      'prefer-named-capture-group': 'off',
      'react/hook-use-state': 'off',
      'react/jsx-curly-brace-presence': 'off',
      'react-hooks/exhaustive-deps': 'off', // Getting a version incompatibility issue with this for now

    }
  },
];
