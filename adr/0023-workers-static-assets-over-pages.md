# ADR-0023: 配信基盤を Cloudflare Pages から Workers static assets へ移す

## Status

承認

## Context

この ADR は、2 つの ADR の判断の一部だけを置き換える。

- ADR-0021 のうち、Pages を前提にした判断を置き換える。
  - 置き換えるのは、配信基盤を Pages のまま続ける判断、Pages project を Wrangler の管轄にする判断、Pages での bootstrap の順序、管轄の表の Pages の行である。
  - 「データを保持するリソースは Terraform、実行するリソースは Wrangler」という管轄の原則は変えない。
  - ADR-0021: [Cloudflare リソースの管理は Terraform と Wrangler で分担する](0021-cloudflare-terraform-wrangler-boundary.md)
- ADR-0009 のうち、送信の実行基盤を Pages Functions にした判断を置き換える。
  - 入力の項目、検証、通知、API の契約、error code は変えない。
  - ADR-0009: [corporate-site の問い合わせの送信は Cloudflare Pages Functions（Workers）で中継する](0009-corporate-site-contact-form-backend.md)

ADR-0021 は配信基盤を Pages のまま続けると決め、Workers への移行を別の issue へ回した。  
その判断は 3 つの根拠に立っていた。  
#47 で deploy の workflow を作り直す準備を進めると、3 つとも成り立たないことが分かった。

| ADR-0021 が挙げた根拠                                           | 確かめた事実                                                                                                                                                        |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 決めた構成（Pages Functions を含む）を設計し直す必要がある      | **Pages Functions は実装されていない。** `apps/corporate-site/functions/` がなく、issue #26 は open のままである。設計し直す対象は文書だけで、コードはない          |
| 作業の範囲が issue を大きく超える                               | #47 は deploy の workflow を作り直す issue である。Pages を前提にした workflow をこれから書くところで、Workers で書いても手間は大きく変わらない                     |
| Pages と Workers のどちらを長く保つかは Cloudflare の方針による | **方針は公開されている。** 公式が Pages からの移行ガイドと機能の比較表を持つ。`wrangler` は、非対話で失敗したときのメッセージで、新規の project を Workers へ勧める |

provider の resource の分け方も、Pages と Workers で違う。  
provider 5.24.0 の schema を比べた結果は次のとおり。

| resource                    | 必須の項目                                  | secret を持つか                           | assets を持つか |
| --------------------------- | ------------------------------------------- | ----------------------------------------- | --------------- |
| `cloudflare_pages_project`  | `account_id` / `name` / `production_branch` | **持つ**（`deployment_configs.env_vars`） | 持つ            |
| `cloudflare_worker`         | `account_id` / `name`                       | **持たない**                              | **持たない**    |
| `cloudflare_worker_version` | `account_id` / `worker_id`                  | 持つ                                      | 持つ            |

**Pages は、箱と中身が 1 つの resource にまとまっている。**  
ADR-0021 は、Pages project を丸ごと Wrangler の管轄にした。  
Terraform に持たせると secret まで抱え、`ignore_changes` で管理の外の範囲を作るしかなかったからである。  
**Workers は、箱と中身が別の resource に分かれている。**  
ADR-0021 の管轄の原則が、例外なく当てはまる。

## Decision

- **配信基盤を Workers static assets へ移し、Cloudflare Pages を使わない。**
  Context の 3 つの根拠が成り立たず、Workers では管轄の原則が例外なく当てはまるためである。
- **Astro の出力は `output: "static"` のまま変えない。**
  `dist/` を、そのまま Worker の static assets として配る。
- **`/api/contact` は Worker script が処理する。**
  Workers static assets は、何も設定しなければ assets を先に返し、一致しなければ Worker を呼ぶ。
  `/api/contact` は静的なファイルとして存在しないので、Worker に届く。
  `run_worker_first` は要らない。
- **Astro の Cloudflare adapter は入れない。**
  静的な出力のままなら要らない。

### 管轄

ADR-0021 の原則は変えず、当てはめる先を Workers の resource に変える。

| リソース                               | 管轄      | 根拠                                                       |
| -------------------------------------- | --------- | ---------------------------------------------------------- |
| Zone / DNS record / TLS                | Terraform | ADR-0021 から変えない                                      |
| `cloudflare_worker`（箱）              | Terraform | 名前と `tags` だけを持つ。`observability` は設定しない     |
| `cloudflare_workers_custom_domain`     | Terraform | 必須の項目は `account_id` / `hostname` / `service` の 3 つ |
| `workers_dev` / `preview_urls`         | Wrangler  | `wrangler.jsonc` に書く。wrangler の既定値との衝突を避ける |
| Rate Limiting ルール（`/api/contact`） | Terraform | ADR-0021 から変えない                                      |
| R2 バケット（state / VRT baseline）    | Terraform | ADR-0021 と ADR-0022 から変えない                          |
| `cloudflare_worker_version`（中身）    | Wrangler  | assets、bindings、secret を持ち、deploy のたびに変わる     |
| `cloudflare_workers_deployment`        | Wrangler  | どの version を live にするかを決める。deploy そのもの     |
| runtime secret（Resend / Turnstile）   | Wrangler  | ADR-0021 から変えない。Terraform の state に載せない       |

- ADR-0022: [VRT baseline を Cloudflare R2 へ移す](0022-vrt-baseline-on-r2.md)

`observability`、`workers_dev`、`preview_urls` は、`wrangler.jsonc` に書かなくても wrangler が既定値を送る。  
Terraform でも持つと、deploy のたびに値を取り合う。  
そのため、この 3 つは Wrangler の管轄にし、`wrangler.jsonc` に明示する。  
`logpush` と `tags` は wrangler が送らないので、Terraform が持つ。  
`cloudflare_workers_script_subdomain` は Terraform で管理しない。

### bootstrap の順序

Pages では、`cloudflare_pages_domain` が project の存在を前提にし、`wrangler pages deploy` は project を自動では作らない。  
そのため、運用者が手で作り、Wrangler、Terraform の順に実行する必要があった。  
Workers では Terraform が箱を作れるので、次の順にする。

1. `terraform apply` が `cloudflare_worker` と Zone / DNS / TLS を作る。
2. deploy の workflow が `wrangler deploy` で version を上げ、deployment を切り替える。
3. `terraform apply` が `cloudflare_workers_custom_domain` を張る。

運用者が手で実行する初回の手順はなくなる。

### preview

preview URL は version ごとに自動で作られる。  
作るかどうかは `wrangler.jsonc` の `preview_urls` で宣言する。  
CI では alias を付け、pull request の番号から preview を開けるようにする。

- alias のない preview URL は `wrangler` 3.74.0 以上、alias 付きは 4.21.0 以上で使える。
- preview URL は、2024-09-25 以降にアップロードした version だけで使える。Worker は新しく作るので、この条件は問題にならない。

### runtime secret の置き場

runtime secret は、ADR-0021 のとおり Wrangler で投入する。  
Cloudflare Secrets Store は採らない。  
Workers では Secrets Store を使えるので見直したが、次の 3 つの理由で結論を変えない。

- **open beta である。** 本番の問い合わせフォームが頼る secret の置き場には早い。
- **利点が出ない。** Secrets Store の価値はアカウントをまたいだ再利用にある。消費者は Worker 1 つ、secret は 3 つで、共有する相手がいない。
- **コードが変わる。** 参照が `env.X` から `await env.X.get()` になり、非同期の呼び出しが増える。

GA になり、secret を共有する 2 つ目の消費者が現れたら見直す。

### 稼働中のサイトの切り替え

corporate-site は、いま Pages の GitHub 連携で公開している。  
切り替えは次の順で行う。

1. Worker を作り、production とは別の URL で内容を確かめる。
2. `cloudflare_workers_custom_domain` を張る前に、Pages の側の custom domain を外す。
3. Worker の側へ custom domain を張り、DNS が Worker を指すことを確かめる。
4. 表示と `/api/contact` を確かめた後で、Pages project を消す。

custom domain は同時に 2 つの宛先へ張れないので、手順 2 と 3 の間はサイトが落ちる。  
作業の時間帯を決め、切り戻しの手順（Pages の側へ custom domain を戻す）を #47 の作業で残す。

## Verification

`wrangler` 4.126.0 の同梱の schema と bundle で、`wrangler.jsonc` に書かないときに送る既定値を確かめた。

| 設定            | wrangler の既定     | 対応する Terraform                    | 管轄      |
| --------------- | ------------------- | ------------------------------------- | --------- |
| `observability` | `{ enabled: true }` | `cloudflare_worker`                   | Wrangler  |
| `workers_dev`   | `true`              | `cloudflare_workers_script_subdomain` | Wrangler  |
| `preview_urls`  | `false`             | `cloudflare_workers_script_subdomain` | Wrangler  |
| `logpush`       | 送らない            | `cloudflare_worker`                   | Terraform |
| `tags`          | キーがない          | `cloudflare_worker`                   | Terraform |

「`observability`、`workers_dev`、`preview_urls` を `wrangler.jsonc` に書かず、Terraform だけで持つ」という当初の回避の方針は成り立たなかった。  
たとえば `preview_urls` の既定は `false` で、Terraform で `previews_enabled = true` にしても、deploy のたびに戻される。

- provider 5.24.0（2026-08-24 公開）が、Workers static assets の resource を持つ。
- Secrets Store は、Workers から使える形になっている。
  - Workers の binding のキーは `secrets_store_secrets` で、`binding` / `store_id` / `secret_name` を取る。
  - 値は `wrangler secrets-store secret create` で投入でき、Terraform の state に載せずに済む。
  - provider は、値を持たない `cloudflare_secrets_store` と、値が required かつ sensitive の `cloudflare_secrets_store_secret` に分かれる。箱だけを Terraform が持てる。
- `@astrojs/cloudflare` 14.2.5（2026-08-25 公開）は、Workers を配信先とする adapter である。
  - 説明文は "Deploy your site to Cloudflare Workers" である。
  - peer dependency は `astro ^7.2.0` / `wrangler ^4.125.0` で、このリポジトリの Astro は 6.3.1 である。

## Considered Options

| 選択肢                                            | 強み                                                                                                 | 弱み                                                                                                                                                                                                                                        |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** 配信基盤を Workers static assets へ移す | 管轄の原則が例外なく当てはまる。bootstrap が Terraform から始まる。Cloudflare が新規に勧める側に立つ | 稼働中のサイトの切り替えで、サイトが落ちる時間が出る。preview の alias に `wrangler` 4.21.0 以上が要る                                                                                                                                      |
| Cloudflare Pages を続ける（ADR-0021 を保つ）      | 稼働中のサイトを触らず、サイトが落ちない。決定を変えずに済む。`wrangler` の版に依存しない            | Pages project を丸ごと Wrangler へ渡すので、production branch や compatibility date が Terraform の差分に出ない。運用者が手で作る初回の手順が残る。Cloudflare が新規を Workers へ勧める向きと逆に進み、実装が進むほど後の移行の手間が増える |
| Pages と Workers を並べて使う                     | 段階的に移せる                                                                                       | 管轄の表とツールの分担が 2 系統になり、ADR-0021 が避けようとした「どちらの管轄か」の判断が増える。このプロジェクトは app が 1 つで、分ける単位がない                                                                                        |

公式は Pages の利点として、Early Hints のネイティブの対応、file-based routing、Cloudflare の zone の外の custom domain、Pages Plugins の 4 つを挙げる。  
このプロジェクトは、どれも使わない。  
ドメインは Cloudflare の zone の中にあり、API は `/api/contact` の 1 本で、Plugins は使っていない。  
Early Hints は、Workers でも `Link` header で出せる。

## Consequences

### Positive

- ADR-0021 の原則が例外なく成り立つ。ADR-0021 が退けた、`ignore_changes` で管理の外の範囲を作る案を使わずに済む。
- bootstrap が Terraform から始まり、運用者が手で作る手順がなくなる。
- preview URL を作るかどうかを `wrangler.jsonc` で宣言できる。Pages では project の側の設定で、コードから触れなかった。
- 構成が減る。Astro の adapter も `run_worker_first` も要らない。
- 将来 SSR へ移る道は残る。`@astrojs/cloudflare` は Workers を配信先とする adapter になっている。

### Negative

- **稼働中のサイトの切り替えで、サイトが落ちる時間が出る。** custom domain を付け替える間だけである。
- Pages の GitHub 連携を外す作業が、切り替えと同時になる。
- ADR-0009 が前提にした Pages Functions が Worker script になる。実装の後に、`context/operations.md`、`context/codebase.md`、問い合わせフォームの Design Doc の置き場と実行モデルの記述を更新する。
  - 出典: [operations.md](../context/operations.md#kufu-infra-へ渡す取り決め)
  - 出典: [問い合わせフォームの Design Doc](../design/features/contact-form/DesignDoc.md)
- Early Hints をネイティブには使えない。いまは使っていないので、困らない。
- SSR へ移るときは、adapter を入れる前に Astro のメジャーの更新が要る。`output: "static"` を保つ間は影響しない。
- 初回の deploy の後に `terraform plan` が空になることを、まだ確かめていない。管轄の表で衝突は避けられる見込みで、実装の最初に確かめる。
- 切り替えでサイトが落ちる時間の長さを、見積もっていない。custom domain の付け替えと DNS の伝播による。
