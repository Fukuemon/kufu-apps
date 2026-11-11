import { defineConfig } from "vite-plus";

const e2eDir = `${import.meta.dirname}/e2e`;

export default defineConfig({
  fmt: {
    printWidth: 80,
    ignorePatterns: [
      // apm が配置し、書き換えるファイル。整形すると次の apm install で差分が出る
      ".agents/**",
      ".claude/**",
      ".codex/**",
      "apm.yml",
      "apm.lock.yaml",
      "pnpm-lock.yaml",
      // スキル setup-e2e-lint から写した規則。配布元と diff で比べるため、配布元のままの書式で残す
      "e2e/lint/e2e-authoring-rule.mjs",
    ],
  },
  lint: {
    plugins: ["typescript"],
    categories: {
      correctness: "error",
    },
    rules: {
      "eslint/no-unused-vars": "error",
    },
    jsPlugins: ["./e2e/lint/plugin.mjs"],
    overrides: [
      {
        // テストの書き方の規則（ADR-0032）。options は、vp check を流す場所に依らないよう絶対パスで渡す
        files: ["e2e/tests/**"],
        rules: {
          "e2e/e2e-authoring-rule": [
            "error",
            {
              testsDir: `${e2eDir}/tests`,
              fixedWaitAllowedFiles: [`${e2eDir}/tests/fixtures/caption.ts`],
              timeoutDefinitionFile: `${e2eDir}/tests/fixtures/timeouts.ts`,
            },
          ],
        },
      },
    ],
    options: { typeAware: true },
  },
});
