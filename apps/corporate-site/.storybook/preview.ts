import "../src/styles/globals.css";

import type { Preview } from "@storybook-astro/framework";

// VRT (storycap) 用のビルドでだけ、外部地図の iframe から src を外す。
// 一次の遮断は .storybook/main.ts が VRT ビルドにだけ入れる CSP (frame-src 'none') が担い、
// ここはその二重化である。src を外しても進行中の読み込みは止まらないため、単独では
// 許容 diff 0 (adr/0015) を保証できない。
// 通常の storybook dev / storybook:build は地図をそのまま表示する。
if (import.meta.env.VITE_VRT === "1") {
  const mapSelector = 'iframe[data-testid="company-access-map"]';

  const detachMaps = () => {
    for (const frame of document.querySelectorAll<HTMLIFrameElement>(
      mapSelector,
    )) {
      if (frame.dataset["vrtDetached"] === "true") {
        continue;
      }
      frame.dataset["vrtDetached"] = "true";
      frame.removeAttribute("src");
    }
  };

  detachMaps();
  new MutationObserver(detachMaps).observe(document, {
    childList: true,
    subtree: true,
  });
}

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
