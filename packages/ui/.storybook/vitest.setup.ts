import { screenshot } from "@storycap-testrun/browser";
import { afterEach, beforeEach } from "vitest";
import { page } from "vitest/browser";
import { STORY_RENDERED } from "storybook/internal/core-events";
import { addons } from "storybook/preview-api";

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

// storybook-addon-pseudo-states は、hover と押下の見た目を、#storybook-root に付けるクラスと、
// STORY_RENDERED のイベントで書き換えるスタイルシートで出す。Vitest の描画には、どちらも無い (実測)。
// body をクラスの付け先にし、story を描く前にイベントを送って、スタイルシートを書き換えさせる。
document.body.id = "storybook-root";

beforeEach(async () => {
  await page.viewport(1280, 10);
  addons.getChannel().emit(STORY_RENDERED);

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
