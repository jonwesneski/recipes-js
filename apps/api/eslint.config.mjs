// @ts-check
import nestjsConfig from '@repo/eslint-config/nestjs';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', '**/*script*.ts'],
  },
  ...nestjsConfig,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);
