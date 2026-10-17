// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

// Baseline: rules that still have violations are reported as warnings. The lint
// target fails when the total number of warnings grows (see "maxWarnings" in
// angular.json). Promote a rule to "error" once its violations are fixed, and
// lower "maxWarnings" accordingly.
const baselineTs = {
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/no-inferrable-types": "warn",
  "@typescript-eslint/no-unused-expressions": "warn",
  "@typescript-eslint/no-unused-vars": "warn",
  "@typescript-eslint/consistent-generic-constructors": "warn",
  "@typescript-eslint/no-wrapper-object-types": "warn",
  "@typescript-eslint/no-empty-function": "warn",
  "prefer-const": "warn",
  "no-dupe-else-if": "warn",
  "no-self-assign": "warn",
  "no-empty": "warn",
  "no-useless-assignment": "warn",
  "@angular-eslint/prefer-inject": "warn",
  "@angular-eslint/prefer-standalone": "warn",
  "@angular-eslint/prefer-on-push-component-change-detection": "warn",
  "@angular-eslint/no-output-native": "warn",
};

const baselineTemplate = {
  "@angular-eslint/template/eqeqeq": "warn",
  "@angular-eslint/template/click-events-have-key-events": "warn",
  "@angular-eslint/template/interactive-supports-focus": "warn",
  "@angular-eslint/template/label-has-associated-control": "warn",
  "@angular-eslint/template/elements-content": "warn",
};

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      ...baselineTs,
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {
      ...baselineTemplate,
    },
  },
]);
