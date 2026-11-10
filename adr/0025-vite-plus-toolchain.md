# ADR-0025: 整形、lint、unit test を Vite+ で実行し、Turborepo を外す

## Status

提案

## Context

- ツールチェーンは、Turborepo、oxlint、oxfmt、tsc、Vitest を個別に入れている。Vite+ は入れないと決めていた。
  - ADR-0002: [Monorepo の app の scaffold は公式の create command を優先し、Vite+ は見送る](0002-monorepo-scaffold-create-command-policy.md)
- buddy は、Vite+（`vp`）で整形、lint、Vitest を実行する。設定はルートの `vite.config.ts` に置く。Turborepo は使わず、CI は `pnpm -r check`、`pnpm -r typecheck`、`pnpm -r test` を実行する。
  - 出典: [buddy の context/tech-stack.md](https://github.com/Fukuemon/buddy/blob/c53390a6e64f4ef39d468dedd529425ae4aca0e5/context/tech-stack.md)
  - 出典: [buddy の .github/workflows/ci.yml](https://github.com/Fukuemon/buddy/blob/c53390a6e64f4ef39d468dedd529425ae4aca0e5/.github/workflows/ci.yml#L65-L75)
- fukuemon.dev は、Vite+ を build のキャッシュだけに使っている。lint と整形を `vp lint` と `vp fmt` に替えることを、運営者が決めている。替えた後の ADR は書かれていない。
  - 出典: [fukuemon.dev の ADR-0017](https://github.com/Fukuemon/fukuemon.dev/blob/739871f460b490cc9e1361435d4382c739bdddc6/adr/0017-vp-run-cache-for-web-build.md)
- vite-plus 1.4.0 は、Vite 8.3.5、Vitest 5.0.5、oxlint 1.89.0、oxfmt 0.74.0 を同梱する。buddy と fukuemon.dev は、`pnpm-workspace.yaml` の catalog で `vite` を `@voidzero-dev/vite-plus-core` に置き換える。
- Astro 6.4.8 は `vite ^7.3.2` に、Astro 7.4.8 は `vite ^8.3.6` に依存する。このリポジトリは、Astro 6 のために `vite` を `^7` に固定している。
- `@storybook/addon-vitest` 10.5.9 の peer は `vitest ^3.0.0 || ^4.0.0` で、Vitest 5 を含まない。buddy は 10.6.3 を使う。
- `@astrojs/check` 0.9.12 の peer は `typescript ^5.0.0 || ^6.0.0` で、TypeScript 7 では `astro check` が動かない。
- Turborepo の remote cache は無効で、workspace は 3 つである。手元では、キャッシュなしの `pnpm build` が 30 秒、`pnpm typecheck` が 10 秒で終わる。
- Vite+ の `vp dev` と `vp build` は、Astro を外から動かせない。
  - 出典: [fukuemon.dev の ADR-0003](https://github.com/Fukuemon/fukuemon.dev/blob/739871f460b490cc9e1361435d4382c739bdddc6/adr/0003-monorepo-and-vite-plus.md)

## Decision

### 1. 整形、lint、unit test を Vite+ で実行する

- `pnpm-workspace.yaml` の catalog に `vite-plus` を置き、`vite` を `@voidzero-dev/vite-plus-core` に置き換える。バージョンは buddy と同じにする。
- 整形と lint の設定を、ルートの `vite.config.ts` の `fmt` と `lint` に置く。`.oxfmtrc.json`、`apps/corporate-site/.oxlintrc.json`、`packages/config/oxlint/` を削除する。
- unit test と Storybook のテストは `vp test run` で実行する。
- `oxlint`、`oxfmt`、`oxlint-tsgolint` を devDependencies から外す。`vitest` は、Vitest を使う workspace の devDependencies に、vite-plus が同梱するバージョンで宣言する。
  - 宣言しないと、Storybook のテストが `vitest` を解決できない。
- 整形の規則（80 桁、二重引用符、セミコロンあり）は変えない。

### 2. Turborepo を外し、ルートのコマンドを buddy に合わせる

- 各 workspace は、`check`（`vp check` と、その workspace だけのチェック）、`typecheck`、`test`、`build` の script を持つ。
- ルートのコマンドは、`pnpm check`、`pnpm typecheck`、`pnpm test`、`pnpm build` にする。workspace のタスクは `pnpm -r` で束ねる。
- タスクのキャッシュは持たない。workspace が 3 つで、キャッシュで縮む時間が小さいためである。
  - build の時間が問題になったら、fukuemon.dev の ADR-0017 と同じく、build だけを `vp run` のキャッシュに載せる。

### 3. Astro の開発サーバーと build は、Astro の CLI で実行する

- `astro dev`、`astro build`、`astro check` は変えない。
- Astro を 7 に上げ、`vite` を `^7` に固定する overrides を外す。

### 4. Storybook を 10.6.3 に上げる

- `@storybook/addon-vitest` が Vitest 5 を受け入れるバージョンにする。

### 5. 変えないもの

- Node.js と apm のバージョンは `mise.toml` で、pnpm のバージョンは `packageManager` で固定する。`vp env` と `vp install` は使わない。
- TypeScript は 6 のままにする。7 に上げるのは、`astro check` が TypeScript 7 で動くようになったときにする。
- knip、dependency-cruiser、`check-section-boundary.mjs`、`check-token-usage.mjs`、textlint、lefthook、commitlint は変えない。
- app の最初の scaffold は、公式の `create` のコマンドを優先する。ADR-0002 のこの判断は引き継ぐ。

この決定は、ADR-0002 を置き換える。

## 承認の条件

- Astro を 7 に上げた後に、route の VRT と story の VRT を CI で流し、差分がないことを確認する。
  - 差分が出たときは、運営者が画面を見て baseline を撮り直すかを決める。

## Verification

2026-11-10 に、develop の 0f4ecf6 の worktree で、Astro 7.4.8、vite-plus 1.4.0、Storybook 10.6.3 に差し替えて確認した。macOS の手元の結果で、CI の Linux では確認していない。

- `astro build` は通った。出力のファイルは 277 で、差し替える前と同じ数だった。
  - 3 つのページの HTML は、要素の間の空白の詰め方が変わった。文言と class は変わっていない。
- `astro check` は、エラー 0、警告 0 で通った。
- ルートで `vp lint` を流すと、108 ファイルを 2.5 秒で確認した。今の lint が見ていない `scripts/vrt-container.mjs` に、使っていない import を 1 件見つけた。
- `vp fmt --check` は、今の整形の規則のままで、追跡しているコードに差分を出さなかった。
- `apps/corporate-site` の unit test は、`vp test run`（Vitest 5.0.5）で 4 件が通った。
- `packages/ui` の Storybook のテストは、`vp test run` で 47 件が通り、story の画像を 47 枚撮った。
  - `packages/ui` に `vitest` を宣言しないと、`vitest` の `./internal/traces` を解決できずに止まった。
- route の VRT と、corporate-site の story の VRT（`@storybook/test-runner`）は、確認していない。
  - `pnpm vrt:route` は、worktree では、コンテナの中の `pnpm install` が `lefthook install` で失敗して止まった。Astro のバージョンとは関係がない。

## Considered Options

| 選択肢                                                                                                              | 強み                                                                                                                                               | 弱み                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **採用:** 整形、lint、unit test を Vite+ で実行し、Turborepo を外す                                                 | buddy と同じコマンドと設定の場所になる。oxlint、oxfmt、Vitest のバージョンを vite-plus の 1 つで上げられる。ルートのスクリプトも lint の対象になる | Astro を 7 に、Storybook を 10.6.3 に、Vitest を 5 に上げることになる。route と story の VRT に差分が出るかは未確認である |
| Vite+ を build のキャッシュだけに使い、lint、整形、test は今のツールを直接実行する（fukuemon.dev の ADR-0017 の形） | Vitest と Storybook を上げずに済む                                                                                                                 | buddy とコマンドがそろわない。fukuemon.dev もこの形をやめる。Astro の build は 9 秒で、キャッシュで縮む時間が小さい       |
| 今のまま、Turborepo、oxlint、oxfmt、Vitest を使う                                                                   | 何も上げずに済み、VRT に差分が出ない                                                                                                               | buddy とコマンドと設定の場所がそろわない。要求の受け入れ条件を満たさない                                                  |
| Vite+ を入れ、Turborepo も残す                                                                                      | 2 回目からの build と typecheck が速い                                                                                                             | タスクを束ねるツールが buddy と違う。`vp run` と役割が重なる                                                              |

## Consequences

### Positive

- 3 つのリポジトリで、`pnpm check`、`pnpm typecheck`、`pnpm test` が同じ意味になる。
- lint と整形の設定が、ルートの `vite.config.ts` の 1 か所になる。
- `vite` の overrides と、Astro が Vite 8 に対応するまでという `context/tech-stack.md` の制約がなくなる。

### Negative

- Vite+ は beta で、互換性のない変更に追従する手間が残る。
- vite-plus を上げると、同梱の Vitest、oxlint、oxfmt も一緒に上がる。
- 2 回目からのタスクが、キャッシュで速くならない。
- Astro、Storybook、Vitest のメジャーバージョンとマイナーバージョンを、同じ要求の中で上げる。
