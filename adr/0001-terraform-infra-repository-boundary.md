# ADR-0001: Terraform の infra code は別リポジトリで管理する

## 状態

承認

## 決定日

2026-05-07

## 背景

- Phase 1 の LP と将来の app は Cloudflare 上への deploy を前提にしている。
- Cloudflare Pages、Workers、DNS、custom domain、secret、binding などの変更は本番影響が大きく、アプリコードとは異なる review 観点と権限管理が必要である。
- Kufu Monorepo は frontend-first な app / package / docs の責務境界を中心に設計しており、日常的な UI 実装と infra apply 導線を同じ repo に混在させると判断コストが上がる。
- Terraform による infra 管理を採用する場合、state backend、plan / apply、provider credential、review 権限をアプリ開発フローから分離したい。

## 決定

- Cloudflare の infra code は Terraform で管理する。
- Terraform の正本は Kufu Monorepo とは別リポジトリに置く。
- infra repo の配置先は `$(ghq root)/github.com/Fukuemon/kufu-infra` とする。
- Kufu Monorepo には Terraform 本体、state 設定、apply workflow を置かない。
- Kufu Monorepo には app 側が依存する infra contract だけを Design Docs、spec、ADR に残す。
- app 変更に伴って infra 変更が必要な場合は、spec または ADR から infra repo の対応変更へ追跡できるようにする。

## 代替案

### 1. Terraform を monorepo に同居させる

#### Pros

- app と infra の変更を 1 つの PR で整合させやすい。
- 開発初期の小規模構成では repo 数を増やさずに済む。
- app 側の変更と必要な Pages / Workers / binding 更新を同時にレビューしやすい。

#### Cons

- UI 変更と本番 infra 変更が同じ差分面に並び、レビュー観点が混ざる。
- Terraform apply 権限や Cloudflare credential を app 開発導線に近づけやすくなる。
- DNS、secret、Workers など本番影響の大きい変更が、通常のアプリ開発 PR に埋もれやすい。
- AI や開発者が repo 全体を見たときに、どこまで触ってよいかの境界が曖昧になりやすい。
- 将来 Cloudflare 基盤を複数 app / repo で共有する場合、monorepo 側の責務が過剰に広がる。

### 2. Terraform を使わず Cloudflare Dashboard で運用する

#### Pros

- 初期セットアップは速い。
- 小さな設定変更なら管理コストが低い。

#### Cons

- 変更履歴、review、再現性、環境差分管理が弱い。
- secret や binding を含む運用ルールが属人化しやすい。
- preview / production の差分や rollback 手順を安定して残しにくい。

## 影響

### 良い影響

- アプリ repo と infra repo の責務境界が明確になる。
- Terraform state、provider credential、apply 権限を app 開発フローから分離できる。
- Cloudflare 固有の本番変更を専用 review で扱いやすくなる。
- 将来 app が増えても、共有 infra を別 repo 側で管理しやすい。

### 悪い影響 / トレードオフ

- app 変更と infra 変更が別 repo に分かれるため、変更追跡の運用ルールが必要になる。
- 1 つの機能変更で 2 つの PR が必要になる場合がある。
- infra contract の同期漏れが起きると、app 側ドキュメントと実体の乖離が起こりうる。

## 実装・運用への反映

- 対象 app / package: `apps/lp-site`、将来の Cloudflare deploy 対象 app、docs workflow
- spec 更新要否: 要。infra 変更が絡む spec では、infra repo 側の対応有無を明記する
- AI 向け設定更新要否: 要。Cloudflare 前提と infra repo 分離方針を AI ルールへ反映する

## 関連ドキュメント

- `PRD.md`: Phase 1 の LP と将来拡張の前提
- `design/DesignDoc.md`: Cloudflare 前提の infra / deployment 設計
- `specs/...`: infra 変更が必要な個別機能 spec
- infra repo: `$(ghq root)/github.com/Fukuemon/kufu-infra`
