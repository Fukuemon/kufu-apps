import { defineConfig } from "@playwright/test";

const target = process.env.E2E_TARGET ?? "lp-site";
const port = Number(process.env.E2E_PORT ?? "4321");
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${port}`;
const webServerCommand = process.env.E2E_WEB_SERVER_COMMAND;

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
