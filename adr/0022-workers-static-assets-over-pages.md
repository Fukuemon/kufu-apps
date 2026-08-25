# ADR-0022: 配信基盤を Cloudflare Pages から Workers static assets へ移す

## 状態

承認 (2026-08-25)

## 決定日

2026-08-25

## 背景

[ADR-0020](0020-cloudflare-terraform-wrangler-boundary.md) は配信基盤を Cloudflare Pages のまま続けると決め、Workers への移行は別 issue へ回した。その判断は 3 つの根拠に立っていたが、実装の準備を進める過程で 3 つとも成立しないことが分かった。

| ADR-0020 が挙げた根拠                                           | 2026-08-25 時点の事実                                                                                                                                      |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 決定済みの構成 (Pages Functions を含む) の再設計を伴う          | **Pages Functions は未実装である。** `apps/corporate-site/functions/` が存在せず、issue #26 は open のままである。再設計する対象は文書だけで、コードが無い |
| 作業範囲が本 issue を大きく超える                               | #47 は deploy 経路を作り直す issue である。Pages 前提の経路をこれから新規に書くところであり、Workers で書くのと手間が大きく変わらない                      |
| Pages と Workers のどちらを長期的に維持するかは Cloudflare 次第 | **方針は表に出ている。** 公式が Pages からの移行ガイドと機能比較表を持ち、`wrangler` は非対話の失敗メッセージで新規を Workers へ寄せる                     |

### provider の構造が決定的だった

provider 5.24.0 の schema を比べたところ、Pages と Workers で resource の切り方が違っていた。

| resource                    | 必須                                        | secret を持つか                          | assets を持つか |
| --------------------------- | ------------------------------------------- | ---------------------------------------- | --------------- |
| `cloudflare_pages_project`  | `account_id` / `name` / `production_branch` | **持つ** (`deployment_configs.env_vars`) | 持つ            |
| `cloudflare_worker`         | `account_id` / `name`                       | **持たない**                             | **持たない**    |
| `cloudflare_worker_version` | `account_id` / `worker_id`                  | 持つ                                     | 持つ            |

**Pages は箱と中身が 1 つの resource に融合している。** ADR-0020 が Pages project を丸ごと Wrangler の管轄としたのは、Terraform に持たせると secret まで抱えることになり、`ignore_changes` で穴を開けるしかなかったからである。

**Workers は箱と中身が別の resource になっている。** ADR-0020 が立てた「データを保持するリソースは Terraform、実行するリソースは Wrangler」という原則が、例外なしで当てはまる。

## 決定

- **配信基盤を Workers static assets へ移す。** Cloudflare Pages を使わない。
- **Astro の出力は `output: "static"` のまま変えない。** `dist/` をそのまま Worker の static assets として配る。
- **`/api/contact` は Worker script が処理する。** Workers static assets は既定で assets を先に返し、一致しなければ Worker を呼ぶ。`/api/contact` は静的ファイルとして存在しないため Worker に届く。`run_worker_first` は要らない。
- **Astro の Cloudflare adapter は導入しない。** 静的出力のままなら不要である。

### 管轄

ADR-0020 の原則は変えない。当てはめる先が変わる。

| リソース                              | 管轄      | 判断根拠                                                 |
| ------------------------------------- | --------- | -------------------------------------------------------- |
| Zone / DNS record / TLS               | Terraform | ADR-0020 から変更なし                                    |
| `cloudflare_worker` (箱)              | Terraform | 名前と観測設定だけを持ち、secret も assets も持たない    |
| `cloudflare_workers_custom_domain`    | Terraform | 必須は `account_id` / `hostname` / `service` の 3 つ     |
| `cloudflare_workers_script_subdomain` | Terraform | `previews_enabled` で preview URL の有無を宣言できる     |
| Rate Limiting ルール (`/api/contact`) | Terraform | ADR-0020 から変更なし                                    |
| R2 バケット (state / VRT baseline)    | Terraform | ADR-0020 / ADR-0021 から変更なし                         |
| `cloudflare_worker_version` (中身)    | Wrangler  | assets / bindings / secret を持つ。deploy のたびに変わる |
| `cloudflare_workers_deployment`       | Wrangler  | どの version を live にするか。deploy そのもの           |
| runtime secret (Resend / Turnstile)   | Wrangler  | ADR-0020 から変更なし。Terraform state に載せない        |

### bootstrap の順序が正順に戻る

Pages では `cloudflare_pages_domain` が project の存在を前提とし、かつ `wrangler pages deploy` が project を自動作成しないため、**運用者の手動作成 → Wrangler → Terraform** という逆転した順序を強いられていた。

Workers では箱を Terraform が作れる。

1. `terraform apply` が `cloudflare_worker` と Zone / DNS / TLS を作る
2. deploy workflow が `wrangler deploy` で version を上げ、deployment を切り替える
3. `terraform apply` が `cloudflare_workers_custom_domain` を張る

**運用者が手で叩く初回手順が無くなる。** ADR-0020 が受け入れた手動ステップは、本決定で解消する。

### preview

version ごとに preview URL が自動生成される。`cloudflare_workers_script_subdomain` の `previews_enabled` で有無を宣言し、CI では alias を付けて PR 番号から辿れるようにする。

- 版の要件: 付き preview URL は `wrangler` 3.74.0 以上、alias 付きは 4.21.0 以上である。
- 対象: preview URL は 2024-09-25 以降にアップロードした version でのみ使える。新規に作るため問題にならない。

### 稼働中サイトの移行

現在 corporate-site は Pages の GitHub 連携で公開されている。切り替えは次の順で行う。

1. Worker を作り、production とは別の URL で内容を確認する
2. `cloudflare_workers_custom_domain` を張る前に、Pages 側の custom domain を外す
3. Worker 側へ custom domain を張り、DNS が Worker を指すことを確認する
4. 表示と `/api/contact` を確認したのち、Pages project を削除する

**2 と 3 の間はサイトが落ちる。** custom domain は同時に 2 つの宛先へ張れないためである。作業時間帯を決め、切り戻し手順 (Pages 側へ custom domain を戻す) を spec に残す。

## 代替案

### 1. Cloudflare Pages を続ける (ADR-0020 の維持)

#### Pros

- 稼働中のサイトを触らない。切り替えのダウンタイムが発生しない。
- 決定を変えずに済む。

#### Cons

- Terraform の管轄境界に穴が残る。Pages project を Wrangler へ丸ごと渡すため、production branch や compatibility date が Terraform の差分に現れない。
- 運用者の手動作成が初回手順として残る。
- Cloudflare が新規を Workers へ寄せている方向と逆に進む。将来の移行コストは、実装が進むほど上がる。

### 2. Pages と Workers を併存させる

#### Pros

- 段階的に移せる。

#### Cons

- 管轄表とツール分担が 2 系統になり、ADR-0020 が避けようとした「どちらが管轄か」の判断が増える。
- 本プロジェクトは app が 1 つで、分割する単位が無い。

## 外部依存の健全性

| 項目                                                | 採用 (Workers static assets)                        | 代替案 (Cloudflare Pages)                     |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------- |
| 最終公開日                                          | provider 5.24.0 (2026-08-24) が対応 resource を持つ | 同じ provider が対応                          |
| 対象バージョンへの対応 (peer dependency / 動作要件) | preview alias に `wrangler` 4.21.0 以上             | `wrangler` の版に依存しない                   |
| 後継・代替の有無                                    | Cloudflare が新規へ推奨する側                       | 移行ガイドが用意されている (移行元の位置づけ) |

Pages の利点として公式が挙げるのは Early Hints のネイティブ対応、file-based routing、Cloudflare zone 外の custom domain、Pages Plugins の 4 つである。**本プロジェクトはいずれも使わない。** ドメインは Cloudflare zone 内にあり、API は `/api/contact` の 1 本で、Plugins は未使用である。Early Hints は Workers でも `Link` header で出せる。

## 影響

### 良い影響

- ADR-0020 の原則が例外なしで成立する。`ignore_changes` で穴を開ける必要が無くなり、代替案 3 を退けた理由がそのまま満たされる。
- bootstrap の順序が Terraform 起点に戻り、運用者の手動作成が消える。
- preview URL の有無を Terraform で宣言できる。Pages では project 側の設定であり、Terraform から触れなかった。
- 構成が減る。Astro の adapter も `run_worker_first` も要らない。

### 悪い影響 / トレードオフ

- **稼働中サイトの切り替えでダウンタイムが出る。** custom domain の付け替えの間だけである。
- ADR-0009 が前提にした Pages Functions が Worker script になる。機能仕様 (入力項目 / validation / API 契約 / error code) は変わらないが、置き場と実行モデルの記述を書き換える。
- Pages の GitHub 連携を外す作業が、切り替えと同時になる。
- Early Hints をネイティブに使えない。現時点で使っていないため実害は無い。

### 影響範囲

- 対象 app / package: `apps/corporate-site`、`e2e`、GitHub Actions workflow、新設する Terraform ディレクトリ
- spec 更新要否: 要。#47 の spec に、切り替え手順、ダウンタイムの扱い、切り戻し手順を反映する

### 未確認事項

- **`wrangler deploy` が箱の設定を書き換えるかは未確認である。** `cloudflare_worker` は `observability` / `subdomain` / `tags` を持つ。`wrangler.jsonc` に同じ設定を書くと、deploy のたびに Terraform と取り合う恐れがある。**回避方針**: これらを `wrangler.jsonc` に書かず Terraform 側だけで持つ。実装の最初に、deploy 後の `terraform plan` が空になることを確認する。
- 将来 SSR へ切り替える場合の Astro Cloudflare adapter の Workers 対応は未確認である。現在は `output: "static"` のため影響しない。
- 切り替え時のダウンタイムの長さを見積もっていない。custom domain の付け替えと DNS の伝播に依存する。
- **Cloudflare Secrets Store が使えるかを再評価できる。** ADR-0020 は「Pages Functions からは使えない」と確認して runtime secret の管轄を Wrangler で固定した。Secrets Store は Workers 連携を持つため、本決定で前提が変わる。使えるなら Terraform が値を持たずに secret の binding を宣言でき、管轄を見直す余地が生まれる。**実装の前に確認する。**

## 実装・運用への反映

- **更新時期は実装完了後である。** context と DesignDoc は現状事実を記述する文書であり、決定が承認されただけでは記述すべき事実が存在しない。承認時点で行うのは ADR-0009 と ADR-0020 の状態変更だけである。

| 対象                                                                                                                        | 更新内容                                                           |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [context/infrastructure.md](../context/infrastructure.md)                                                                   | 配信基盤を Workers とし、切り替え手順と切り戻しを書く              |
| [context/architecture.md](../context/architecture.md)                                                                       | Worker script の置き場と、assets との routing を定める             |
| [design/features/corporate-site/DesignDoc_corporate-site.md](../design/features/corporate-site/DesignDoc_corporate-site.md) | 問い合わせフォーム仕様の runtime を Pages Functions から Worker へ |
| `apps/corporate-site/wrangler.jsonc`                                                                                        | assets と Worker script の設定 (新規)                              |

- ADR-0009 と ADR-0020 の状態は、本 ADR の承認に合わせて更新した (2026-08-25)。どちらも Pages を前提にした部分だけが置き換わる。

## 関連ドキュメント / チケット

- [ADR-0020](0020-cloudflare-terraform-wrangler-boundary.md): Terraform / Wrangler の管轄分担 (原則は有効。Pages 前提の部分を本 ADR が置換)
- [ADR-0009](0009-corporate-site-contact-form-backend.md): 問い合わせフォームの backend (Pages Functions 前提の部分を本 ADR が置換)
- [ADR-0019](0019-terraform-monorepo-consolidation.md): infra code の monorepo 集約
- [ADR-0021](0021-vrt-baseline-on-r2.md): VRT baseline を R2 へ置く決定
- issue: #47 (決定経緯) / #26 (Pages Functions の実装。本 ADR で Worker script になる)
