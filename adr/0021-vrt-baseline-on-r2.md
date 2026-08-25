# ADR-0021: VRT baseline を Cloudflare R2 へ移す

## 状態

承認 (2026-08-23)

## 決定日

2026-08-23

## 背景

VRT baseline の保管先は 2 度変わり、3 度目の判断として本 ADR へ回ってきた。

- 当初は S3 互換ストレージ (R2) へ置くと決めた。
  - [ADR-0015](0015-visual-regression-testing-policy.md) — VRT の方針と baseline の扱いを定めた決定
- 実装の過程で storycap が Storybook 10 に追いつかず、移行のついでに「81 枚 2.94MB なら外部ストレージは要らない」と判断して Git 管理へ変えた。あわせて infra 集約 (#47) 待ちを外した。
  - [ADR-0018](0018-story-vrt-on-storybook-test-integrations.md) — story VRT を `storycap-testrun` と `reg-cli` へ移し、baseline を Git 管理にした決定
- その後の実測で、Git 管理は履歴を恒久的に太らせることが分かった。判断は #47 へ引き継がれた。

### 実測 (2026-08-23)

`.git` は 60MB である。履歴内の PNG blob の内訳は次のとおりである。

| 種別                    | 履歴内の blob    | 作業ツリー     | 1 枚あたり   |
| ----------------------- | ---------------- | -------------- | ------------ |
| route baseline          | 16 個 / 9.48 MB  | 6 枚 / 5.60 MB | 最大 2.04 MB |
| story baseline          | 196 個 / 8.33 MB | 80 枚 / 2.2 MB | 27 KB        |
| その他 PNG (サイト素材) | 4 個 / 6.13 MB   | —              | —            |

**重いのは route 側である。** `fullPage: true` で撮っており、縦は 6712〜13678px ある。story 側の 1 枚 27KB とは桁が違う。

route の baseline を触った commit は **0 件**である。1 度も撮り直していない状態で 9.48MB を占めている。撮り直しが始まれば story より速く積まれる。

### 引き継ぎ時に挙がった 3 論点のうち 2 つは消えている

#33 は「R2 へ移すだけでは解決しない」として 3 点を残したが、実装を確認した結果、2 点は現行構成では発生しない。

| 論点                                 | 現況                                                                                                                        |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| reg-suit のキー解決が不安定          | **発生しない。** 現行は `reg-cli` でディレクトリ同士を直接比較しており、reg-suit を使っていない。キー解決という仕組みがない |
| route 側は reg-suit の管轄外で別設計 | **別設計にならない。** reg-suit が無いため、両方とも「比較前にディレクトリを用意する」だけの問題になる                      |
| PR で差分画像を見る経路を失う        | 一部は既に失っていない。差分レポートは `.vrt/` を artifact へ上げる形で提供済みである。失うのは baseline 更新時の rich diff |

## 決定

- **story と route の baseline を Cloudflare R2 へ移す。** Git 管理をやめる。
- **両方を 1 つの同期手順で扱う。** どちらも「比較前にディレクトリを取得し、更新時に送り返す」であり、S3 互換 API で同じ形になる。

| 対象  | ディレクトリ                                      | 読み書きするもの                               |
| ----- | ------------------------------------------------- | ---------------------------------------------- |
| story | `vrt/baseline/<target>/`                          | `reg-cli` が読む。`--update` で書く            |
| route | `e2e/corporate-site/route-vrt.spec.ts-snapshots/` | Playwright が読む。`--update-snapshots` で書く |

- **reg-suit へは戻さない。** 戻すとキー解決の問題を引き受け直すことになる。`reg-cli` のディレクトリ比較を維持する。
- **baseline の正は CI で撮った画像とする。** ADR-0018 から変えない。撮り直しは `workflow_dispatch` から行い、成功時に R2 へ送る。
- **同期には `s5cmd` を使う。** CI の container での導入が 1 秒 / 17MB で、`aws-cli` (24 秒 / 271MB) より安い。VRT job は 3 つあり、導入時間はその数だけ乗る。
- **バケットは Terraform 管轄とする。** GitHub Actions が使う S3 互換の access key は Terraform 外で発行し、GitHub Actions の secret に登録する。
  - [ADR-0020](0020-cloudflare-terraform-wrangler-boundary.md) — データを保持するリソースを Terraform 管轄と定めた決定
- **既存の baseline は履歴から削除しない。** 移行後の commit で作業ツリーから消えるだけとする。履歴の書き換えは PR とローカル clone を壊すため行わない。

### baseline の差分をレビューで見る経路

Git 管理を外すと、baseline を更新した PR で GitHub の rich diff が画像比較を出さなくなる。代わりに次を使う。

- **差分の確認**: `reg-cli` の HTML レポート。既に `.vrt/` を artifact へ上げている。経路は変わらない。
- **撮り直しの確認**: `workflow_dispatch` の実行結果に、更新前後の baseline を並べたレポートを artifact として残す。**この形式は実装時に決める。**

## 代替案

### 1. Git LFS へ移す

#### Pros

- 現行の手順を変えない。baseline は作業ツリーに存在し続け、PR の rich diff もそのまま残る。
- 実装は `.gitattributes` の追加と `actions/checkout` の設定だけで済む。

#### Cons

- 帯域が従量である。GitHub Free / Pro の無料枠は storage 10 GiB / 帯域 10 GiB / 月で、**支払い方法を登録せずに帯域を超えると翌月まで LFS が無効化される**。VRT job は 3 つあり、baseline を毎回取得する。
- #47 で R2 を扱う経路を整えるため、保管先が GitHub と Cloudflare に分かれる。

### 2. route を viewport 撮影へ変えて Git 管理を続ける

#### Pros

- 外部保管を導入せずに済む。作業ツリーは 7.8MB から 3.3MB へ下がる。
- 撮影も比較も速くなる。

#### Cons

- **fold 以下の回帰を検出できなくなる。** route VRT はページ全体のレイアウト崩れを見るためのものであり、検出範囲を狭めることは目的を削る。
- 履歴が積まれる性質は変わらない。撮り直しのたびに増え続ける。

### 3. GitHub Actions の artifact / cache に置く

#### Pros

- 追加の資格情報が要らない。

#### Cons

- artifact には保持期間があり、cache は容量と未参照期間で退避される。**baseline の正本として持てない。**

## 外部依存の健全性

**同期には `s5cmd` を使う。** CI の Playwright container (`mcr.microsoft.com/playwright:v1.59.1-noble`) で 3 つを実測して決めた (2026-08-25)。

| 項目             | 採用 (`s5cmd` 2.3.0)              | `aws-cli` v2        | `rclone` 1.75.0            |
| ---------------- | --------------------------------- | ------------------- | -------------------------- |
| container 導入   | **1 秒**                          | 24 秒               | 62 秒                      |
| 導入後のサイズ   | **17 MB**                         | 271 MB              | 82 MB                      |
| 取得方法         | tar.gz の静的バイナリ 1 本        | zip + インストーラ  | zip (`unzip` の導入が要る) |
| 手元の版         | 未導入 (CI でのみ使う)            | 2.32.26 (mise 経由) | 未導入                     |
| 後継・代替の有無 | `aws-cli` / `rclone` / SDK 直呼び | `s5cmd` / `rclone`  | `s5cmd` / `aws-cli`        |

VRT job は 3 つあり、導入時間はその数だけ乗る。`aws-cli` なら 1 回の CI で 72 秒、`s5cmd` なら 3 秒である。container image は Playwright が配るものを使うため、こちらでツールを焼き込めない。**導入の安さがそのまま効く。**

`s5cmd` の差分同期を、MinIO を S3 互換の代役として確認した。ディレクトリの送信と取得が往復で一致し、1 枚だけ差し替えた再同期では変更した 1 枚だけが転送された。

`aws-cli` は手元 (mise 宣言) に残す。手動での確認や、CI 以外の作業に使う。

### R2 を S3 クライアントから使うときの設定

| 項目     | 値                                                    |
| -------- | ----------------------------------------------------- |
| endpoint | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`       |
| region   | `auto` (空文字と `us-east-1` も `auto` へ寄せられる)  |
| 資格情報 | R2 API token が生む Access Key ID / Secret Access Key |

**R2 は ACL に対応していない。** `--acl` を伴う操作は失敗する。バケットポリシー、バージョニング、ライフサイクル、オブジェクトロックも未実装である。baseline の同期はオブジェクトの読み書きと一覧だけで足りるため、これらの制約には当たらない。

## baseline のキー体系

**`main` の 1 系統だけを持つ。** ブランチごとに分けない。

```
s3://<bucket>/story/ui/<story>.png
s3://<bucket>/story/corporate-site/<story>.png
s3://<bucket>/route/<route>-<viewport>-linux.png
```

比較対象は常に `main` の baseline とする。ブランチごとに持つと、分岐点の解決という問題が戻ってくる。#33 が reg-suit で踏んだのはこれである。

撮り直しは `workflow_dispatch` からのみ行い、実行後に `main` の baseline を置き換える。PR の中で baseline は変わらない。

## 撮り直しレポート

`reg-cli` が出す HTML レポートを、撮り直しの前後でも使う。**新しい形式は作らない。**

撮り直し job は次の順で動く。

1. R2 から現行 baseline を取得する
2. 撮影する
3. **取得した baseline を旧、撮影結果を新として `reg-cli` を回す**
4. レポートを artifact へ上げる
5. 撮影結果を R2 へ送る

3 が通常の VRT と同じ処理であるため、レポートの形式も同じになる。人はレポートを見て、意図した変更かを確認する。

## 影響

### 良い影響

- 履歴が baseline で太らなくなる。撮り直しの回数を気にせず VRT を運用できる。
- R2 は egress が無料であり、CI が毎回読む使い方で帯域の上限に当たらない。無料枠は storage 10GB / Class A 100 万 / Class B 1000 万リクエストである。
- story と route で保管の仕組みが揃う。ADR-0018 が「route 側と保管モデルが揃う」ことを Git 管理の利点に挙げたが、その利点は R2 でも保たれる。
- #47 が用意する R2 と資格情報の経路を、そのまま使える。

### 悪い影響 / トレードオフ

- baseline を更新した PR で、GitHub の rich diff による画像比較が出なくなる。artifact のレポートで代替する。
- CI に S3 互換の資格情報が増える。通常の CI が持つ credential の範囲が広がる。
- baseline の取得が CI の実行時間に乗る。作業ツリーは 7.8MB であり、影響は小さいと見込む。
- **story 側 VRT が #47 の完了を待つ。** ADR-0018 が外した依存を、意図して戻すことになる。

### 影響範囲

- 対象 app / package: `e2e`、`apps/corporate-site`、`packages/ui`、GitHub Actions workflow、新設する Terraform ディレクトリ
- spec 更新要否: 要。#47 の spec に、baseline の同期手順と資格情報の受け渡しを反映する

### 未確認事項

本 ADR の判断を支える未確認事項は残っていない。

## 実装・運用への反映

- **更新時期は実装完了後である。** context と DesignDoc は現状事実を記述する文書であり、決定が承認されただけでは記述すべき事実が存在しない。承認時点で行うのは ADR-0018 の状態変更だけである。

| 対象                                                      | 更新内容                                                             |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| [context/testing.md](../context/testing.md)               | baseline の保管先と同期手順、撮り直しの経路                          |
| [context/toolchain.md](../context/toolchain.md)           | VRT 行の baseline 管理を「Git 管理」から「R2」へ変更する             |
| [context/infrastructure.md](../context/infrastructure.md) | R2 バケットと S3 互換 access key を Infrastructure Contract へ加える |
| `scripts/vrt-story.mjs` / `scripts/vrt-container.mjs`     | 比較前の取得と更新後の送信を足す                                     |
| `.github/workflows/ci.yml`                                | VRT job へ `s5cmd` の導入、資格情報、同期の手順を足す                |

- ADR-0018 の状態は、本 ADR の承認に合わせて「一部置換」へ変更した (2026-08-23)。置き換わるのは baseline の保管先だけであり、`storycap-testrun` と `reg-cli` を使う決定は有効である。

## 関連ドキュメント / チケット

- [ADR-0018](0018-story-vrt-on-storybook-test-integrations.md): story VRT の実現方式 (本 ADR が保管先だけを置換する)
- [ADR-0015](0015-visual-regression-testing-policy.md): VRT の方針と許容 diff
- [ADR-0019](0019-terraform-monorepo-consolidation.md): infra code の monorepo 集約 (R2 を作る場所)
- [ADR-0020](0020-cloudflare-terraform-wrangler-boundary.md): データを保持するリソースを Terraform 管轄とする決定
- [context/testing.md](../context/testing.md): テスト責務の分担と VRT の位置づけ
- issue: #47 (決定経緯) / #33 (引き継ぎ元)
