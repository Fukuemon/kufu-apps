# ADR-0002: Monorepo app scaffold は公式 create command を優先し Vite+ は見送る

## 状態

承認

## 決定日

2026-05-08

## 背景

- issue #3 では Kufu Monorepo の Phase 1 foundation として、`apps/corporate-site`、`apps/base`、`packages/*`、root workspace 設定を整備する。
- 既存の設計では `pnpm workspace` と `Turborepo` を基盤にし、app / package ごとの task を root script から束ねる構成を採用している。
- app scaffold の初期案では、`apps/corporate-site` と `apps/base` を directory 作成後に `pnpm --filter ... add ...` で手動構成する案もあった。
- 一方で `Astro` と `Vite` は公式の `create` command を持っており、初期構成を正規の scaffold から始めたほうが不要な差分や設定漏れを減らせる。
- `Vite+` は monorepo / app / library を作成できる統合 toolchain だが、runtime、package manager、task 実行、build / check 導線まで含めて project 全体の契約を再設計する影響が大きい。

## 決定

- `apps/corporate-site` の初期 scaffold は `pnpm create astro@latest apps/corporate-site` を正とする。
- `apps/base` の初期 scaffold は `pnpm create vite apps/base --template react-ts` を正とする。
- 生成後に、package 名、root scripts、typecheck、E2E、shared config など monorepo の contract へ寄せる調整を行う。
- issue #3 では `pnpm workspace` と `Turborepo` を継続採用し、`Vite+` は導入しない。
- `Vite+` の採否は、将来 monorepo 全体の toolchain 契約を見直す専用 issue / spec で再検討する。

## 代替案

### 1. app を手動で scaffold する

#### Pros

- 生成物を最小限に制御しやすい。
- 余分な template file を最初から持ち込まずに済む。

#### Cons

- 公式 scaffold が前提にしている標準設定を取りこぼしやすい。
- Astro / Vite の更新追従が手作業になりやすい。
- 初期設定の妥当性を毎回自分たちで再判断する必要がある。

### 2. Vite+ を issue #3 で採用する

#### Pros

- app 生成、依存管理、check、build、task 実行を統一 toolchain へ寄せられる。
- 将来的に monorepo 全体の frontend toolchain を一元化できる可能性がある。

#### Cons

- `pnpm workspace` と `Turborepo` を前提にした現行 contract を大きく見直す必要がある。
- app scaffold だけでなく root command contract まで同時に再設計することになる。
- Phase 1 foundation の論点を増やし、issue #3 の完了条件が不安定になる。
- 現時点では alpha 段階のため、導入判断を app scaffold の都合だけで決めるには影響範囲が広い。

## 影響

### 良い影響

- `apps/corporate-site` と `apps/base` を各 framework の標準 scaffold から開始できる。
- 手動構成より設定漏れや初期不整合を減らしやすい。
- issue #3 の主目的である `pnpm workspace` + `Turborepo` foundation を保ったまま app skeleton を整備できる。

### 悪い影響 / トレードオフ

- scaffold 後に monorepo 契約へ寄せるための整理が必要になる。
- 生成される初期ファイルの一部は、この repo の方針に合わせて調整または削除が必要になる。
- `Vite+` 採用の議論は後続 issue に持ち越される。

## 実装・運用への反映

- 対象 app / package: `apps/corporate-site`、`apps/base`、root workspace scripts、spec prompt
- spec 更新要否: 要。app scaffold の install / setup 方針を `create` command ベースへ更新する
- AI 向け設定更新要否: 不要。repo 全体の基盤方針は `pnpm workspace` + `Turborepo` のまま

## 関連ドキュメント

- `design/DesignDoc.md`: Phase 1 foundation の範囲 (Why/What 節)、monorepo 構成と toolchain 方針
- `specs/3-monorepo-foundation/index.md`: issue #3 の詳細設計
- `specs/3-monorepo-foundation/prompts/`: 実装 prompt 群
