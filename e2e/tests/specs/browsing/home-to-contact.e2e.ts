import { expect, test } from "@playwright/test";

import { contactBandCtaLink } from "../../selectors/contact-band";
import {
  productsSearchBox,
  productsSearchResult,
} from "../../selectors/products";

test.describe("トップ", () => {
  test.describe("お問い合わせまでの回遊", () => {
    test("取扱製品の導線から検索してお問い合わせの導線を押した場合、検索の条件が URL と読み直した後の検索欄に残り、空にすると消え、お問い合わせが開くこと", async ({
      page,
    }) => {
      await page.goto("/");

      await test.step("トップの取扱製品の導線から取扱製品を開く", async () => {
        await page.getByTestId("home-link-products").click();
        await expect(page).toHaveURL("/products");
        await expect(page.getByTestId("products-section-index")).toBeVisible();
      });

      await test.step("メーカーの名前で検索すると、条件が URL に残る", async () => {
        await productsSearchBox(page).fill("住友重機械工業");
        await expect(page).toHaveURL(
          (url) => url.searchParams.get("q") === "住友重機械工業",
        );
        await expect(productsSearchResult(page)).toContainText(
          "件のカテゴリが一致",
        );

        await page.reload();
        await expect(productsSearchBox(page)).toHaveValue("住友重機械工業");
      });

      await test.step("検索欄を空にすると、URL から条件が消える", async () => {
        await productsSearchBox(page).fill("");
        await expect(page).toHaveURL("/products");
      });

      await test.step("取扱製品の問い合わせの導線からお問い合わせを開く", async () => {
        await page.getByTestId("products-link-contact").click();
        await expect(page).toHaveURL("/contact");
        await expect(page.getByTestId("contact-section-info")).toBeVisible();
      });
    });

    test("トップの問い合わせの導線を押した場合、お問い合わせが開くこと", async ({
      page,
    }) => {
      await page.goto("/");

      await page.getByTestId("home-link-contact").click();

      await expect(page).toHaveURL("/contact");
      await expect(page.getByTestId("contact-section-info")).toBeVisible();
    });

    test("トップの末尾の問い合わせの帯のボタンを押した場合、お問い合わせが開くこと", async ({
      page,
    }) => {
      await page.goto("/");

      await contactBandCtaLink(
        page.getByTestId("home-section-contact-band"),
      ).click();

      await expect(page).toHaveURL("/contact");
      await expect(page.getByTestId("contact-section-info")).toBeVisible();
    });
  });
});
