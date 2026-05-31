# Engineering Conventions

> 最終更新: 2026-05-31

shared config / root task / repository quality gate の境界規約。toolchain 一覧は [toolchain.md](toolchain.md)。

## Shared Config Boundary

- `packages/config` は少なくとも `tsconfig`、`oxlint`、`vitest` の共有設定を export する。
- export は用途別 subpath を正とし、`tsconfig/base`、`tsconfig/react`、`tsconfig/astro`、`oxlint/base`、`vitest/base` を初期対象にする。
- `oxfmt` は config file をほぼ持たない前提のため、root script と実行ルールを正本にする。
- `knip` と `dependency-cruiser` は workspace 全体を検査するため、root config と root script を正とする。
- `Storybook` は `packages/ui` skeleton の入口として扱うが、本格運用ルールは後続 issue で定義する。

## Root Task Boundary

- workspace task は root script から `turbo run` で束ねる。
- `dev`、`dev:lp`、`build`、`lint`、`typecheck`、`test` は `turbo run` を使う。
- `format`、`e2e`、`knip`、`depcruise` は root 管理ツールとして直実行する。
- `e2e`、`knip`、`dependency-cruiser` は package task ではなく repository task として扱う。
- `lefthook` の `pre-commit` で `pnpm depcruise` と `pnpm knip` を自動実行し、commit 前に repository quality gate を通す。

## Repository Quality Gate (pre-commit)

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer
    participant Git as git commit
    participant Hook as lefthook (pre-commit)
    participant Dep as pnpm depcruise
    participant Knip as pnpm knip
    Dev->>Git: commit 実行
    Git->>Hook: pre-commit 起動
    par 依存境界検査
        Hook->>Dep: dependency-cruiser
        Dep-->>Hook: OK / NG (循環 / 未宣言 / app間直接依存)
    and 不要コード検査
        Hook->>Knip: knip
        Knip-->>Hook: OK / NG (dead code / 未使用 export)
    end
    alt 全てOK
        Hook-->>Git: commit 通過
        Git-->>Dev: commit 成立
    else いずれかNG
        Hook-->>Git: commit 中断
        Git-->>Dev: 失敗内容 (修正してから再 commit)
    end
```

## Repository Analysis Contract

- `knip` は workspace ごとの `project` / `entry` を持つ monorepo config を root `knip.json` に持つ。
- `dependency-cruiser` は root `.dependency-cruiser.cjs` を正本とし、少なくとも circular dependency、未宣言依存、devDependency 流入、app 間直接依存を検査する。
- app 間直接依存は禁止し、共有コードは `packages/*` の公開入口へ寄せる ([architecture.md](architecture.md))。
- false positive を避けるため、generated file や root 管理の設定ファイルは root config 側で除外する。
