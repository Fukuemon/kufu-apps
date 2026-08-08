import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { checkSectionBoundaries } from "./check-section-boundary.mjs";

const fixture = (name: string) =>
  fileURLToPath(
    new URL(`./__fixtures__/section-boundary/${name}`, import.meta.url),
  );

// fixture 用の公開面対応表 (実 src とは独立)
const publicFiles = {
  alpha: "AlphaSection.astro",
  beta: "BetaSection.astro",
};

describe("check-section-boundary", () => {
  it("正しい構成 (ディレクトリ指定 / 同一 section 内 / common / package import / コメントアウトされた import) では違反ゼロ", () => {
    expect(checkSectionBoundaries(fixture("valid"), publicFiles)).toEqual([]);
  });

  it("4 方向の違反 + 明示 index import をすべて検出する", () => {
    const violations = checkSectionBoundaries(
      fixture("violations"),
      publicFiles,
    );

    // ① pages → section 内部の直接 import
    expect(violations).toContainEqual(
      expect.stringContaining("pages から section 内部への直接 import"),
    );
    // ① 明示 index import も違反
    expect(
      violations.filter((v) =>
        v.includes("pages から section 内部への直接 import"),
      ),
    ).toHaveLength(2);
    // ② section 間 import (静的 / 動的の両方)
    expect(
      violations.filter((v) => v.includes("section 間 import")),
    ).toHaveLength(2);
    // ③ common → sections の逆依存
    expect(violations).toContainEqual(
      expect.stringContaining("common から sections への逆依存"),
    );
    // ④ index.ts の公開面違反
    expect(violations).toContainEqual(expect.stringContaining("公開面違反"));
    // pages への逆流 import
    expect(violations).toContainEqual(
      expect.stringContaining("pages への逆流 import"),
    );
    // SECTION_PUBLIC_FILES 未登録 section の検出 (素通り防止)
    expect(violations).toContainEqual(
      expect.stringContaining(
        "components/sections/gamma: SECTION_PUBLIC_FILES に未登録",
      ),
    );

    expect(violations).toHaveLength(8);
  });
});
