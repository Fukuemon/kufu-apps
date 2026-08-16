# ADR-0015: VRT (visual regression testing) を story と route の 2 系統で導入する

## 状態

承認

## 決定日

2026-08-16

## 背景

- UI を変える作業の安全網が、要素の存在と文言を見る Playwright の smoke テストしかなく、opacity やカスケード起因の視覚崩れを検出できない。
- [ADR-0014](0014-corporate-site-sections-architecture.md) の styles 再編では、出力 CSS のバイト比較と目視で代替した。しかし `apps/corporate-site/src/styles/components.css` を utility / cva へ colocation 移行する残作業は出力 CSS の形が必ず変わるため、バイト比較が使えない。視覚回帰を検出する手段が移行の前提になる。
- [ADR-0012](0012-design-source-of-truth-implementation.md) がデザイン正本を「実装 + Storybook」と定めているため、Storybook の story が視覚回帰の対象セットとして最も自然である。
- 実測 (2026-08-16 時点): story は `packages/ui` 47 / `apps/corporate-site` 34 の計 81 (`*.stories.*` のファイル数 29 とは別)。route は `/` `/products` `/contact` の 3 つ。

## 決定

- VRT を、unit test / play / E2E と並ぶ **独立したテスト種別**として位置づける。
- 撮影手段は **2 系統の併用**とする。
  - **story 側**: storycap で撮影し reg-suit で比較する。対象は 81 story (fixture story は対象外)。撮影は既定 viewport 1 種。Storybook は `@kufu/ui` と `@kufu/corporate-site` の 2 インスタンスがあるため、それぞれ撮影して比較対象へまとめる。
  - **route 側**: Playwright の `toHaveScreenshot` で撮影する。対象は 3 route × desktop / mobile の 2 viewport = 6 枚。
- baseline の保管先は系統ごとに分ける。route 側はリポジトリ (Git 管理)、story 側は S3 互換ストレージ。
- **許容 diff は 0 (完全一致) を初期値**とし、flake が実測された場合にその実測値を上回る最小値まで緩める。
- **差分が出たら CI を失敗させる** (ブロッキング扱い)。
- 環境差による恒常的な差分への一次対処は、閾値の引き上げでも非ブロッキング化でもなく、**原因要素のマスクと撮影環境の固定**とする。閾値緩和と required checks からの除外は後段の手段であり、後者はユーザーが判断する。

## 代替案

### 1. Playwright の `toHaveScreenshot` だけで統一する

#### Pros

- 実行系と baseline が 1 系統に収まり、保守コストが小さい。
- 外部ストレージが不要で、baseline が Git 管理されるため差分が PR レビューに乗る。

#### Cons

- story 単位の撮影が素直に書けず、ADR-0012 が定めるデザイン正本 (Storybook) をそのまま対象セットにできない。
- ページを story 化して 1 系統へ寄せる案は、実装コストと二重管理が発生する。

### 2. reg-suit + storycap だけで統一する

#### Pros

- story 単位の網羅が最大になる。

#### Cons

- storycap は story しか撮れず、ページ全体のレイアウト合成や `globals.css` 起因の崩れを捉えられない。

### 3. 許容 diff に最初から小さい閾値 (差分ピクセル比 0.1% 等) を置く

#### Pros

- 導入直後の flake 対応コストが下がる。

#### Cons

- 撮影環境を固定している前提では、小さな崩れを見逃す副作用の方が大きい。

### 4. VRT ジョブを required status checks から外して運用する

#### Pros

- 導入直後のノイズで開発が止まらない。

#### Cons

- 赤を放置する習慣がつくと VRT が形骸化し、許容 diff 0 という決定が実質的に無意味になる。

## 影響

### 良い影響

- `components.css` の colocation 移行を、差分ゼロを完了条件として安全に進められる。
- コンテンツ改修 (文言差し替え等) でも、意図しないレイアウト崩れを検出できる。
- デザイン正本 (Storybook) と検証対象が一致する。

### 悪い影響 / トレードオフ

- 実行系と baseline が 2 系統になり、保守対象が増える。
- story 側は S3 互換ストレージを必要とし、運用対象が増える。
- 許容 diff 0 は、環境差が出た場合に初期の対応コストが高い。

## 実装・運用への反映

- 対象 app / package: `apps/corporate-site`、`packages/ui`、`e2e`、リポジトリ横断の CI 設定
- spec 更新要否: 要。VRT を伴う spec ではテスト観点に視覚回帰を含める
- AI 向け設定更新要否: 不要 (規約は `context/testing.md` に反映済み)

### reg-suit を S3 互換ストレージへ接続するときの必須設定

`reg-publish-s3-plugin` は `sdkOptions` を `S3Client` のコンストラクタへ渡すため、S3 互換ストレージ (Cloudflare R2 / ローカルの検証用ストレージ) で動作する。ただし既定値のままでは失敗するため、次の 4 点を設定する (2026-08-16 調査。4 は同日の実測で追加)。

| #   | 設定                                             | 理由                                                                                                                                                                                                          |
| --- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `enableACL: false` を明示する                    | plugin の既定は `enableACL: true` / `acl: public-read` だが、**R2 はオブジェクト ACL を未実装**で `x-amz-acl` 等が非対応。既定のままでは PutObject が失敗する                                                 |
| 2   | `sdkOptions.region` に `auto` を指定する         | R2 の region は `auto` が正 (空値と `us-east-1` がエイリアス)                                                                                                                                                 |
| 3   | `customDomain` と `endpoint` を併用しない        | 併用すると差分レポートの URL が二重に組み立てられる既知の不具合がある ([reg-suit issue #162](https://github.com/reg-viz/reg-suit/issues/162))                                                                 |
| 4   | `sdkOptions.forcePathStyle` に `true` を指定する | S3 の既定である virtual-host style は `<bucket>.<endpoint>` を名前解決するため、ローカルの検証用ストレージでは解決できない。R2 も path style を受け付けるので、移行後も同じ値で使える (2026-08-16 実測で追加) |

`sdkOptions.endpoint` には R2 の場合 `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` を指定する。ローカル検証では同じ項目を検証用ストレージのエンドポイントへ向け、`enableACL` / `region` / `forcePathStyle` は同じ値のまま使える。

出典: [plugin README](https://github.com/reg-viz/reg-suit/blob/master/packages/reg-publish-s3-plugin/README.md) / [R2 の S3 API 互換性](https://developers.cloudflare.com/r2/api/s3/api/)

## 関連ドキュメント

- `context/testing.md`: テスト責務の分担 (VRT の節)
- `context/toolchain.md`: 標準スタック (VRT ツール)
- `design/features/corporate-site/DesignDoc_corporate-site.md`: テスト観点
- [ADR-0012](0012-design-source-of-truth-implementation.md): デザイン正本 = 実装 + Storybook
- [ADR-0014](0014-corporate-site-sections-architecture.md): `components.css` 受け皿の位置づけ
- [ADR-0016](0016-ci-local-hook-responsibility.md): VRT を含む CI ジョブ構成
- issue: #33 (決定経緯)
