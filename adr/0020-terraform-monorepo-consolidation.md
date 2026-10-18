# ADR-0020: Terraform の infra code を Kufu Monorepo へ集約する

## Status

承認

## Context

- ADR-0001 は、Cloudflare の infra code を Terraform で管理し、その置き場を別リポジトリ `kufu-infra` に置くと決めた。
  - ADR-0001: [Terraform の infra code は kufu-apps と別のリポジトリで管理する](0001-terraform-infra-repository-boundary.md)
- `kufu-infra` には、決定から 3 か月たっても `.tf` ファイルが 1 つもない。
  最終コミットは 2026-05-08 にある。
  分離のコスト（別リポジトリの維持、基盤への取り決めの同期）だけを払い、利益を受け取っていない。
- Cloudflare の設定はすべて Dashboard 上にあり、コードで管理していない。
  この状態は、ADR-0001 が Dashboard の運用の欠点として退けたものと同じになる。
- テスト戦略と CI の整備（#33）は、VRT baseline の保管先に R2 を選び、空のリポジトリを待って一度止まった。
  #33 は baseline を Git で管理して R2 への依存を外し、完了した。
  - ADR-0018: [story の側の VRT を Storybook の公式のテストの基盤に載せ、baseline をリポジトリで管理する](0018-story-vrt-on-storybook-test-integrations.md)
- #47 では baseline の保管先を R2 と決めた。
  Git の管理では PNG が履歴に積もり続けるためである（`.git` の 60MB のうち、VRT の PNG の blob が 212 個、17.8MB を占める）。
  - ADR-0022: [VRT baseline を Cloudflare R2 へ移す](0022-vrt-baseline-on-r2.md)
- ADR-0001 の判断が誤っていたのではない。
  別リポジトリの運用は、そこへ書き込む頻度と担当があって初めて機能する。
  その前提が満たされなかった。

## Decision

- **Cloudflare の infra code を Kufu Monorepo へ集約する。** ADR-0001 をこの ADR で置き換える。
- `kufu-infra` は、削除せずにアーカイブする。
  ADR-0001 のコピーと初期の検討の履歴を残して、判断の経緯を追えるようにする。
  read-only にして、誤って書き込みが再開されるのを防ぐ。
- どのリソースを Terraform と Wrangler のどちらが持つかは、この ADR では決めない。
  ADR-0021 が定める。
  - ADR-0021: [Cloudflare リソースの管理は Terraform と Wrangler で分担する](0021-cloudflare-terraform-wrangler-boundary.md)
- この ADR は ADR-0021 と同時に承認する。
  monorepo に同居する欠点のうち、credential の分離と本番への影響が大きい変更の扱いは、ADR-0021 のツールの分担に依存するためである。
- 基盤への取り決めは、app のリポジトリから infra のリポジトリへの受け渡しではなく、同じリポジトリの中の規約として残す。
  - 出典: [context/operations.md の kufu-infra へ渡す取り決め](../context/operations.md#kufu-infra-へ渡す取り決め)

### `infra/` をリポジトリの直下に置き、Cloudflare の推奨に沿って分ける

ディレクトリの構成は次のとおり。

```text
infra/
├── README.md                    # apply の手順、bootstrap の順序、権限
├── bootstrap/                   # state の置き場を作るためだけの root module。初回に 1 回
│   ├── provider.tf
│   ├── r2_state_bucket.tf
│   └── vars.tf
└── cloudflare/                  # 本体。account と zone のレベルを 1 つのディレクトリにまとめる
    ├── provider.tf              # terraform{}、backend（R2）、provider
    ├── vars.tf
    ├── r2.tf                    # account のレベル
    ├── dns.tf                   # zone のレベル
    ├── pages_domain.tf
    └── rate_limiting.tf
```

- `infra/` はリポジトリの直下に置き、`packages/infra/` にしない。
  `pnpm-workspace.yaml` の glob は `apps/*` と `packages/*` だけなので、workspace の package として拾われない。
  `packages/` は app から import される共有のライブラリの場所であり、infra はどこからも import されない。
- 実行は、`pnpm infra:plan` のような root の script から行う。
  `package.json` を持たない直下のディレクトリを root の script から動かす形は、既存の `e2e/` と同じにする。
- ファイルは `provider.tf`、`<subject>.tf`、`vars.tf` の 3 種に分ける。
  - 出典: [Cloudflare Terraform Best Practices](https://developers.cloudflare.com/terraform/advanced-topics/best-practices/) の「Directory structure」
- bootstrap を別の root module にする。
  state の置き場の R2 バケットを Terraform 自身が作るため、`infra/cloudflare/` だけでは初回を実行できない。
  `bootstrap/` の state はローカルに置いて commit せず、失ったら `terraform import` で回復する。
- state の key には scope を含め、`cloudflare/main/terraform.tfstate` とする。
  後から兄弟の state を足すときに、既存の state の名前を変えずに済む。
- 環境をディレクトリで分けない（`envs/staging/` の形を採らない）。
  Cloudflare は staging、QA、production を別のアカウントと別のドメインで分けるよう定めている。
  アカウントの階層の共有リソース（Load Balancer の monitor や pool など）を、同じアカウントの中で分けられないためである。
  - 出典: [Cloudflare Terraform Best Practices](https://developers.cloudflare.com/terraform/advanced-topics/best-practices/) の「Use separate environments」

### state は R2 に置き、`s3` backend の AWS 向けの検証を切る

R2 は S3 互換だが AWS ではない。  
`s3` backend は STS、IAM、metadata API を前提にする箇所があるため、その検証を切る。  
state のロックは、R2 に DynamoDB がないので、`use_lockfile` で S3 の側のロックファイルを使って取る。

```hcl
backend "s3" {
  bucket = "<state バケット名>"
  key    = "cloudflare/main/terraform.tfstate"
  region = "auto"

  endpoints = { s3 = "https://<ACCOUNT_ID>.r2.cloudflarestorage.com" }

  skip_credentials_validation = true # STS が無い
  skip_region_validation      = true # auto は AWS のリージョン名でない
  skip_requesting_account_id  = true # IAM / STS / metadata API が無い
  skip_s3_checksum            = true # R2 のチェックサム対応が限定的
  use_path_style              = true
  use_lockfile                = true # state ロックを S3 側のオブジェクトで取る
}
```

### module を作らない

`modules/` を設けず、resource module、infrastructure module、composition の 3 層の構成を採らない。  
Terraform の一般的なベストプラクティスはこの 3 層を示す。  
出典: [Terraform Best Practices — Key Concepts](https://www.terraform-best-practices.com/key-concepts)  
一方 Cloudflare は、module を避けるか控えめに使うよう定める。  
共有の module の内部を変えるとリソースが同期を失うか作り直されること、Terraform core の外のロジックがデバッグを難しくすることが理由である。  
出典: [Cloudflare Terraform Best Practices](https://developers.cloudflare.com/terraform/advanced-topics/best-practices/) の「Avoid modules (or use them sparingly)」

Cloudflare の側を採る根拠は次の 3 つ。

1. 3 層の構成が役に立つのは、同じ形が繰り返される場合（複数のアカウント、リージョン、環境）である。対象は 1 アカウント、1 zone、1 サイトで、括り出す重複がない。
2. 1、2 個のリソースを包む module は薄いラッパーになり、変数と出力を増やすだけで重複を減らさない。
3. プロジェクトの判断の優先順位は、将来の拡張性を最下位に置く。3 層にするのは将来の拡張性への投資であり、上位の一貫性と開発体験を削る。
   - 出典: [context/project.yml](../context/project.yml) の `decision_priority`

module は、同じ形が 2 か所以上に実在し、かつリポジトリの中のローカルの module として持てるときに作る。  
Cloudflare の警告は共有の module に最も強く当たり、同じ pull request でしか変わらないローカルの module はリスクの質が違うためである。

### 規模が変わったときの構成を先に決める

引き金を満たすまで、構成を展開しない。

| 段階 | 状況                         | 形                                                  | 引き金                                                       |
| ---- | ---------------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| 0    | 現在（corporate-site だけ）  | `infra/cloudflare/` と `infra/bootstrap/`           | なし                                                         |
| 1    | 別の app を足す（同じ zone） | `infra/cloudflare/` を `shared/` と `<app>/` に分割 | app に固有のリソースが数個を超えるか、apply の頻度が分かれる |
| 2    | staging などの環境を足す     | `infra/cloudflare/<account>/...`                    | 2 つ目の Cloudflare アカウントを使う                         |
| 3    | AWS や GCP を併用する        | `infra/aws/` や `infra/gcp/` を並べる               | 別の provider を導入する                                     |

- 段階 3 で初めて composition が役に立つ。
  provider をまたぐ参照が生じ、root module の間で値を渡す `terraform_remote_state` が要るためである。
- 名前を `infra/main/` ではなく `infra/cloudflare/` にしたのは、段階 3 に備えるためである。
- subject ごとにファイルを分けておくと、段階 1 の分割はファイルの移動だけで済む。
- root module を分けるときは、state を分ける作業（`terraform state mv` か import）が一度要る。
  最初から分けると、6 個ほどのリソースに常に運用のコストを払うことになり、判断の優先順位に反する。
  一度きりの作業として受け入れる。

### 既存の Dashboard の設定は import し、実在しないものは新しく書く

Cloudflare が推奨する `cf-terraforming` で、既存のリソースを Terraform の state へ import する。  
本番で動くリソースを削除して作り直すことを避けるため、作り直さない。  
見込みは次のとおり。

- Zone、DNS record、TLS: `cf-terraforming` で import する。公開中のサイトが依存しており、実在する。
- custom domain の紐付け: 新しく作る。ADR-0023 が配信基盤を Workers へ移すため、既存の Pages の側は import せずに張り直す。
  - ADR-0023: [配信基盤を Cloudflare Pages から Workers static assets へ移す](0023-workers-static-assets-over-pages.md)
- `/api/contact` の Rate Limiting のルール: 新しく作る。基盤への取り決めが「設定する」と将来の形で書いており、まだない。`/api/contact` も実装していない。
- VRT baseline 用の R2 バケット: 新しく作る。ADR-0022 が保管先を R2 と定めた。
- Terraform の state 用の R2 バケット: 新しく作る。`infra/bootstrap/` が作る。
- runtime secret: 対象にしない。ADR-0021 が Wrangler の管轄と定める。

この見込みは棚卸しの前に作った。  
apply の前に Dashboard を棚卸しして実在するリソースを確定し、結果を基盤への取り決めに書く。  
見込みと食い違ったら、棚卸しの結果を正とする。

### monorepo に同居する欠点に、1 つずつ対処する

ADR-0001 が monorepo に同居する欠点として挙げた 5 点は、集約した後も消えない。

- UI の変更と本番の infra の変更が同じ差分に並び、レビューの観点が入り交じる。
  - Terraform を `infra/` に限り、差分の場所で見分けられるようにする。日常の deploy は Terraform を通らないので、UI の変更の pull request に infra の差分は入らない。
- apply の権限や Cloudflare の credential が、app の開発の導線に近づく。
  - credential を 2 系統に分ける。通常の CI は deploy の scope に限った token だけを持ち、apply は手動の起動と environment protection rules を通す。
- DNS、secret、Workers のような本番への影響が大きい変更が、通常の pull request に埋もれる。
  - Terraform の管轄（DNS、R2、Rate Limiting）は、apply を自動で実行しない。merge しても、apply の workflow を手動で起動しなければ本番に反映されない。
  - Wrangler の管轄の Worker script には対処しない。理由は次の節に書く。
- どこまで触ってよいかの境界が曖昧になる。
  - ディレクトリの構成で境界を定める。実装した後、その事実を [context/codebase.md](../context/codebase.md) に書き、CLAUDE.md の系統の生成物から参照させる。
- 将来 Cloudflare の基盤を複数の app やリポジトリで共有すると、責務が広がりすぎる。
  - 対処せず、見直しの条件を満たしたら再検討する。いま Cloudflare を共有する別の app はない。
  - ADR-0003: [Phase 1 は `apps/corporate-site` だけを実装し、`apps/cms` の設計を後続へ送る](0003-phase1-corporate-site-only-and-cms-deferred.md)

### Worker script の変更は、集約しても悪化しないので対処しない

Worker script は Wrangler の管轄で、push を起点とする deploy の workflow が自動で本番に反映する。  
`/api/contact` のコードの変更は通常の pull request に入り、apply の workflow のような明示の操作を挟まない。  
別リポジトリの構成を保っても、Worker のコードは app の側にあるので、app のリポジトリへの push で自動で deploy される。  
この欠点は、リポジトリをどう分けても解けない。  
緩和は通常の pull request のレビューと自動テストに任せ、infra の権限の分離とは別の問題として扱う。

`/api/contact` は実装しておらず（`apps/corporate-site/functions/` がなく、issue #26 が open）、自動で deploy した実績はない。  
ここで書くのは、構成から導いた結果である。  
ADR-0013: [Design Doc の各節には今の事実だけを書き、将来の計画は Open Questions / Future Work 節に集める](0013-designdoc-present-facts-only.md)

runtime secret は、この欠点に当たらない。  
値が pull request の差分に現れず、特権を持つ手順でだけ変わるので、通常の pull request に埋もれることがない。

### 1 名の体制でも成り立つ分離だけを使う

開発は 1 名なので、自分の変更を自分が承認することになり、レビューによる職務の分離は成り立たない。  
`.github/CODEOWNERS` での所有者の宣言も同じ理由で分離にならないため、設定しない。  
1 名でも成り立つ分離は次の 2 つ。

- apply を自動で実行せず、必ず手動で起動する。
- 通常の CI に apply 用の credential を持たせない。

人が増えてレビューで分離できるようになったら、手段を足すかを見直す。

### `kufu-infra` から 2 点を書き写すまでアーカイブしない

`kufu-infra` の PRD と DesignDoc には、このリポジトリのどの文書にもない内容が 2 点ある。

- preview と production で、secret の実値を共有しない。ADR-0021 は secret を Wrangler の管轄と定めたが、環境の間で値を分けることは書いていない。
- resource の import と state の移動には、rollback と検証の手順を spec に残す。Dashboard の設定の移行は対象を定めたが、失敗したときの戻し方を定めていない。

実装のときに、この 2 点を [context/operations.md](../context/operations.md) と #47 の spec に書き写す。  
書き写し終えるまで、`kufu-infra` をアーカイブしない。

### 見直しの条件

次のどちらかが起きたら、この決定を再検討する。

- Kufu Monorepo の外の app が、同じ Cloudflare アカウントの基盤を共有する必要が生じた。
- 人が増え、infra の変更のレビューを担う人と app の開発を担う人を分けられるようになった。

## Verification

- `s3` backend の設定を、MinIO を S3 互換の代わりにして terraform 1.14.3 で確かめた（2026-08-25）。
  - `init` と `apply` が通り、state が `cloudflare/main/terraform.tfstate` に書かれた。
  - apply の間は `terraform.tfstate.tflock` が現れ、ロックを持ったまま別の apply を実行すると `Error acquiring the state lock` で拒まれた。
  - MinIO は R2 ではない。HashiCorp は S3 互換のストレージを best effort とし、Amazon S3 でしかテストしていない。R2 に固有の挙動（とくにチェックサムの扱い）は、初回の apply まで確かめられず、未確認のまま残る。
- `kufu-infra` の全ブランチ（`develop`、`feature/1`）を確かめた（2026-08-25）。
  - `.tf` は 1 つもない。追跡するファイル 118 個のうち 97 個が AI の設定（`.claude/`、`.codex/`、`.cursor/`、`.agents/`）にあたる。
  - 既定のブランチは `main` ではなく `develop` である。
  - `PRD.md`（155 行）と `design/DesignDoc.md`（217 行）は、このリポジトリのコピーではなく、infra に固有の要求と設計を持つ。判断はこの ADR と ADR-0021 が引き継ぎ、引き継げていない 2 点を Decision に書いた。
  - `adr/0001-...` は、このリポジトリの ADR-0001 と表題と決定日だけが違う。`hooks/` と `specs/` は共有のプロセスの配布物で、元のファイルはこのリポジトリにある。

## Considered Options

| 選択肢                                                       | 強み                                                                                                                       | 弱み                                                                                                                                                                                                           |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** monorepo の `infra/` に集約し、module を作らない   | 1 つの pull request で app と infra の変更を揃えられる。`infra/` の接頭辞で境界とレビューの観点を分けられる                | 権限の分離をリポジトリの境界ではなく、ディレクトリと workflow の組み合わせで行う。monorepo の責務が広がる                                                                                                      |
| 別リポジトリのまま Terraform を書き始める（ADR-0001 を保つ） | 決定を変えずに済む。apply の権限と credential を app の開発の導線から切り離す狙いを、設計どおりに実現できる                | 着手されなかった原因に対処していない。3 か月の空白は手順の重さが障壁だったことを示し、同じ構造なら同じ結果になる見込みが高い。R2 の 1 リソースのために別リポジトリの初期の構築が要る。同期のコストを払い続ける |
| Terraform を使わず Dashboard で運用する                      | 追加の学習と state の運用が要らない。今からの変更が最も小さい                                                              | ADR-0001 が挙げた欠点（変更の履歴、review、再現性、環境の差分の管理が弱く、secret と binding の運用が属人化する）がそのまま当たる。#47 の目的の 1 つ（Cloudflare のリソースをコードで管理する）を満たさない    |
| 3 層の module の構成を採る                                   | Terraform の一般的なベストプラクティスに沿う。app や provider が増えても構成を変えずに広げられる。層ごとの責務が明確になる | Cloudflare が module を避けるよう定める。括り出す重複がなく、薄いラッパーにしかならない。最下位の将来の拡張性のために、一貫性と開発体験を削る                                                                  |
| 集約するが、ディレクトリを分けず app と同じ並びに置く        | 構成が最も単純になる                                                                                                       | 境界が曖昧になる欠点とレビューの観点が入り交じる欠点に対処できない。`infra/` の接頭辞がなく、CI の path filter で infra の変更だけを対象にできない                                                             |

## Consequences

### Positive

- 1 つの pull request で app の変更と infra の変更を揃えられる。#33 のように app の都合で infra のリソースが要る変更が、リポジトリをまたがずに済む。
- 基盤への取り決めと実体が同じリポジトリに置かれ、同期を忘れて食い違うことがなくなる。
- VRT baseline の保管先を R2 にする選択肢が開く。
- コードで管理していなかった Cloudflare のリソースが、初めてコードの管理に入る。

### Negative

- monorepo の責務が広がる。frontend が中心のリポジトリに infra の関心が加わり、読み手が把握する範囲が増える。
- 権限の分離を、ディレクトリと workflow の組み合わせで行う。リポジトリの境界より弱く、設定し忘れがそのままリスクになる。
- ADR-0001 を前提に書いた文書を、実装した後に直す必要がある。
  - [context/codebase.md](../context/codebase.md): `infra/` のディレクトリの境界と依存の規約を書く。
  - [context/operations.md](../context/operations.md): 基盤への取り決めの位置づけ、ツールの境界、bootstrap の順序、state と secret の扱いを書く。
  - [context/project.yml](../context/project.yml): `repos.infra` をアーカイブ済みに変え、`repos.layout` に `infra/` を、`commands` に `infra:plan` と `infra:apply` を足す。
  - [design/DesignDoc.md](../design/DesignDoc.md): ADR-0001 を根拠とする記述と「Terraform は別 repo 管理とする」の記述を書き換える。
    - infra と app のリポジトリをまたぐ review の未決事項は、論点がなくなるので閉じる。
- `kufu-infra` をアーカイブすると、そこへのリンクの先は read-only になる。リンクは切れない。
- `kufu-infra` の既定のブランチは `develop` なので、アーカイブの前に内容を取り出すときは参照するブランチを間違えない。
