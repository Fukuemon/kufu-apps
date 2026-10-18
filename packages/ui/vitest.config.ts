import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import storycap from "@storycap-testrun/browser/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, defineProject } from "vitest/config";

// story 側 VRT の撮影 (@kufu/ui)。比較は root の reg-cli が行う。
// 幅は固定し、高さは story の内容に合わせる (fullPage が伸ばす)。詳細は README.md の VRT 節。
const VIEWPORT = { width: 1280, height: 10 };

export default defineConfig({
  test: {
    projects: [
      defineProject({
        plugins: [
          storybookTest({ configDir: ".storybook" }),
          storycap({
            viewport: VIEWPORT,
            output: { dir: "../../.vrt/actual/ui", file: "[id].png" },
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
          setupFiles: ["./.storybook/vitest.setup.ts"],
        },
      }),
    ],
  },
});
