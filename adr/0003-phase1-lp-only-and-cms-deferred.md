# ADR-0003: Phase 1 は `apps/lp-site` のみを実装し `apps/cms` は設計を後続へ送る

## 状態

承認

## 決定日

2026-05-09

## 背景

- issue #3 の monorepo foundation では、当初 `apps/lp-site` と `apps/base` の 2 app を Phase 1 で scaffold する案を前提にしていた。
- しかし `apps/base` は名前と用途が曖昧で、React app の骨組み以上の意味を持たず、長期的な責務境界として弱かった。
- 現時点で明確になっている将来要件は「LP サイトに掲載する投稿内容を管理する app が必要になりうる」という点であり、汎用的な `base` よりも `cms` のほうが検討対象に近い。
- 一方で `apps/cms` も、公開フロー、権限、データモデル、運用者、Cloudflare 上での runtime 境界、Hono + Inertia + React の採否など未確定事項が多く、Phase 1 の scaffold 対象として固定するには早い。
- Phase 1 の最優先事項は LP foundation を最小構成で成立させることであり、未確定な第 2 app の追加は論点を増やす。

## 決定

- Phase 1 では `apps/lp-site` のみを app 実装対象とする。
- `apps/base` は作成しない。
- 将来の投稿管理 app は `apps/cms` を候補名として文書にのみ記載し、実装は行わない。
- `apps/cms` の責務は「LP 掲載投稿を管理する app 候補」として扱う。
- `apps/cms` の技術選定は別 spec / ADR で行う。初期候補として Hono + Inertia + React を比較対象に含めるが、この ADR では採用確定しない。
- root script、E2E contract、shared config は `apps/lp-site` を既定対象として成立させ、将来 `apps/cms` を追加できる拡張余地だけを残す。

## 代替案

### 1. `apps/base` を当初案どおり Phase 1 で作る

#### Pros

- React app の骨組みを早期に配置できる。
- `packages/ui` や React Compiler 方針の接続先を具体化しやすい。
- 将来の app 追加時に scaffold の再調整が減る可能性がある。

#### Cons

- `base` という名前では用途が曖昧で、長期的な責務境界として弱い。
- 何の app なのかが文書から伝わりにくく、AI や開発者の判断を曖昧にする。
- Phase 1 の主目的である LP foundation から論点が逸れる。

### 2. `apps/cms` を Phase 1 で先に scaffold する

#### Pros

- 将来の投稿管理 app の配置先を早期に固定できる。
- CMS 向けの shared UI や config の検討を前倒ししやすい。

#### Cons

- app shell を置く前に、責務、公開フロー、権限、データ設計を決める必要がある。
- Hono + Inertia + React を含む技術選定が未確定で、scaffold の前提が揺れやすい。
- Phase 1 の完了条件が LP foundation 以外に広がる。

### 3. app 候補を明記せず `future-app` 扱いにする

#### Pros

- 将来の選択肢を狭めない。
- 命名に関する再変更コストを避けられる。

#### Cons

- 現時点で見えている「LP 投稿管理」の要件が文書に残らず、設計の入口が弱くなる。
- 後続 spec の対象が曖昧になりやすい。

## 影響

### 良い影響

- Phase 1 の app 実装対象が `apps/lp-site` に絞られ、foundation の目的が明確になる。
- `apps/base` という曖昧な名前を残さずに済む。
- 将来 app の議論を `apps/cms` という具体的な論点に寄せられる。
- CMS app の技術選定と責務設計を、専用 spec / ADR で落ち着いて進められる。

### 悪い影響 / トレードオフ

- React app の実体が Phase 1 に存在しないため、`packages/ui` や React Compiler の実運用確認は後続へ持ち越される。
- 将来 `apps/cms` を作る時点で、scaffold と command contract の追加調整が必要になる。
- Hono + Inertia + React の採否は未確定のまま残る。

## 実装・運用への反映

- 対象 app / package: `apps/lp-site`、将来の `apps/cms`、`packages/ui`、`packages/config`、root `e2e`
- spec 更新要否: 要。`apps/base` 前提の prompt / contract を外し、`apps/cms` を後続設計対象として記載する
- AI 向け設定更新要否: 要。repo 概要、module responsibility、開発 workflow から `apps/base` / `dev:base` / `@kufu/base` を外す

## 関連ドキュメント

- `PRD.md`: Phase 1 / Phase 2 の境界と CMS app の位置づけ
- `design/DesignDoc.md`: monorepo の app / package 責務境界
- `specs/3-monorepo-foundation/index.md`: issue #3 の実装対象と後続論点
- `specs/3-monorepo-foundation/prompts/`: `apps/base` 前提を外した prompt 群
