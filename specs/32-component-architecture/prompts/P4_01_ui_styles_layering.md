---
phase: 4
seq: 1
target: ui
issue: 32
depends_on: [P2_01_corporate-site_sections_migration.md]
---

# @source の theme.css 移動 / motion トークン追加 / styles レイヤ分割 (D5 / D6 / 突合③④)

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- **完了条件のタスク化**: 作業開始前に「完了条件」セクションの各項目を todo として登録し、各ステップ完了時に状態を更新すること。タスク化せずに作業を開始することは禁止
- 副作用操作は issue の status ラベル更新と `Refs #32` 付き commit のみ承認済み。push / PR 作成は都度確認する

### 実装アンチパターンの回避 (必守)

- スコープ厳守: spec / 本 prompt に明記された機能のみ実装する。未要求の機能追加・
  先回りの抽象化・無関係なリファクタ・暗黙の互換維持をしない。
- 既存規約への整合: 命名・エラー処理・ログ・テスト・API 連携方式は、対象コードベースの
  既存パターンに合わせる。新方式を持ち込む場合は理由を述べて確認を取る。
- 観測可能な契約の保持: UI 文言・イベント名・戻り値・エラーメッセージ・ログ形式・API を
  要求なく変更しない。変更が必要なら理由と影響を明記する。
- 推測の排除: 要件・業務ルール・API 仕様が不明なら停止して確認する。それらしいが
  誤った実装 (存在しない API 呼び出し / 非互換な引数) を避け、import と API の実在を確認する。
- fallback の最小化: `??` / `||` / 既定引数 / 多段 fallback / 暗黙のエラー握り潰しは
  「任意データ」に限定する。必須データの欠落は隠さず明示的に失敗させる。
- 過剰実装の排除: 単純な条件分岐を strategy / handler map に置換しない。
  要求も計測もない caching / memoization を入れない。
- dead code を残さない: 到達不能コード・未使用の変数 / 関数 / import / export・
  変更後に不要化した型定義を削除する。
- 判断の記録: 非自明な設計判断は理由 (or spec / ADR へのリンク) を残す。

## 作業ステップ (この順序で実行する)

### ステップ 0: 前提確認とベースライン計測

1. `P2_01` が完了していることを確認する (P2 と本 prompt はともに `apps/corporate-site/README.md` を更新するため、並列実行しない — 2026-08-07 変更)。現在のブランチが `feature/32` であることを確認する
2. **変更前**に `pnpm --filter @kufu/corporate-site build` を実行し、`apps/corporate-site/dist/_astro/*.css` の合計バイト数を控える (ステップ 2 の分割完了時の比較基準にする。**トークン追加 (ステップ 3) より前に分割の等価比較を終える順序**にしているのは、`:root` へのトークン追加が出力 CSS を増やし、バイト等価の判定を壊すため)

### ステップ 1: @source を theme.css へ移す (突合④)

1. `packages/ui/src/styles/theme.css` に `@source "../components";` を追加する (theme.css 自身からの相対パスで `packages/ui/src/components` を指す)
2. `apps/corporate-site/src/styles/globals.css` の `@source` 2 行を削除する。`packages/ui/src/lib` 向けの 1 行は移送せず削除する (`lib/utils.ts` は `cn` のみで class 文字列を持たないため)
3. `pnpm --filter @kufu/corporate-site build` を実行し、`@kufu/ui` の component が使う Tailwind class が出力 CSS に含まれることを確認する
4. diff レビューを回し、指摘を対応してから次へ

### ステップ 2: src/styles/ を役割別に分割する (D6)

`apps/corporate-site/src/styles/` を次の 4 ファイル構成にする:

| ファイル         | 内容 (現行 `globals.css` の該当箇所)                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `globals.css`    | entry。`@import "tailwindcss"` + `@kufu/ui/tokens.css` + `@kufu/ui/theme.css` + 下記 3 ファイルの `@import` のみ          |
| `base.css`       | `:root` のカスタムプロパティと、その直後の `border-radius` 規則 (クラス規則が始まる直前まで)                              |
| `components.css` | クラスセレクタ群と、それらに紐づく `@media` ブロック。**末尾の `@media (prefers-reduced-motion: reduce)` もここに含める** |
| `animations.css` | `@keyframes scroll-cue` / `@keyframes section-rise`                                                                       |

**`utilities.css` は作らない**。現行 `globals.css` に `@utility` は 1 件も無く、空ファイルは dead code になる (絶対ルールの「dead code を残さない」)。P5 以降で `@utility` が必要になった時点で追加する。

**`@layer` は付けない**。現行 CSS は素のセレクタで書かれており、`@layer components` で包むと Tailwind utility との優先順位が変わって表示が壊れるため。**本ステップでは**分割は `@import` によるファイル移動のみとし、セレクタと宣言は 1 文字も書き換えない (motion トークンへの置換はステップ 4 で分割の等価確認後に行う。cva 化・削減は P5 の責務)。

**カスケード順 (同一詳細度の上書き関係) を必ず保つこと**。CSS は同一詳細度なら後勝ちのため、**スタイル規則の相対順**は現行 `globals.css` の記述順を保たなければならない。ただし `@keyframes` ブロックは出現位置がカスケードに影響しない (名前参照のため) ので、`animations.css` へ移してよい — つまり「連結順の完全一致」ではなく「@keyframes を除くスタイル規則の順序保持」が要件である。特に次の 2 点に注意する:

- `@media (prefers-reduced-motion: reduce)` ブロックは現行ファイルの **末尾** にあり、`.scroll-cue-icon` の `animation` や `.business-row-copy::after` の `transition` を同一詳細度で上書きしている。これを `base.css` (先頭側) に置くと上書きが効かなくなり、`prefers-reduced-motion` でアニメーションが止まらなくなる。**必ず `components.css` の末尾 (全クラス規則の後) に置く** (現行では `@keyframes` 2 件がこのブロックの直前にあるが、それらは `animations.css` へ移るため、`components.css` 内で末尾に置けば上書き関係は現行と等価になる)
- 冒頭の `border-radius` 規則は要素 (`button` / `input` …)・class (`.products-control-btn` …)・属性 (`[data-testid=…]`)・id (`#products-category-groups`) が 1 つのセレクタリストに混在している。**セレクタリストを分割せず、そのまま `base.css` に置く** (分割すると「1 文字も書き換えない」に反する)

`@import` の順序は base → components → animations とする (animations の `@keyframes` は順不同のため末尾でよい)。

分割が終わったらこの時点で `pnpm --filter @kufu/corporate-site build` を実行し、`dist/_astro/*.css` の合計バイト数が**ステップ 0 で控えた値と同じか小さい**ことを確認する (トークン追加・置換より前のこの時点で比較する。ステップ 3 のトークン追加とステップ 4 の `var()` 置換後はバイト数が増えるため、この比較はここでしか行えない)。

### ステップ 3: motion トークンを追加する (D5)

1. `packages/ui/src/styles/tokens.css` に duration / easing の motion トークンを追加する。**セマンティック統合** (2026-08-08 ユーザー決定): 値 1:1 の数値トークンは作らず、次の 10 トークンで**全列挙**する。統合で値が動くのは 0.22s / 0.25s → `fast` (0.2s) のみ (最大 50ms。受け入れ基準の等価例外として承認済み):

   | トークン                | 値            | 統合元 (現行値)                | 役割                                 |
   | ----------------------- | ------------- | ------------------------------ | ------------------------------------ |
   | `--kufu-motion-fast`    | `0.2s`        | 0.2s / 0.22s / 0.25s (18 箇所) | hover / focus 等の micro interaction |
   | `--kufu-motion-medium`  | `0.35s`       | 0.35s (1 箇所)                 | 要素単位の強調                       |
   | `--kufu-motion-slow`    | `0.7s`        | 0.7s (4 箇所)                  | section reveal (`section-rise` 含む) |
   | `--kufu-motion-drift`   | `0.9s`        | 0.9s (1 箇所)                  | 大きい要素のゆったりした transform   |
   | `--kufu-motion-glide`   | `1.2s`        | 1.2s (1 箇所)                  | carousel 等の移動                    |
   | `--kufu-motion-cue`     | `1.8s`        | 1.8s (1 箇所)                  | ループ演出 (`scroll-cue`)            |
   | `--kufu-motion-stagger` | `0.12s`       | 0.12s (delay 1 箇所)           | 段差 delay                           |
   | `--kufu-ease`           | `ease`        | ease                           | 既定 easing                          |
   | `--kufu-ease-out`       | `ease-out`    | ease-out                       | `section-rise`                       |
   | `--kufu-ease-in-out`    | `ease-in-out` | ease-in-out                    | `scroll-cue`                         |

2. 追加したトークンを Tailwind utility として使う必要がある場合のみ、`theme.css` に `@theme inline` 写像を追加する (本 issue では utility 化の要求はないため、通常は不要)
3. 統合元の出現箇所数が表と大きく食い違う場合は停止してユーザーに確認する (「不明点ハンドリング」)

### ステップ 4: duration / easing をトークン参照へ置換する (D5)

分割の等価確認 (ステップ 2) とトークン追加 (ステップ 3) が済んでから、`base.css` / `components.css` / `animations.css` 内の**全 `transition` / `animation` 宣言**の duration・delay・easing 値を、ステップ 3 の対応表の `var()` 参照へ置換する (例: `transition: transform 0.9s ease 0.12s;` → `transition: transform var(--kufu-duration-900) var(--kufu-ease) var(--kufu-duration-120);`)。

- 置換対象は duration / delay / easing の値のみ。プロパティ名・対象プロパティ (`transform` 等)・`@keyframes` 内の `%` 指定・宣言の順序は変えない
- `@media (prefers-reduced-motion: reduce)` 内の `animation: none` / `transition: none` は値がキーワードのため置換対象外
- 置換後、`grep -nE "[0-9.]+s" src/styles/*.css` で `transition` / `animation` 宣言に生の秒数 literal が残っていないことを機械確認する (それ以外の文脈の秒数は対象外)
- `pnpm --filter @kufu/corporate-site build` が通り、出力 CSS に `var(--kufu-duration-` が現れることを確認する

### ステップ 5: README の styles 記述を追従させる

`apps/corporate-site/README.md` の styles に関する記述 (`globals.css` のコード例、`@source` / `fonts.css` の記述) を、4 ファイル構成 + motion トークン参照の実態に合わせて更新する。

### ステップ最終: 最終確認

1. `## 検証コマンド` がすべてパスすることを確認
2. `pnpm e2e` で DOM 構造とテキストが分割前と等価であることを確認する (E2E は視覚回帰を検出しないため、`/` `/products` `/contact` を desktop / mobile viewport で目視比較し、実施したことを PR 説明に記録する (PR 未作成の段階では該当 commit の message 本文に記録し、PR 作成時に転記する — push / PR 作成自体は承認範囲外のため行わない))
3. **カスケード順を確認する**: OS の「視差効果を減らす」を有効にした状態で `/` を開き、スクロールキューと section の出現アニメーションが停止することを確認する。`@media (prefers-reduced-motion: reduce)` が `components.css` 末尾に置かれていないと停止しない。この退行はバイト数比較でも E2E でも検出できないため、必ず目視で確認する
4. アニメーションの体感が置換前と同一であることを確認する (`/` のスクロールキュー・section 出現、hover transition を目視。トークン置換で値が変わっていれば見た目で分かる)
5. 変更をコミットする (commit message に `Refs #32` を含める)

## 実装コンテキスト

- spec: `specs/32-component-architecture/index.md` (D5 / D6 / 突合③④ / 実装分割 P4)
- 参照する path:
  - `packages/ui/src/styles/` (tokens.css / theme.css / fonts.css / globals.css)
  - `apps/corporate-site/src/styles/globals.css`
  - `apps/corporate-site/src/components/common/BaseLayout.astro` (fonts の読み込み経路。変更しない)
- 規約の正本: `context/component-design.md` (スタイリング節)、`adr/0007-design-token-architecture.md` (2026-07-25 更新節)

## 前提条件

- 完了しているべき phase / 依存 prompt: `P2_01_corporate-site_sections_migration.md` (README 更新が競合するため。P3 とは並列実行可 — 変更ファイルが重ならない)
- 完了後に着手可能になる後続 prompt: `P5_01_corporate-site_cva_consolidation.md`
- 必要な repo 状態: sections 構成への移行 (P2) が完了していること

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 変更する repo 領域

`packages/ui/src/styles/` (theme.css / tokens.css) と `apps/corporate-site/src/styles/`、`apps/corporate-site/README.md` の styles 節。frontmatter の `target` は命名規則上 1 つしか書けないため `ui` としているが、**作業量の主体は `corporate-site` 側**である (spec の実装分割表では P4 を `ui` + `corporate-site` としている)

### 実装する範囲

- `packages/ui/src/styles/theme.css` への `@source` 追加
- `apps/corporate-site/src/styles/globals.css` からの `@source` 2 行削除
- `packages/ui/src/styles/tokens.css` への motion トークン追加
- `apps/corporate-site/src/styles/` の 4 ファイル構成への分割
- `apps/corporate-site/README.md` の styles に関する記述の追従 (`globals.css` のコード例、`@source` / `fonts.css` の記述)

### 実装しない範囲

- **duration / easing の置換以外の CSS の中身の書き換え** (クラスセレクタの cva 化・削減は P5 の責務。本 prompt は移動 + ステップ 4 の motion トークン置換のみ)
- 近接クラスタ (0.2s 系) 以外の値の統合 (0.35s 以上の各値は役割が異なるため寄せない)
- fonts の読み込み経路の変更 (`BaseLayout.astro` の `?url` 参照は現行維持 — 突合③)
- `@kufu/ui` の component 実装の変更
- トークン体系そのものの再設計 (ADR-0007 の 2 層構造は維持)

## 設計仕様

spec の D5 / D6 / 突合③④ より抜粋:

> **D5: motion トークンは `@kufu/ui`、keyframes は app-local**。duration / easing の motion トークンは `@kufu/ui/tokens.css` に定義する (「トークンは常に ui」の既存昇格境界と整合)。site 固有演出の keyframes は app-local (`src/styles/animations.css`) に置き、複数 app での再利用が明確になったら `@kufu/ui` へ昇格する。**トークンは定義するだけでなく、既存 CSS の duration / easing 値を `var()` 参照へ置換するところまでを本 issue (P4) で行う** (2026-08-07 追記。定義のみだと未参照の dead code になるため)。
>
> **D6: src/styles/ は 4 ファイル構成**。`globals.css` = entry (@import のみ。現行の `@source` 2 行のうち `packages/ui/src/components` 分を `@kufu/ui/theme.css` へ移動。`packages/ui/src/lib` 分は `utils.ts` (cn のみ) で class 文字列を持たないため移送せず削除する)、`base.css` (`:root` と要素セレクタの base スタイル)、`components.css` (クラスセレクタ群。cva / utility 移行の受け皿)、`animations.css` (@keyframes)。
>
> **`utilities.css` は作らない / `@layer` は付けない** (2026-07-27 訂正)。現行 `globals.css` に `@utility` と `@layer` は 1 件も無く、空ファイルは dead code になる。また素のセレクタを `@layer components` で包むと Tailwind utility との優先順位が変わって表示が壊れるため、分割はファイル移動のみとする。
>
> tokens 層は既存どおり `@kufu/ui/tokens.css` の import で賄う。fonts は現行の `BaseLayout.astro` の `?url` 参照経路を維持する。
>
> **突合④**: `@source` のパスは記述ファイル基準の相対解決のため theme.css 側で ui 自身の src を指せば全 consumer が自動で ui の class を生成できる。

## テスト観点

- 分割後に build / Storybook build が通るか
- 出力 CSS が分割前と同じか小さいか (`dist/_astro/*.css` の合計バイト数で比較。**置換前の分割直後に比較する**)
- motion トークン置換後、`transition` / `animation` 宣言に生の秒数 literal が残っていないか (grep)、出力 CSS にトークン参照が現れるか
- `@kufu/ui` の component が使う class が出力に含まれるか (`@source` 移動の検証)
- DOM 構造とテキストが分割前と等価か (既存 E2E)。見た目は 3 route を目視比較する
- カスケード順が保たれているか: `prefers-reduced-motion: reduce` 有効時にアニメーションが停止するか (バイト数比較・E2E では検出できない退行)

## 検証コマンド

- `pnpm --filter @kufu/corporate-site build`
- `pnpm --filter @kufu/corporate-site typecheck`
- `pnpm --filter @kufu/corporate-site storybook:build`
- `pnpm --filter @kufu/ui build`
- `pnpm e2e`
- `pnpm format:check`

## 完了条件

- [ ] 全ステップを順序通りに実行した
- [ ] `theme.css` に `@source "../components"` があり、app entry から `@source` が消えている
- [ ] ステップ 3 の対応表のセマンティック motion トークン 10 件が `tokens.css` に追加されている
- [ ] `src/styles/` が 4 ファイル構成 (globals / base / components / animations) になり、`globals.css` は `@import` のみになっている
- [ ] 分割ステップ (ステップ 2) ではセレクタと宣言を 1 文字も書き換えていない (`@layer` も付けていない)。書き換えはステップ 4 の duration / easing 置換のみ
- [ ] `utilities.css` を作っていない (空ファイルにしない)
- [ ] 分割直後 (トークン追加・置換より前) の出力 CSS の合計バイト数が分割前と同じか小さいことを確認した
- [ ] `@keyframes` を除くスタイル規則の順序が分割前と一致し、`@media (prefers-reduced-motion: reduce)` が `components.css` の末尾にある
- [ ] `transition` / `animation` 宣言の duration / delay / easing がすべて `var()` 参照になり、生の秒数 literal が残っていない (grep で機械確認)
- [ ] `prefers-reduced-motion: reduce` 有効時にアニメーションが停止することを目視確認した
- [ ] `/` `/products` `/contact` の目視比較 (desktop / mobile) を実施し PR 説明に記録した
- [ ] `apps/corporate-site/README.md` の styles 記述を更新した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] 変更を `Refs #32` 付きでコミットした
- [ ] 未解決の仕様質問が残っていない
