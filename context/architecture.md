# Codebase Architecture

> 最終更新: 2026-06-13

Kufu Monorepo の package / runtime boundary と依存方向。全体像 (system landscape, モジュール責務) は [design/DesignDoc.md](../design/DesignDoc.md) を正本とし、本書はコードベースの境界規約を扱う。

## Package Boundary

- app から別 app の内部実装へ依存しない。
- app から `packages/config` など公開 package を経由して共有する。
- UI は app 内に置き、複数 consumer が揃った時点で `packages/ui` へ昇格する。
- 共通 utility は必要性が明確な場合だけ package 化する。

第一原則は feature / colocation。app や feature 内で閉じる UI・utility はローカルに置き、再利用が複数 app / feature にまたがって明確になった時点で `packages/*` の公開入口へ寄せる。

```text
apps/corporate-site ─┐
apps/cms ─────┼─→ packages/ui ─→ packages/config
              └────────────────→ packages/config
```

- `apps/*` → `packages/*` (公開入口) のみ許可。
- `apps/* → apps/*` (app 間直接依存) は禁止。
- `packages/ui` → `packages/config` は許可。
- 循環依存・未宣言依存・devDependency 流入は禁止 ([engineering.md](engineering.md) の repository quality gate で検査)。

### デザインシステム資産の正本と昇格境界

colocation 第一原則の適用を資産種別ごとに定める (本テーブルを正本とする。決定経緯: [spec #13](../specs/13-design-system-foundation/index.md) D6 / [ADR-0007](../adr/0007-design-token-architecture.md))。

| 資産種別                     | 正本                              | 昇格条件                                      |
| ---------------------------- | --------------------------------- | --------------------------------------------- |
| デザイントークン             | 常に `packages/ui` (`tokens.css`) | 昇格不要 (最初から正本。app 配下で定義しない) |
| フォント / shared stylesheet | 常に `packages/ui`                | 同上                                          |
| UI コンポーネント            | app 内 colocation                 | 複数 app / feature で再利用が明確になった時   |
| utility                      | app 内 colocation                 | 必要性が明確な場合のみ package 化             |

デザインシステム資産 (トークン / フォント / stylesheet) は colocation 原則の例外であり、最初から `packages/ui` を正本とする。UI コンポーネント / utility は従来の複数 consumer ルールに従う。

## Runtime Boundary

- `apps/corporate-site` は、Cloudflare 上でもできる限り静的配信で成立させる。
- React island は必要最小限とし、配信する JavaScript 量を抑える。
- 環境変数は build-time に閉じるものと runtime で参照するものを分けて扱う。
- 秘密情報を client bundle に含めない。Cloudflare の secret 管理に置くべき値は repo に保存しない ([infrastructure.md](infrastructure.md))。
- 問い合わせフォームや外部 API 連携を追加する場合は、ブラウザから直接第三者 API を叩く構成を標準にせず、必要に応じて Workers を中継点にする。

## State Boundary (React app)

- URL は状態管理の一部として扱い、React app では TanStack Router の route state に寄せる。
- URL で表現できる状態を client state (Zustand など) でグローバルに持たない。
- server state / client state / URL state を分けて扱う (詳細な標準は [DesignDoc_cms.md](../design/features/cms/DesignDoc_cms.md))。
