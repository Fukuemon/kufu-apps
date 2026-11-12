# ADR-0021: corporate-site は shadcn を静的に描画して使い、client:\* の island は操作が要るものに限る

## Status

[ADR-0022](0022-corporate-site-island-policy.md) に置換

## Context

- `apps/corporate-site` は Astro の静的な生成（`output: "static"`）だけで作り、`@astrojs/react` を入れていなかった。
- `packages/ui` は shadcn/ui（React と Radix）を基盤に持つ。
  ADR-0017: [デザイントークンの 2 層と配る entry](0017-design-token-architecture.md)
- corporate-site の UI を作るにあたり、shadcn（React）を `.astro` でどう使うか、どこから `client:*`（React の island）にするかが決まっていなかった。
- Astro は React のコンポーネントも**ビルドのときに静的な HTML へ描画し**、`client:*` を付けない限りクライアントの JavaScript を一切配らない。
  性能のコストが生じるのは、`client:*` を付けて island にし、React のランタイムを配ってハイドレーションするときだけである。
  この点は誤解されやすい。
- 既存の方針は「React の island は必要な最小限にする」と定めていたが、shadcn の具体的な使い方は文書になっていなかった。
  - 定めていた文書は [codebase.md](../../context/codebase.md#react-island-の境界)、corporate-site の Design Doc、デザインの制作物の取り決め、禁止事項。
- モバイルのナビの開閉は、`.astro` と最小の script で、開閉、`aria-expanded`、Escape、選んだ後に閉じる動きを扱っている。

## Decision

1. **表示だけの UI は、shadcn（React）を静的に描画して直接使う。**
   - Button（リンクと送信）、Card、Badge、Tag、section のように、クライアントの状態を持たない UI は、`@kufu/ui` の shadcn のコンポーネントを `.astro` の中で **`client:*` なしで**使う。
   - ビルドのときに HTML になり、JavaScript は配らない。
   - `.astro` 版を別に作らず、コンポーネントの定義を `@kufu/ui` の 1 か所に保ち、二重の実装を避ける。
2. **`@astrojs/react` は入れてよい。**
   - integration を入れること自体には、ランタイムのコストがない。island がなければ JavaScript は配られない。
   - 最初の island が要る前でも、静的な描画のために入れてよい。
3. **`client:*` の island は、本当に操作が要るものに限る。**
   - island にするのは、問い合わせフォームと、Radix のインタラクティブな primitive（Dialog、DropdownMenu、Popover、Tooltip、Accordion、Tabs、Select など）だけにする。
   - **素の script で足りる開閉のトグルは island にしない。** モバイルのナビの開閉は island にせず、全ページに共通の header に React のランタイムを載せない。
4. **island のデフォルトのディレクティブは遅延の系統にする。**
   - `client:visible` か `client:idle` をデフォルトにする。
   - `client:load` は、above-the-fold で即時の操作が要る箇所だけで使う。
5. **インタラクティブな Radix の primitive を、`client:*` なしで静的に描画しない。**
   - 静的に描画すると、見た目だけが出て動かない。必ず island にする。
6. **`client:*` の総数を予算として管理する。**
   - [Design Doc](../design/DesignDoc.md) のガードレール「Unnecessary Client JS Count」で監視し、増えたときは island にした妥当性をレビューする。

## Considered Options

| 選択肢                                                                                        | 強み                                                                                                               | 弱み                                                                                                                                    |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** 表示だけの UI は shadcn を静的に描画し、`client:*` の island は操作が要るものに限る | 表示だけの UI が JavaScript なしで `@kufu/ui` を再利用でき、二重の実装が起きない。性能のコストが island に限られる | `@astrojs/react` の依存とビルドのときの React の SSR が加わる。インタラクティブな primitive を静的に描画する誤りが起こりうる            |
| `.astro` で shadcn のスタイルを作り直す（React を一切使わない）                               | クライアントの JavaScript がない点は同じ                                                                           | shadcn のコンポーネントと `.astro` 版の二重の実装が生まれ、`@kufu/ui` とずれる。トークンを二重に管理しない方針（ADR-0017）と一貫しない  |
| すべてを React の island（`client:load`）で作る                                               | 開発者の体験が単純                                                                                                 | 表示だけの UI にまで React のランタイムを配り、性能の予算を圧迫する。corporate-site の主な価値である高速な静的配信に反する              |
| `@astrojs/react` を入れず、Astro だけで完結させる                                             | 一見、性能の面で安全                                                                                               | shadcn のコンポーネントを corporate-site で再利用できず、二重の実装を強いる。静的な描画にランタイムのコストがない以上、過剰な制約である |

## Consequences

### Positive

- 表示だけの UI が JavaScript なしのまま、`@kufu/ui` を 1 か所の定義として再利用でき、二重の実装が起きない。
- 性能のコストが `client:*` の island に限られ、予算の管理の対象がはっきりする。
- 静的な React は island ではなく、禁止事項の対象外であることを文書にし、判断のぶれをなくす。

### Negative

- `@astrojs/react` の依存と、ビルドのときの React の SSR が加わる。ランタイムのコストはないが、ビルドはわずかに増える。
- インタラクティブな primitive を静的に描画する誤りが起こりうる。Decision の 5 で防ぐ。
- `client:*` を乱用する余地が増えるため、ガードレールでの監視が前提になる。
