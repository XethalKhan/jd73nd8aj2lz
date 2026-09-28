// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const jest = require("eslint-plugin-jest");
const testingLibrary = require("eslint-plugin-testing-library");
const reactNative = require("eslint-plugin-react-native");
const tsConfigRootDir = require("node:path").dirname(
  require.resolve("./tsconfig.json"),
);

const typeScriptFiles = ["**/*.ts", "**/*.tsx"];
const testFiles = [
  "**/*.test.ts",
  "**/*.test.tsx",
  "**/*.spec.ts",
  "**/*.spec.tsx",
];

const warningRules = (rules) =>
  Object.fromEntries(
    Object.entries(rules).map(([rule, config]) => [
      rule,
      Array.isArray(config) ? ["warn", ...config.slice(1)] : "warn",
    ]),
  );

const typeCheckedTypeScriptConfig =
  typescriptEslint.configs["flat/recommended-type-checked"].map((config) => ({
    ...config,
    files: typeScriptFiles,
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        projectService: true,
        tsconfigRootDir: tsConfigRootDir,
      },
    },
    rules: warningRules(config.rules ?? {}),
  }));

module.exports = defineConfig([
  expoConfig,
  ...typeCheckedTypeScriptConfig,
  {
    files: testFiles,
    ...jest.configs["flat/recommended"],
    rules: warningRules(jest.configs["flat/recommended"].rules),
  },
  {
    files: testFiles,
    ...testingLibrary.configs["flat/react"],
    rules: {
      ...warningRules(testingLibrary.configs["flat/react"].rules),
      // React Native Testing Library supports render-result queries and
      // synchronous fireEvent helpers used throughout this test suite.
      "testing-library/prefer-screen-queries": "off",
      "testing-library/no-await-sync-events": "off",
      "testing-library/render-result-naming-convention": "off",
    },
  },
  {
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: {
      "react-native": reactNative,
    },
    rules: {
      "react-native/no-inline-styles": "warn",
      "react-native/no-single-element-style-arrays": "warn",
      "react-native/no-unused-styles": "error",
    },
  },
  {
    ignores: ["dist/*"],
  }
]);
