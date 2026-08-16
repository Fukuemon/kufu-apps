# Codebase Architecture

> 最終更新: 2026-08-07

Kufu Monorepo の package / runtime boundary と依存方向。全体像 (system landscape, モジュール責務) は [design/DesignDoc.md](../design/DesignDoc.md) を正本とし、本書はコードベースの境界規約を扱う。

## Package Boundary

- app から別 app の内部実装へ依存しない。
- app から `packages/config` など公開 package を経由して共有する。
- UI は app 内に置き、複数 consumer が揃った時点で `packages/ui` へ昇格する。
- 共通 utility は必要性が明確な場合だけ package 化する。

第一原則は feature / colocation。app や feature 内で閉じる UI・utility はローカルに置き、再利用が複数 app / feature にまたがって明確になった時点で `packages/*` の公開入口へ寄せる。

component のディレクトリ構成、BCD Design 基準の命名、Container / Presentation、Storybook 対象は [component-design.md](component-design.md) を正本とする。本書は package / runtime の境界を扱い、component 設計の詳細は重複させない。

```text
apps/corporate-site ─┐
apps/cms ─────┼─→ packages/ui ─→ packages/config
              └────────────────→ packages/config
```

- `apps/*` → `packages/*` (公開入口) のみ許可。
- `apps/* → apps/*` (app 間直接依存) は禁止。
- `packages/ui` → `packages/config` は許可。
- 循環依存・未宣言依存・devDependency 流入は禁止する。
  - 根拠: [engineering.md](engineering.md) — repository quality gate が検査する対象と実行経路

### App 内依存方向 (sections 公開面)

app 内の component 依存は次の一方向に固定する。ディレクトリ構成は component-design.md が正本である。

- 根拠: [ADR-0014](../adr/0014-corporate-site-sections-architecture.md) — sections の再編と公開面規約を定める

```text
pages → sections (index.ts) → common → @kufu/ui
```

- pages から section 内部ファイルへの直接 import は禁止 (各 section の `index.ts` 経由のみ許可)。pages 側は **ディレクトリ指定の named import** (`.../sections/hero`) で書き、明示 `index` path (`.../hero/index` / `.../hero/index.ts`) は書かない (形式を 1 つに固定して検査を単純に保つ)。
- section 間の import は index 経由でも禁止。共有が必要になった部品は `common/` (app 内) または `packages/ui` (複数 app) へ昇格する。
- `common/` から `sections/` への逆依存は禁止 (依存方向の下半分も検査対象)。
- 各 section の `index.ts` は Section component のみを再輸出する (公開面違反も検査対象)。
- 同 section 内 (story 含む) の直接参照は自由 (story の colocation を維持)。
- **検査手段**: dependency-cruiser と oxlint はいずれも `.astro` を解析対象にしないため、本境界は app 配下の独自スクリプト (`apps/corporate-site/scripts/check-section-boundary.mjs`) で検査する。`check-token-usage.mjs` (トークン直書きガード) と同方式で、ripgrep により import (静的 / 動的 / 再輸出) を走査する。検査は上記 4 点 (pages → 内部 / section 間 / common → sections / index.ts 公開面) を対象とし、対象拡張子・構文などの検査契約と既知の非検出範囲はスクリプトと fixture テストを正とする。dependency-cruiser は引き続き `.ts` / `.js` 層の package 境界・循環・未宣言依存を担当する。
- **gate 配線**: 検査は corporate-site の `lint` script に合流し、root `pnpm lint`・lefthook pre-commit・CI workflow の 3 経路で走る。pre-commit は `--no-verify` で素通しできるため、**必須 gate は CI である**。

### デザインシステム資産の正本と昇格境界

colocation 第一原則の適用を資産種別ごとに定める (本テーブルを正本とする。決定経緯: [ADR-0007](../adr/0007-design-token-architecture.md))。

| 資産種別                     | 正本                              | 昇格条件                                      |
| ---------------------------- | --------------------------------- | --------------------------------------------- |
| デザイントークン             | 常に `packages/ui` (`tokens.css`) | 昇格不要 (最初から正本。app 配下で定義しない) |
| フォント / shared stylesheet | 常に `packages/ui`                | 同上                                          |
| UI コンポーネント            | app 内 colocation                 | 複数 app / feature で再利用が明確になった時   |
| utility                      | app 内 colocation                 | 必要性が明確な場合のみ package 化             |

デザインシステム資産 (トークン / フォント / stylesheet) は colocation 原則の例外であり、最初から `packages/ui` を正本とする。UI コンポーネント / utility は従来の複数 consumer ルールに従う。

汎用性の高い component は shared component 候補として `packages/ui` に置き、shared catalog の Storybook に掲載する。corporate-site 固有 component は `apps/corporate-site` 内に colocation し、app-local Storybook で確認する。

## Runtime Boundary

- `apps/corporate-site` は静的配信を基本とし、`client:*` island は下記「shadcn 消費と React island の境界」の基準に従って限定する。
- React island は必要最小限とし、配信する JavaScript 量を抑える。
- 環境変数は build-time に閉じるものと runtime で参照するものを分けて扱う。

### shadcn 消費と React island の境界 (corporate-site)

Astro は React/shadcn コンポーネントもビルド時に静的 HTML へ描画し、`client:*` を付けない限りクライアント JS を出荷しない。コストが発生するのは island 化 (`client:*`) した時だけである。

- 根拠: [ADR-0008](../adr/0008-astro-react-island-policy.md) — React island 化の境界と shadcn の消費ポリシー。代替案の比較も含む

- **表示専用 UI** (Button-as-link / Card / Badge / Tag / section 等) は `@kufu/ui` の shadcn コンポーネントを `.astro` 内で **`client:*` なし**で使う (JS ゼロ)。`.astro` で再実装せず `@kufu/ui` を単一正本に保つ。
- **`@astrojs/react` は導入してよい** (island が無ければランタイムは出荷されない)。
- **`client:*` island はインタラクションに限定**: 問い合わせフォーム、Radix インタラクティブ primitive (Dialog / Dropdown / Popover / Tooltip / Accordion / Tabs / Select 等)。モバイルナビ開閉のように素の script で足りるものは `.astro` + 最小 script で実装し island 化しない。
- island の既定ディレクティブは `client:visible` / `client:idle`。`client:load` は above-the-fold で即時操作が要る時のみ。
- **ハードルール**: インタラクティブ Radix primitive を `client:*` なしで静的描画しない (見た目だけ出て動かないため必ず island 化)。
- `client:*` 総数は、design/DesignDoc.md の Why/What 節にあるガードレール「Unnecessary Client JS Count」で監視する。
- 秘密情報を client bundle に含めない。Cloudflare の secret 管理に置くべき値は repo に保存しない。
  - 根拠: [infrastructure.md](infrastructure.md) — secret の置き場と Infrastructure Contract
- 問い合わせフォームや外部 API 連携を追加する場合は、ブラウザから直接第三者 API を叩く構成を標準にせず、Workers を中継点にする (下記「Edge API / Error Contract」)。

### Edge API / Error Contract

Cloudflare Pages Functions / Workers で app 側 API を追加する場合の横断規約。具体 endpoint の request / response / error code 一覧は各 feature doc を正本とし、本節は実装方針の境界を定める。

- API は原則として同一オリジン配下に置く (`/api/*`)。ブラウザから第三者 API を直接叩く構成は標準にしない。
- secret / token / API key / 宛先などの秘匿値は Workers 側で参照し、client bundle・repo に含めない。
- client validation は UX のために行い、Workers 側で必ず再検証する。server は client の validation 結果を信頼しない。
- JSON API の成功 response は `{ "ok": true }`、失敗 response は `{ "ok": false, "code": string, "message"?: string, "errors"?: object }` を標準 envelope とする。
- client は `message` の文言ではなく `code` と HTTP status で分岐する。`errors` は field-level validation error のみに使う。
- bot 対策 / rate limit / Origin 検証などの security 判断は Workers 側に集約し、feature doc と infrastructure.md に反映する。

corporate-site 問い合わせフォームの concrete contract は [DesignDoc_corporate-site.md](../design/features/corporate-site/DesignDoc_corporate-site.md#問い合わせフォーム仕様) を正本とする。

## State Boundary (React app)

- URL は状態管理の一部として扱い、React app では TanStack Router の route state に寄せる。
- URL で表現できる状態を client state (Zustand など) でグローバルに持たない。
- server state / client state / URL state を分けて扱う (詳細な標準は [DesignDoc_cms.md](../design/features/cms/DesignDoc_cms.md))。
