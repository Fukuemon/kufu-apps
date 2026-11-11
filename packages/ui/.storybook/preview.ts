import "./preview.css";

import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    // a11y のアドオンの違反を、story のテストの失敗にする
    a11y: { test: "error" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        // packages/ui/design/catalog.md の「カタログのページ」の順
        order: [
          "はじめに",
          ["原則", "アクセシビリティ"],
          "トークン",
          ["色", "文字", "余白と角丸"],
          "コンポーネント",
          ["Base", "Case"],
          "パターン",
        ],
      },
    },
  },
};

export default preview;
