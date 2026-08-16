import type { StorybookConfig } from "@storybook-astro/framework";
import { react } from "@storybook-astro/framework/integrations";
import { mergeConfig } from "vite";

// VRT (storycap) 用のビルドかどうか。README.md の「Visual Regression Testing (VRT)」節を読む。
const isVrtBuild = process.env["VITE_VRT"] === "1";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook-astro/framework",
    options: {
      integrations: [react()],
    },
  },
  // VRT ビルドでは外部の埋め込みフレーム (会社概要の Google Maps) を読み込ませない。
  // タイル画像の内容も読み込み完了時刻も実行ごとに変わるため、許容 diff 0 (adr/0015) と両立しない。
  // CSP はリクエストが出る前に止めるので、DOM を後から書き換える preview.ts の処理と違い
  // 読み込みとの競合が起きない。preview.ts 側はそれでも src を外し、二重に防ぐ。
  previewHead: (head) =>
    isVrtBuild
      ? `${head}\n<meta http-equiv="Content-Security-Policy" content="frame-src 'none'" />`
      : head,
  viteFinal: async (config) =>
    mergeConfig(config, {
      define: {
        // VRT ビルドかどうかを preview へ渡す。preview は browser で動くため process.env を
        // 読めず、この builder は VITE_ 接頭辞の env を自動では公開しないので定数へ畳み込む。
        "import.meta.env.VITE_VRT": JSON.stringify(
          process.env["VITE_VRT"] ?? "",
        ),
      },
    }),
};

export default config;
