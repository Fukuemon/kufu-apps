---
type: context
title: 技術スタック
description: 採用しているツールの役割とバージョンの所在、先に決めておく採用の候補、ルートのコマンド、ツールを上げるときの確認、新しい app の作り始め。バージョンそのものと選んだ理由は書かない
status: draft
governs:
  - mise.toml
  - package.json
  - pnpm-workspace.yaml
  - vite.config.ts
verified_commit: 81f85da2744f320f44040307f1ec854f705f7c79
---

# 技術スタック

## Toolchain

npm のパッケージのバージョンは、各 package の `package.json` と `pnpm-lock.yaml` に書いてある。  
pnpm のバージョンは、ルートの `package.json` の `packageManager` に書いてある。  
Node.js のバージョンは、`mise.toml` に書いてある。  
採否の判断は [docs/adr/](../docs/adr/) が持つ。

ツールごとの役割は次のとおり。

- pnpm workspace: package を管理する。
- Astro: コーポレートサイトの framework として使う。
- TypeScript: 言語として使う。
- Vite+（`vite-plus`）: 同梱の oxfmt で整形し、同梱の oxlint で lint を掛ける。設定はルートの `vite.config.ts` の `fmt` と `lint` にある。
  - 型を使う規則は、`lint.options.typeAware` で掛ける。
  - Markdown も整形の対象にする。
  - eslint は、oxlint で足りないことを確認した場合だけ、段階的に併用する。prettier は入れない。
  - バージョンは、`pnpm-workspace.yaml` の catalog にある。`vite` も catalog で `@voidzero-dev/vite-plus-core` に置き換える。
- Vite+ の `vp test`: unit test を同梱の Vitest で流す。`packages/ui` の Storybook のテストは、ブラウザが要るので `vrt:capture` から `vp test run --project=storybook` で流す。
  - vite-plus と Vitest は一緒に上げる。Vitest のバージョンは、vite-plus の依存が決める。
  - `vitest`、`@vitest/browser`、`@vitest/browser-playwright` は、vite-plus が使う Vitest と同じバージョンに固定する。
  - Storybook は、`@storybook/addon-vitest` の peer が Vitest の範囲を決めるので、vite-plus を上げるときに合わせて上げる。
- Storybook: `packages/ui` と、app の presentation のコンポーネントのレビューに使う。
- Playwright: E2E と、route の VRT（`toHaveScreenshot`）に使う。E2E の workspace（`e2e/`、`@kufu/e2e`）で管理し、バージョンは `e2e/package.json` にある。
- storycap-testrun と reg-cli: Storybook の story を撮影して比べる。
- knip: 使っていないコードと export を検出する。ルートで管理する。
- dependency-cruiser: 依存を解析する。ルートで管理する。
- Tailwind CSS v4 と `@tailwindcss/vite`: スタイリングに使う。
- shadcn/ui: `packages/ui` の共有のコンポーネントの元にする。
  - ADR-0010: [shadcn の primitive に Base UI を採る](../docs/adr/0010-shadcn-base-ui-primitive-policy.md)
- `@astrojs/react`: React のコンポーネントを Astro で描画する。使い方は [codebase.md](codebase.md#shadcn-の使い方と-react-island-の境界) にある。
- lefthook: Git のフックからチェックを実行する。
- textlint: Markdown の文章をチェックする。

使う前に先に決めておく候補は次のとおり。

- Rolldown: bundler の候補にする。`apps/cms` を実装するときの build の構成で、採否を確認する。
- React Compiler: React の app を入れるときの標準にする。`packages/ui` と、`apps/cms` を実装するときに使う。
  - React Compiler に対応していないライブラリと実装の扱いは [CMS の Design Doc](../docs/design/features/cms/DesignDoc.md) にある。
- Hono、Inertia、React: CMS の app の候補にする。実装していない。採否は ADR か spec で決める。

### ルートのコマンド

ルートのコマンドは `package.json` の `scripts` にある。  
役割は次のとおり。

- `pnpm dev`: すべての app を起動する。コーポレートサイトだけなら `pnpm dev:corporate` を使う。
- `pnpm build`: `build` の script を持つ workspace をビルドする。今は corporate-site だけが持つ。
- `pnpm check`: ルートの `vp check` で全体の整形と lint を確認し、続けて `pnpm -r check` で workspace ごとのチェックを実行する。自動の修正は `pnpm check:fix`（`vp check --fix`）を使う。
- `pnpm typecheck`: 型をチェックする。
- `pnpm test`: unit test を実行する。
- `pnpm e2e`: E2E を実行する。`@kufu/e2e` の `e2e` の script を呼ぶ。デフォルトの対象は corporate-site である。
- `pnpm storybook`: Storybook を起動する。`packages/ui` だけなら `pnpm storybook:ui`、corporate-site だけなら `pnpm storybook:corporate` を使う。
- `pnpm storybook:build`: Storybook をビルドする。GitHub Pages の artifact は `pnpm storybook:pages` が作る。
- `pnpm vrt:story`: story の VRT を実行する。baseline の撮り直しは `pnpm vrt:story:update` を使う。
- `pnpm vrt:route`: route の VRT を Playwright の公式の container で実行する。baseline の撮り直しは `pnpm vrt:route:update` を使う。
- `pnpm knip && pnpm depcruise`: リポジトリの健全さをチェックする。
- `pnpm check:specs`: close した issue の spec が残っていないかを確認する。実行の時期は [conventions.md](conventions.md#チェックの実行点) にある。
- 依存の追加: `pnpm --filter @kufu/<module> add <package>` を使う。

テストのコマンドの使い分けは [testing.md](testing.md) にある。

## Upgrade Checks

- Astro 7 の `astro preview` は、コーディングエージェントの中で動いていると判定すると、バックグラウンドに回ってすぐ終了する。
  - E2E の `e2e:serve` は、`--ignore-lock` を付けて前面で動かす。付けないと、Playwright の `webServer` が「exited early」で失敗する。
  - Astro を上げたときは、エージェントのセッションから `pnpm e2e` を流して確認する。
- vite-plus を上げると、同梱の oxlint と oxfmt も一緒に上がる。上げたときは `pnpm check`、`pnpm test`、`pnpm build`、`pnpm storybook:build` を流して確認する。
- それ以外のツールで、バージョンを上げるときに動かなくなりやすい箇所と確認の方法は、未定。

## Scaffolding

app の最初の scaffold は、公式の `create` のコマンドを優先する。  
ADR-0025: [整形、lint、unit test を Vite+ で実行し、Turborepo を外す](../docs/adr/0025-vite-plus-toolchain.md)

- `apps/corporate-site`: `pnpm create astro@latest apps/corporate-site`
- React の app: `pnpm create vite ... --template react-ts`
- 作った後に、package の名前、ルートの script、typecheck、E2E、`tsconfig.json` を、monorepo の取り決めに合わせる。
  - 名前は [conventions.md](conventions.md#naming) に、`tsconfig.json` と script の取り決めは [conventions.md](conventions.md#shared-configuration) にある。
  - E2E の対象にする手順は [testing.md](testing.md#runtime-requirements) にある。
