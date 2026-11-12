import { expect, test } from "@playwright/test";

import {
  carouselCategoryCard,
  carouselNextButton,
  carouselPrevButton,
} from "../../selectors/home";

test.describe("トップ", () => {
  // 狭い幅で確かめる。1280px では写真のあるカードが全て収まり、送る先が無い
  test.use({ viewport: { width: 390, height: 900 } });

  test.describe("最初の画面", () => {
    test("モバイルの幅で開いた場合、スクロールせずにお見積り・お問い合わせのボタンが全て見えること", async ({
      page,
    }) => {
      await page.goto("/");

      await expect(page.getByTestId("home-link-contact")).toBeInViewport({
        ratio: 1,
      });
    });
  });

  test.describe("取扱製品カテゴリのカルーセル", () => {
    test("開いて 10 秒経った場合、カードが送られず、次のカテゴリを押すと次のカードへ送られること", async ({
      page,
    }) => {
      await page.clock.install();
      await page.goto("/");
      const carousel = page.getByTestId("home-products-carousel");
      const firstCard = carouselCategoryCard(carousel, "駆動・変減速機器");
      const secondCard = carouselCategoryCard(carousel, "空圧・油圧機器");
      await carousel.scrollIntoViewIfNeeded();
      await expect(firstCard).toBeInViewport({ ratio: 1 });

      await page.clock.runFor(10_000);

      await expect(firstCard).toBeInViewport({ ratio: 1 });
      await expect(carouselPrevButton(carousel)).toBeDisabled();

      await carouselNextButton(carousel).click();

      await expect(secondCard).toBeInViewport({ ratio: 1 });
      await expect(firstCard).not.toBeInViewport();
      await expect(carouselPrevButton(carousel)).toBeEnabled();
    });

    test.describe("動きを減らす設定のとき", () => {
      // 送りを瞬時にし、1 回の送りが終わる前に次を押さないようにする。送っている途中に押すと、送る量が足りなくなる
      test.use({ contextOptions: { reducedMotion: "reduce" } });

      test("末尾のカードまで送った場合、次のカテゴリが押せなくなること", async ({
        page,
      }) => {
        await page.goto("/");
        const carousel = page.getByTestId("home-products-carousel");
        const next = carouselNextButton(carousel);

        for (const name of ["空圧・油圧機器", "工場設備関連", "切削工具"]) {
          await expect(next).toBeEnabled();
          await next.click();
          await expect(carouselCategoryCard(carousel, name)).toBeInViewport({
            ratio: 1,
          });
        }

        await expect(next).toBeDisabled();
        await expect(carouselPrevButton(carousel)).toBeEnabled();
      });
    });

    test("カードを押した場合、取扱製品のそのカテゴリの位置が開くこと", async ({
      page,
    }) => {
      await page.goto("/");
      const carousel = page.getByTestId("home-products-carousel");

      await carouselCategoryCard(carousel, "駆動・変減速機器").click();

      await expect(page).toHaveURL("/products#drive-reducers");
      await expect(
        page.getByTestId("products-category-drive-reducers"),
      ).toBeInViewport();
    });
  });
});
