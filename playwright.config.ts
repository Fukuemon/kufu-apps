import { defineConfig } from "@playwright/test";

const targetContracts = {
  "lp-site": {
    port: 4321,
    workspace: "@kufu/lp-site",
  },
} as const;

const target = process.env.E2E_TARGET ?? "lp-site";
const targetContract = targetContracts[target as keyof typeof targetContracts];

if (!targetContract) {
  throw new Error(
    `Unsupported E2E_TARGET: ${target}. Add an app contract in playwright.config.ts.`,
  );
}

const port = Number(process.env.E2E_PORT ?? String(targetContract.port));
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${port}`;
const webServerCommand = `pnpm --filter ${targetContract.workspace} run e2e:serve`;

export default defineConfig({
  testDir: `./e2e/${target}`,
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: webServerCommand
    ? {
        command: webServerCommand,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
