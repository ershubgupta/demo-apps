import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    ignores: [
      ".next/**",
      "coverage/**",
      "dist-*/**",
      "node_modules/**",
      "release-artifacts/**",
      "scripts/recorder/**",
      "src/app/**",
      "src/features/**",
      "src/lib/**",
      "src/i18n/**",
      "src/constant.ts",
      "src/proxy.ts"
    ],
    rules: {
      "no-undef": "off"
    }
  }
);
