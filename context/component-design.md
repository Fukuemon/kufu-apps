# Component Design

> 最終更新: 2026-07-25

Kufu Monorepo の frontend component 設計規約。本 doc を component のディレクトリ構成、命名、責務分割、Storybook 対象の横断正本とする。決定経緯は [spec #6](../specs/6-storybook-component-catalog/index.md) D3 / D4 / D7、sections 再編・公開面・カタログ / スタイル規約は issue #32 ([ADR-0011](../adr/0011-corporate-site-sections-architecture.md))。

## 原則

### 縦軸を先に置く

component は、技術レイヤーではなく feature / domain の関心を先にして置く。

- 縦軸: feature / domain / business concern
- 横軸: UI component / data assembly / presentation / state / story などの技術責務

基本方針は **package by feature** とし、横軸の責務は feature 配下のファイル名・役割で表す。共通 UI package だけは例外で、`packages/ui` に shared primitive / shared pattern を置く。

### Colocation と昇格

- app / feature 内で閉じる component は app 内に colocation する。
- 複数 app / feature で再利用が明確な component だけ `packages/ui` へ昇格する。
- `packages/ui` へ昇格した component は Storybook story を持つ。
- app-local component は app-local Storybook で確認し、`packages/ui` Storybook へ混ぜない。

### Pages は薄く保つ

Astro の file-based routing は `src/pages/` に置く。Next.js App Router の route segment colocation は前提にしない。

`src/pages/*.astro` の責務:

- URL / query / path param の取得
- page layout assembly
- feature root component の呼び出し
- head / metadata など route に強く紐づく設定

`src/pages/*.astro` に置かないもの:

- section / component の詳細 UI
- data shaping の大きな分岐
- reusable presentation
- Storybook 対象 component

## ディレクトリ構成

区切りの概念は **section** とし、**route 層でグルーピング**する (`components/sections/<route>/<section>/`)。ページとの対応が物理構造で一意になる。旧 `components/features/<feature>/` 構成は本規約で置換した (決定経緯: issue #32 / [ADR-0011](../adr/0011-corporate-site-sections-architecture.md))。

```text
apps/<app>/src/
├── content/                       # データ / ロジック層 ("何を")
│   └── <feature>.ts
├── components/
│   ├── sections/
│   │   └── <route>/               # route 単位 (home / products / contact ...)
│   │       └── <section>/         # section 単位
│   │           ├── index.ts               # 公開面 (Section component のみ再輸出)
│   │           ├── <Feature>Section.astro # section assembly (content → presentation)
│   │           ├── <Component>.astro      # presentation (props only / story 対象)
│   │           └── <Component>.stories.ts
│   └── common/                    # route 横断の site component
│       └── <Component>/
│           ├── <Component>.astro
│           └── <Component>.stories.ts
└── pages/
    └── <route>.astro              # routing + page assembly
```

- section 内部は **フラット + `index.ts`**: 公開面は `index.ts` のみ (Section component だけを再輸出)。内部 component と story は section dir 直下に並べる。`internal/` サブディレクトリは作らない (1 component 1 ディレクトリを強制しない方針を継承)。
- **section の内部非公開**: pages からは `index.ts` 経由の import のみ許可。section 間の import は index 経由でも禁止し、共有が必要になった部品は `common/` (app 内) または `packages/ui` (複数 app) へ昇格する。依存方向は `pages → sections (index) → common → @kufu/ui` の一方向 ([architecture.md](architecture.md) の depcruise 検査対象)。
- presentation component に `Presentation` suffix は付けない。`<Component>.astro` がそのまま presentation であり、story 対象。
- 複数 route をまたいで使う site component (`SectionHeading` など) は `components/common/<Component>/` に置く。

corporate-site の例 (route / section の実マップは [component-map.md](../design/features/corporate-site/component-map.md) を正本とする):

```text
apps/corporate-site/src/components/
├── sections/
│   ├── home/
│   │   ├── hero/
│   │   ├── business/
│   │   │   ├── index.ts
│   │   │   ├── BusinessSection.astro
│   │   │   ├── BusinessFeatureRow.astro
│   │   │   └── BusinessFeatureRow.stories.ts
│   │   ├── services/ company/ consultation/
│   ├── products/
│   │   ├── hero/ category/ detail/
│   └── contact/
│       └── contact/
└── common/
    └── SectionHeading/
```

## 責務分割

ロジック (何を) と UI (どう見せる) を分離する。ただし分離の境界は **component 1 つずつに Container を被せる**のではなく、`content 層 → section assembly → presentation` の 3 階層で表す。静的サイトでは末端 component に渡すだけの空 Container を作らない。

### Content 層

`src/content/<feature>.ts` (または Content Collection。下記参照) はデータ / ロジック層とする。

責務:

- 各 feature が表示する content / 静的データの定義
- 旧 Container が抱えていた fixture / static data の集約先
- CMS / API へ差し替えるときの seam (境界)

禁止:

- JSX / markup を持つこと
- token / style を直接持つこと

### Section assembly

`<Feature>Section.astro` は section assembly component とする。これが「ロジックと UI を束ねる」本来の Container 役で、粒度は **section** とし、末端 component ごとには作らない。

責務:

- `content/<feature>.ts` (または Content Collection) の取得
- content を presentation component の props へ整形・map
- `SectionHeading` など共通 component と presentation の接続
- section 内の layout assembly

禁止:

- Storybook の主対象にすること
- props を素通しするだけの薄いラッパーを末端 component ごとに作ること

### Presentation

`<Component>.astro` は presentation component とする (`Presentation` suffix は付けない)。

責務:

- props だけで描画を完結する
- layout / typography / token / shared component の組み合わせを表現する
- Storybook で default / variant / edge state を確認できる (story の主対象)

禁止:

- URL / query / path param を読むこと
- API / Workers / external service を直接呼ぶこと
- secret / runtime env に依存すること
- route 固有の side effect を持つこと
- content / fixture を component 内に直書きすること (story fixture は除く)

### Shared Primitive / Shared Pattern

`packages/ui` は shared primitive / shared pattern の正本とする。

置いてよいもの:

- `Button`
- `LinkButton`
- `Tag`
- `Separator`
- `FormField`
- `Input`
- `Select`
- `Textarea`
- `DefinitionRow`

置かないもの:

- corporate-site の page section
- corporate-site の section heading など、page 文脈や business wording を持つ component
- feature 固有の business wording を持つ component
- app-local data shape に依存する component
- page-level sample

## Content 層の選び分け

content 層の実装方式は content の性質で選び分ける (ハイブリッド)。全面 Content Collections も全面 plain も避ける。

| 方式                         | 適用する content                                                          | 例                                          |
| ---------------------------- | ------------------------------------------------------------------------- | ------------------------------------------- |
| plain `content/<feature>.ts` | singleton / bespoke / 数が固定 / レイアウト密結合                         | Hero コピー、Business feature、Contact info |
| Astro Content Collections    | 同形エントリの集合 (N 件・増減する・個別ページ化 / フィルタ / CMS 化候補) | ProductCategory、CategoryMakers             |

判断ルール:

- 「このページ専用の固定文言」は plain `content/<feature>.ts` を既定にする。
- 「複数件を並べる / CMS 化後は CMS が所有する」同形データは Content Collection 候補とする。
- Content Collection は実体が必要になった feature だけで `src/content.config.ts` に loader を定義し、全面採用しない。CMS 化時は loader を差し替える。
- 規約は先に決め、Content Collection の実体は対象 feature を実装する段階で追加する (空 collection を先に作らない)。

### ハードコード基準

実装内の直書きは次の 3 区分で判断する (決定経緯: issue #32 D7):

1. **文言・リスト**: content 層へ (上記の選び分けに従う)。component 内への content 直書きは禁止 (story fixture は除く)。
2. **繰り返し値** (数値 / URL / 閾値): 定数化する。content 由来なら content 層、表示ロジック由来なら section 内 constants に置く。
3. **スタイル値**: セマンティックトークン参照のみ (project.yml forbidden / design-workflow §6)。

許容する直書き: `aria-label` / `alt` / sr-only 等の**機能的文言**と、単一箇所でのみ使う一時値。ただし同じ値が 2 箇所以上に現れたら定数化する。

## スタイリング

corporate-site の Astro component は **Tailwind utility** でスタイルする (scoped `<style>` + 生 CSS は原則使わない)。`packages/ui` (shadcn) とスタイル記法を揃え、token ガバナンスを保つため。

- 値の正本は `@kufu/ui/tokens.css`。色・フォントは semantic token の utility (`text-foreground` / `bg-secondary` / `text-muted-foreground` / `border-border` / `font-mono` / `font-serif` など) を使う。
- corporate-site は全量 `@kufu/ui/styles.css` を取り込まず、app-local の lean な Tailwind v4 entry (`src/styles/globals.css`) を持つ ([ADR-0007](../adr/0007-design-token-architecture.md) の「更新」)。token → utility の `@theme` 写像は `@kufu/ui/theme.css` に一元化し、`styles.css` と app entry の双方が import する。Tailwind の走査は Vite plugin の module graph に任せ、app 自身のソースへの app-local `@source` は置かない。workspace package (`packages/ui`) のソース走査は `@kufu/ui/theme.css` が自身の `src/components` を `@source` で指す (app entry に書かない。issue #32 突合④)。
- app の `src/styles/` はレイヤ別に分割し、`globals.css` は `@import` のみの entry とする: `base.css` (@layer base: document-level / `:root`) / `components.css` (@layer components: 既存生 CSS の移行受け皿。cva / utility 移行で逐次削減し最終的に削除を目標) / `animations.css` (@keyframes) / `utilities.css` (@utility 拡張)。
- **cva への集約**: 視覚 variant / 状態分岐を持つ component は cva で variants を定義し、frontmatter の条件付き class 組み立てを置換する (shadcn/ui パターンと整合)。variant のない固定 class の component は Tailwind utility 直書きのままでよい。
- **アニメーション**: duration / easing の motion トークンは `@kufu/ui/tokens.css` に置く (トークンは常に ui)。site 固有演出の keyframes は app-local (`src/styles/animations.css`) に置き、複数 app での再利用が明確になったら `@kufu/ui` へ昇格する。
- token ガード (design-workflow §6): raw hex / 色の arbitrary value (`text-[#fff]` 等) を直書きしない。semantic token utility を参照する。サイズ・余白の arbitrary value (`min-h-95` で表せない `text-[8.75rem]` 等) は可。
- spacing は Tailwind スケール (0.25rem グリッド) の canonical 表記を優先する (`gap-4.5` > `gap-[1.125rem]`)。スケールに無い font-size / line-height / letter-spacing は arbitrary value でよい。
- 条件付き class (variant / align / media position) は frontmatter で class 文字列を組み立てて渡す。
- Storybook (app-local) でも Tailwind を効かせるため、`.storybook/preview.ts` で `globals.css` を import する。`@storybook-astro/framework` は `astro.config.mjs` の Vite plugin を自動ロードするため、Tailwind v4 は Astro 側と同じ `@tailwindcss/vite` 設定で動く。

## 命名規則

命名は BCD Design の考え方を基準にし、component 名から Domain / Base / Case が読めるようにする。

### 用語

| 要素   | 意味                        | 例                                       |
| ------ | --------------------------- | ---------------------------------------- |
| Base   | UI の型 / 基礎名詞          | `Button`, `Card`, `Form`, `List`, `Row`  |
| Case   | 状況 / 動作 / 状態          | `Edit`, `Delete`, `Search`, `Featured`   |
| Domain | 関心の対象 / feature の名詞 | `Product`, `Business`, `Contact`, `Site` |

### パターン

| パターン               | 用途                                       | 例                                       |
| ---------------------- | ------------------------------------------ | ---------------------------------------- |
| `Base`                 | shared primitive                           | `Button`, `Card`                         |
| `Case + Base`          | shared action / state primitive            | `SearchButton`, `FeaturedTag`            |
| `Domain + Base`        | domain を表示する component                | `ProductCard`, `ContactInfoRow`          |
| `Domain + Base + Case` | domain に対する操作 / 状態を持つ component | `ProductSearchForm`, `ContactSendButton` |

### 判断ルール

- Base だけで意味が通り、app / feature に依存しないものは `packages/ui` 候補。
- Domain を持つものは原則 app / feature 配下に置く。
- `Header`, `Footer`, `Navigation` など site 概念に依存するものは `SiteHeader` / `SiteFooter` / `SiteNavigation` のように Domain を付ける。
- 抽象度の高い `Tag`, `Category`, `Information`, `Summary` などは、必要なら `ProductCategoryList` / `ContactInfoRow` のように対象と表現 UI を明示する。
- 複数形だけの component 名を避ける。リストは `ProductList` / `ManufacturerList` のように `List` を Base として使う。
- 派生や条件は後置の `With` / `For` / `By` を使って明示してよい。ただし乱用せず、先に Domain / Base / Case で表現できないか確認する。

## Feature の切り方

feature は `Domain + Case` を基本に切る。ただし corporate-site のような静的サイトでは、route / section / content group が実装単位になる場合がある。

一般的な Case:

| Case        | 主な UI                                   | 責務                         |
| ----------- | ----------------------------------------- | ---------------------------- |
| 表示        | `List`, `Table`, `Card`, `Section`, `Row` | データやコンテンツを表示する |
| 作成 / 更新 | `Form`                                    | 入力、validation、送信準備   |
| 削除        | `Dialog`                                  | 確認、削除 action            |

判断の目安:

- 一覧表示が feature の主価値なら feature 側に置く。
- 詳細画面が URL / param / route 固有の責務を強く持つ場合は `pages` が param を読み、feature Container に渡す。
- 更新 / 削除 / 作成は action が発生する component に責務を寄せる。ただし external call は feature / API 境界の規約に従う。
- route 固有の情報取得や metadata は `pages`、表示用のデータ整形は Container、描画は Presentation に寄せる。

## Storybook 対象

Storybook は **component catalog** として運用する (探しやすさ / ドキュメント性 / バリエーション網羅。決定経緯: issue #32 D1〜D3)。

### カタログ共通規約

- **autodocs 全面採用**: `.storybook/preview` の `tags: ['autodocs']` で全 story に適用し、例外は story 側で `!autodocs` を指定する。
- **title はディレクトリと 1:1**: title は物理配置から機械的に決める。分類の判断を story 作成時にしない。
  - app-local: `Sections/<Route>/<Section>/<Component>` / `Common/<Component>`
  - packages/ui: `UI/<Component>`
- **バリエーション網羅**: presentation component は cva variants の全組み合わせを args で列挙する story と、edge state (長文 / 空データ / 最小構成) の story を必須にする。

### packages/ui

`packages/ui` Storybook は shared component catalog とする。

- shared component は default story を必須にする。
- variant / state がある component は同一 catalog に story を追加する。
- app 固有 component や page-level sample は載せない。

### app-local

app-local Storybook は section-local presentation component の review 入口とする。

- story は `<Component>.stories.*` (`Presentation` suffix なし) を基本にする。
- 固定 props / fixture で状態差分を表現する。
- **section assembly の story も公認する**: Section story は「ページ文脈での確認入口」としてカタログに含める。fixture は story 内に限定し、網羅は代表ケースのみでよい (variant 網羅の主対象は presentation component)。
- 本番 secret、実送信、external API call を伴う story を作らない。

## Design Artifact との関係

`.pen` は design 正本、code / Storybook は実装正本である。

- `.pen` の page section は page 文脈を保持する。
- `.pen` の reusable component は `GenericComponents` / `CorporateSiteComponents` のように分類する。
- `GenericComponents` は `packages/ui` への shared component 候補。
- feature 固有 component は app-local presentation (+ 必要なら content 層 / section assembly) へ写像する。
- `.pen` と実装 component が 1:1 にならない場合は、spec / PR に分割・統合理由を残す。

## 参照

- [spec #6](../specs/6-storybook-component-catalog/index.md): Storybook / component catalog / Container-Presentation の決定経緯
- [architecture.md](architecture.md): package boundary / runtime boundary
- [engineering.md](engineering.md): Storybook quality gate / root task boundary
- [design-workflow.md](design-workflow.md): `.pen` と実装正本の境界
- [BCD Design](https://zenn.dev/misuken/articles/203b9dd3afbf1c)
- [Functional cohesion / colocation](https://zenn.dev/coji/articles/react-router-v7-functional-cohesion-colocation)
