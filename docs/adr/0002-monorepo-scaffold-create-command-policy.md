# ADR-0002: Monorepo の app の scaffold は公式の create command を優先し、Vite+ は見送る

## Status

ADR-0025 に置換

## Context

- Kufu Monorepo の Phase 1 foundation では、`apps/corporate-site`、`apps/base`、`packages/*`、root の workspace の設定を整備する。
- 既存の設計は `pnpm workspace` と `Turborepo` を基盤にし、app / package ごとの task を root の script から束ねる構成を採用している。
- app の scaffold の初期案には、`apps/corporate-site` と `apps/base` のディレクトリを作った後に `pnpm --filter ... add ...` で手動で構成する案もあった。
- `Astro` と `Vite` は公式の `create` command を持つ。
  - 初期の構成を正規の scaffold から始めたほうが、不要な差分や設定の抜けを減らせる。
- `Vite+` は monorepo / app / library を作成できる統合の toolchain である。
  - runtime、package manager、task の実行、build / check の導線まで含めて、project 全体の契約を再設計する影響が大きい。

## Decision

- `apps/corporate-site` の初期の scaffold は、`pnpm create astro@latest apps/corporate-site` を正とする。
- `apps/base` の初期の scaffold は、`pnpm create vite apps/base --template react-ts` を正とする。
- 生成した後に、package 名、root scripts、typecheck、E2E、shared config など、monorepo の contract へ寄せる調整を行う。
- Phase 1 foundation では `pnpm workspace` と `Turborepo` を継続して採用し、`Vite+` は導入しない。
- `Vite+` の採否は、将来 monorepo 全体の toolchain の契約を見直す専用の issue / spec で再検討する。

## Considered Options

| 選択肢                                                                                                      | 強み                                                                                                                                                                                        | 弱み                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** 公式の create command で scaffold し、`pnpm workspace` と `Turborepo` を継続して `Vite+` は見送る | 各 framework の標準の scaffold から開始できる。手動の構成より設定の抜けや初期の不整合を減らしやすい。`pnpm workspace` + `Turborepo` の foundation を保ったまま app の skeleton を整備できる | scaffold の後に monorepo の契約へ寄せる整理が必要になる。生成される初期ファイルの一部は、調整または削除が必要になる                                                                                                                                                                                                           |
| app を手動で scaffold する                                                                                  | 生成物を最小限に制御しやすい。余分な template file を最初から持ち込まずに済む                                                                                                               | 公式の scaffold が前提にしている標準の設定を取りこぼしやすい。Astro / Vite の更新への追従が手作業になりやすい。初期の設定の妥当性を毎回自分たちで判断し直す必要がある                                                                                                                                                         |
| Phase 1 foundation で `Vite+` を採用する                                                                    | app の生成、依存管理、check、build、task の実行を統一の toolchain へ寄せられる。将来 monorepo 全体の frontend の toolchain を一元化できる可能性がある                                       | `pnpm workspace` と `Turborepo` を前提にした現行の contract を大きく見直す必要がある。app の scaffold だけでなく、root の command contract まで同時に再設計することになる。Phase 1 foundation の論点を増やし、完了条件が不安定になる。現時点では alpha 段階のため、app の scaffold の都合だけで導入を決めるには影響範囲が広い |

## Consequences

### Positive

- `apps/corporate-site` と `apps/base` を、各 framework の標準の scaffold から開始できる。
- 手動の構成より、設定の抜けや初期の不整合を減らしやすい。
- Phase 1 foundation の主目的である `pnpm workspace` + `Turborepo` の foundation を保ったまま、app の skeleton を整備できる。

### Negative

- scaffold の後に、monorepo の契約へ寄せる整理が必要になる。
- 生成される初期ファイルの一部は、この repo の方針に合わせて調整または削除が必要になる。
- `Vite+` の採用の議論は、後続の issue に持ち越される。
