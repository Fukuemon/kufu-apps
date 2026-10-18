# ADR-0001: Terraform の infra code は kufu-apps と別のリポジトリで管理する

## Status

ADR-0020 に置換

## Context

- Phase 1 のコーポレートサイトと将来の app は、Cloudflare 上への deploy を前提にしている。
- Cloudflare Pages、Workers、DNS、custom domain、secret、binding などの変更は本番への影響が大きい。
  - アプリのコードとは異なる review の観点と権限管理が必要である。
- Kufu Monorepo は、frontend-first な app / package / docs の責務の境界を中心に設計している。
  - 日常的な UI の実装と infra の apply の導線を同じ repo に混在させると、判断のコストが上がる。
- Terraform による infra 管理を採用する場合、state backend、plan / apply、provider credential、review の権限をアプリ開発のフローから分離したい。

## Decision

- Cloudflare の infra code は Terraform で管理する。
- Terraform のコードは、Kufu Monorepo とは別のリポジトリに置く。
- infra repo の配置先は `$(ghq root)/github.com/Fukuemon/kufu-infra` とする。
- Kufu Monorepo には、Terraform 本体、state の設定、apply の workflow を置かない。
- Kufu Monorepo には、app の側が依存する infra contract だけを Design Docs、spec、ADR に残す。
- app の変更に伴って infra の変更が必要な場合は、spec または ADR から infra repo の対応する変更へ追跡できるようにする。

## Considered Options

| 選択肢                                                                        | 強み                                                                                                                                                                                                 | 弱み                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** Terraform で管理し、infra code を別のリポジトリ（kufu-infra）に置く | アプリの repo と infra の repo の責務の境界が明確になる。Terraform の state、provider credential、apply の権限を app の開発フローから分離できる。Cloudflare 固有の本番の変更を専用の review で扱える | app の変更と infra の変更が別の repo に分かれ、変更を追跡する運用のルールが必要になる。1 つの機能の変更で 2 つの PR が必要になる場合がある                                                                                                                                                                                                                                                                                                |
| Terraform を monorepo に同居させる                                            | app と infra の変更を 1 つの PR で整合させやすい。開発初期の小規模な構成では repo の数を増やさずに済む。app の変更と、必要な Pages / Workers / binding の更新を同時にレビューしやすい                | UI の変更と本番の infra の変更が同じ差分に並び、レビューの観点が混在する。Terraform の apply の権限や Cloudflare の credential が app の開発の導線に近づきやすい。DNS、secret、Workers など本番への影響が大きい変更が、通常のアプリ開発の PR に埋もれやすい。AI や開発者が repo 全体を見たとき、どこまで触ってよいかの境界が曖昧になりやすい。将来 Cloudflare の基盤を複数の app / repo で共有する場合、monorepo の側の責務が過剰に広がる |
| Terraform を使わず Cloudflare Dashboard で運用する                            | 初期のセットアップが速い。小さな設定の変更なら管理のコストが低い                                                                                                                                     | 変更の履歴、review、再現性、環境の差分の管理が弱い。secret や binding を含む運用のルールが属人化しやすい。preview / production の差分や rollback の手順を安定して残しにくい                                                                                                                                                                                                                                                               |

## Consequences

### Positive

- アプリの repo と infra の repo の責務の境界が明確になる。
- Terraform の state、provider credential、apply の権限を app の開発フローから分離できる。
- Cloudflare 固有の本番の変更を、専用の review で扱いやすくなる。
- 将来 app が増えても、共有の infra を別の repo の側で管理しやすい。

### Negative

- app の変更と infra の変更が別の repo に分かれるため、変更を追跡する運用のルールが必要になる。
- 1 つの機能の変更で、2 つの PR が必要になる場合がある。
- infra contract の同期が漏れると、app の側のドキュメントと実体が乖離しうる。
