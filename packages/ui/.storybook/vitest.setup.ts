import { screenshot } from "@storycap-testrun/browser";
import { afterEach, beforeEach } from "vitest";
import { page } from "vitest/browser";

// 撮影時だけ当てる。スクロールバーは表示の有無が撮影ごとに揺れ、キャレットは点滅する。
// どちらも画像の端で差分になり、許容 diff 0 と両立しない (実測)。
const VRT_STYLE = `
  html { scrollbar-width: none; }
  ::-webkit-scrollbar { display: none; }
  * { caret-color: transparent !important; }
`;

// vitest.config.ts の viewport と揃える。描画側の幅を決めるのはこちら。
// @storybook/addon-vitest 10.6 は、story ごとに page.viewport を 1200x900 で呼ぶ。
// 呼び出しを固定の値に置き換え、幅と高さ (storycap-testrun が内容に合わせて伸ばす) を保つ。
const setViewport = page.viewport.bind(page);
page.viewport = () => setViewport(1280, 10);

beforeEach(async () => {
  await page.viewport(1280, 10);

  if (!document.getElementById("vrt-style")) {
    const style = document.createElement("style");
    style.id = "vrt-style";
    style.textContent = VRT_STYLE;
    document.head.append(style);
  }
});

afterEach(async (context) => {
  await screenshot(page, context);
});
