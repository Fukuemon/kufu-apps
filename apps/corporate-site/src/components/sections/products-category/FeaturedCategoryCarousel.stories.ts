import { expect, userEvent, waitFor, within } from "storybook/test";

import FeaturedCategoryCarousel from "./FeaturedCategoryCarousel.astro";
import { initFeaturedCarousel } from "./featured-carousel.js";

const sourceReferences = [
  "docs/design/features/corporate-site/reference/company-profile.md",
];

// 1280px の幅で横にあふれ、矢印で送れる枚数にする。写真は外部の配信に頼らないよう 1 枚だけ付ける
const categories = [
  {
    id: "drive-reducers",
    collection: "productCategories",
    data: {
      id: "drive-reducers",
      order: 1,
      name: "駆動・変減速機器",
      summary: "モーター、変減速機、制御機器など駆動系の主要機器。",
      groupId: "drive-transmission",
      featuredImage:
        "https://images.unsplash.com/photo-1723022323088-ca3d68fae5db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      sourceReferences,
    },
  },
  ...[
    { id: "bearings-linear-motion", order: 2, name: "軸受・直動機器" },
    { id: "automation-labor-saving", order: 3, name: "自動化・省力化機器" },
    {
      id: "chain-belt-sprocket-gear",
      order: 4,
      name: "チェーン・ベルト及びスプロケット・歯車",
    },
    { id: "power-transmission-supplies", order: 5, name: "伝動機器・用品" },
    { id: "pneumatic-hydraulic", order: 6, name: "空圧・油圧機器" },
  ].map(({ id, order, name }) => ({
    id,
    collection: "productCategories",
    data: {
      id,
      order,
      name,
      summary: `${name}。`,
      groupId: "drive-transmission",
      sourceReferences,
    },
  })),
] as const;

const meta = {
  title: "Sections/ProductsCategory/FeaturedCategoryCarousel",
  component: FeaturedCategoryCarousel,
};

export default meta;

export const Default = {
  args: {
    categories,
    makerCountsByCategoryId: {
      "drive-reducers": 17,
      "bearings-linear-motion": 20,
      "automation-labor-saving": 29,
      "chain-belt-sprocket-gear": 14,
      "power-transmission-supplies": 9,
      "pneumatic-hydraulic": 12,
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const carousel = canvasElement.querySelector<HTMLElement>(
      "[data-featured-carousel]",
    );
    if (!carousel) throw new Error("カルーセルが描画されていない");
    // Storybook では Astro の <script> が動かないので、同じ関数をここで呼ぶ。
    // 時間が経っても動かないことは、動きを減らす設定を付けない E2E が確かめる
    initFeaturedCarousel(carousel);

    const canvas = within(carousel);
    const track = canvas.getByRole("group");
    const prev = canvas.getByRole<HTMLButtonElement>("button", {
      name: "前のカテゴリ",
    });
    const next = canvas.getByRole<HTMLButtonElement>("button", {
      name: "次のカテゴリ",
    });

    // 矢印の無効は scroll のイベントで変わり、位置より遅れる。位置に追い付くまで待つ
    const waitArrowsMatchPosition = () =>
      waitFor(async () => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        await expect(prev.disabled).toBe(track.scrollLeft <= 1);
        await expect(next.disabled).toBe(track.scrollLeft >= maxScroll - 1);
      });

    await expect(track.scrollLeft).toBe(0);
    await expect(prev).toBeDisabled();
    await expect(next).toBeEnabled();

    const send = async (button: HTMLButtonElement, direction: 1 | -1) => {
      const before = track.scrollLeft;
      await userEvent.click(button);
      await waitFor(() =>
        expect((track.scrollLeft - before) * direction).toBeGreaterThan(0),
      );
      await waitArrowsMatchPosition();
    };

    await send(next, 1);
    await expect(prev).toBeEnabled();

    // 末尾まで送ると「次のカテゴリ」を押せなくなる
    while (!next.disabled) await send(next, 1);
    await expect(next).toBeDisabled();
    await expect(prev).toBeEnabled();

    // 先頭に戻すと「前のカテゴリ」を押せなくなる。VRT は先頭の状態を撮る
    while (!prev.disabled) await send(prev, -1);
    await expect(track.scrollLeft).toBe(0);
    await expect(prev).toBeDisabled();
  },
};

export const Empty = {
  args: {
    categories: [],
    makerCountsByCategoryId: {},
  },
};
