# P1_01: packages/ui のデザイントークンを 2 層構造 + 3 entry へ再設計する

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- **完了条件のタスク化**: 作業開始前に「完了条件」セクションの各項目を todo として登録し、各ステップ完了時に状態を更新すること。タスク化せずに作業を開始することは禁止

## 作業ステップ (この順序で実行する)

### ステップ 0: ブランチ準備

ブランチ命名と base branch は `AGENTS.md` の `Spec Workflow Contract` および `workflow-git` に従う (`feature/13`)。

1. 最新の base branch (`develop`) を取得する
2. 作業ブランチ `feature/13` を使う (既存ならそのまま)
3. この prompt と P1_02 (corporate-site) は **同一 PR** で実施する。PR description に両 prompt の完了条件を転記する
4. Draft PR を作成して push する

### ステップ 1: fontsource 依存の追加

1. `packages/ui` に以下を依存追加する: `@fontsource-variable/noto-sans-jp`, `@fontsource-variable/noto-serif-jp`, `@fontsource-variable/geist-mono`
   - 追加コマンド: `pnpm --filter @kufu/ui add @fontsource-variable/noto-sans-jp @fontsource-variable/noto-serif-jp @fontsource-variable/geist-mono`
2. 既存の `@fontsource-variable/geist` は新フォント体系 (sans=Noto Sans JP) で不要になるため削除する: `pnpm --filter @kufu/ui remove @fontsource-variable/geist`
3. `## 検証コマンド` の `pnpm --filter @kufu/ui build` を実行する
4. diff レビュー (`spec-review` または repo 標準レビュー手段) を回し、指摘を対応する

### ステップ 2: tokens.css の新設 (CSS 変数の正本)

1. `packages/ui/src/styles/tokens.css` を新規作成し、`## 設計仕様` の「primitive 層」「semantic 層」「inverse スコープ」をその値どおりに定義する
2. shadcn デフォルトの未使用変数 (`--chart-*` / `--sidebar-*` / `--destructive` / `--accent` 系) は #10 で shadcn コンポーネント導入時に kufu パレットへ再設計するため、**本タスクではデフォルト値のまま温存する** (削除しない)
3. `## 検証コマンド` を実行する
4. diff レビューを回し、指摘を対応する

### ステップ 3: fonts.css の新設 (font-face 登録)

1. `packages/ui/src/styles/fonts.css` を新規作成し、fontsource の可変フォントを import する (`@fontsource-variable/noto-sans-jp` 等)。`font-display: swap` を効かせる
2. 各 `--font-*` トークンのフォールバックスタックは `## 設計仕様` の値に従う
3. `## 検証コマンド` を実行する
4. diff レビューを回し、指摘を対応する

### ステップ 4: globals.css (= styles.css エントリ) の再構成

1. `packages/ui/src/styles/globals.css` を、`tokens.css` + `fonts.css` を内包する全量エントリへ再構成する:
   - 先頭で `@import "./tokens.css";` と `@import "./fonts.css";` を行う
   - `shadcn/tailwind.css` / `tw-animate-css` の層は維持する
   - `@theme inline` のマッピングを新 semantic 変数に合わせて更新する (`--font-sans` 等)
2. 旧トークン (`--kufu-color-*` / `--kufu-radius-sm/md/lg` / `--kufu-font-body` / `--kufu-font-heading`) と `.kufu-theme` クラスを削除する
3. `## 検証コマンド` を実行する
4. diff レビューを回し、指摘を対応する

### ステップ 5: 旧 TS export の削除

1. 以下のファイルを削除する: `packages/ui/src/tokens/index.ts`, `packages/ui/src/theme/index.ts`, `packages/ui/src/fonts/index.ts` (旧 `--kufu-*` 変数を参照する死に export)
2. `packages/ui/package.json` の `exports` から `./tokens` / `./theme` / `./fonts` を削除し、`./tokens.css` / `./fonts.css` を追加する (`./styles.css` は維持)
3. これらを import している箇所が `packages/ui` 内に無いことを `## 検証コマンド` の `pnpm knip` で確認する
4. `## 検証コマンド` を実行する
5. diff レビューを回し、指摘を対応する

### ステップ最終: 最終確認

1. `## 検証コマンド` がすべてパスすることを確認する
2. P1_02 (corporate-site) を同一 PR で実施する (旧トークン削除により corporate-site のビルドが壊れるため、P1_02 まで完了して初めて `pnpm build` が通る)
3. spec の `## 上位資料からの変更点` に追記が必要なら `spec-track` に渡す
4. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/13-design-system-foundation/index.md`
- 参照する section: `## Content / Data 設計` (保存・管理するデータ / マッピング表)、`## Interface 設計` (stylesheet export 表)、`## Performance / Security 設計` (フォント読み込み)、`## 備考` (27 変数リスト)
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `packages/ui/src/styles/globals.css` (現行。再構成対象)
  - `packages/ui/src/styles/tokens.css` (新設)
  - `packages/ui/src/styles/fonts.css` (新設)
  - `packages/ui/src/tokens/index.ts` / `theme/index.ts` / `fonts/index.ts` (削除対象)
  - `packages/ui/package.json` (exports / dependencies 更新)
- 決定根拠: `adr/0007-design-token-architecture.md`

## 前提条件

- 完了しているべき phase / 依存 prompt: なし (P1 の起点)
- 完了後に着手可能になる後続 prompt: `P1_02_corporate-site_token_migration.md` (同一 PR で連続実施)
- 必要な repo 状態: `feature/13` ブランチ

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 特に: `## 設計仕様` の対応表に無い shadcn semantic 変数を新たに kufu パレットへ割り当てる判断が必要になった場合は停止して確認する (本タスクは対応表の 27 変数 + 派生 alpha トークンのみが対象。未使用 shadcn 変数は温存)
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 実装する範囲

- `packages/ui` のトークン再設計 (tokens.css / fonts.css 新設、globals.css 再構成)
- fontsource 依存の追加 / 旧フォント依存の削除
- 旧 `--kufu-*` トークン・`.kufu-theme`・旧 TS export (`./tokens` / `./theme` / `./fonts`) の削除
- `package.json` exports の更新 (`./tokens.css` / `./fonts.css` 追加)

### 実装しない範囲

- `apps/corporate-site` のコード変更 (→ P1_02)
- Pencil variables の rename / 再取り込み (→ P2、Pencil MCP 作業)
- shadcn コンポーネントの追加・実装 (→ #10)
- `@astrojs/react` の導入 (→ #10。ADR-0008)
- 未使用 shadcn 変数 (`--chart-*` / `--sidebar-*` / `--destructive` / `--accent`) の kufu パレット化 (→ #10)

## 設計仕様

spec `specs/13-design-system-foundation/index.md` から該当箇所を抜粋する。トークンは 2 層構造 (primitive = 値を持つ唯一の層 / semantic = primitive 参照のみ)。

### primitive 層 (`--kufu-<hue>-<scale>`)

| 変数              | 値        |
| ----------------- | --------- |
| `--kufu-white`    | `#FFFFFF` |
| `--kufu-gray-50`  | `#F7F8FA` |
| `--kufu-gray-100` | `#ECEFF3` |
| `--kufu-gray-200` | `#D7DEE6` |
| `--kufu-gray-300` | `#CBD2DA` |
| `--kufu-gray-500` | `#7C8694` |
| `--kufu-gray-600` | `#5B6472` |
| `--kufu-gray-800` | `#26323A` |
| `--kufu-gray-900` | `#1F2933` |
| `--kufu-gray-950` | `#111827` |
| `--kufu-teal-300` | `#7CC6B6` |
| `--kufu-teal-600` | `#006B6B` |
| `--kufu-teal-900` | `#0A3D4A` |

### semantic 層 (`:root` ライト面既定。primitive 参照)

| semantic 変数                                | 参照 / 値                                                   | 由来 (旧 `.pen`)        |
| -------------------------------------------- | ----------------------------------------------------------- | ----------------------- |
| `--background`                               | `--kufu-gray-50`                                            | `paper`                 |
| `--foreground`                               | `--kufu-gray-900`                                           | `ink`                   |
| `--muted` / `--secondary`                    | `--kufu-gray-100`                                           | `paper-soft`            |
| `--muted-foreground`                         | `--kufu-gray-600`                                           | `ink-soft`              |
| `--border` / `--input`                       | `--kufu-gray-300`                                           | `paper-line`            |
| `--card` / `--popover`                       | `--kufu-white`                                              | `card`                  |
| `--card-foreground` / `--popover-foreground` | `--kufu-gray-900`                                           | (本文と同じ)            |
| `--secondary-foreground`                     | `--kufu-gray-900`                                           | (ライト面)              |
| `--primary` / `--ring`                       | `--kufu-teal-600`                                           | `accent`                |
| `--primary-foreground`                       | `--kufu-white`                                              | (CTA 白文字)            |
| `--primary-soft`                             | `--kufu-teal-300`                                           | `accent-soft`           |
| `--card-overlay`                             | `color-mix(in srgb, var(--kufu-white) 90%, transparent)`    | `card-overlay`          |
| `--photo-overlay`                            | `color-mix(in srgb, var(--kufu-teal-900) 12%, transparent)` | `photo-tone`            |
| `--ghost-foreground`                         | `color-mix(in srgb, var(--kufu-gray-900) 5%, transparent)`  | `ink-ghost`             |
| `--radius`                                   | `0rem`                                                      | (`.pen` 実測で全面直角) |

- `accent-deep` (`#0A3D4A`) は canvas 直接使用なし。primitive `--kufu-teal-900` として保持し、semantic 名は与えない (`--photo-overlay` の基底)。
- `--font-sans` / `--font-serif` / `--font-mono` は fonts.css 側で family を、tokens.css 側でフォールバック付きスタックを定義する:
  - `--font-sans: "Noto Sans JP Variable", system-ui, sans-serif;`
  - `--font-serif: "Noto Serif JP Variable", "Hiragino Mincho ProN", serif;`
  - `--font-mono: "Geist Mono Variable", ui-monospace, monospace;`
  - (フォールバックの正確な family 名は fontsource パッケージの提供名に合わせる。判断に迷う場合は停止して確認)

### inverse スコープ (ダーク面 section。`.surface-inverse` で semantic を上書き)

`.dark` テーマではなくラッパー class で表現する。

| semantic 変数 (上書き)   | 参照              | 由来 (旧 `.pen`)                    |
| ------------------------ | ----------------- | ----------------------------------- |
| `--background`           | `--kufu-gray-950` | `ink-deep`                          |
| `--foreground`           | `--kufu-white`    | `ink-inverse`                       |
| `--secondary-foreground` | `--kufu-gray-200` | `ink-inverse-soft`                  |
| `--muted-foreground`     | `--kufu-gray-500` | `ink-inverse-muted`                 |
| `--border`               | `--kufu-gray-800` | `ink-panel` + `line-inverse` (統合) |

- 旧 `ink-panel` `#26323A` と `line-inverse` `#2A3642` は近似値かつ両方ボーダー用途のため `--kufu-gray-800` に統合する。

### 3 entry 構成 (Interface 設計)

| export 経路           | 内容                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `@kufu/ui/tokens.css` | primitive + semantic CSS 変数のみ                                                                          |
| `@kufu/ui/fonts.css`  | fontsource import (font-face 登録)                                                                         |
| `@kufu/ui/styles.css` | tokens + fonts + Tailwind theme + shadcn 層の全量 (= globals.css。内部で tokens.css / fonts.css を import) |

### フォント読み込み (Performance 設計)

- `@fontsource-variable/*` の可変フォントを使い、日本語サブセット (fontsource の unicode-range 分割) をそのまま利用する
- `font-display: swap` を採用する
- preload 対象の選定・Lighthouse 実測は #10 (本タスク対象外)

## テスト観点

spec `## テスト / 評価方針` から:

- `pnpm build` / `pnpm lint` / `pnpm typecheck` が `packages/ui` 変更後も通ること (corporate-site のビルドは P1_02 完了後に通る)
- 実装コードに raw hex / arbitrary value が残っていないこと (トークン参照に寄せる)
- 計測指標: トークンガード違反 (raw hex 直書き) 検出件数 = 0

## 検証コマンド

- `pnpm --filter @kufu/ui build`
- `pnpm --filter @kufu/ui lint`
- `pnpm --filter @kufu/ui typecheck`
- `pnpm format:check`
- `pnpm knip`
- `pnpm depcruise`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] fontsource 依存を追加し、旧 `@fontsource-variable/geist` を削除した
- [ ] `tokens.css` を新設し primitive / semantic / inverse スコープを設計仕様どおり定義した
- [ ] `fonts.css` を新設し fontsource import + `font-display: swap` を設定した
- [ ] `globals.css` を `tokens.css` + `fonts.css` を内包する全量エントリへ再構成し、`@theme inline` を更新した
- [ ] 旧 `--kufu-*` トークン・`.kufu-theme`・旧 TS export 3 系統を削除し、`package.json` exports を更新した
- [ ] `## 検証コマンド` のうち `pnpm --filter @kufu/ui build` / `lint` / `typecheck` / `knip` / `depcruise` / `format:check` がパスする
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] P1_02 を同一 PR で実施する段取りを整えた
- [ ] 未解決の仕様質問が残っていない
