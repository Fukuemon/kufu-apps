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

beforeEach(async () => {
  // vitest.config.ts の viewport と揃える。描画側の幅を決めるのはこちら。
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
