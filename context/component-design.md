# Component Design

> 最終更新: 2026-06-18

Kufu Monorepo の frontend component 設計規約。本 doc を component のディレクトリ構成、命名、責務分割、Storybook 対象の横断正本とする。決定経緯は [spec #6](../specs/6-storybook-component-catalog/index.md) D3 / D4 / D7。

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

app-local feature component は `apps/<app>/src/components/features/<feature>/` 配下に置く。

```text
apps/<app>/src/
├── pages/
│   └── <route>.astro
└── components/
    └── features/
        └── <feature>/
            └── <ComponentName>/
                ├── <ComponentName>.astro
                ├── <ComponentName>Presentation.astro
                └── <ComponentName>Presentation.stories.ts
```

corporate-site の例:

```text
apps/corporate-site/src/components/features/corporate-site/
├── Hero/
│   ├── Hero.astro
│   ├── HeroPresentation.astro
│   └── HeroPresentation.stories.ts
├── BusinessSection/
│   ├── BusinessSection.astro
│   ├── BusinessSectionPresentation.astro
│   └── BusinessSectionPresentation.stories.ts
└── ContactInfoRow/
    ├── ContactInfoRow.astro
    ├── ContactInfoRowPresentation.astro
    └── ContactInfoRowPresentation.stories.ts
```

## 責務分割

### Container

`<ComponentName>.astro` は Container component とする。

責務:

- content / fixture / static data の組み立て
- feature-local state / 条件分岐
- route entry から渡された値の整形
- Presentation へ渡す props の生成
- shared component と app-local Presentation の接続

禁止:

- Storybook の主対象にすること
- 見た目の細かい分岐を直接持つこと
- `packages/ui` に昇格すべき primitive を app 内で再実装すること

### Presentation

`<ComponentName>Presentation.astro` は Presentation component とする。

責務:

- props だけで描画を完結する
- layout / typography / token / shared component の組み合わせを表現する
- Storybook で default / variant / edge state を確認できる

禁止:

- URL / query / path param を読むこと
- API / Workers / external service を直接呼ぶこと
- secret / runtime env に依存すること
- route 固有の side effect を持つこと

### Shared Primitive / Shared Pattern

`packages/ui` は shared primitive / shared pattern の正本とする。

置いてよいもの:

- `Button`
- `LinkButton`
- `Tag`
- `SectionHeading`
- `Card`
- `Separator`
- `FormField`
- `Input`
- `Select`
- `Textarea`
- `DefinitionRow`

置かないもの:

- corporate-site の page section
- feature 固有の business wording を持つ component
- app-local data shape に依存する component
- page-level sample

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

### packages/ui

`packages/ui` Storybook は shared component catalog とする。

- shared component は default story を必須にする。
- variant / state がある component は同一 catalog に story を追加する。
- app 固有 component や page-level sample は載せない。

### app-local

app-local Storybook は feature-local Presentation component の review 入口とする。

- story は `<ComponentName>Presentation.stories.*` を基本にする。
- 固定 props / fixture で状態差分を表現する。
- Container は原則 story 対象にしない。
- 本番 secret、実送信、external API call を伴う story を作らない。

## Design Artifact との関係

`.pen` は design 正本、code / Storybook は実装正本である。

- `.pen` の page section は page 文脈を保持する。
- `.pen` の reusable component は `GenericComponents` / `CorporateSiteComponents` のように分類する。
- `GenericComponents` は `packages/ui` への shared component 候補。
- feature 固有 component は app-local Container / Presentation へ写像する。
- `.pen` と実装 component が 1:1 にならない場合は、spec / PR に分割・統合理由を残す。

## 参照

- [spec #6](../specs/6-storybook-component-catalog/index.md): Storybook / component catalog / Container-Presentation の決定経緯
- [architecture.md](architecture.md): package boundary / runtime boundary
- [engineering.md](engineering.md): Storybook quality gate / root task boundary
- [design-workflow.md](design-workflow.md): `.pen` と実装正本の境界
- [BCD Design](https://zenn.dev/misuken/articles/203b9dd3afbf1c)
- [Functional cohesion / colocation](https://zenn.dev/coji/articles/react-router-v7-functional-cohesion-colocation)
