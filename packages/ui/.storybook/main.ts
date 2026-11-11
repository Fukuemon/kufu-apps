import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    // 状態の story で、hover の見た目をマウスを乗せずに出す
    "storybook-addon-pseudo-states",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // 画面のカタログ（corporate-site の Storybook）を、同じサイドバーに並べる。
  // 公開先では、scripts/build-storybook-pages.mjs が 2 つを隣のディレクトリ（ui/ と corporate-site/）に置く。
  // 手元では、pnpm storybook が corporate-site を 6007 番で起動する。
  refs: (_config, { configType }) => ({
    "corporate-site": {
      title: "画面",
      url:
        configType === "DEVELOPMENT"
          ? "http://127.0.0.1:6007"
          : "../corporate-site",
    },
  }),
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [tailwindcss()],
    }),
};

export default config;
