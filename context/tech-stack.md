---
type: context
title: 技術スタック
description: 採用しているツールの役割とバージョンの所在、先に決めておく採用の候補、ルートのコマンド、vite と Node.js のバージョンの制約、新しい app の作り始め。バージョンそのものと選んだ理由は書かない
status: draft
governs:
  - mise.toml
  - package.json
  - pnpm-workspace.yaml
  - turbo.json
verified_commit: 81f85da2744f320f44040307f1ec854f705f7c79
---

# 技術スタック

## Toolchain

npm のパッケージのバージョンは、各 package の `package.json` と `pnpm-lock.yaml` に書いてある。  
pnpm のバージョンは、ルートの `package.json` の `packageManager` に書いてある。  
Node.js のバージョンは、`mise.toml` に書いてある。  
採否の判断は [adr/](../adr/) が持つ。

ツールごとの役割は次のとおり。

- pnpm workspace: package を管理する。
- Turborepo: ルートの script から `turbo run` で workspace のタスクを束ねる。
- Astro: コーポレートサイトの framework として使う。
- TypeScript: 言語として使う。
- oxlint: lint に使う。TypeScript を含む workspace では、`oxlint-tsgolint` で type-aware に実行する。
  - eslint は、oxlint で足りないことを確認した場合だけ、段階的に併用する。
- oxfmt: format に使う。prettier は入れない。
- Vitest: unit test に使う。
- Storybook: `packages/ui` と、app の presentation のコンポーネントのレビューに使う。
- Playwright: E2E と、route の VRT（`toHaveScreenshot`）に使う。ルートで管理する。
- storycap-testrun と reg-cli: Storybook の story を撮影して比べる。
- knip: 使っていないコードと export を検出する。ルートで管理する。
- dependency-cruiser: 依存を解析する。ルートで管理する。
- tsdown: ライブラリをビルドする。
- Tailwind CSS v4 と `@tailwindcss/vite`: スタイリングに使う。
- shadcn/ui: `packages/ui` の共有のコンポーネントの元にする。
  - ADR-0010: [shadcn の primitive に Base UI を採る](../adr/0010-shadcn-base-ui-primitive-policy.md)
- `@astrojs/react`: React のコンポーネントを Astro で描画する。使い方は [codebase.md](codebase.md#shadcn-の使い方と-react-island-の境界) にある。
- lefthook: Git のフックからチェックを実行する。
- textlint: Markdown の文章をチェックする。

使う前に先に決めておく候補は次のとおり。

- Rolldown: bundler の候補にする。`apps/cms` を実装するときの build の構成で、採否を確認する。
- React Compiler: React の app を入れるときの標準にする。`packages/ui` と、`apps/cms` を実装するときに使う。
  - React Compiler に対応していないライブラリと実装の扱いは [CMS の Design Doc](../design/features/cms/DesignDoc.md) にある。
- Hono、Inertia、React: CMS の app の候補にする。実装していない。採否は ADR か spec で決める。

### ルートのコマンド

ルートのコマンドは `package.json` の `scripts` にある。  
役割は次のとおり。

- `pnpm dev`: すべての app を起動する。コーポレートサイトだけなら `pnpm dev:corporate` を使う。
- `pnpm build`: すべての workspace をビルドする。
- `pnpm lint`: lint を実行する。
- `pnpm typecheck`: 型をチェックする。
- `pnpm format:check`: format を確認する。書き換えるときは `pnpm format` を使う。
- `pnpm test`: unit test を実行する。
- `pnpm e2e`: E2E を実行する。デフォルトの対象は corporate-site である。
- `pnpm storybook`: Storybook を起動する。`packages/ui` だけなら `pnpm storybook:ui`、corporate-site だけなら `pnpm storybook:corporate` を使う。
- `pnpm storybook:build`: Storybook をビルドする。GitHub Pages の artifact は `pnpm storybook:pages` が作る。
- `pnpm vrt:story`: story の VRT を実行する。baseline の撮り直しは `pnpm vrt:story:update` を使う。
- `pnpm vrt:route`: route の VRT を Playwright の公式の container で実行する。baseline の撮り直しは `pnpm vrt:route:update` を使う。
- `pnpm knip && pnpm depcruise`: リポジトリの健全さをチェックする。
- `pnpm check:specs`: close した issue の spec が残っていないかを確認する。実行の時期は [conventions.md](conventions.md#チェックの実行点) にある。
- 依存の追加: `pnpm --filter @kufu/<module> add <package>` を使う。

テストのコマンドの使い分けは [testing.md](testing.md) にある。

## Upgrade Checks

- `.ts` の設定ファイル（`packages/config/vitest/base.ts` など）の import は、Node.js 23.6 以上でだけ、そのまま動く。23.6 から type stripping が初めから有効になるためである。
  - CI の Node.js は 24 以上にする。22.12 では `ERR_UNKNOWN_FILE_EXTENSION` で失敗する。
- Astro 7 の `astro preview` は、コーディングエージェントの中で動いていると判定すると、バックグラウンドに回ってすぐ終了する。
  - E2E の `e2e:serve` は、`--ignore-lock` を付けて前面で動かす。付けないと、Playwright の `webServer` が「exited early」で失敗する。
  - Astro を上げたときは、エージェントのセッションから `pnpm e2e` を流して確認する。
- それ以外のツールで、バージョンを上げるときに動かなくなりやすい箇所と確認の方法は、未定。

## Scaffolding

app の最初の scaffold は、公式の `create` のコマンドを優先する。  
ADR-0025: [整形、lint、unit test を Vite+ で実行し、Turborepo を外す](../adr/0025-vite-plus-toolchain.md)

- `apps/corporate-site`: `pnpm create astro@latest apps/corporate-site`
- React の app: `pnpm create vite ... --template react-ts`
- 作った後に、package の名前、ルートの script、typecheck、E2E、共有の設定を、monorepo の取り決めに合わせる。
  - 名前は [conventions.md](conventions.md#naming) に、共有の設定は [conventions.md](conventions.md#shared-configuration) にある。
  - E2E の対象にする手順は [testing.md](testing.md#runtime-requirements) にある。
