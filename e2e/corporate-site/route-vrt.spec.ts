import { expect, test } from "@playwright/test";

// route 側 VRT。3 route × desktop / mobile の 2 viewport = 6 枚を撮る (adr/0015)。
// baseline はリポジトリで Git 管理し、差分が PR レビューに乗るようにする。
// story 側 (storycap + reg-suit) との保管先の使い分けは README.md の VRT 節を読む。
//
// 申し送り: root の playwright.config.ts は CI で retries: 2 を与える。route VRT は
// 許容 diff 0 で flake に最も敏感なため、CI へ載せる P2 で retry の扱いを決める。

const routes = [
  { name: "home", path: "/" },
  { name: "products", path: "/products" },
  { name: "contact", path: "/contact" },
] as const;

// mobile の 390x900 は smoke.spec.ts のモバイルナビ検証と揃えている。
const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 900 },
] as const;

for (const viewport of viewports) {
  test.describe(`route VRT (${viewport.name})`, () => {
    // full-page 撮影はページ全体をスクロールして合成するため、root の 30 秒では足りない。
    test.describe.configure({ timeout: 120_000 });

    // 撮影と判定は Playwright 公式 container に固定する。Playwright の baseline は
    // ファイル名に platform を含み、素の環境ではフォント描画も一致しない (adr/0015)。
    // ROUTE_VRT_CONTAINER は scripts/vrt-route.mjs だけが渡すので、`pnpm vrt:route` を
    // 経由しない実行はここで止まる。
    test.skip(
      process.env["ROUTE_VRT_CONTAINER"] !== "1",
      "route VRT は Playwright 公式 container でのみ実行する (pnpm vrt:route)",
    );

    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      // BaseLayout.astro の reveal は IntersectionObserver で is-visible を付けるため、
      // 既定のままでは表示状態がスクロール位置に依存する。prefers-reduced-motion: reduce は
      // 既存実装が持つ分岐で、全 reveal 対象を即時可視にし CSS の animation / transition も止める。
      // カルーセルの自動スクロールも同じ分岐で停止する。
      // テスト都合のコードをプロダクションへ足さずに撮影を決定的にできる。
      reducedMotion: "reduce",
    });

    test.beforeEach(async ({ page, baseURL }) => {
      if (!baseURL) {
        throw new Error("baseURL が解決できていません");
      }
      const origin = new URL(baseURL).origin;

      // VRT を外部サービスの応答に依存させない。会社概要の Google Maps とカテゴリ写真
      // (Unsplash) は内容も応答時間も実行ごとに変わり、許容 diff 0 と両立しない。
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
            // 通信を落としても iframe の枠は残る。描画の揺れを避けるため合わせて隠す。
            // 該当 route 以外では 0 件にマッチするだけで害はない。
            mask: [page.getByTestId("company-access-map")],
            // 許容 diff は 0 (完全一致) を初期値とする (adr/0015 / spec D10)。
            // flake が実測されたときだけ、その実測値を上回る最小値まで緩める。
            maxDiffPixels: 0,
            threshold: 0,
            // toHaveScreenshot は「連続 2 枚が一致するまで」撮り直す。トップページの
            // full-page は縦が長く、既定の 5 秒では合成が終わらずタイムアウトした (実測)。
            // 許容 diff は 0 のままで、撮影に必要な時間だけを与える。
            timeout: 30_000,
          },
        );
      });
    }
  });
}
