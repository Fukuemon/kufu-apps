import { defineConfig } from "@playwright/test";

const targetContracts = {
  "corporate-site": {
    port: 4321,
    workspace: "@kufu/corporate-site",
  },
} as const;

const target = process.env.E2E_TARGET ?? "corporate-site";
const targetContract = targetContracts[target as keyof typeof targetContracts];

if (!targetContract) {
  throw new Error(
    `Unsupported E2E_TARGET: ${target}. Add an app contract in e2e/playwright.config.ts.`,
  );
}

const port = Number(process.env.E2E_PORT ?? String(targetContract.port));
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${port}`;
const webServerCommand = `pnpm --filter ${targetContract.workspace} run e2e:serve`;

export default defineConfig({
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  // CI のログにテストごとの所要時間を出す。待つ時間を決めるときに集める（context/testing/e2e.md）
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "e2e",
      testDir: "./tests",
      testMatch: "**/*.e2e.ts",
    },
    {
      name: "route-vrt",
      testDir: "./corporate-site",
      testMatch: "route-vrt.spec.ts",
      // full-page 撮影は合成に時間がかかり、全体の 30 秒では足りない
      timeout: 120_000,
      // toHaveScreenshot は連続 2 枚が一致するまで撮り直すため、既定の 5 秒では足りなかった (実測)
      expect: { timeout: 30_000 },
      // 既定の形はファイル名に project の名前を足す。project を分ける前に撮った baseline の名前のまま比べる
      snapshotPathTemplate:
        "{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-snapshotSuffix}{ext}",
    },
  ],
  webServer: webServerCommand
    ? {
        command: webServerCommand,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
