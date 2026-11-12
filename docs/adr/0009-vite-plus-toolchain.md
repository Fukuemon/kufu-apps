# ADR-0009: 整形、lint、unit test を Vite+ で実行し、Turborepo を外す

## Status

承認

## Context

- ツールチェーンは、Turborepo、oxlint、oxfmt、tsc、Vitest を個別に入れている。Vite+ は入れないと決めていた。
  - ADR-0008: [Monorepo の app の scaffold は公式の create command を優先し、Vite+ は見送る](0008-monorepo-scaffold-create-command-policy.md)
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
- 型を使う lint の規則は、`lint.options.typeAware` で続ける。
- unit test と Storybook のテストは `vp test run` で実行する。
  - `packages/ui` の Storybook のテストは、`vrt:capture` の script のまま、コマンドだけを替える。ブラウザが要るので、`test` の script にしない。
- `oxlint`、`oxfmt`、`oxlint-tsgolint` を devDependencies から外す。`vitest` は、Vitest を使う workspace の devDependencies に、vite-plus が同梱するバージョンで宣言する。
  - 手元の試行では、別のバージョンの `vitest` が上位のディレクトリにあると、Storybook のテストがそれを解決して止まった。宣言が要るかは、実装で確認する。
- 整形の規則（80 桁、二重引用符、セミコロンあり）は変えない。
  - buddy は単引用符とセミコロンなしにしている。合わせると全てのファイルに差分が出るので、合わせない。
- lefthook の pre-commit は、ステージしたファイルを整形して staging に戻す動きを保つ。整形のコマンドを `vp fmt` に、lint のコマンドを `pnpm check` に替える。

### 2. Turborepo を外し、ルートのコマンドを buddy に合わせる

- ルートのコマンドは、`pnpm check`、`pnpm typecheck`、`pnpm test`、`pnpm build` にする。
  - `pnpm check` は、ルートの `vp check` でリポジトリの全体を整形と lint で確認し、続けて `pnpm -r check` を実行する。
  - `pnpm typecheck` は、ルートの `tsc` と `pnpm -r typecheck` を実行する。`pnpm test` と `pnpm build` は、`pnpm -r` で workspace の同じ名前の script を実行する。
  - 整形と lint の自動の修正は、`pnpm check:fix`（`vp check --fix`）で実行する。
- workspace は、自分に要る script だけを持つ。`check` は、その workspace だけのチェックがある workspace が持つ。
  - buddy は workspace ごとに `vp check` を実行する。このリポジトリは、ルートのスクリプトと `e2e/` も確認するために、ルートで 1 回実行する。
- タスクのキャッシュは持たない。workspace が 3 つで、キャッシュで縮む時間が小さいためである。
  - build の時間が問題になったら、fukuemon.dev の ADR-0017 と同じく、build だけを `vp run` のキャッシュに載せる。
  - Turbo の remote cache を入れるかの判断は、対象がなくなる。
    - ADR-0016: [CI とローカルのフックの役割を分ける](0016-ci-local-hook-responsibility.md)

### 3. Astro の開発サーバーと build は、Astro の CLI で実行する

- `astro dev`、`astro build`、`astro check` は変えない。
- Astro を 7 に上げ、`vite` を `^7` に固定する overrides を外す。
- Astro 7.4.8 は Node.js 22.23.4 以上を求める。Node.js を 22.12.0 に固定しているワークフローは、24 に上げる。

### 4. Storybook を 10.6.3 に上げる

- `@storybook/addon-vitest` が Vitest 5 を受け入れるバージョンにする。

### 5. 変えないもの

- Node.js と apm のバージョンは `mise.toml` で、pnpm のバージョンは `packageManager` で固定する。`vp env` と `vp install` は使わない。
  - buddy は pnpm のバージョンを `mise.toml` にも書く。2 か所に書くと片方だけを上げる誤りが起きるので、合わせない。
- TypeScript は 6 のままにする。7 に上げるのは、`astro check` が TypeScript 7 で動くようになったときにする。
- knip、dependency-cruiser、`check-section-boundary.mjs`、`check-token-usage.mjs`、textlint、commitlint は変えない。
  - buddy は knip と dependency-cruiser を使っていない。外す理由がないので、残す。

### 6. app の最初の scaffold は、公式の create のコマンドを優先する

ADR-0008 の scaffold の判断を、変えずに引き継ぐ。

- `apps/corporate-site` の初期の scaffold は、`pnpm create astro@latest apps/corporate-site` を正とする。
- React の app の初期の scaffold は、`pnpm create vite ... --template react-ts` を正とする。
- 生成した後に、package 名、ルートの script、typecheck、E2E、共有の設定を、monorepo の取り決めに合わせる。

### 7. Astro を上げた後の VRT の差分は、運営者が画面を見て決める

- Astro を 7 に上げる pull request で、route の VRT と story の VRT を CI で流す。
- 差分が出たら、HTML の空白を Astro 6 と同じにする設定で、差分が消えるかを確認する。
- 設定で消えない差分は、運営者が画面を見て、baseline を撮り直すかを決める。

この決定は、ADR-0008 を置き換える。

## Verification

2026-11-10 に、develop の 0f4ecf6 の worktree で、Astro 7.4.8、vite-plus 1.4.0、Storybook 10.6.3 に差し替えて確認した。macOS の手元の結果で、CI の Linux では確認していない。  
3 つを同時に差し替えた状態で確認した。Astro だけを上げた状態は確認していない。

- `astro build` は通った。出力のファイルは 277 で、差し替える前と同じ数だった。
  - 3 つのページの HTML は、要素の間の空白の詰め方が変わった。文言と class は変わっていない。
- `astro check` は、エラー 0、警告 0 で通った。
- ルートで `vp lint` を流すと、108 ファイルを 2.5 秒で確認した。今の lint が見ていない `scripts/vrt-container.mjs` に、使っていない import を 1 件見つけた。
  - `lint.options.typeAware` を有効にして流し、エラーなく終わった。型を使う規則が誤りを出すことは、確認していない。
- `vp fmt --check` は、今の整形の規則のままで、追跡しているコードに差分を出さなかった。Markdown は対象から外して流したので、確認していない。
- `apps/corporate-site` の unit test は、`vp test run`（Vitest 5.0.5）で 4 件が通った。
- `packages/ui` の Storybook のテストは、`vp test run` で 47 件が通り、story の画像を 47 枚撮った。
  - `packages/ui` に `vitest` を宣言する前は、上位のディレクトリの Vitest 4 を解決し、`./internal/traces` が見つからずに止まった。worktree が元のチェックアウトの中にあるために起きた可能性がある。
- route の VRT、corporate-site の Storybook の build、corporate-site の story の VRT（`@storybook/test-runner`）は、確認していない。
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
