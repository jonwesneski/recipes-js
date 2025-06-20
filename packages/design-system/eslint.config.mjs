import path from "node:path";
// eslint-disable-next-line import/order -- these need to be imported first
import { fileURLToPath } from 'node:url';

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: path.resolve(__dirname),
  recommendedConfig: js.configs.recommended,
});

  export default [
    ...compat.extends("@repo/eslint-config/next"),
    {
      ignores: ["**/*.css"],
      languageOptions: {
        //globals: globals.browser, // or node, etc.
        //parser: tseslint.parser,
        parserOptions: {
          //root: true,
          project: './tsconfig.json', // Point to your tsconfig.json
          ecmaVersion: "latest",
          sourceType: "module",
        },
      },
      rules: {
        "next/no-html-link-for-pages": 'off'
      }
    },
  ];