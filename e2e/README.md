# @kufu/e2e

`pnpm e2e` と `pnpm vrt:route` が読む Playwright の workspace。取り決めは [context/testing.md](../context/testing.md) と [context/testing/e2e.md](../context/testing/e2e.md) が持ち、食い違ったらそちらに従う。  
ADR-0031: [E2E のテストのコードを層に分けて書き、ページ単位の Page Object をやめる](../docs/adr/0031-e2e-test-code-layers.md)  
ADR-0033: [E2E をルートの e2e/ に置いたまま、workspace の package にする](../docs/adr/0033-e2e-workspace-at-root.md)

## 構成

```text
e2e/
├── package.json          # @kufu/e2e。e2e、vrt:route:run、lint、typecheck の script
├── playwright.config.ts  # project は e2e と route-vrt
├── .oxlintrc.json        # 書き方の規則の設定
├── lint/                 # 書き方の規則（e2e-authoring-rule.mjs）と、oxlint に読ませる plugin.mjs
├── tsconfig.json
├── tests/
│   ├── specs/<機能>/<振る舞い>.e2e.ts
│   └── selectors/        # testid を持たない要素の指し方
└── corporate-site/       # route の VRT（route-vrt.spec.ts）と baseline
```

E2E のテストのコードは `packages/*` に置かない。

## 層

- `specs/` は、確認と、1 本か 2 本の spec だけが使う操作を持つ。領域は `data-testid` で拾い、spec に直接書く。
- `selectors/` は、role、文言、CSS のセレクタでの指し方を、ページを引数に取る関数で持つ。
- Page Object のクラスは作らない。
- 層の分け方と規則が止める書き方は、[context/testing/e2e.md](../context/testing/e2e.md) とスキル write-e2e-test にある。

## E2E が担うジャーニー

ジャーニーの定義は、[コーポレートサイトの Design Doc](../apps/corporate-site/DesignDoc.md#e2e-が担うジャーニー) にある。

## VRT

route の VRT は [README.md](../README.md) の「route 側」のセクションにある。
