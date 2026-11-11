import { expect, test } from "@playwright/test";

// route 側 VRT。3 route × desktop / mobile = 6 枚を撮る (docs/adr/0015)。
// baseline は Git 管理し、差分が PR レビューに乗るようにする。手順は README.md の VRT 節。

const routes = [
  { name: "home", path: "/" },
  { name: "products", path: "/products" },
  { name: "contact", path: "/contact" },
] as const;

// mobile の 390x900 は tests/specs/navigation/site-navigation.e2e.ts のモバイルナビ検証と揃えている。
const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 900 },
] as const;

for (const viewport of viewports) {
  test.describe(`route VRT (${viewport.name})`, () => {
    // full-page 撮影は合成に時間がかかり、root の 30 秒では足りない。
    test.describe.configure({ timeout: 120_000 });

    // 撮影環境は container に固定する (docs/adr/0015)。ROUTE_VRT_CONTAINER は
    // scripts/vrt-container.mjs だけが渡す。
    test.skip(
      process.env["ROUTE_VRT_CONTAINER"] !== "1",
      "route VRT は Playwright 公式 container でのみ実行する (pnpm vrt:route)",
    );

    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      // reveal (IntersectionObserver) とカルーセルの自動スクロールを、既存実装が持つ
      // prefers-reduced-motion の分岐で止める。test.use の直下に書くと Playwright 1.59 は
      // 黙って無視するため contextOptions 経由で渡す。
      contextOptions: { reducedMotion: "reduce" },
    });

    test.beforeEach(async ({ page, baseURL }) => {
      if (!baseURL) {
        throw new Error("baseURL が解決できていません");
      }
      const origin = new URL(baseURL).origin;

      // 外部サービス (Google Maps / Unsplash) は内容も応答時間も実行ごとに変わる。
      // mask は描画を隠すだけで通信は残るため、リクエスト自体を落とす。
      await page.route("**/*", (route) => {
        const url = route.request().url();
        if (
          url.startsWith(origin) ||
          url.startsWith("data:") ||
          url.startsWith("blob:")
        ) {
          return route.continue();
        }
        return route.abort();
      });
    });

    for (const route of routes) {
      test(`${route.name} は baseline と一致する`, async ({ page }) => {
        await page.goto(route.path);

        await expect(page).toHaveScreenshot(
          `${route.name}-${viewport.name}.png`,
          {
            fullPage: true,
            // 通信を落としても iframe の枠は残るため合わせて隠す。
            mask: [page.getByTestId("company-access-map")],
            // 知覚できる差は 1 ピクセルも許さない。threshold だけ 0.02 にしたのは、
            // products desktop の 1 箇所で ±1/255 のアンチエイリアスの揺れが出たため
            // (経緯は spec の「route VRT の flake 観測」)。
            maxDiffPixels: 0,
            threshold: 0.02,
            // 連続 2 枚が一致するまで撮り直すため、既定の 5 秒では足りなかった (実測)。
            timeout: 30_000,
          },
        );
      });
    }
  });
}
