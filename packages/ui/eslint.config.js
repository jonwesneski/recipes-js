const {
    defineConfig,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    extends: compat.extends("@repo/eslint-config/next"),
rules: {
            '@typescript-eslint/dot-notation': 'off' // or 'off' to disable it
        },
    languageOptions: {
        parser: tsParser,

        parserOptions: {
            project: "./tsconfig.json",
            tsconfigRootDir: __dirname,
        },
    },
}]);
