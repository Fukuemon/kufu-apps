# ADR-0026: workspace の package はソースを export し、ビルドの成果物、project references、packages/config を持たない

## Status

提案

## Context

- `packages/ui` の `exports` は、すべて `src/` のファイルを指す。`build` の script は tsdown で `dist/` を作るが、`dist/` を読む利用者はリポジトリにない。
- `packages/ui` の `exports` には、`./components/*` のようなワイルドカードのエントリがある。
- `packages/config` は、`tsconfig`、`oxlint`、`vitest` の設定を export する。`vitest/base.ts` を読むために、Node.js 23.6 以上が要る。
- 型のチェックは、workspace ごとに実行する。corporate-site は `astro check`、packages は `tsc --noEmit` を使う。TypeScript の project references は入れていない。
- 手元では、3 つの workspace の型のチェックが 10 秒で終わる。
- `astro check` は、`tsc -b` と project references を使わない。
- buddy の `packages/ui` は、`src/` を export し、build の script を持たない。buddy に、設定を配る package はない。各 package が `tsconfig.json` を自分で持ち、lint と整形の設定はルートの `vite.config.ts` にある。project references は使っていない。
  - 出典: [buddy の packages/ui/package.json](https://github.com/Fukuemon/buddy/blob/c53390a6e64f4ef39d468dedd529425ae4aca0e5/packages/ui/package.json#L5-L16)
- lint と整形の設定をルートの `vite.config.ts` に移すと、`packages/config` に残るのは、3 つの `tsconfig` と 8 行の `vitest/base.ts` になる。
  - ADR-0025: [整形、lint、unit test を Vite+ で実行し、Turborepo を外す](0025-vite-plus-toolchain.md)
- `packages/ui` のコンポーネントとトークンは、デザインシステムの要求（#61）で作り直す。

## Decision

### 1. workspace の package は、ソースを export する

- `packages/*` は `"private": true` にし、`exports` で `src/` のファイルを指す。`dist/` を作らない。
- `packages/ui` の `build` の script と tsdown を削除する。
- 利用者（Astro、Storybook、Vitest）が、自分のバンドラーで package のソースを変換する。
- `dist/` の export に替えるのは、次のどれかが起きたときにする。
  - package をリポジトリの外に公開する。
  - バンドラーを通さずに package を読む利用者ができる。

### 2. app は、`exports` に名前で書いたエントリだけを import する

- `exports` にワイルドカードのエントリを足さない。
- エントリの一覧は `package.json` の `exports` を正とする。`packages/ui` のエントリをどう分けるかは、デザインシステムの設計で決める。

### 3. project references を入れない

- 型のチェックは、workspace ごとの `typecheck` の script で実行し、ルートは `pnpm -r typecheck` で束ねる。
- ソースを export する間は、型の宣言のファイルをビルドする順序がないので、project references が解く問題がない。
- 次のどれかが起きたら、入れるかを決め直す。
  - CI の型のチェックが 60 秒を超える。
  - `dist/` を export する package ができる。
- 入れるときは、`tsc` で確認する package に `composite` を付け、ルートの `tsconfig.json` に `references` を並べて、`tsc -b` で実行する。Astro の app は `astro check` のまま、references の外に置く。

### 4. packages/config を削除する

- 各 workspace が、`tsconfig.json` を自分で持つ。
- Vitest の設定は、各 workspace の設定のファイルに直接書く。
- lint と整形の設定は、ルートの `vite.config.ts` が持つ。

## Considered Options

| 選択肢                                                                                       | 強み                                                                                       | 弱み                                                                                                                                   |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** ソースを export し、ビルドの成果物、project references、packages/config を持たない | buddy と同じ形になる。ビルドの順序と、使われない `dist/` がなくなる。workspace が 1 つ減る | `tsconfig` の 15 行ほどが workspace ごとに重なる。利用者ごとに package のソースを変換し直す                                            |
| `dist/` を export し、利用者は成果物を読む                                                   | 利用者が package のソースを変換せずに済む。package の外に出ない型を隠せる                  | 変えるたびに build が要る。開発サーバーで package の変更がすぐに反映されない。ビルドの順序を管理することになる                         |
| ソースを export し、project references を入れる                                              | エディタと `tsc -b` が、変えた package だけを確認し直す                                    | `composite` と宣言のファイルの出力が要る。`astro check` は references を使わないので、app には当たらない。今の 10 秒を縮める必要がない |
| packages/config を、`tsconfig` だけを配る package として残す                                 | `tsconfig` の重なりがない                                                                  | 3 つのファイルのために workspace を 1 つ持つ。buddy と形が違う                                                                         |

## Consequences

### Positive

- `pnpm build` が、corporate-site の build だけになる。
- `.ts` の設定のファイルを package から読まなくなり、`context/tech-stack.md` の Node.js 23.6 以上という制約がなくなる。
- shared package を足すときに決めることが、`exports` のエントリの名前だけになる。

### Negative

- `tsconfig` の共通の設定を変えるときに、workspace の数だけファイルを直す。
- workspace が増えて型のチェックが遅くなったときに、project references を入れる作業が残る。
