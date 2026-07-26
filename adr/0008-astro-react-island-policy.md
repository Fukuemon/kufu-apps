# ADR-0008: corporate-site の shadcn 消費は静的描画を既定とし、client:\* island はインタラクションに限定する

## 状態

承認

## 決定日

2026-06-13

## 背景

- `apps/corporate-site` は純 Astro 静的 (`output: "static"`) で、現状 `@astrojs/react` を導入していない。一方 `packages/ui` は shadcn/ui (React + Radix) を基盤に持つ ([ADR-0007](0007-design-token-architecture.md))。
- corporate-site の UI を実装するにあたり、「shadcn(React) を `.astro` でどう消費するか」「どこから `client:*` (React island) にするか」が未確定だった。
- 誤解されやすい点: Astro は React コンポーネントも **ビルド時に静的 HTML へ描画**し、`client:*` を付けない限りクライアント JS を一切出荷しない。パフォーマンスコストが発生するのは `client:*` を付けて island 化 (React ランタイム出荷 + ハイドレーション) した時だけである。
- 既存方針 ([context/architecture.md](../context/architecture.md) Runtime Boundary、[feature doc](../design/features/corporate-site/DesignDoc_corporate-site.md)、[design-workflow §3 Phase C](../context/design-workflow.md)、CLAUDE.md 禁止事項) は「React island は必要最小限」を定めるが、shadcn の具体的な消費パターンは明文化されていなかった。

## 決定

1. **表示専用 UI は shadcn(React) を静的描画で直接使う**: Button (link/submit) / Card / Badge / Tag / section 等、クライアント状態を持たない UI は `@kufu/ui` の shadcn コンポーネントを `.astro` 内で **`client:*` なし**で使う。ビルド時に HTML へ焼かれ JS はゼロ。`.astro` 版を別実装せず `@kufu/ui` を単一コンポーネント正本に保つ (二重実装の回避)。
2. **`@astrojs/react` は導入してよい**: integration の導入自体はランタイムコストを持たない (island が無ければ JS は出荷されない)。最初の島が必要になる前でも、静的描画のために導入してよい。
3. **`client:*` island は本物のインタラクションに限定する**: モバイルナビ開閉、問い合わせフォーム (#14)、および Radix のインタラクティブ primitive (Dialog / DropdownMenu / Popover / Tooltip / Accordion / Tabs / Select 等) のみ island 化する (改訂あり: 下記 `## 更新`)。
4. **island の既定ディレクティブは遅延系**: `client:visible` または `client:idle` を既定とし、above-the-fold で即時操作が必要な箇所のみ `client:load` を使う。
5. **ハードルール (正しさ)**: インタラクティブ Radix primitive を `client:*` なしで静的描画しない。静的描画では見た目だけ出て動作しないため、必ず island 化する。
6. **予算管理**: `client:*` の総数を [Design Doc](../design/DesignDoc.md) のガードレール「Unnecessary Client JS Count」で監視し、増加時は island 化の妥当性をレビューする。

## 代替案

- **`.astro` で shadcn スタイルを再実装 (React を一切使わない)**: client JS ゼロは同じだが、shadcn コンポーネントと `.astro` 版の二重実装線が生まれ、`@kufu/ui` 正本と drift する。トークンを二重管理しない方針 ([ADR-0007](0007-design-token-architecture.md)) と一貫しないため不採用。
- **すべて React island (`client:load`) で実装**: DX は単純だが、表示専用 UI にまで React ランタイムを出荷し性能予算を圧迫する。corporate-site の主価値 (高速静的配信) に反するため不採用。
- **`@astrojs/react` を入れず Astro 完結に固執**: 一見性能に安全だが、shadcn 正本を corporate-site で再利用できず二重実装を強いる。静的描画にランタイムコストが無い以上、過剰な制約のため不採用。

## 影響

### 良い影響

- 表示専用 UI が JS ゼロのまま `@kufu/ui` を単一正本として再利用でき、二重実装が起きない。
- パフォーマンスコストが `client:*` island に局所化され、予算管理の対象が明確になる。
- 「静的 React は island ではない = 禁止事項の対象外」を明文化し、判断のぶれを無くす。

### 悪い影響 / トレードオフ

- `@astrojs/react` 依存とビルド時 React SSR が加わる (ランタイムコストは無いがビルドはわずかに増える)。
- インタラクティブ primitive の静的描画という footgun が残る (ハードルール #5 で防ぐ)。
- `client:*` の濫用余地が増えるため、ガードレール監視 (#6) が前提になる。

### 影響範囲

- `apps/corporate-site` への影響: `@astrojs/react` 導入、表示専用は静的描画、island は遅延ディレクティブ既定 (実装は #10 / フォームは #14)
- `packages/ui` への影響: shadcn コンポーネントが Astro 静的描画でも成立すること (SSR セーフ) を前提に整備する
- `e2e` への影響: island の主要導線 (問い合わせフォーム) と、script で動く導線 (モバイルナビ開閉) を検証対象にする (#10 / #14 で検討)

## 関連チケット / PR

- issue #10 (corporate-site 本体実装。本ポリシーを適用)
- issue #14 (問い合わせフォーム。最初の主要 island)
- issue #6 (Storybook。shadcn コンポーネント整備)
- [ADR-0007](0007-design-token-architecture.md) (デザイントークン体系。二重管理回避の方針を共有)
- [context/architecture.md](../context/architecture.md) Runtime Boundary (本 ADR を参照)

## 更新

### 2026-07-26: モバイルナビ開閉を island の例から除外 (issue #31)

- **背景**: 決定 3 はモバイルナビ開閉を island 化の代表例として挙げていたが、実装 (`apps/corporate-site/src/components/common/SiteHeader.astro`) は `.astro` + 最小 script で開閉・`aria-expanded`・Escape・選択後 close を扱っており、記述と実態が食い違っていた。
- **決定**: **素の script で足りる開閉トグルは island 化しない**。決定 3 の島の例からモバイルナビ開閉を外し、全ページ共通 header に React ランタイムを載せない。
- **影響**: 決定 3 の island 対象は問い合わせフォームと Radix インタラクティブ primitive に限られる。`context/architecture.md` の「shadcn 消費と React island の境界」も同じ基準に揃えた。
