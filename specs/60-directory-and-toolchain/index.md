---
type: spec
title: ディレクトリ構成とツールチェーンを buddy と fukuemon.dev にそろえる
description: 文書の置き場、ツールチェーン、workspace の package の契約を buddy に合わせる要求の、論点、目指す形、Design Doc の変更の案、実装のタスクの分け方
status: draft
---

# ディレクトリ構成とツールチェーンを buddy と fukuemon.dev にそろえる

## Requirements

要求は [issue 60](https://github.com/Fukuemon/kufu-apps/issues/60) にある。  
子の issue は、shared package の公開の契約（[issue 8](https://github.com/Fukuemon/kufu-apps/issues/8)）と、workspace の型の契約（[issue 9](https://github.com/Fukuemon/kufu-apps/issues/9)）の 2 つ。

## Non-Goals

次のものは、ほかの要求が決める。この spec は、置き場の名前だけを前提にする。

- `packages/ui` の中の構成、トークン、コンポーネント、`exports` のエントリの分け方（デザインシステムの要求）
- `e2e/` の置き場と層、Playwright のバージョン（e2e と検証の要求）
- `apps/docs-site` と、ドキュメントサイトが `docs/` のどれを公開するか（docs-site の要求）
- `infra/` と配信の基盤（基盤の要求）
- 整形の規則を buddy に合わせること（単引用符、セミコロンなし）

## Acceptance Criteria

issue 60 の受け入れ条件を使う。

## Open Points

どの論点も、運営者が決める。ADR は提案のままにしている。

### 論点 1: Turborepo、oxlint、oxfmt を Vite+ に置き換えるか

| 案        | 内容                                                                                                                 | 強み                                   | 弱み                                                                                    |
| --------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------- |
| A（推奨） | 整形、lint、unit test を Vite+ で実行し、Turborepo を外す。Astro の開発サーバーと build は Astro の CLI のままにする | buddy と同じコマンドと設定の場所になる | Astro を 7 に、Storybook を 10.6.3 に、Vitest を 5 に上げる。VRT に差分が出るかは未確認 |
| B         | Vite+ を build のキャッシュだけに使う（fukuemon.dev の今の形）                                                       | Vitest と Storybook を上げずに済む     | buddy とコマンドがそろわない。fukuemon.dev もこの形をやめる                             |
| C         | 今のツールのままにする                                                                                               | 何も上げない                           | 受け入れ条件「buddy と同じコマンド」を満たさない                                        |

- 推奨の理由: 手本の 2 つが同じ向きに進んでいる。手元の試行で、build、`astro check`、`vp lint`、`vp fmt`、`vp test` が動いた。
- 案 A を採ると決まるもの: Astro 7 への更新。Astro 6 は Vite 7 に、vite-plus は Vite 8 に依存するためである。
- 詳細と試行の結果は、ADR-0025 の下書きにある。

### 論点 2: `specs/` の置き場を buddy に合わせるか

| 案        | 内容                                               | 強み                                                                                        | 弱み                                               |
| --------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| A（推奨） | `docs/specs/` に移し、`specs/README.md` を削除する | buddy と同じ場所になる。スクリプトとワークフローは `docs.spec` を読むので、値を変えれば動く | PR #57 の spec（`specs/46-…`）と順番を合わせる     |
| B         | ルートの `specs/` に残す                           | 何も変えない                                                                                | spec の場所だけが buddy と違う                     |
| C         | Git で追跡しない `.ai-out/` に置く                 | closeout のチェックが要らない                                                               | pull request で spec を読めない。ADR-0011 を変える |

- 詳細は、ADR-0024 の下書きにある。PRD、Design Doc、ADR を `docs/` に移すことは、受け入れ条件にあるので論点にしていない。

### 論点 3: TypeScript のバージョン

| 案        | 内容                                           | 強み                                                                                            | 弱み                                                                                                                    |
| --------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| A（推奨） | `^6.0.3` のままにする                          | 変更がない。buddy（`^6.0.2`）、fukuemon.dev（6.0.2 に上げる予定）と同じメジャーバージョンになる | なし                                                                                                                    |
| B         | `6.0.2` に固定して fukuemon.dev と同じ値にする | 3 つのリポジトリで同じパッチバージョンになる                                                    | 下げる理由がない。fukuemon.dev が 6.0.2 を選んだ理由は、7 で `astro check` が動かないことで、6.0.3 を避ける理由ではない |
| C         | 7.0.2 に上げる                                 | 最新になる                                                                                      | `astro check` が動かない（`@astrojs/check` の peer は `^5.0.0 \|\| ^6.0.0`）                                            |

- 案 A は今の値を変えないので、ADR にしない。7 に上げる条件を、ADR-0025 の下書きの「変えないもの」に書いた。

### 論点 4: issue 8 と issue 9 の扱い

| 案        | 内容                                                                               | 強み                                                                                      | 弱み                                                                   |
| --------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| A（推奨） | issue 60 の子のままにし、ADR-0026 で答え、実装のタスク T6 の pull request で閉じる | 問いと答えの対応が issue に残る。issue 8 の完了条件（script と文書の更新）を、T6 が満たす | なし                                                                   |
| B         | 2 つを閉じ、問いを issue 60 に移す                                                 | issue の数が減る                                                                          | 問いの本文が閉じた issue に残り、issue 60 の本文を書き換えることになる |

### issue 8 の問いへの答えの案

- ソースの export のまま進めるか、`dist/` に寄せるか: ソースの export のまま進める。`packages/ui` の tsdown の build は、成果物を読む利用者がいないので削除する。
- `packages/ui` の export の方針: app は、`exports` に名前で書いたエントリだけを import する。ワイルドカードのエントリは足さない。エントリの分け方は、デザインシステムの設計で決める。
- `packages/config` の配布の方針: 削除する。lint と整形の設定はルートの `vite.config.ts` に移り、残る `tsconfig` は各 workspace が自分で持つ。
- 案と比較は、ADR-0026 の下書きにある。

### issue 9 の問いへの答えの案

- どの時点から project references が要るか: CI の型のチェックが 60 秒を超えたときと、`dist/` を export する package ができたとき。今は 10 秒で、入れない。
- 型の依存をどう管理するか: package がソースを export し、利用者の `typecheck` が package のソースも一緒に確認する。
- 入れるときにコマンドをどう変えるか: `tsc` で確認する package に `composite` を付け、ルートの `tsc -b` で実行する。Astro の app は `astro check` のまま外に置く。

### 論点 5: ADR の番号

- PR #49 は、ADR-0020 から 0023 を足している。
- 推奨: この要求は 0024 から 0026 を使う。後から設計するほかの要求は、0027 から順に使う。
- 先にマージされた pull request と番号が重なったら、後からマージする pull request が番号を振り直す。

### 論点 6: Astro 7 で VRT に差分が出たときの扱い

- 受け入れ条件は「route の VRT が差分なしで通る」である。
- Astro 7 は、HTML の要素の間の空白の詰め方が Astro 6 と違う。インラインの要素の間の空白が消えると、文字の間隔が変わることがある。
- 推奨: T2 で CI の VRT を流す。差分が出たら、空白を戻す設定で差分を消せるかを確認し、消せなければ運営者が画面を見て baseline を撮り直すかを決める。

## Decisions

未記入。運営者が論点を決めたら、ここに移す。

## Design

### 今の振る舞いを固定するもの

構造を変える前と後で、次のチェックが同じ結果になることを確認する。

- route の VRT（3 つのページ、desktop と mobile）
- story の VRT（`packages/ui` の 47 枚、corporate-site の 33 枚）
- E2E の smoke
- unit test（4 件）と、`check-section-boundary.mjs` の fixture のテスト
- 文書の移動では、`check-links.mjs`

足りない点は 2 つ。

- VRT の撮影と判定は CI だけで行う。GitHub Actions の job が起動しない間は、T2 から T4 を確認できない。
- `pnpm vrt:route` は、worktree で実行すると、コンテナの中の `pnpm install` が `lefthook install` で失敗する。手元で route の VRT を流すには、この不具合を先に直す。

### 目指すディレクトリ

```text
.
├── apps/
│   └── corporate-site/   # Astro のコーポレートサイト。DesignDoc.md を持つ
├── packages/
│   └── ui/               # デザイントークン、共有の UI、Storybook
├── e2e/                  # Playwright の E2E と route の VRT
├── docs/
│   ├── PRD.md
│   ├── design/           # 全体の Design Doc と、コードがまだない機能の Design Doc
│   ├── adr/
│   └── specs/            # 作業中の spec がある間だけ存在する
├── context/
├── scripts/
├── vite.config.ts        # 整形と lint の設定
└── pnpm-workspace.yaml   # vite-plus の catalog
```

- なくなるもの: ルートの `PRD.md`、`design/`、`adr/`、`specs/`、`packages/config/`、`turbo.json`、`.oxfmtrc.json`、`apps/corporate-site/.oxlintrc.json`
- buddy に合わせない箇所と理由
  - `e2e/` は、ルートに残す。buddy は `packages/e2e` に置く。置き場は e2e と検証の要求が決める。
  - knip と dependency-cruiser は残す。buddy は使っていない。外す理由がない。
  - 整形の規則は変えない。buddy は単引用符とセミコロンなしにしている。変えると全てのファイルに差分が出て、開いている pull request と衝突する。
  - pnpm のバージョンは `packageManager` だけに書く。buddy は `mise.toml` にも書く。2 か所に書くと、片方だけを上げる誤りが起きる。

### ルートのコマンド

| 今                               | 変えた後           | 実行するもの                                                                      |
| -------------------------------- | ------------------ | --------------------------------------------------------------------------------- |
| `pnpm lint`、`pnpm format:check` | `pnpm check`       | `vp check`（整形と lint）と、corporate-site のトークンと section の境界のチェック |
| `pnpm format`                    | `pnpm check --fix` | `vp check --fix`                                                                  |
| `pnpm typecheck`                 | `pnpm typecheck`   | `pnpm -r typecheck` と、ルートの `tsc`                                            |
| `pnpm test`                      | `pnpm test`        | `pnpm -r test`（`vp test run`）                                                   |
| `pnpm build`                     | `pnpm build`       | `pnpm -r build`                                                                   |

`pnpm dev`、`pnpm e2e`、`pnpm storybook`、`pnpm vrt:*`、`pnpm knip`、`pnpm depcruise`、`pnpm check:specs` は、名前を変えない。

### 全体の Design Doc の変更の案

`design/DesignDoc.md`（移した後は `docs/design/DesignDoc.md`）を、実装のタスクの中で次のとおり変える。

- frontmatter: `description` から「設定」を外す。
- Goals and Non-Goals: 「`packages/config` に、TypeScript、lint、format などの共有の設定を置く」を削除する。
- Assumptions and Constraints
  - 「TypeScript、lint、format、test の設定は `packages/config` に集める」を替える。
    - 替えた後の文: 「整形と lint の設定はルートの `vite.config.ts` に置き、`tsconfig.json` は各 workspace が持つ」
    - ADR-0025 と ADR-0026 へリンクする。
  - 「pnpm workspace と Turborepo を使い」を、「pnpm workspace を使い、workspace のタスクは `pnpm -r` で束ねる」に替える。
  - 「workspace の package はソースを export し、ビルドの成果物を持たない」を足す。ADR-0026 へリンクする。
- Architecture: 図から `packages/config` のノードを外す。依存の規則から「`packages/ui` は `packages/config` に依存してよい」を削除する。
- Components: `packages/config` のセクションを削除する。
- Interfaces: 「`@kufu/config` は、用途別の subpath で共有の設定を export する」を削除する。
- Repository Layout: 「目指すディレクトリ」の図に替える。
- リンク: `../PRD.md`、`../adr/`、`../context/` を、移した後の相対パスに直す。

`context/` も、同じタスクの中で変える。

- `context/tech-stack.md`: Toolchain の Turborepo、oxlint、oxfmt、tsdown の行を Vite+ に替える。ルートのコマンドを替える。Upgrade Checks の vite の `^7` の固定と Node.js 23.6 の制約を削除し、vite-plus と Vitest を一緒に上げる規則を足す。Scaffolding の「Vite+ は入れない」を削除する。
- `context/conventions.md`: Shared Configuration とルートのタスクを替える。
- `context/codebase.md`: Dependency Rules の「`packages/ui` は `packages/config` に依存してよい」を削除する。`exports` に名前で書いたエントリだけを import する規則を足す。
- `context/index.md`、`CONTRIBUTING.md`、`AGENTS.md`: 文書のパスとコマンドを直す。

### 実装のタスクの分け方

種別 refactoring のプリセットに従い、子のタスクは実装の 6 件にする。文書の更新は、各タスクの pull request に含める。

| #   | タスク                                                                           | 完了の条件                                                                                                                                | 前提                                 |
| --- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| T1  | 文書を `docs/` に移す                                                            | `context/project.yml` の `docs` が `docs/` を指す。移す前のパスへの参照がリポジトリにない。`check-links.mjs` と `pnpm check:specs` が通る | ADR-0024 の承認。PR #57 のマージの後 |
| T2  | Astro を 7 に上げ、`vite` の overrides を外す                                    | build、`astro check`、E2E の smoke、route と story の VRT が通る                                                                          | ADR-0025 の承認。CI が動くこと       |
| T3  | Vite+ を入れ、整形と lint を `vp check` に替える                                 | `pnpm check` が通る。`.oxfmtrc.json`、`.oxlintrc.json`、`packages/config/oxlint/` がない。lefthook と CI が `pnpm check` を呼ぶ           | T2                                   |
| T4  | unit test と Storybook のテストを `vp test` に替え、Storybook を 10.6.3 に上げる | `pnpm test` と story の VRT が通る                                                                                                        | T3                                   |
| T5  | Turborepo を外し、ルートのコマンドを `pnpm -r` に替える                          | `turbo.json` と turbo の依存がない。CI の全ての job が通る。`context/tech-stack.md` と `CONTRIBUTING.md` のコマンドが一致する             | T3                                   |
| T6  | `packages/ui` の build と `packages/config` を削除し、package の契約を文書に書く | `pnpm build`、`pnpm typecheck`、`pnpm knip`、`pnpm depcruise` が通る。issue 8 と issue 9 を閉じる                                         | ADR-0026 の承認。T3、T5              |

- T1 は、ほかのタスクに依存しない。開いている pull request が少ないときに行う。PR #49 は、T1 の後に書き直すと、ADR を足す場所が `docs/adr/` になる。
- T4 は、デザインシステムの実装より前に行う。デザインシステムの実装が、上げた後の Storybook と Vitest の上で書けるようにするためである。
- T2 から T6 は、同じファイル（`package.json`、`pnpm-lock.yaml`、CI のワークフロー）を変えるので、順に 1 つずつ行う。

## Verification

- 受け入れ条件「route の VRT が差分なしで通る」は、T2 から T6 の各 pull request の CI で確認する。
- 受け入れ条件「移す前のパスへのリンクが残っていない」は、T1 の pull request で `check-links.mjs` と検索で確認する。
- 受け入れ条件「CI の全ての job が通る」は、T6 をマージした後の develop の CI で確認する。

## Carry Over

- ADR-0024、ADR-0025、ADR-0026: 承認されたら、状態を承認にする。ADR-0002 の状態を「ADR-0025 に置換」にする。
- 全体の Design Doc: 「全体の Design Doc の変更の案」のとおりに変える。
- `context/tech-stack.md`、`context/conventions.md`、`context/codebase.md`: 「全体の Design Doc の変更の案」のとおりに変える。
