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

同期に使うツールを決める。R2 は S3 互換 API を提供するため、S3 クライアントをそのまま使える。

| 項目                                                | 採用候補 (`aws-cli` v2)                           | 代替案 (`rclone`)             |
| --------------------------------------------------- | ------------------------------------------------- | ----------------------------- |
| 最終公開日                                          | **未確認** (実装時に確認する)                     | **未確認** (実装時に確認する) |
| 対象バージョンへの対応 (peer dependency / 動作要件) | Playwright container に同梱されないため導入が要る | 同上                          |
| 後継・代替の有無                                    | `rclone` / `s5cmd` / SDK 直呼び                   | `aws-cli` / SDK 直呼び        |

**未確認**: どちらを使うかは実装時に決める。判断材料は、Playwright の container image へ入れる手数と、差分同期の挙動である。

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

- 同期ツール (`aws-cli` / `rclone` / SDK 直呼び) を決めていない。Playwright の container image へ導入する手数で判断する。
- 撮り直し時に更新前後を並べるレポートの形式を決めていない。
- baseline を R2 のどのキー体系で持つかを決めていない。ブランチごとに分けるか、`main` の 1 系統だけを持つかで、PR での比較対象が変わる。

## 実装・運用への反映

- **更新時期は実装完了後である。** context と DesignDoc は現状事実を記述する文書であり、決定が承認されただけでは記述すべき事実が存在しない。承認時点で行うのは ADR-0018 の状態変更だけである。

| 対象                                                      | 更新内容                                                             |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| [context/testing.md](../context/testing.md)               | baseline の保管先と同期手順、撮り直しの経路                          |
| [context/toolchain.md](../context/toolchain.md)           | VRT 行の baseline 管理を「Git 管理」から「R2」へ変更する             |
| [context/infrastructure.md](../context/infrastructure.md) | R2 バケットと S3 互換 access key を Infrastructure Contract へ加える |
| `scripts/vrt-story.mjs` / `scripts/vrt-container.mjs`     | 比較前の取得と更新後の送信を足す                                     |
| `.github/workflows/ci.yml`                                | VRT job へ資格情報と同期の手順を足す                                 |

- ADR-0018 の状態は、本 ADR の承認に合わせて「一部置換」へ変更した (2026-08-23)。置き換わるのは baseline の保管先だけであり、`storycap-testrun` と `reg-cli` を使う決定は有効である。

## 関連ドキュメント / チケット

- [ADR-0018](0018-story-vrt-on-storybook-test-integrations.md): story VRT の実現方式 (本 ADR が保管先だけを置換する)
- [ADR-0015](0015-visual-regression-testing-policy.md): VRT の方針と許容 diff
- [ADR-0019](0019-terraform-monorepo-consolidation.md): infra code の monorepo 集約 (R2 を作る場所)
- [ADR-0020](0020-cloudflare-terraform-wrangler-boundary.md): データを保持するリソースを Terraform 管轄とする決定
- [context/testing.md](../context/testing.md): テスト責務の分担と VRT の位置づけ
- issue: #47 (決定経緯) / #33 (引き継ぎ元)
