import { expect, test } from "@playwright/test";

import {
  productsSearchBox,
  productsSearchResult,
} from "../../selectors/products";

test.describe("取扱製品", () => {
  test.describe("モバイルの幅の索引と一覧の開閉", () => {
    test.use({ viewport: { width: 390, height: 900 } });

    test("開いた場合、カテゴリの索引と、先頭と末尾のカテゴリのメーカーの一覧が閉じていること", async ({
      page,
    }) => {
      await page.goto("/products");

      await expect(
        page.getByTestId("products-category-drive-reducers"),
      ).toBeVisible();
      await expect(page.getByTestId("products-category-list")).toBeHidden();
      await expect(
        page.getByTestId("products-maker-list-drive-reducers"),
      ).toBeHidden();
      await expect(
        page.getByTestId("products-maker-list-materials-bolts"),
      ).toBeHidden();
    });

    test("検索の語を付けた URL で開いた場合、索引が開いて語と件数が見え、当たったカテゴリが開いていること", async ({
      page,
    }) => {
      await page.goto(`/products?q=${encodeURIComponent("住友重機械工業")}`);

      await expect(page.getByTestId("products-category-list")).toBeVisible();
      await expect(productsSearchBox(page)).toBeVisible();
      await expect(productsSearchBox(page)).toHaveValue("住友重機械工業");
      await expect(productsSearchResult(page)).toContainText(
        "件のカテゴリが一致",
      );
      await expect(
        page.getByTestId("products-maker-list-drive-reducers"),
      ).toBeVisible();
    });

    test("カテゴリを指す URL で開いた場合、そのカテゴリだけが開き、画面に入っていること", async ({
      page,
    }) => {
      await page.goto("/products#fans-blowers-industrial");

      await expect(
        page.getByTestId("products-maker-list-fans-blowers-industrial"),
      ).toBeVisible();
      await expect(
        page.getByTestId("products-category-fans-blowers-industrial"),
      ).toBeInViewport();
      await expect(page.getByTestId("products-category-list")).toBeHidden();
      await expect(
        page.getByTestId("products-maker-list-drive-reducers"),
      ).toBeHidden();
    });

    test("閉じて始めた後にデスクトップの幅へ広げた場合、カテゴリの索引が出ること", async ({
      page,
    }) => {
      await page.goto("/products");
      await expect(page.getByTestId("products-category-list")).toBeHidden();

      await page.setViewportSize({ width: 1280, height: 800 });

      await expect(page.getByTestId("products-category-list")).toBeVisible();
    });
  });

  test.describe("デスクトップの幅の索引と一覧の開閉", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("開いた場合、カテゴリの索引と、先頭と末尾のカテゴリのメーカーの一覧が開いていること", async ({
      page,
    }) => {
      await page.goto("/products");

      await expect(page.getByTestId("products-category-list")).toBeVisible();
      await expect(
        page.getByTestId("products-maker-list-drive-reducers"),
      ).toBeVisible();
      await expect(
        page.getByTestId("products-maker-list-materials-bolts"),
      ).toBeVisible();
    });
  });
});
