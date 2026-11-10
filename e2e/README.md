# E2E Test Conventions

`pnpm e2e` が読む Playwright suite の実装側の申し合わせ。取り決めは [context/testing.md](../context/testing.md) と [ADR-0017](../docs/adr/0017-ui-test-structure-policy.md) が持ち、食い違ったらそちらに従う。

## 構成

```text
e2e/
└── <target>/                  # E2E_TARGET (既定 corporate-site)
    ├── pages/                 # route ごとの Page Object
    ├── smoke.spec.ts          # 主要 route の到達性と表示
    └── route-vrt.spec.ts      # route 側 VRT (README.md の VRT 節)
```

Page Object と VRT のヘルパは `e2e/` 配下に置く。`packages/*` へ昇格させない。

## Page Object

- **page 単位**で 1 クラスとし、route が増えたときだけ増やす。先回りの抽象化を作らない。
- セレクタと操作を Page Object へ集約し、テスト本体はシナリオだけを書く。
- locator は用途で使い分ける。**この規約は Page Object の内部にも適用する。**

| 用途                                | 使うもの      |
| ----------------------------------- | ------------- |
| 領域の特定 (セクション / ページ)    | `data-testid` |
| 操作対象 (ボタン / リンク / 入力欄) | `getByRole`   |

- 規約へ寄せられない箇所は、**理由をコメントで残す**。現状の例外は次の 3 分類。
  - **ヘッダー / フッターで文言が重複する操作対象**: 同じ名前のリンクが両方にあり role では一意にならないため `data-testid` で引く
  - **件数を数える locator**: `getByRole` は `href` の無いアンカーやアクセシビリティツリー上の非表示要素を除くため、DOM 上の件数を数える用途では意味が変わる。CSS セレクタのまま残す
  - **role も testid も持たない要素**: `[data-products-result]` (`aria-live` の `<p>`)。規約へ寄せるには production の markup を変える必要があり、別 issue で扱う
- 表示内容そのものの確認 (メーカー名など) は、領域の特定でも操作対象でもないため locator 規約の対象外。文言で探してよい。
- 引数を取らない locator は `readonly` プロパティにし、引数を取るものだけメソッドにする。

## E2E が担うジャーニー

**route をまたぐ到達性**を見る。単一コンポーネント内で閉じる操作は play が担う。以下は定義で、テストコードの実装は別 issue。

### 1. 回遊

1. `/` を開く
2. 取扱製品への導線から `/products` へ到達する
3. カテゴリ・メーカー名で検索し、**検索条件が URL に保持される**ことを確認する
4. 問い合わせへの導線から `/contact` へ到達する

### 2. ナビゲーション

1. ヘッダーのリンクから `/products` / `/contact` へ到達する
2. フッターのリンクから各 route へ到達する
3. モバイル幅でナビゲーションを開閉し、開いた状態から各 route へ到達する

### 3. JS 無効時

1. 3 route の主要セクションが表示される
2. 問い合わせ先 (電話 / メール) に到達できる

### 対象外

- **問い合わせフォームの送信**。`ContactSection.astro` に `<form>` は無く、`contact-form-slot` は「デザイン確認用のフォーム枠」と明記されている。実体ができた時点 (#26) で追加する。

## VRT

route 側 VRT は [README.md](../README.md) の「route 側 VRT」節。
