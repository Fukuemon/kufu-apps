import { join } from "node:path";

import { screenshot } from "@storycap-testrun/node";
import { getStoryContext, type TestRunnerConfig } from "@storybook/test-runner";

// story 側 VRT の撮影 (@kufu/corporate-site)。比較は root の reg-cli が行う。
// Astro の Storybook は addon-vitest (Vite の公式 renderer 限定) に載らないため test-runner を使う。

// 幅は実サイトの desktop と揃える。高さは最小にし、fullPage に内容まで伸ばさせる。
// 高さを viewport から算出する story は parameters.vrt.viewport で上書きする。
const DEFAULT_VIEWPORT = { width: 1280, height: 10 };

// 撮影時だけ当てる。スクロールバーは表示の有無が撮影ごとに揺れ、キャレットは点滅する。
// どちらも画像の端で差分になり、許容 diff 0 と両立しない (実測)。
const VRT_STYLE = `
  html { scrollbar-width: none; }
  ::-webkit-scrollbar { display: none; }
  * { caret-color: transparent !important; }
`;

const config: TestRunnerConfig = {
  async preVisit(page, context) {
    const story = await getStoryContext(page, context);
    const viewport = story.parameters["vrt"]?.viewport ?? DEFAULT_VIEWPORT;
    await page.setViewportSize(viewport);
    await page.addStyleTag({ content: VRT_STYLE });
  },
  async postVisit(page, context) {
    await screenshot(page, context, {
      output: {
        dir: join(import.meta.dirname, "../../../.vrt/actual/corporate-site"),
        file: "[id].png",
      },
    });
  },
};

export default config;
