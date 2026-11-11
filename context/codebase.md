---
type: context
title: コードベースの構造
description: app と package の境界、app の中の層と依存の向き、island の規約、状態の置き場、共有へ移す条件、Edge API の共通の契約。コードから読み取れる構造は書かない
status: stable
governs:
  - apps/
  - packages/
  - .dependency-cruiser.cjs
  - apps/corporate-site/scripts/check-section-boundary.mjs
verified_commit: 81f85da2744f320f44040307f1ec854f705f7c79
---

# コードベースの構造

全体の構成とモジュールの責務は [docs/design/DesignDoc.md](../docs/design/DesignDoc.md) にある。

## Module Boundaries

コードは、技術の層より先に、feature とドメインの関心で分ける。  
UI コンポーネント、データの組み立て、表示、状態、story のような技術の責務は、feature の中のファイル名と役割で表す。  
例外は `packages/ui` で、共有の primitive と共有のパターンを置く。

app や feature の中で閉じる UI と utility は、その中に置く。  
複数の app か feature で再利用することがはっきりした時点で、`packages/*` が公開するエントリポイントへ移す。  
移す条件は [Placement Rules](#placement-rules) にある。

デザインシステムの資産は、資産の種類ごとに置き場と移す条件を決める。  
ADR-0007: [デザイントークンの構成](../docs/adr/0007-design-token-architecture.md)

| 資産の種類                     | 置き場                             | 移す条件                                   |
| ------------------------------ | ---------------------------------- | ------------------------------------------ |
| デザイントークン               | 常に `packages/ui`（`tokens.css`） | 移さない。app の配下で定義しない           |
| フォントと共有のスタイルシート | 常に `packages/ui`                 | 移さない。app の配下で定義しない           |
| UI コンポーネント              | app の中                           | 複数の app か feature で再利用が明確になる |
| utility                        | app の中                           | 必要性が明確な場合だけ package にする      |

実装のコードと Storybook を、デザインの基準にする。  
中間のデザインファイルを基準にしない。  
ADR-0012: [デザインの基準を実装にする](../docs/adr/0012-design-source-of-truth-implementation.md)

### app の中の層

Astro の app は、`content`、section、`common`、`pages` に分ける。  
section は `components/sections/<section>/` の 1 階層に並べ、route の層を作らない。  
IA を変えてもディレクトリを動かさずに済むよう、構造をページの構成から切り離すためである。  
ADR-0014: [corporate-site の sections 構成](../docs/adr/0014-corporate-site-sections-architecture.md)

ロジックと UI は、`content` 層、section assembly、presentation の 3 つで分ける。  
末端のコンポーネントごとに Container を被せない。

- `content` 層は、`src/content/<feature>.ts` か Content Collection に置き、表示する内容と静的なデータを持つ。
  - CMS や API へ差し替えるときの境界になる。
- section assembly は `<Feature>Section.astro` で、section の単位で 1 つ作る。
  - `content` 層から取得し、presentation の props へ整形し、section の中の layout を組む。
- presentation は `<Component>.astro` で、props だけで描画を完結させる。
  - Storybook の story の主な対象になる。
- `components/common/` は、app の中で複数の section か route が共有する site のコンポーネントを持つ。
- `src/pages/*.astro` は、URL と param の取得、ページの layout の組み立て、section の呼び出し、head と metadata を担う。
  - Astro の file-based routing を使う。Next.js App Router の route segment colocation は前提にしない。

`packages/ui` に置いてよいのは、Base だけで意味が通る共有の primitive と共有のパターンである。  
例は `Button`、`LinkButton`、`Tag`、`Separator`、`FormField`、`Input`、`Select`、`Textarea`、`DefinitionRow`。  
次のものは `packages/ui` に置かない。

- corporate-site のページの section
- section の見出しのように、ページの文脈や業務の文言を持つコンポーネント
- feature 固有の業務の文言を持つコンポーネント
- app のデータの形に依存するコンポーネント
- ページの単位のサンプル

## Dependency Rules

package の間の依存の向きは次のとおり。

- `apps/*` は、`packages/*` が公開するエントリポイントだけに依存する。
- `apps/*` の間で直接依存しない。
- app は、`packages/*` の `package.json` の `exports` に名前で書いたエントリだけを import する。`exports` にワイルドカードのエントリを足さない。
- 循環する依存、宣言していない依存、devDependency の実行時のコードへの流入を禁じる。
  - チェックはルートの `.dependency-cruiser.cjs` が行う。

app の中のコンポーネントの依存は、`pages` → section の `index.ts` → `common` → `@kufu/ui` の 1 方向にする。  
ADR-0014: [corporate-site の sections 構成](../docs/adr/0014-corporate-site-sections-architecture.md)

- `pages` から section の内部のファイルを直接 import しない。各 section の `index.ts` を通す。
  - ディレクトリを指定した named import（`.../sections/hero`）で書き、`.../hero/index` や `.../hero/index.ts` は書かない。チェックを単純に保つため、形式を 1 つに固定する。
- section の間で import しない。`index.ts` を通しても禁じる。
  - 共有が要るコンポーネントは、app の中なら `common/` へ、複数の app なら `packages/ui` へ移す。
- `common/` から `sections/` へ依存しない。
- 各 section の `index.ts` は Section のコンポーネントだけを再輸出する。
- 同じ section の中の参照は、story を含めて自由にする。

app の中の依存の向きは、`apps/corporate-site/scripts/check-section-boundary.mjs` がチェックする。  
dependency-cruiser と oxlint はどちらも `.astro` を解析しないためである。

- チェックは、上の 4 つ（`pages` から内部、section の間、`common` から `sections`、`index.ts` の公開面）を対象にする。
- 対象の拡張子、構文、既知の非検出の範囲は、スクリプトと fixture のテストを正とする。
- dependency-cruiser は、`.ts` と `.js` の層の package の境界、循環、宣言していない依存を受け持つ。
- チェックは corporate-site の `check` に含め、ルートの `pnpm check`、lefthook の pre-commit、CI の 3 か所で実行する。
  - pre-commit は `--no-verify` で飛ばせるので、必ず通すチェックは CI である。

層ごとに、してはいけないことは次のとおり。

- `content` 層は、JSX と markup を持たない。トークンとスタイルを直接持たない。
- section assembly を、Storybook の主な対象にしない。
- props を渡すだけの薄いラッパーを、末端のコンポーネントごとに作らない。
- presentation は、次のことをしない。
  - URL、query、path param を読む。
  - API、Workers、外部のサービスを直接呼ぶ。
  - secret と実行時の環境変数に依存する。
  - route 固有の副作用を持つ。
  - 内容と fixture をコンポーネントの中に直接書く。story の fixture は除く。

cva は `@kufu/ui/lib` を通して使う。  
app の `package.json` に `class-variance-authority` を直接足さない。  
共有のユーティリティを読み込む先を、`cn` と同じ 1 つに保つためである。

### shadcn の使い方と React island の境界

Astro は React と shadcn のコンポーネントもビルド時に静的な HTML へ描画し、`client:*` を付けない限りクライアントの JavaScript を配らない。  
JavaScript を配るのは island にしたときだけである。  
ADR-0008: [Astro と React island の方針](../docs/adr/0008-astro-react-island-policy.md)

- `apps/corporate-site` は静的な配信を基本にする。
- 表示だけの UI（リンクのボタン、Card、Badge、Tag、section など）は、`@kufu/ui` の shadcn のコンポーネントを `.astro` の中で `client:*` なしで使う。
  - `.astro` で作り直さず、コンポーネントの定義を `@kufu/ui` の 1 か所に保つ。
- `@astrojs/react` は入れてよい。island がなければランタイムは配られない。
- `client:*` の island は、操作が要るものに限る。
  - 対象は、問い合わせフォームと、Radix のインタラクティブな primitive（Dialog、Dropdown、Popover、Tooltip、Accordion、Tabs、Select など）である。
  - モバイルのナビの開閉のように素の script で足りるものは、`.astro` と最小の script で作り、island にしない。
- island のデフォルトのディレクティブは `client:visible` か `client:idle` にする。
  - `client:load` は、above-the-fold で即時の操作が要るときだけ使う。
- インタラクティブな Radix の primitive を、`client:*` なしで静的に描画しない。見た目だけ出て動かない。
- Astro で解決できるものを React の island にしない。
- `client:*` の総数は、[PRD](../docs/PRD.md#success-metrics) の悪化させない指標「不要なクライアントの JavaScript の数」で監視する。

## State Ownership

- React の app では、URL を状態の一部として扱い、TanStack Router の route の状態に置く。
  - URL で表せる状態を、client の状態（Zustand など）でグローバルに持たない。
  - server の状態、client の状態、URL の状態を分けて扱う。標準の候補は [CMS の Design Doc](../docs/design/features/cms/DesignDoc.md) にある。
- corporate-site の表示する内容は、`content` 層が持つ。
- 環境変数は、build-time に閉じるものと実行時に参照するものを分けて扱う。
- シークレットを client の bundle に含めない。置き場は [operations.md](operations.md#secrets) にある。
- 問い合わせフォームの内容は、アプリ側（Workers）で永続化しない。DB、ストレージ、ログに残さず、メールで通知するだけにする。
  - フォームの近くに利用目的を示す。
  - 永続化しないのはアプリ側に限る。通知の流れ（Resend からのメールの送信、受信箱、Resend 側の一時的な保持）には、通知という目的の範囲でデータが残る。
  - ADR-0009: [corporate-site の問い合わせフォームの backend](../docs/adr/0009-corporate-site-contact-form-backend.md)

## Placement Rules

### デザインシステムの文書と 3 つの層

- デザインシステムの文書は `packages/ui/DESIGN.md` と、`packages/ui/design/` の `tokens.md`、`components.md`、`catalog.md` に置く。
- トークンの 3 つの層は `packages/ui/src/tokens/` に置く。
  - プリミティブトークンは `primitive.css` に置く。接頭辞は `--kufu-primitive-` である。
  - セマンティックトークンは `semantic.css` に置く。接頭辞は `--kufu-color-` である。
  - テーマ変数は `theme.css` に置く。
- 層の分け方は ADR-0027: [デザイントークンの 3 つの層](../docs/adr/0027-design-tokens-three-layers.md)にある。

### 新しいコンポーネント

- 画面とコンポーネントのコードを書く前に、`packages/ui/DESIGN.md` と `packages/ui/design/` の 3 つの文書を全て読む。
- 新しいコンポーネントは、まず section の中に置く。
- app の中で複数の section か route が使うものは、`components/common/` へ移す。
- 複数の app で使うものは、`packages/ui` へ移す。
  - `packages/ui` へ移したコンポーネントは Storybook の story を持つ。必須の story は [testing.md](testing.md#required-tests) にある。
- `common/` には、1 コンポーネントにつき 1 ディレクトリを作らず、ファイルを平らに並べる。`index.ts` を置かない。
- section の中も平らに並べ、`internal/` のようなサブディレクトリを作らない。
- 各 app で UI を独自に作らない。app で shadcn/ui を直接 init しない。
- 共有していない utility の関数を散在させない。

### shadcn/ui で表せないとき

shadcn/ui はコードを repo に写して所有するモデルなので、次の順に試す。  
別のデザインシステムを並べず、`packages/ui` だけを元にして、トークン、primitive、独自のコンポーネントの順に積む。

1. 配色、radius、spacing、typography は、`tokens.css` のセマンティックトークンを上書きして変える。コンポーネントは書き換えない。
2. 既存のコンポーネントを直接編集する。CVA の variant を足すか、markup を変える。
3. 既存のコンポーネントにロジックや layout を足すときは、base を変えずに wrapper で包む。
4. 独自のコンポーネントを `packages/ui` に足す。shadcn の流儀（CVA の variants、セマンティックトークン、a11y は Radix の primitive）に沿う。

### content 層の方式

content 層の方式は、内容の性質で選ぶ。  
全面を Content Collections にも、全面を素の TypeScript にもしない。

- このページだけの固定の文言は、素の `content/<feature>.ts` に置く。
  - 1 つだけのもの、数が固定のもの、layout と強く結びつくものが当たる。例は Hero のコピー、Business の feature、連絡先。
- 同じ形のエントリが並び、増減し、個別のページや絞り込みや CMS への移行の候補になるものは、Astro Content Collections に置く。
  - 例は ProductCategory、CategoryMakers。
- Content Collection は、要る feature を実装するときに `src/content.config.ts` に loader を定義する。空の collection を先に作らない。
  - CMS へ移すときは loader を差し替える。

実装の中に値を直接書くかは、次の 3 つで決める。

1. 文言とリスト: `content` 層に置く。コンポーネントの中に直接書かない。story の fixture は除く。
2. 繰り返し使う値（数値、URL、閾値）: 定数にする。内容に由来するなら `content` 層に、表示のロジックに由来するなら section の中の定数に置く。
3. スタイルの値: セマンティックトークンだけを参照する。規則は [conventions.md](conventions.md#スタイリングの共有と書き方) にある。

`aria-label`、`alt`、sr-only のような機能の文言と、1 か所だけで使う一時的な値は、直接書いてよい。  
同じ値が 2 か所以上に現れたら定数にする。

### スタイルのファイル

- トークンを Tailwind の utility へ写す `@theme` は、`@kufu/ui/theme.css` だけに置く。`styles.css` と app の entry の両方がこれを import する。
- corporate-site は `@kufu/ui/styles.css` の全体を取り込まず、app の Tailwind v4 の entry `src/styles/globals.css` を持つ。
  - ADR-0007: [デザイントークンの構成](../docs/adr/0007-design-token-architecture.md)
- Tailwind の走査は Vite plugin の module graph に任せ、app のソースへの `@source` を app に置かない。
  - `packages/ui` のソースの走査は、`@kufu/ui/theme.css`（実体は `packages/ui/src/styles/theme.css`）が `@source "../components"` で指す。app の entry に書かない。
- app の `src/styles/` は役割で分け、`globals.css` は `@import` だけの entry にする。
  - `base.css` は、`:root` のカスタムプロパティと、要素セレクタへの base のスタイルを持つ。
  - `components.css` は、クラスセレクタを持つ。cva と utility へ移して減らし、最後は消す。
  - `animations.css` は、`@keyframes` を持つ。
  - `utilities.css` は、`@utility` の拡張が要るときに足す。使う前に空のファイルを作らない。
- 分けるときはファイルを動かすだけにし、`@layer` で包まない。素のセレクタの CSS を `@layer components` に入れると、Tailwind の utility との優先順位が変わり、表示が崩れる。
- motion の duration と easing のトークンは `@kufu/ui/tokens.css` に置く。
- site 固有の演出の keyframes は app の `src/styles/animations.css` に置く。複数の app での再利用が明確になったら `@kufu/ui` へ移す。

### Edge API

Cloudflare Pages Functions か Workers で app の API を足すときは、次に従う。  
endpoint ごとの request、response、error code は feature の Design Doc が持つ。  
問い合わせフォームの契約とセキュリティの規則は [問い合わせフォームの Design Doc](../docs/design/features/contact-form/DesignDoc.md) にある。

- API は同一オリジンの `/api/*` に置く。ブラウザから第三者の API を直接呼ぶ構成を標準にしない。Workers を中継点にする。
- secret、token、API key、宛先などの秘匿する値は Workers 側で参照し、client の bundle と repo に含めない。
- client の validation は UX のために行う。Workers 側で必ず検証し直し、client の結果を信頼しない。
- JSON の API の成功の response は `{ "ok": true }` にする。
- 失敗の response は `{ "ok": false, "code": string, "message"?: string, "errors"?: object }` にする。
  - client は `message` の文言で分岐せず、`code` と HTTP status で分岐する。
  - `errors` は、項目ごとの validation のエラーだけに使う。
- bot 対策、rate limit、Origin の検証などのセキュリティの判断は Workers 側にまとめ、feature の Design Doc と [operations.md](operations.md) に書く。
