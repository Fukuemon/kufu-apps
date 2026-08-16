# ADR-0015: Terraform の infra code を Kufu Monorepo へ集約する

## 状態

提案

## 決定日

2026-08-16

## 背景

- [ADR-0001](0001-terraform-infra-repository-boundary.md) は 2026-05-07 に、Cloudflare の infra code を Terraform で管理し、その正本を別リポジトリ `kufu-infra` に置くと決めた。
- **2026-08-16 時点で `kufu-infra` は事実上空である。** `.tf` ファイルが 1 つも存在せず、中身は PRD / DesignDoc / ADR-0001 のコピーと AI 設定のみで、最終コミットは 2026-05-08 である。
- ADR-0001 が前提にした「Terraform による infra 管理」そのものが始まっていない。したがって現状は、分離のコスト (別 repo の維持、Infrastructure Contract の同期) だけを払い、分離の利益を受け取っていない。
- Cloudflare の設定 (Pages project / domain / secret) はすべて Dashboard 上にあり、コード管理されていない。これは ADR-0001 が代替案 2 の Cons として退けた状態と同じである。決定から 3 か月、実態は退けたはずの選択肢のままだった。
- #33 (テスト戦略と CI パイプライン整備) が VRT baseline の保管先に Cloudflare R2 を選んだ結果、R2 が Infrastructure Contract の対象となり、空の repo 待ちで実装が止まっている。

### 判断を分ける事実

ADR-0001 の判断自体が誤っていたのではない。**分離が成立する前提が満たされなかった**ことが問題である。別リポジトリの運用は、そこに変更を書き込む頻度と担当が存在して初めて機能する。

事実として確認できるのは、3 か月間 `.tf` が 1 つも書かれなかったこと、Cloudflare の設定が Dashboard 上に残り続けたこと、#33 が空の repo 待ちで止まっていることの 3 点である。

**推定** (単一事例からの解釈であり、検証していない): 現状の開発体制は 1 名で、対象は corporate-site 1 つ ([ADR-0003](0003-phase1-corporate-site-only-and-cms-deferred.md)) である。この規模に対して 2 リポジトリにまたがる変更手順が重く、着手の障壁として働いた可能性が高い。

## 決定

> **承認順序**: 本 ADR と [ADR-0016](0016-cloudflare-terraform-wrangler-boundary.md) は**同時に承認する**。本 ADR が挙げる Cons 2 と Cons 3 の対処は ADR-0016 の credential 分担に依存しており、本 ADR だけを承認すると対処のない状態になる。

- **Cloudflare の infra code を Kufu Monorepo へ集約する。** ADR-0001 を supersede する。
- `kufu-infra` は **アーカイブする** (削除しない)。ADR-0001 のコピーと初期検討の履歴が残っており、判断の経緯を追える状態を保つ。read-only にすることで、誤って書き込みが再開されることを防ぐ。
- ツールの分担 (どのリソースを Terraform が持ち、どれを Wrangler が持つか) は本 ADR の対象外とし、[ADR-0016](0016-cloudflare-terraform-wrangler-boundary.md) で定める。
- Infrastructure Contract は「app repo から infra repo への受け渡し」ではなくなる。同一 repo 内の規約として [context/infrastructure.md](../context/infrastructure.md) に残す。

### ディレクトリ構成

```text
infra/
├── README.md                    # apply 手順 / bootstrap の順序 / 権限
├── bootstrap/                   # state 置き場を作るためだけの root module。初回 1 回
│   ├── provider.tf
│   ├── r2_state_bucket.tf
│   └── vars.tf
└── cloudflare/                  # 本体。account 階層と zone 階層を 1 つに畳んでいる
    ├── provider.tf              # terraform{} + backend (R2) + provider
    ├── vars.tf
    ├── r2.tf                    # account レベル
    ├── dns.tf                   # zone レベル
    ├── pages_domain.tf
    └── rate_limiting.tf
```

- **`infra/` を repo ルート直下に置く。** `pnpm-workspace.yaml` の glob は `apps/*` と `packages/*` のみのため、workspace package として拾われない。`packages/infra/` は採らない。`packages/` は app から import される共有ライブラリの場所であり、infra は誰からも import されないため意味が合わない。
- **実行は root script から行う** (`pnpm infra:plan` など)。`package.json` を持たない root 直下のディレクトリを root script から動かす形は、既存の `e2e/` と同じである。
- **ファイル命名は Cloudflare の推奨に従う。** `provider.tf` / `<subject>.tf` / `vars.tf` の 3 種で構成する ([Cloudflare Terraform Best Practices](https://developers.cloudflare.com/terraform/advanced-topics/best-practices/))。
- **`bootstrap/` を別の root module にする。** state を R2 に置く一方で R2 バケットを Terraform が作るため、本体だけでは初回が回らない。`bootstrap/` の state はローカルに置き、commit しない。失った場合は `terraform import` で回復する。
- **state の key に scope を含める。** `terraform.tfstate` ではなく `cloudflare/main/terraform.tfstate` とする。後から兄弟の state を足すときに、既存 state のリネームを避けられる。
- **`envs/` のようなディレクトリで環境を分けない。** Cloudflare は staging / QA / production を**別アカウント + 別ドメイン**で分けるよう定めている。アカウント階層の共有リソース (Load Balancer の monitor / pool など) を同一アカウント内で分離できないためである。

### モジュールを作らない

`modules/` ディレクトリを設けず、resource module / infrastructure module / composition の 3 層構成を採らない。

[terraform-best-practices.com](https://www.terraform-best-practices.com/key-concepts) はこの 3 層を提示するが、Cloudflare は「**モジュールは避ける (使うとしても控えめに)**」と定める。理由として、共有されたモジュールが内部で変わるとリソースが同期を失うか再作成されること、Terraform core の外側のロジックのバグを考慮する必要が生じデバッグが難しくなることを挙げている。

Cloudflare 側を採る根拠は次の 3 点である。

1. 3 層構成が効くのは同じ形が繰り返される場合 (複数アカウント、複数リージョン、複数環境) である。対象は 1 アカウント / 1 zone / 1 サイトで、括り出すべき重複が存在しない。
2. 1〜2 リソースを包むモジュールは薄いラッパーにしかならず、変数と出力というインターフェースを増やすだけで重複を減らさない。
3. [context/project.yml](../context/project.yml) の `decision_priority` は将来拡張性を最下位に置く。3 層化は将来拡張性への投資であり、上位の一貫性と開発体験を削る。

**モジュールを作る条件**: 同じ形が 2 箇所以上に実在し、かつリポジトリ内のローカルモジュールとして持てること。Cloudflare の警告は共有モジュールに最も強く当たり、同じ PR でしか変わらないローカルモジュールはリスクの質が異なる。条件を満たすまで作らない。

### 構成を展開する条件

規模が変わったときの移行先を先に定める。条件を満たさないうちは展開しない。

| 段階 | 状況                       | 形                                                  | 引き金                                                        |
| ---- | -------------------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| 0    | 現在 (corporate-site のみ) | `infra/cloudflare/` + `infra/bootstrap/`            | —                                                             |
| 1    | 別アプリ追加 (同一 zone)   | `infra/cloudflare/` を `shared/` と `<app>/` へ分割 | アプリ固有リソースが数個を超える、または apply 頻度が分かれる |
| 2    | staging 等の環境追加       | `infra/cloudflare/<account>/...`                    | 2 つ目の Cloudflare アカウント                                |
| 3    | AWS / GCP 併用             | `infra/aws/` / `infra/gcp/` を並置                  | 別プロバイダの導入                                            |

段階 3 で初めて composition の概念が実利を持つ。プロバイダを跨ぐ参照 (Cloudflare の DNS が他クラウドの資源を指すなど) が生じ、root module 間で値を渡す `terraform_remote_state` が必要になるためである。現時点では接着すべき相手が存在しない。

`infra/cloudflare/` という名前は段階 3 を織り込んでいる。`infra/main/` としない理由がこれである。また subject 別にファイルを分けることで、段階 1 の分割をファイルの移動だけで済ませられる。

**この展開には代償がある。** root module を分ける時点で state を分ける作業 (`terraform state mv` または import) が一度発生する。これを避けるには最初から分割することになるが、6 リソース程度に対して常時の運用コストを払うことになり、`decision_priority` の順位に反する。一度きりの限定的な作業として受け入れる。

### 既存の Dashboard 設定の移行

Cloudflare が推奨する `cf-terraforming` を使い、既存リソースを Terraform state へ import する。作り直しは行わない。本番稼働中のリソースを削除・再作成する経路を避けるためである。

### ADR-0001 が挙げた Cons への対処

ADR-0001 は monorepo 同居 (代替案 1) の Cons を 5 点挙げた。集約後もこれらは消えないため、個別に対処を定める。

| ADR-0001 の Cons                                                               | 対処                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| UI 変更と本番 infra 変更が同じ差分面に並び、レビュー観点が混ざる               | Terraform を `infra/` に限定し、差分の所在で判別できるようにする。加えて ADR-0016 の分担により、日常の deploy は Terraform を経由しないため、UI 変更の PR に infra 差分が混ざらない                                            |
| Terraform apply 権限や Cloudflare credential を app 開発導線に近づけやすくなる | ADR-0016 で credential を 2 系統に分ける。通常の CI は deploy scope に限定した token しか持たず、apply は手動起動 + environment protection rules を通す                                                                        |
| DNS、secret、Workers など本番影響の大きい変更が、通常の PR に埋もれやすい      | **Terraform 管轄 (DNS / R2 / Rate Limiting)**: apply が自動実行されない。merge されても apply workflow の手動起動を経なければ本番へ反映されない。**Wrangler 管轄 (Pages Functions / runtime secret)**: 下記「残る Cons」を参照 |
| どこまで触ってよいかの境界が曖昧になりやすい                                   | 本 ADR の「ディレクトリ構成」で境界を定める。実装後、その事実を [context/architecture.md](../context/architecture.md) に記述し、CLAUDE.md 系の生成物から参照させる                                                             |
| 将来 Cloudflare 基盤を複数 app / repo で共有する場合、責務が過剰に広がる       | **対処しない (条件付きで再検討)**。現時点で Cloudflare を共有する別 app は存在しない ([ADR-0003](0003-phase1-corporate-site-only-and-cms-deferred.md))。下記「見直しの条件」に該当したとき再検討する                           |

### 残る Cons: Wrangler 管轄の変更

Cons 3 のうち **Pages Functions (Workers) の変更は対処しない。** [ADR-0016](0016-cloudflare-terraform-wrangler-boundary.md) の分担により Pages Functions は Wrangler 管轄であり、push を起点とする deploy workflow で自動的に本番へ出る。`/api/contact` のコード変更は通常の PR に含まれ、apply workflow のような明示的な行為を挟まない。

**ただしこれは集約によって悪化するものではない。** Pages Functions は 2026-08-16 時点で未実装であり (`apps/corporate-site/functions/` が存在せず、issue #26 が open。[ADR-0013](0013-designdoc-present-facts-only.md) が同じ事実を記録している)、自動 deploy された実績はない。ここで言えるのは構成上の帰結である。ADR-0001 の構成のままでも、Pages Functions を実装すれば app repo への push を起点に Cloudflare Pages が自動 deploy する ([context/infrastructure.md](../context/infrastructure.md) の Environment Strategy)。Workers のコードは app 側にあるため、この Cons は repo 境界では解けない。

緩和は通常の PR レビューと自動テストに依存する。infra の権限分離とは別の問題として扱う。

runtime secret はこの Cons の対象外である。値は PR の差分に現れず、特権経路でのみ変更されるため、「通常の PR に埋もれる」経路が存在しない。

### CODEOWNERS の位置づけと限界

`.github/CODEOWNERS` に `/infra/` の所有者を宣言する。ただし**現在の開発体制は 1 名であり、CODEOWNERS は職務分離として機能しない**。自分の PR を自分が承認する形になるためである。

したがって上記の対処表に CODEOWNERS を数えていない。実効的な分離は次の 2 つだけである。

- apply が自動実行されず、手動起動という明示的な行為を必ず伴うこと
- 通常の CI が apply 用 credential を持たないこと ([ADR-0016](0016-cloudflare-terraform-wrangler-boundary.md))

CODEOWNERS を置く理由は 2 つある。境界を宣言として残すことと、人員が増えた時点で追加の設定なしに効き始めることである。人員が増えるまでは、分離手段として数えない。

### 見直しの条件

次のいずれかが成立したとき、この決定を再検討する。条件を満たさないうちは再検討しない。

- Kufu Monorepo の外にある app が、同じ Cloudflare アカウントの基盤を共有する必要が生じたとき。
- infra 変更のレビュー担当が、アプリ開発の担当と分離されたとき (人員が増え、権限を組織的に分けられるようになったとき)。

## 代替案

### 1. 別リポジトリのまま Terraform を書き始める (ADR-0001 の維持)

#### Pros

- 決定を変えずに済む。ADR の履歴が単純に保たれる。
- ADR-0001 が意図した責務分離と権限分離を、当初の設計どおりに実現できる。

#### Cons

- 着手されなかった原因に対処していない。3 か月間着手されなかった事実は、手順の重さが障壁として働いたことを示す。同じ構造を残せば同じ結果になる可能性が高い。
- #33 のブロックが継続する。R2 の 1 リソースを作るために、別 repo の初期構築一式が先に必要になる。
- Infrastructure Contract の同期という運用コストを、利益が出ていない段階から払い続ける。

### 2. Terraform を採用せず Cloudflare Dashboard で運用する

#### Pros

- 追加の学習と state 運用が不要である。現状からの変更が最も小さい。

#### Cons

- ADR-0001 が代替案 2 の Cons として挙げた内容がそのまま該当する。変更履歴、review、再現性、環境差分管理が弱く、secret や binding の運用が属人化する。
- 本 issue の目的の 1 つ (コード管理されていない Cloudflare リソースをコード管理下に置く) を満たさない。
- #33 の R2 も Dashboard 作成となり、CI から使う資格情報の管理が文書だけの約束になる。

### 3. 3 層モジュール構成 (resource module / infrastructure module / composition) を採る

#### Pros

- terraform-best-practices.com が提示する一般的な構成に沿う。将来アプリやプロバイダが増えたとき、構成を変えずに拡張できる。
- 各層の責務が明示され、どこに何を書くかの判断が減る。

#### Cons

- Cloudflare が「モジュールは避ける」と明示している。共有モジュールの内部変更でリソースが同期を失う、または再作成される危険と、Terraform core の外側のロジックによるデバッグ困難を理由に挙げている。
- 対象は 1 アカウント / 1 zone / 1 サイトで、括り出すべき重複が存在しない。1〜2 リソースを包むモジュールは薄いラッパーにしかならない。
- `decision_priority` で最下位の将来拡張性のために、上位の一貫性と開発体験を削ることになる。

### 4. 集約するが、ディレクトリを分けず app と同列に置く

#### Pros

- 構成が最も単純になる。

#### Cons

- ADR-0001 が挙げた Cons のうち「境界が曖昧になる」「レビュー観点が混ざる」に対処できない。
- `infra/` というパス接頭辞がなくなり、CI の path filter や CODEOWNERS で infra 変更だけを対象にできなくなる。

## 影響

### 良い影響

- 1 つの PR で app 変更と infra 変更を整合させられる。#33 のような「app 側の都合で infra リソースが要る」変更が、repo をまたがずに完結する。
- Infrastructure Contract の同期漏れという失敗モードがなくなる。contract と実体が同じ repo に置かれる。
- #33 のブロックが解ける。
- コード管理されていなかった Cloudflare リソースが、初めてコード管理下に入る。ADR-0001 が本来目指していた状態に、別の経路で到達する。

### 悪い影響 / トレードオフ

- monorepo の責務が広がる。frontend 中心の repo に infra の関心事が加わり、読み手が把握すべき範囲が増える。
- 権限分離を repo 境界ではなく、ディレクトリ・CODEOWNERS・workflow の組み合わせで実現することになる。repo 境界より弱い分離であり、設定漏れが直接リスクになる。
- ADR-0001 を前提に書かれた文書 ([context/infrastructure.md](../context/infrastructure.md) / [design/DesignDoc.md](../design/DesignDoc.md) / [context/project.yml](../context/project.yml)) の更新が必要になる。
- `kufu-infra` をアーカイブすることで、そこへのリンクを持つ既存文書のリンク先が read-only になる。リンク自体は切れない。

### 未確認事項

- `kufu-infra` に、本 monorepo 側へ引き継ぐべき内容が残っていないかは、アーカイブ実施前に確認する。現時点の確認では PRD / DesignDoc / ADR-0001 のコピーと AI 設定のみであり、いずれも本 repo に正本がある。

## 実装・運用への反映

- 対象 app / package: `apps/corporate-site`、`e2e` (#33 の VRT)、GitHub Actions workflow、新設する Terraform ディレクトリ
- spec 更新要否: 要。#47 の spec に、ディレクトリ配置、CODEOWNERS、apply workflow の分離を反映する
- AI 向け設定更新要否: 要。**本 ADR に由来する更新**を次に網羅する。ADR-0016 に由来する更新は同 ADR の同名節を正本とする。
- **更新時期は実装完了後である。** context と DesignDoc は現状事実を記述する文書であり、決定が承認されただけでは記述すべき事実が存在しない ([ADR-0013](0013-designdoc-present-facts-only.md) の原則を context にも適用する)。承認時点で行うのは ADR-0001 の状態変更だけである。

| 対象                                                            | 更新内容                                                                                                                         |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [context/architecture.md](../context/architecture.md)           | `infra/` のディレクトリ境界と依存規約                                                                                            |
| [context/infrastructure.md](../context/infrastructure.md)       | Infrastructure Contract の位置づけ変更、ツール境界表、bootstrap 順序、state / secret の扱い                                      |
| [context/project.yml](../context/project.yml) の `repos.infra`  | `kufu-infra` の参照を、アーカイブ済みである旨へ変更する                                                                          |
| [context/project.yml](../context/project.yml) の `repos.layout` | `infra/` を追加する                                                                                                              |
| [context/project.yml](../context/project.yml) の `commands`     | `infra:plan` / `infra:apply` を追加する (`dev-commands` skill がここを正本として読む)                                            |
| [context/project.yml](../context/project.yml) の `domains`      | `infra` を追加するか `core` に含めるかを決める (`domain:*` ラベルの体系に影響する)                                               |
| [design/DesignDoc.md](../design/DesignDoc.md) の 105 / 116 行目 | ADR-0001 を infra repo 境界の正本とする記述を、本 ADR へ差し替える                                                               |
| [design/DesignDoc.md](../design/DesignDoc.md) の 251 行目       | 「Terraform は別 repo 管理とし、アプリ repo に本番基盤の apply 導線を持ち込まない」は本 ADR が覆す規範そのものである。書き換える |
| [design/DesignDoc.md](../design/DesignDoc.md) の 280 行目       | Open Question #6「infra repo と app repo の変更を相互参照する review workflow」は集約により論点が消滅する。クローズする          |

- ADR-0001 の状態は、本 ADR が承認された時点で「置換」へ変更する。提案の段階では変更しない
- **図 ([design/diagrams/](../design/diagrams/)) は提案の段階で追加済みである。** 図は ADR 本文の一部であり、ADR と同時に存在すべきものだからである。context / DesignDoc の更新が実装完了後であることとの差は、この理由による

## 関連ドキュメント

- [ADR-0001](0001-terraform-infra-repository-boundary.md): 本 ADR が supersede する決定
- [ADR-0016](0016-cloudflare-terraform-wrangler-boundary.md): 集約後のツール分担 (本 ADR の前提の上に立つ)
- [ADR-0003](0003-phase1-corporate-site-only-and-cms-deferred.md): Phase 1 の対象が corporate-site のみであること
- [design/DesignDoc.md](../design/DesignDoc.md): 105 / 116 行目が ADR-0001 を infra repo 境界の正本として参照している (承認後に差し替える)
- [context/infrastructure.md](../context/infrastructure.md): Infrastructure Contract / Environment Strategy
- [ADR-0013](0013-designdoc-present-facts-only.md): 現状事実のみを記載する原則 (context の更新時期の根拠)
- [Cloudflare Terraform Best Practices](https://developers.cloudflare.com/terraform/advanced-topics/best-practices/): ディレクトリ構成 / モジュール回避 / 環境分割 / cf-terraforming の出典
- [Terraform Best Practices — Key Concepts](https://www.terraform-best-practices.com/key-concepts): 3 層モジュール構成の出典 (本 ADR では採らない)
- issue: #47 (決定経緯)
