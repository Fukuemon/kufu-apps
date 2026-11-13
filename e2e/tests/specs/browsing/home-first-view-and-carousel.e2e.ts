import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  carouselCategoryCard,
  carouselNextButton,
  carouselPrevButton,
  carouselTrack,
} from "../../selectors/home";

/**
 * トップを開き、カルーセルを画面に入れて返す。
 * カルーセルは画面に入ると下から現れる（data-reveal の translateY の遷移）。
 * 動きが終わる前に押すと、カードの位置がずれて確認が落ちるため、元の位置に着くまで待つ。
 */
const openCarousel = async (page: Page): Promise<Locator> => {
  await page.goto("/");
  const carousel = page.getByTestId("home-products-carousel");
  await carousel.scrollIntoViewIfNeeded();
  await expect(carousel).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  return carousel;
};

test.describe("トップ", () => {
  // 狭い幅で確かめる。1280px ではカードが全て収まり、送る先が無い
  test.use({ viewport: { width: 390, height: 900 } });

  test.describe("最初の画面", () => {
    test("モバイルの幅で開いた場合、スクロールせずにお見積り・お問い合わせのボタンの全体が見えること", async ({
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
      const carousel = await openCarousel(page);
      const firstCard = carouselCategoryCard(carousel, "駆動・変減速機器");
      await expect(firstCard).toBeInViewport({ ratio: 1 });

      await page.clock.runFor(10_000);

      await expect(firstCard).toBeInViewport({ ratio: 1 });
      await expect(carouselPrevButton(carousel)).toBeDisabled();

      await carouselNextButton(carousel).click();

      await expect(
        carouselCategoryCard(carousel, "空圧・油圧機器"),
      ).toBeInViewport({ ratio: 1 });
      await expect(firstCard).not.toBeInViewport();
      await expect(carouselPrevButton(carousel)).toBeEnabled();
    });

    test("次のカテゴリを続けて 2 回押した場合、2 枚先のカードの境目で止まること", async ({
      page,
    }) => {
      const carousel = await openCarousel(page);
      const next = carouselNextButton(carousel);

      // 1 回目の滑らかな送りが終わる前に、2 回目を押す
      await next.click({ clickCount: 2 });

      await expect(
        carouselCategoryCard(carousel, "工場設備関連"),
      ).toBeInViewport({ ratio: 1 });
      await expect(
        carouselCategoryCard(carousel, "空圧・油圧機器"),
      ).not.toBeInViewport();
    });

    test("次のカテゴリの送りの途中にフォーカスの移動で末尾まで動いた場合、前のカテゴリで 1 枚だけ戻ること", async ({
      page,
    }) => {
      const carousel = await openCarousel(page);

      const lastCard = carouselCategoryCard(carousel, "切削工具");

      await carouselNextButton(carousel).click();
      // Tab で末尾のカードへ移ったときと同じく、フォーカスの移動で並びを末尾まで動かす
      await lastCard.focus();
      await expect(lastCard).toBeInViewport({ ratio: 1 });
      await carouselPrevButton(carousel).click();

      await expect(
        carouselCategoryCard(carousel, "工場設備関連"),
      ).toBeInViewport({ ratio: 1 });
      await expect(
        carouselCategoryCard(carousel, "駆動・変減速機器"),
      ).not.toBeInViewport();
    });

    test("カードが全て収まる幅に広げた場合、矢印が消え、フォーカスがカードの並びに移ること", async ({
      page,
    }) => {
      const carousel = await openCarousel(page);
      const next = carouselNextButton(carousel);
      await next.focus();

      await page.setViewportSize({ width: 1280, height: 900 });

      await expect(next).toBeHidden();
      await expect(carouselPrevButton(carousel)).toBeHidden();
      await expect(carouselTrack(carousel)).toBeFocused();
    });

    test.describe("動きを減らす設定のとき", () => {
      // 送りを瞬時にし、1 枚ずつ送った結果を確かめる
      test.use({ contextOptions: { reducedMotion: "reduce" } });

      test("末尾のカードまで送った場合、次のカテゴリが押せなくなること", async ({
        page,
      }) => {
        const carousel = await openCarousel(page);
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

      test("キーボードで末尾のカードまで送った場合、フォーカスが次のカテゴリに残り、もう一度押しても送られないこと", async ({
        page,
      }) => {
        const carousel = await openCarousel(page);
        const next = carouselNextButton(carousel);
        const lastCard = carouselCategoryCard(carousel, "切削工具");

        await next.focus();
        for (let i = 0; i < 3; i += 1) await page.keyboard.press("Enter");
        await expect(lastCard).toBeInViewport({ ratio: 1 });
        await expect(next).toBeDisabled();
        await expect(next).toBeFocused();

        await page.keyboard.press("Enter");

        await expect(lastCard).toBeInViewport({ ratio: 1 });
        await expect(next).toBeFocused();
      });
    });

    test.describe("タッチの画面のとき", () => {
      test.use({ hasTouch: true, isMobile: true });

      /**
       * カルーセルの track の中央に指を置き、dx、dy だけ動かして離す。
       * Playwright の touchscreen はタップだけで、JS で作った touch のイベントでは native のスクロールが起きないため、Chromium の CDP で指の動きを送る。
       */
      const swipe = async (
        page: Page,
        carousel: Locator,
        { dx = 0, dy = 0 }: { dx?: number; dy?: number },
      ) => {
        const box = await carouselTrack(carousel).boundingBox();
        if (!box) throw new Error("カルーセルの位置が取れない");
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        const cdp = await page.context().newCDPSession(page);
        const steps = 10;
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [{ x, y }],
        });
        for (let i = 1; i <= steps; i += 1) {
          await cdp.send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [{ x: x + (dx * i) / steps, y: y + (dy * i) / steps }],
          });
        }
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
        await cdp.detach();
      };

      test("カルーセルの上を縦にスワイプした場合、ページが縦に送られること", async ({
        page,
      }) => {
        const carousel = await openCarousel(page);
        const before = await page.evaluate(() => window.scrollY);

        await swipe(page, carousel, { dy: -300 });

        await expect
          .poll(() => page.evaluate(() => window.scrollY))
          .toBeGreaterThan(before + 200);
      });

      test("カルーセルの上を横にスワイプした場合、カードが送られること", async ({
        page,
      }) => {
        const carousel = await openCarousel(page);
        const firstCard = carouselCategoryCard(carousel, "駆動・変減速機器");

        await swipe(page, carousel, { dx: -200 });

        await expect(carouselPrevButton(carousel)).toBeEnabled();
        await expect(firstCard).not.toBeInViewport({ ratio: 1 });
      });
    });

    test("カードを押した場合、取扱製品のそのカテゴリの位置が開き、メーカーの一覧が開いていること", async ({
      page,
    }) => {
      const carousel = await openCarousel(page);

      await carouselCategoryCard(carousel, "駆動・変減速機器").click();

      await expect(page).toHaveURL("/products#drive-reducers");
      await expect(
        page.getByTestId("products-category-drive-reducers"),
      ).toBeInViewport();
      await expect(
        page.getByTestId("products-maker-list-drive-reducers"),
      ).toBeVisible();
    });

    test("カードをマウスで左へドラッグした場合、カードが送られ、取扱製品が開かないこと", async ({
      page,
    }) => {
      const carousel = await openCarousel(page);
      const firstCard = carouselCategoryCard(carousel, "駆動・変減速機器");
      const box = await firstCard.boundingBox();
      if (!box) throw new Error("カードの位置が取れない");
      const y = box.y + box.height / 2;

      await page.mouse.move(box.x + 200, y);
      await page.mouse.down();
      await page.mouse.move(box.x + 50, y, { steps: 10 });
      await page.mouse.up();

      await expect(carouselPrevButton(carousel)).toBeEnabled();
      await expect(firstCard).not.toBeInViewport({ ratio: 1 });
      await expect(page).toHaveURL("/");
    });

    test("カードを押したまま外へ出て離した場合、その後のホバーでカードが送られず、カードを押すと取扱製品が開くこと", async ({
      page,
    }) => {
      const carousel = await openCarousel(page);
      const firstCard = carouselCategoryCard(carousel, "駆動・変減速機器");
      const box = await firstCard.boundingBox();
      if (!box) throw new Error("カードの位置が取れない");
      const y = box.y + box.height / 2;

      // 横に閾値まで動かさずに、縦に外へ出て離す
      await page.mouse.move(box.x + 100, y);
      await page.mouse.down();
      await page.mouse.move(box.x + 100, box.y - 100, { steps: 5 });
      await page.mouse.up();
      // ボタンを押さずに、カードの上を横切る
      await page.mouse.move(box.x + 200, y);
      await page.mouse.move(box.x + 20, y, { steps: 10 });

      await expect(firstCard).toBeInViewport({ ratio: 1 });
      await expect(carouselPrevButton(carousel)).toBeDisabled();

      await firstCard.click();

      await expect(page).toHaveURL("/products#drive-reducers");
    });
  });
});
