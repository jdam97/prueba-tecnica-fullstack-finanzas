import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["node_modules", ".next", "dist","src/__tests__/*"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        project: "./tsconfig.json",
      },
      globals: {
        fetch: "readonly",
        window: "readonly",
        console: "readonly",
        process: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react,
      "react-hooks": reactHooks,
      prettier: prettierPlugin,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/jsx-key": "warn",
      "react/no-array-index-key": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "prettier/prettier": [
        "warn",
        {
          endOfLine: "auto",
          singleQuote: false,
          semi: true,
        },
      ],
    },
  },
  js.configs.recommended,
  prettierConfig
);
