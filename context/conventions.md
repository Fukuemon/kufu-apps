---
type: context
title: コードと文書の規約
description: 命名、Storybook の title、デザインの制作物の置き場、共有の設定とルートのタスク、チェックの実行点、スタイリングの書き方、チェックの除外。lint で検出できる規則は書かない
status: draft
governs:
  - package.json
  - lefthook.yml
  - knip.json
  - .dependency-cruiser.cjs
  - vite.config.ts
  - .github/workflows/
verified_commit: 81f85da2744f320f44040307f1ec854f705f7c79
---

# コードと文書の規約

## Naming

- package の名前は `@kufu/<module>` にする。例は `@kufu/corporate-site`、`@kufu/ui`。
- コンポーネントのファイルの名前は PascalCase にする。例は `Button.tsx`、`UserCard.tsx`。
- presentation のコンポーネントに `Presentation` の接尾辞を付けない。`<Component>.astro` がそのまま presentation である。
- section の名前は、route の名前ではなくドメインで付ける。
  - 1 つのドメインが複数の section を持つときは、接頭辞で表す。例は `products-category`、`products-detail`。

### コンポーネントの名前の組み方

コンポーネントの名前は BCD Design に従い、名前から Domain、Base、Case が読めるようにする。  
出典: [BCD Design](https://zenn.dev/misuken/articles/203b9dd3afbf1c)

- Base: UI の型と基礎の名詞。例は `Button`、`Card`、`Form`、`List`、`Row`。
- Case: 状況、動作、状態。例は `Edit`、`Delete`、`Search`、`Featured`。
- Domain: 関心の対象と feature の名詞。例は `Product`、`Business`、`Contact`、`Site`。

組み合わせ方と用途は次のとおり。

- `Base`: 共有の primitive。例は `Button`、`Card`。
- `Case + Base`: 共有の操作か状態の primitive。例は `SearchButton`、`FeaturedTag`。
- `Domain + Base`: ドメインを表示するコンポーネント。例は `ProductCard`、`BusinessFeatureRow`。
- `Domain + Base + Case`: ドメインに対する操作か状態を持つコンポーネント。例は `ProductSearchForm`、`ContactSendButton`。

名前を決めるときは、次の規則で判断する。

- Base だけで意味が通り、app と feature に依存しないものは、`packages/ui` の候補にする。
- Domain を持つものは、app か feature の配下に置く。
- `Header`、`Footer`、`Navigation` のように site の概念に依存するものは、`SiteHeader`、`SiteFooter`、`SiteNavigation` のように Domain を付ける。
- `Tag`、`Category`、`Information`、`Summary` のように抽象度の高い語は、`ProductCategoryList`、`ProductsSidebarNav` のように対象と表す UI を明示する。
- 複数形だけの名前を避ける。リストは `ProductList`、`ManufacturerList` のように `List` を Base にする。
- 派生や条件は、後ろに付ける `With`、`For`、`By` で明示してよい。
  - 乱用せず、先に Domain、Base、Case で表せないかを確認する。

feature は `Domain + Case` を基本に切る。  
corporate-site のような静的なサイトでは、route、section、内容のまとまりが実装の単位になる場合がある。

- 一覧の表示が feature の主な価値なら、feature の側に置く。
- 詳細の画面が URL、param、route 固有の責務を強く持つときは、`pages` が param を読み、feature に渡す。
- 作成、更新、削除は、action が起きるコンポーネントに責務を持たせる。外部の呼び出しは [codebase.md](codebase.md#edge-api) の規約に従う。
- route 固有の情報の取得と metadata は `pages` に、表示用のデータの整形は section assembly に、描画は presentation に置く。

### Storybook の title

title は物理的な配置から機械的に決め、story を作るときに分類を判断しない。

- app の story: `Sections/<Section>/<Component>` か `Common/<Component>`
- `packages/ui` の story: `コンポーネント/Base/<名前>`。はじめにとトークンのページを含む題の決め方は、[カタログの文書](../packages/ui/design/catalog.md#題の決め方) にある。
- `<Section>` は、section のディレクトリの名前（kebab-case）を PascalCase にしたものにする。例は `products-category` から `ProductsCategory`。ほかの変換の規則は使わない。

## Comments

コメントに書くことと書かないこと、使う言語は未定。

## Documents

feature の Design Doc は、対象のコードと同じディレクトリの `DesignDoc.md` に置く。コードがまだないときは `docs/design/features/<feature>/DesignDoc.md` に置き、コードができたら隣へ移す。  
掲載する内容の一次情報は `docs/design/features/<feature>/reference/` に置く。

### デザインの制作物

デザインの制作物（依頼文と内容の一次情報）は `docs/design/features/<feature>/` に置く。  
デザインの実体は実装の側にある。  
ADR-0013: [デザインの基準を実装にする](../docs/adr/0013-design-source-of-truth-implementation.md)

- Claude Design への依頼文は `docs/design/features/<feature>/<screen>.prompt.md` に置き、commit する。
  - 採用した方向の依頼文だけを残す。却下した方向の依頼文は残さない。
- Claude Design が出した standalone HTML は `docs/design/.staging/` に置き、commit しない。HTML をデザインの基準にしない。
- 画像のアセットは `apps/<app>/src/assets/` に置き、Astro Image か import で最適化する。
- IA、layout の方針、ブランドの指針のように残す判断は、feature の Design Doc と `packages/ui` のトークンへ書き戻す。
- デザインのツールは `packages/ui` のトークンとコンポーネントを使うだけにし、写して分岐させない。
  - 新しいトークンが要るときは、先にレビューを経て `packages/ui` へ足す。
- 実装するときは、プロトタイプの構造をそのまま持ち込まず、`@kufu/ui` のコンポーネントとセマンティックな HTML へ写す。
  - プロトタイプの HTML になくても、状態（hover、focus、error、empty）、データ量の違い、検索と絞り込みの結果、レスポンシブを実装で補う。
  - 表示は実データ（company-profile、manufacturers）で確認する。
- 制作のフローを変えるときは、先に ADR-0013 を更新する。

## Shared Configuration

設定を配る package は置かない。  
ADR-0010: [workspace の package はソースを export し、ビルドの成果物、project references、packages/config を持たない](../docs/adr/0010-workspace-package-contract.md)

- `tsconfig.json` と Vitest の設定のファイルは、各 workspace が自分で持ち、ほかの workspace の設定を `extends` も import もしない。
  - 共通の値（`target`、`strict`、`skipLibCheck`、`noEmit`）を変えるときは、全ての workspace の `tsconfig.json` を直す。
- 整形と lint の設定は、ルートの `vite.config.ts` の `fmt` と `lint` に置く。ルートの `vp check` がリポジトリの全体を 1 回で確認する。
  - workspace の `check` の script は、その workspace だけのチェックを持つ。`@kufu/e2e` の `check` は、`e2e/` で `pnpm check` を流しても書き方の規則が掛かるよう、`vp check` を実行する。
- knip と dependency-cruiser は workspace の全体を見るので、ルートの設定とルートの script を正とする。
  - knip の設定はルートの `knip.json` に置き、workspace ごとの `project` と `entry` を持つ。
  - dependency-cruiser の設定はルートの `.dependency-cruiser.cjs` に置く。少なくとも、循環する依存、宣言していない依存、devDependency の流入、app の間の直接の依存をチェックする。

### ルートのタスク

- workspace のタスクは、ルートの script から `pnpm -r` と `pnpm --filter` で束ねる。`pnpm -r` は依存の順に流す。
  - `dev`、`dev:corporate`、`build`、`typecheck`、`test` が当たる。
- workspace は、自分に要る script だけを持つ。`pnpm -r` は、その script を持たない workspace を飛ばす。

| workspace             | `check`                      | `typecheck`    | `test`        | `build`       |
| --------------------- | ---------------------------- | -------------- | ------------- | ------------- |
| `apps/corporate-site` | `check-section-boundary.mjs` | `astro check`  | `vp test run` | `astro build` |
| `packages/ui`         | なし                         | `tsc --noEmit` | なし          | なし          |
| `e2e`                 | `vp check`                   | `tsc --noEmit` | なし          | なし          |

- `packages/ui` は `build` を持たない。利用者のバンドラーがソースを変換する。
- `packages/ui` の Storybook のテストは、ブラウザが要るので `test` に入れず、`vrt:capture` で流す。CI の test の job にはブラウザがない。
- `typecheck` の実体は各 workspace が持ち、ルートは集めるだけにする。
  - corporate-site は `astro check`、packages と `e2e` は `tsc --noEmit` を実行する。ルートは `tsc` を実行しない。
  - package はソースを export するので、利用者の `typecheck` が、import した package のソースも一緒に確認する。
  - TypeScript の project references は入れない。CI の型のチェックが 60 秒を超えたときか、`dist/` を export する package ができたときに、入れるかを決め直す。
- `check`、`knip`、`depcruise` は、package のタスクではなくリポジトリのタスクとして、ルートで直接実行する。`check` は `vp check` の後に `pnpm -r check` を実行する。
- `e2e` と `vrt:route:run` は、ルートの script から `pnpm --filter @kufu/e2e` で、E2E の workspace の script を呼ぶ。
- Storybook の起動はルートから対象へ委ねる。
  - `storybook` は共有と app の両方を並べて起動する。`storybook:ui` は `packages/ui` を、`storybook:corporate` は `apps/corporate-site` を対象にする。
- Storybook の build は本番の `build` に混ぜず、専用のチェック `storybook:build` として扱う。
  - app の Storybook は本番の成果物ではなく、実行時の bundle と性能の予算に含めない。

### チェックの実行点

ローカルの Git のフックは速く知らせることを、CI は飛ばせないチェックを受け持つ。  
pre-commit は `--no-verify` で飛ばせるので、CI を最後のチェックにする。  
ADR-0016: [CI とローカルのフックの分担](../docs/adr/0016-ci-local-hook-responsibility.md)

- `typecheck`、`build`、`knip`、`depcruise`、`e2e`、VRT を CI で実行する。
- 同じチェックがローカルのフックと CI の両方で動くのは、意図した二重化として認める。
- pre-commit で `depcruise` と `knip` を実行するかは未定。
  - 動いているフックは `lefthook.yml` にある。
- Storybook の build は、CI と pull request のチェックにし、pre-commit の必須のチェックに含めない。
- CI の実行時間の目標値は置かない。
  - ジョブを足したら実行時間を測り、その値を見て required status checks の要否を判断し直す。
- required status checks は設定しない。
  - CI が赤いまま merge できる状態が残るので、merge の前に pull request のチェックの欄を見る。
- VRT を CI だけで撮って判定する理由は [testing.md](testing.md#test-types-and-guarantees) にある。

`pnpm check:specs` は、close した issue の spec のディレクトリが `docs/specs/` に残っていないかを確認する。  
ADR-0015: [spec の後始末の強制](../docs/adr/0015-specs-closeout-enforcement.md)

- issue を close した直後と、文書を整理する pull request で実行する。
  - close する前に実行しても、対象の issue はまだ OPEN なので、その spec の消し忘れは検出できない。
- lefthook には入れない。`gh` で issue の状態を問い合わせるので、オフラインのときに失敗し、commit が遅くなる。
- CI では `.github/workflows/spec-residue.yml` が同じチェックを実行する。
  - デフォルトのブランチへの push、週に 1 回の cron、手動で動く。
  - pull request のチェックにはしない。別の pull request で spec を消す運用では、issue は閉じたが spec が残っている間、関係のない pull request が失敗するため。
- 残っていたら、[CONTRIBUTING.md](../CONTRIBUTING.md#spec-を閉じるとき) の手順で消す。

### スタイリングの共有と書き方

トークンの値は `packages/ui/src/tokens/` だけに置く。  
置き場とファイルの分け方は [codebase.md](codebase.md#スタイルのファイル) に、トークンとコンポーネントの使い方の規則は [デザインシステムの文書](../packages/ui/DESIGN.md) にある。

- corporate-site の Astro のコンポーネントは、Tailwind の utility でスタイリングする。scoped な `<style>` と素の CSS は原則として使わない。
  - `packages/ui` と記法を揃え、トークンの統制を保つため。
- 色とフォントは、セマンティックトークンの utility で指定する。
  - 例は `text-text`、`bg-surface-subtle`、`text-text-secondary`、`border-divider`、`font-mono`、`font-serif`。
- 実装のコードにトークンの値を直接書かない。raw hex と、色の arbitrary value（`text-[#fff]` など）を書かない。
  - サイズと余白の arbitrary value は書いてよい。例は、`h-[4.1875rem]`。
  - 文字の大きさは、文字のスタイル（`text-body`、`text-heading-36` など）で指定する。arbitrary value（`text-[8.75rem]` など）は書かない。`pnpm check:design` の `TEXT-MIN-SIZE` のチェックが止める。文字のスタイルの表は [tokens.md](../packages/ui/design/tokens.md) にある。
- spacing は、Tailwind のスケール（0.25rem のグリッド）の canonical な書き方を優先する。例は、`gap-[1.125rem]` より `gap-4.5`。
  - スケールにない line-height と letter-spacing は arbitrary value でよい。
- class の差で表せる見た目の variant と状態の分岐を持つ Astro のコンポーネントは、variant ごとの class を frontmatter の中のオブジェクトに書き、`class:list` で条件つきで組み立てる。
  - ADR-0020: [packages/ui のコンポーネントをネイティブの要素と clsx で書く](../docs/adr/0020-ui-components-native-elements.md)
  - markup の構造ごと分岐する見た目の variant は、条件分岐のまま保つ。
  - variant のない固定の class のコンポーネントは、Tailwind の utility を直接書いてよい。
- motion のトークンは役割で名前を付ける（`--kufu-motion-fast` など）。値と 1 対 1 の数値のトークンは作らない。
- app の Storybook でも Tailwind を適用するため、`.storybook/preview.ts` で `globals.css` を import する。
  - `@storybook-astro/framework` は `astro.config.mjs` の Vite plugin を読み込むので、Tailwind v4 は Astro と同じ `@tailwindcss/vite` の設定で動く。

pull request では、[PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md) の Design Guard のチェックリストでトークンの参照を確認する。

## Check Exclusions

- knip と dependency-cruiser は、誤検出を避けるため、生成されたファイルとルートが管理する設定ファイルをルートの設定で除外する。
- トークンの直接の記述のチェック（`check-raw-values.mjs`）は、サイズと余白の arbitrary value を対象にしない。文字の大きさの arbitrary value は、`check-utilities.mjs` の `TEXT-MIN-SIZE` が止める。
- `space-*` は CSS のトークンを持たず、Tailwind の標準のスケール（4px のグリッド）への写像として扱う。トークンの記述のチェックの対象にしない。
  - 余白の段は [トークンの文書](../packages/ui/design/tokens.md#レイアウト角丸影動き) の「レイアウト、角丸、影、動き」にある。
  - ADR-0018: [トークンの 3 つの層](../docs/adr/0018-design-tokens-three-layers.md)
