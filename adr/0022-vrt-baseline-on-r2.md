# ADR-0022: VRT baseline を Cloudflare R2 へ移す

## Status

承認

## Context

この ADR は、ADR-0018 の判断のうち「baseline をリポジトリの Git で管理する」だけを置き換える。  
`storycap-testrun` で撮り、`reg-cli` で比べる判断は置き換えない。  
ADR-0018: [story の側の VRT を Storybook の公式のテストの基盤に載せ、baseline をリポジトリで管理する](0018-story-vrt-on-storybook-test-integrations.md)

ADR-0015 は、story の側の baseline を S3 互換のストレージに置くと決めた。  
ADR-0015: [VRT を story と route の 2 系統で導入する](0015-visual-regression-testing-policy.md)

ADR-0018 は、story の側の 81 枚が 2.94MB と小さいことから、baseline を Git で管理する方式へ変えた。  
その後に測ると、Git で管理すると履歴が増え続け、元に戻らないと分かった。

`.git` は 60MB あった。  
履歴の中の PNG の blob の内訳は次のとおり。

| 種別                         | 履歴の中の blob  | 作業ツリー     | 1 枚あたり   |
| ---------------------------- | ---------------- | -------------- | ------------ |
| route の baseline            | 16 個 / 9.48 MB  | 6 枚 / 5.60 MB | 最大 2.04 MB |
| story の baseline            | 196 個 / 8.33 MB | 80 枚 / 2.2 MB | 27 KB        |
| その他の PNG（サイトの素材） | 4 個 / 6.13 MB   | —              | —            |

- **重いのは route の側である。**
  `fullPage: true` で撮っており、縦は 6712〜13678px ある。
- route の baseline を変えたコミットは 0 件である。
  1 度も撮り直さずに 9.48MB を占めており、撮り直しが始まれば story の側より速く増える。

#33 は、R2 へ移すだけでは解決しない論点を 3 つ残した。  
今の実装を確かめると、2 つは起きない。

- reg-suit のキーの解決が不安定になる論点は、起きない。
  今は `reg-cli` でディレクトリ同士を直接比べており、reg-suit を使わない。
- route の側が reg-suit の管轄の外で、別の設計が要るという論点も、起きない。
  story と route のどちらも、比べる前にディレクトリを用意するだけの問題になる。
- pull request で差分の画像を見る手段を失う論点は、一部だけが残る。
  差分のレポートは、すでに `.vrt/` を artifact に上げて見られる。
  失うのは、baseline を更新したときの GitHub の rich diff である。

## Decision

- **story と route の baseline を Cloudflare R2 へ移し、Git での管理をやめる。**
- **story と route を 1 つの同期の手順で扱う。**
  どちらも、比べる前にディレクトリを取得し、更新したら送り返すだけで、S3 互換の API で同じ形になる。
  - story: `vrt/baseline/<target>/`。`reg-cli` が読み、`--update` で書く。
  - route: `e2e/corporate-site/route-vrt.spec.ts-snapshots/`。Playwright が読み、`--update-snapshots` で書く。
- **reg-suit へは戻さず、`reg-cli` のディレクトリの比較を保つ。**
  戻すと、キーの解決の問題を再び抱える。
- **baseline の基準は、CI で撮った画像のままにする。**
  撮り直しは `workflow_dispatch` から行い、成功したら R2 へ送る。
- **同期には `s5cmd` を使う。**
  CI の container へ入れる時間と大きさが、ほかの候補より小さい。
  測った値は Verification にある。
- **バケットは Terraform で管理する。**
  GitHub Actions が使う S3 互換の access key は Terraform の外で発行し、GitHub Actions の secret に登録する。
  - ADR-0021: [Cloudflare リソースの管理は Terraform と Wrangler で分担する](0021-cloudflare-terraform-wrangler-boundary.md)
  - R2 を作る場所は、ADR-0020 が集約した Terraform のコードである。
  - ADR-0020: [Terraform の infra code を Kufu Monorepo へ集約する](0020-terraform-monorepo-consolidation.md)
- **今の baseline を履歴から消さない。**
  移した後のコミットで、作業ツリーから消すだけにする。
  履歴を書き換えると、開いている pull request と手元の clone が使えなくなる。
- **baseline は `main` の 1 系統だけを持ち、ブランチごとに分けない。**
  ブランチごとに持つと、分岐点の解決の問題が戻る。
  #33 が reg-suit で直面したのは、この問題である。

  ```text
  s3://<bucket>/story/ui/<story>.png
  s3://<bucket>/story/corporate-site/<story>.png
  s3://<bucket>/route/<route>-<viewport>-linux.png
  ```

  - 比べる相手は、常に `main` の baseline にする。
  - pull request の中では、baseline を変えない。

- **撮り直しの結果は、`reg-cli` の HTML レポートで確かめ、新しい形式を作らない。**
  撮り直しの job は、次の順で動く。
  1. R2 から今の baseline を取得する。
  2. 撮る。
  3. 取得した baseline を旧、撮った結果を新として `reg-cli` を回す。
  4. レポートを artifact に上げる。
  5. 撮った結果を R2 へ送る。

  手順 3 が通常の VRT と同じ処理なので、レポートの形式も同じになる。  
  人はレポートを見て、意図した変更かを確かめる。  
  通常の pull request の差分は、今までどおり `.vrt/` の artifact のレポートで確かめる。

## Verification

同期のツールは、CI の Playwright の container（`mcr.microsoft.com/playwright:v1.59.1-noble`）で 3 つを測って決めた。

| 項目                   | `s5cmd` 2.3.0（採用）         | `aws-cli` v2             | `rclone` 1.75.0                   |
| ---------------------- | ----------------------------- | ------------------------ | --------------------------------- |
| container へ入れる時間 | **1 秒**                      | 24 秒                    | 62 秒                             |
| 入れた後の大きさ       | **17 MB**                     | 271 MB                   | 82 MB                             |
| 取得の方法             | tar.gz の静的なバイナリ 1 つ  | zip とインストーラ       | zip（`unzip` を入れる必要がある） |
| 手元の版               | 入れていない（CI だけで使う） | 2.32.26（mise で入れた） | 入れていない                      |
| 代わりになるもの       | `aws-cli`、`rclone`、SDK      | `s5cmd`、`rclone`        | `s5cmd`、`aws-cli`                |

- VRT の job は 3 つあり、入れる時間は job の数だけかかる。
  1 回の CI で、`aws-cli` なら 72 秒、`s5cmd` なら 3 秒になる。
- container の image は Playwright が配るものを使うので、こちらでツールを image に含められない。
  入れる時間の短さが、そのまま CI の時間を縮める。
- MinIO を S3 互換の代わりにして、`s5cmd` の差分の同期を確かめた。
  ディレクトリを送って取得すると、中身が一致した。
  1 枚だけ差し替えて同期し直すと、変えた 1 枚だけを転送した。
- `aws-cli` は、手元の mise の宣言に残す。
  手で確かめる作業と、CI の外の作業に使う。

R2 を S3 のクライアントから使うときの設定は次のとおり。

- endpoint は `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` にする。
- region は `auto` にする。
  空の文字列と `us-east-1` も `auto` として扱われる。
- 資格情報は、R2 の API token から生まれる Access Key ID と Secret Access Key を使う。
- **R2 は ACL に対応しておらず、`--acl` を付けた操作は失敗する。**
  バケットのポリシー、バージョニング、ライフサイクル、オブジェクトのロックも、R2 にない。
  baseline の同期は、オブジェクトの読み書きと一覧だけで足りるので、これらの制約に当たらない。

## Considered Options

| 選択肢                                                                | 強み                                                                                                                                 | 弱み                                                                                                                                                                                                                                                                       |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** story と route の baseline を R2 へ移し、`s5cmd` で同期する | 履歴が baseline で増えない。egress が無料で、CI が毎回読んでも帯域の上限に当たらない。#47 が用意する R2 と資格情報の受け渡しを使える | baseline を更新した pull request で rich diff が出ない。CI に S3 互換の資格情報が増える。story の側の VRT が #47 の完了を待つ                                                                                                                                              |
| Git LFS へ移す                                                        | 今の手順を変えずに済む。baseline が作業ツリーに残り、rich diff も残る。`.gitattributes` と `actions/checkout` の設定だけで済む       | 帯域が従量である。GitHub Free と Pro の無料の枠は storage 10 GiB と帯域 10 GiB / 月で、**支払い方法を登録せずに帯域を超えると翌月まで LFS が無効になる**。VRT の job は 3 つあり、毎回 baseline を取得する。#47 で R2 を扱うので、保管先が GitHub と Cloudflare に分かれる |
| route を viewport の範囲だけ撮る方式に変え、Git での管理を続ける      | 外部の保管が要らない。作業ツリーは 7.8MB から 3.3MB に下がる。撮るのも比べるのも速くなる                                             | **fold より下の回帰を検出できなくなる。** route の VRT はページ全体のレイアウトの崩れを見るためのもので、検出の範囲を狭めると目的を損なう。撮り直すたびに履歴が増える性質は変わらない                                                                                      |
| GitHub Actions の artifact か cache に置く                            | 資格情報を足さずに済む                                                                                                               | artifact には保持の期間があり、cache は容量と参照されない期間で消される。**baseline を保管する場所にできない**                                                                                                                                                             |

## Consequences

### Positive

- 履歴が baseline で増えなくなり、撮り直しの回数を気にせず VRT を運用できる。
- R2 は egress が無料で、CI が毎回読んでも帯域の上限に当たらない。
  無料の枠は storage 10GB、Class A が 100 万リクエスト、Class B が 1000 万リクエストである。
- story と route で、保管の方式が揃う。
  ADR-0018 が Git での管理の利点に挙げた、route の側と保管の方式が揃うことは、R2 でも保たれる。
- #47 が用意する R2 と資格情報の受け渡しを、そのまま使える。

### Negative

- baseline を更新した pull request で、GitHub の rich diff が画像を比べて見せなくなる。
  artifact のレポートで代える。
- CI に S3 互換の資格情報が増え、通常の CI が持つ資格情報の範囲が広がる。
  access key とバケットは、基盤への取り決めに加える。
  - 参照: [context/operations.md の kufu-infra へ渡す取り決め](../context/operations.md#kufu-infra-へ渡す取り決め)
- baseline の取得の時間が、CI の時間に加わる。
  作業ツリーの baseline は 7.8MB で、影響は小さいと見込む。
- **story の側の VRT が #47 の完了を待つ。**
  ADR-0018 が外した依存を、意図して戻す。
- 比べる前の取得と更新した後の送信を、`scripts/vrt-story.mjs`、`scripts/vrt-container.mjs`、`.github/workflows/ci.yml` に足す必要がある。
