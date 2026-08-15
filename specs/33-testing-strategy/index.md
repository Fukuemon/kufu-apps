# テスト戦略と CI パイプライン整備 (play / Page Object / VRT / GitHub Actions)

## メタ情報

- Issue: `#33`
- ステータス: `In Progress`
- 作成日: 2026-08-14
- 更新日: 2026-08-15
- Branch: `feature/33`
- Owner: Fukuemon

## 設計フェーズ状況

状態は `未着手 / 進行中 / 完了 / レビュー済 / 保留` のいずれか。保留の場合は理由を備考に残す。

| #   | フェーズ                    | 状態   | 最終更新   | 備考                                                           |
| --- | --------------------------- | ------ | ---------- | -------------------------------------------------------------- |
| 1   | 起票                        | 完了   | 2026-08-14 | #28 / #12 を統合済み。実装突合: 対象                           |
| 2   | 下書き                      | 完了   | 2026-08-14 | template の必須節を充足                                        |
| 3   | 上位文書突合                | 完了   | 2026-08-14 | 矛盾なし。context への追記は本 spec の計画的な更新             |
| 4   | 論点整理                    | 完了   | 2026-08-14 | D1〜D9 を起票。clarify で 1 件ずつ確定                         |
| 5   | 論点解決                    | 完了   | 2026-08-15 | D1〜D9 を確定。設計上の未決ゼロ (U1 は実装順序、U2 は運用判断) |
| 6   | Interface / Routing 設計    | 未着手 |            |                                                                |
| 7   | Content / Data 設計         | 未着手 |            |                                                                |
| 8   | Performance / Security 設計 | 未着手 |            |                                                                |
| 9   | Test / Metrics 設計         | 未着手 |            |                                                                |
| 10  | 実装分割                    | 未着手 |            |                                                                |
| 11  | レビュー済                  | 未着手 |            |                                                                |

## 上位文書整合

- PRD 更新要否: 不要 (統合モード。`design/DesignDoc.md` の Why / What と衝突しない)
- Design Doc 更新要否: **要** (モジュール責務は継承だが、Future Work の「CI パイプライン」行が D6 / D7 の実装後に古くなる)
- ADR 起票要否: 要 (VRT の手段選択と、CI とローカル hook の責務分担は選択肢を比較して決める判断のため)

| 上位文書                     | 節 / 該当箇所                                       | 整合方針 (継承 / 補足 / 変更提案)                                                                                      |
| ---------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| PRD (統合)                   | Non Goals (CMS / 認証 / 過剰な抽象化)               | 継承。本 spec はいずれにも触れない                                                                                     |
| Design Doc                   | モジュール責務 → `e2e` は root 管理の公開前検証     | 継承                                                                                                                   |
| Design Doc                   | 成功条件 #2 (3 route と問い合わせ導線を E2E で通す) | 補足。ジャーニー網羅と VRT を上乗せする                                                                                |
| feature doc (corporate-site) | テスト観点 / 問い合わせ導線の route intercept 方針  | 継承。E2E fixture の分岐定義をジャーニー定義の入力に使う                                                               |
| context/testing.md           | テスト責務の分担 (Unit test / E2E の 2 種別)        | 補足。VRT の位置づけを追加する (本 spec のスコープに含む計画更新)                                                      |
| context/engineering.md       | Repository Quality Gate (pre-commit)                | 補足。CI との責務分担を追加する (同上)                                                                                 |
| context/infrastructure.md    | Cloudflare Pages preview deployment                 | 継承。preview と CI E2E の分担判断に使う                                                                               |
| ADR-0008                     | Astro / React island ポリシー                       | 継承。play 対象を React に限る根拠                                                                                     |
| ADR-0012                     | デザイン正本 = 実装 + Storybook                     | 継承。VRT の対象セットを Storybook に置く根拠                                                                          |
| ADR-0001                     | Terraform の infra code は別リポジトリで管理する    | **変更提案**。D4 の R2 調達が本 ADR と衝突する。supersede は #47 が主体で行い、本 spec は #47 の完了を実装の前提とする |

`context/testing.md` / `context/engineering.md` への追記は衝突ではなく、本 spec がスコープとして計画している更新であり sync phase で反映する。

**ADR-0001 とは衝突がある。** 同 ADR は「Terraform 本体・state・apply workflow を monorepo に置かない」と定め、`context/infrastructure.md` も「infra 側の変更は Infrastructure Contract 経由で `kufu-infra` へ依頼する」を保持している。
D4 で R2 を調達する設計はこれに反するが、**supersede の主体は #47** であり本 spec では行わない。本 spec は #47 の完了を P1a の前提として扱う。
ADR-0001 が spec 側に課す「infra 変更が絡む spec では infra repo 側の対応有無を明記する」義務は、U1 (実装順序の依存) の記載で満たす。

## 関連資料

- `design/DesignDoc.md`: モジュール責務 (`e2e`) / 成功条件 #2
- `design/features/corporate-site/DesignDoc_corporate-site.md`: テスト観点 / 問い合わせ導線の検証境界
- `context/testing.md` / `context/engineering.md` / `context/infrastructure.md`
- 要求定義: [requirements.md](requirements.md)
- 関連 issue: #33 (本体) / 統合済み #28 (VRT) / #12 (CI) / 参照 #26 (問い合わせフォーム) / #32 (styles 受け皿)

## 背景

UI を変える作業の安全網が、現状は「要素の存在と文言を見る E2E」しかない。
`components.css` を utility / cva へ colocation 移行する作業 (#32 の積み残し) は出力 CSS の形が変わるため、
#32 で使った「出力 CSS のバイト比較」が使えない。視覚崩れを検出する手段がないまま移行するのは危険であり、
**VRT の導入がその移行の前提 gate** になる。

同時に、テストを増やしても回す場所が決まっていなければ意味がない。CI は段階的に増えたが
どこまで載せるかの方針がなく、ローカル `lefthook` との分担も未整理である。
そのため本 spec はテストの中身 (play / Page Object / ジャーニー / VRT) と
実行場所 (CI / ローカル) を 1 つの設計として扱う。

影響範囲は `packages/ui` (play テスト対象) / `apps/corporate-site` (VRT 対象) / `e2e` (Page Object) /
リポジトリ横断の CI 設定である。

## スコープ

### やること

- play テストの導入方針 (対象基準と Astro 側の制約) の確定
- E2E の Page Object 構成規約と locator 規約の確定
- E2E がカバーするユーザージャーニーの定義と play との責務境界の確定
- VRT の手段選択・対象セット・許容 diff・snapshot 運用の確定と、**実行可能な状態までの実装**
- CI のジョブ構成、ローカル `lefthook` との責務分担、Turbo キャッシュ方針、required status checks の確定と `.github/workflows/` の実装
- 決定の `context/testing.md` / `context/engineering.md` / ADR への反映

### やらないこと

- play テスト / E2E ジャーニーの**テストコード実装** (方針確定後に別 issue。VRT と CI は例外で本 spec で実装する)
- `components.css` の colocation 移行そのもの (本 spec が gate を用意し、移行は差分ゼロを完了条件とする派生 issue が行う)
- 問い合わせフォーム (#26) の実装。island が増えた後の play 対象追加は #26 側で行う
- Cloudflare Pages のデプロイ設定変更
- 既存 workflow (`spec-residue` / `spec-closeout` / `storybook-pages`) の作り替え

## 要件の解釈

### 実現したいユーザー価値

- 開発者と AI エージェントが、UI を変えたときに壊れたことへ**気づける**状態になる
- テストの置き場と実行場所が決まっており、追加時に迷わない

### 成功条件

- VRT が実行でき、UI 無変更なら差分ゼロ、意図した変更なら baseline 更新手順で解消できる
- CI とローカル hook の責務が重複なく分担され、`context/` に文書化されている
- play / Page Object / ジャーニーの規約が、実装 issue がそのまま従える粒度で決まっている

### 対象ユーザー / 操作主体

- 開発者 (本人): テストを追加・保守する
- AI エージェント: 規約に従ってテストを実装する
- CI (GitHub Actions): 決められたジョブを実行する

EARS 風の振る舞い。観測手段が定義できるものだけを本 spec の受け入れ基準とする
(`requirements.md` の「文書群は…を保持している」型は観測手段が無いため、下記のとおり観測可能な形へ具体化した)。

- WHEN 開発者が VRT の実行コマンドを実行したとき、システムは対象セットを撮影し baseline との差分件数を終了コードと標準出力で返す。
- WHILE UI に変更がない間、システムは VRT を 2 回連続実行しても差分 0 件を返す。
- IF 意図した UI 変更で差分が出た場合、THEN システムは baseline 更新コマンドで差分を 0 件に解消できる。
- WHEN 開発者が意図的に 1 箇所のスタイルを変更したとき、システムは VRT で差分を 1 件以上検出する。
- WHEN develop 向けの PR が作成されたとき、システムは `lint` / `test` / `typecheck` / `build` / `knip` / `depcruise` / `e2e` / route の VRT を実行し、各ジョブの成否を PR のチェック欄に返す。
- WHERE story 側の VRT は #47 完了後に CI へ載せる。#33 の時点ではローカルの S3 互換ストレージに対して実行し、差分判定が成立することを確認する。
- IF いずれかのジョブが失敗した場合、THEN システムは失敗したジョブ名とログを PR から辿れる状態にする。

## 現状の実測 (2026-08-14)

要求定義の業務ルール #1 (判断は現規模の実測に基づく) に対応する棚卸し。論点の判断材料とする。

| 対象                    | 実測値                                                           |
| ----------------------- | ---------------------------------------------------------------- |
| E2E ファイル数          | 1 (`e2e/corporate-site/smoke.spec.ts`)                           |
| E2E テスト数            | 5                                                                |
| E2E のセレクタ内訳      | `getByTestId` 24 / `getByText` 6 / `locator()` 5 / `getByRole` 3 |
| `data-testid` 定義箇所  | 20                                                               |
| stories 数              | 29 (`packages/ui` 11 / `apps/corporate-site` 17 / fixture 1)     |
| `play` 関数を持つ story | 0                                                                |
| React island            | **0** (`client:*` ディレクティブの使用箇所なし)                  |
| CI に載っているもの     | `lint` / `test`                                                  |
| CI に載っていないもの   | `typecheck` / `build` / `knip` / `depcruise` / `e2e`             |
| lefthook pre-commit     | `protected-branch` / `format` / `repo-analysis` / `lint`         |

この実測から、要求定義の決定事項に**前提のずれ**が 2 件ある。D1 / D2 で扱う。

## 実装対象

| モジュール       | 実装有無 | 主な責務                                                         |
| ---------------- | :------: | ---------------------------------------------------------------- |
| `e2e`            |    ◯     | Page Object 構成、locator 規約、ジャーニー定義。VRT の実装先候補 |
| `ui`             |    ◯     | play テストの対象。VRT の Storybook 側対象セット                 |
| `corporate-site` |    ◯     | VRT の route 対象 (3 route × 2 viewport)                         |
| `core`           |    ◯     | `.github/workflows/` と `lefthook.yml` の責務分担                |
| `config`         |    -     | 変更しない                                                       |
| `cms`            |    -     | 対象外 (未着手モジュール)                                        |

## 機能仕様

### User Flow

開発者 / CI が本 spec の成果物を使う流れ。

1. 開発者が UI を変更する
2. ローカルで `lefthook` の pre-commit gate が走る (責務は D6 で確定)
3. 開発者が VRT を実行し、baseline との差分を確認する
4. 意図した差分なら baseline を更新し、意図しない差分なら実装を直す
5. PR を作成すると CI が決定したジョブ構成を実行し、結果を PR に返す

### Reuse Policy

- Page Object と VRT のヘルパは `e2e/` 配下に colocation する。`packages/*` へ昇格させない
- play テストのユーティリティは `packages/ui` 内に置き、app からは参照させない

### Performance

- CI 実行時間の目標値は置かない (D8)。実測値を記録し、U2 (remote cache の要否) の判断材料にする
- VRT のためにプロダクションコードへ待機用の実装を入れない (テスト都合で島を増やさない)

### Routing / URL State

該当なし。本 spec はテストと CI の仕組みを対象とし、アプリの routing / URL state を変更しない。

### Content / Assets

VRT の baseline は D4 の決定により **2 系統** を持つ。

#### reg-suit を R2 に接続する際の必須設定 (2026-08-15 調査)

| #   | 設定                                      | 理由                                                                                                                                                          |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `enableACL: false` を明示する             | plugin の既定は `enableACL: true` / `acl: public-read` だが、**R2 はオブジェクト ACL を未実装**で `x-amz-acl` 等が非対応。既定のままでは PutObject が失敗する |
| 2   | `sdkOptions.region` に `auto` を指定      | R2 の region は `auto` が正 (空値と `us-east-1` がエイリアス)                                                                                                 |
| 3   | `customDomain` と `endpoint` を併用しない | 併用すると差分レポートの URL が二重に組み立てられる既知の不具合がある (reg-suit issue #162)                                                                   |

`sdkOptions.endpoint` には `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` を指定する。

**#33 の実装ではこの endpoint をローカルの S3 互換ストレージ (Docker で起動する RustFS 等) に向ける。**
上記 3 点のうち `enableACL: false` と `region: auto` はローカル検証でも同じ設定で通るため、
#47 完了後は endpoint と資格情報を差し替えるだけで R2 へ移行できる。
ローカル検証で撮った baseline は破棄前提とし、正となる baseline は #47 完了後に CI 環境で撮り直す。
出典: [plugin README](https://github.com/reg-viz/reg-suit/blob/master/packages/reg-publish-s3-plugin/README.md) / [issue #162](https://github.com/reg-viz/reg-suit/issues/162) / [R2 S3 API compatibility](https://developers.cloudflare.com/r2/api/s3/api/)

| 系統                | 撮影対象                                 | 保管先                       |
| ------------------- | ---------------------------------------- | ---------------------------- |
| reg-suit + storycap | story (`packages/ui` 11 + セクション 17) | Cloudflare R2 (S3 互換)      |
| Playwright          | 3 route × 2 viewport                     | リポジトリ (Playwright 既定) |

- R2 の資格情報は secret として扱い、置き場は `context/infrastructure.md` に従う
- Playwright 側の baseline は Git 管理されるため、差分が PR レビューに乗る

### UI Reuse

該当なし。本 spec は共有 UI の構成を変更しない。play テストは既存の `packages/ui` コンポーネントを対象にする。

### Testing

- 責務分担は Unit test / E2E / **VRT** の 3 種別とする (D3)。`context/testing.md` のテーブルへ反映する
- locator は領域特定に `data-testid`、操作対象に `getByRole` を優先する (D5)。Page Object 内部にも同じ規約を適用する
- play テストの対象は `packages/ui` の 11 コンポーネントに限る (D1)

## Interface 設計

### UI / API / Event Interface

アプリの UI / API は変更しない。本 spec が定義するのは**開発者と CI に対する実行インターフェース**である。

- VRT の実行コマンド (名称と引数は D4 の手段選択後に確定)
- VRT の baseline 更新コマンド
- CI の workflow トリガと job 名 (required status checks を設定する場合、job 名が契約になる)

### Props / Request / Response

該当なし。コンポーネントの props や API の request / response を変更しない。

## Content / Data 設計

### 保存・管理するデータ

| データ            | 内容                              | 置き場                                       |
| ----------------- | --------------------------------- | -------------------------------------------- |
| VRT baseline 画像 | 3 route × 2 viewport と対象 story | D4 の手段選択後に確定                        |
| VRT 差分レポート  | 実行ごとの差分画像と判定結果      | 成果物として保持しない候補も含めて D4 で確定 |

### コンテンツ配置 / package / route

- Page Object と VRT のヘルパは `e2e/` 配下に置く
- play テストは対象コンポーネントと同じ story ファイルに colocation する
- CI 設定は `.github/workflows/` に置き、ローカル gate は `lefthook.yml` に置く

## Performance / Security 設計

### Performance

- CI 実行時間の目標値は置かない。D6 / D7 / D8 適用後に実測し、その値を見て remote cache の要否を判断する (D9)
- Turbo キャッシュの remote 化 (D9) は実測値が許容範囲を超えた場合にのみ検討する
- テスト都合でプロダクションコードに待機処理や不要な island を追加しない (`decision_priority` 1 位を損なわない)

### Security / Privacy

- VRT の baseline 画像に非公開情報を含めない。撮影対象は公開サイトの 3 route と Storybook に限る
- **Cloudflare R2 の資格情報という新しい secret が増える** (D4 の帰結)。置き場と権限の絞り方は `context/infrastructure.md` に従い、書き込み権限を VRT 用のバケットに限定する
- R2 バケットを公開設定にしない。差分レポートの閲覧経路は実装フェーズで決める
- Turbo の remote cache を採用する場合、キャッシュに含まれる成果物の公開範囲を D9 で確認する

## Error / Fallback 設計

### エラーケース

| #   | ケース                                     | ユーザー (開発者) への見せ方             | リカバリ                                       |
| --- | ------------------------------------------ | ---------------------------------------- | ---------------------------------------------- |
| 1   | VRT が意図した UI 変更で差分を出す         | 差分画像付きで失敗を報告                 | baseline 更新コマンドを実行する                |
| 2   | VRT が環境差で恒常的に差分を出す           | flake として原因を報告し CI は赤にしない | 撮影環境を固定するか対象を安定領域へ絞る       |
| 3   | 地図 iframe / 外部画像で撮影が不安定になる | flake 要因として記録                     | 該当要素をマスクして撮影する                   |
| 4   | CI の E2E が sandbox の bind 制約で落ちる  | 失敗ジョブのログに原因を出す             | D7 の判断に応じて CI から外し preview へ寄せる |

### Fallback

- VRT が安定しない場合、CI 必須から外してローカル運用に落とす (D8 の選択肢 b / c)
- CI 実行時間が目標を超える場合、対象セットを縮小するか opt-in 実行にする

## テスト / 評価方針

### テスト観点

本 spec の成果物自体をどう検証するか。

- VRT: UI 無変更で連続実行して差分ゼロになること (flake しないこと) を実測で確認する
- VRT: 意図的に 1 箇所スタイルを変えて差分が検出されることを確認する (検出力の確認)
- CI: develop 向けの PR を実際に作り、決定したジョブが実行され結果が PR に返ることを確認する
- 規約類 (play / Page Object / locator): 実装 issue がそのまま従える粒度になっているかを `spec-review` で確認する

### 計測指標

| 指標                     | 目的                           |
| ------------------------ | ------------------------------ |
| CI の総実行時間          | D8 の目標値との対比            |
| VRT の撮影枚数           | 実行時間と保守コストの見積もり |
| VRT の連続実行での差分数 | flake の有無 (目標: 0)         |
| E2E のセレクタ内訳       | locator 規約 (D5) 適用後の変化 |

## フロー / シーケンス

(diagram phase で作成する。現時点では未作成)

### Flowchart (ユーザー操作起点)

```mermaid
flowchart TD
```

### Sequence

```mermaid
sequenceDiagram
```

## 実装分割

### 実装タスク案

(論点確定後に track / prompts phase で確定する。現時点は暫定)

| Phase | 対象                     | 概要                                                                       | 依存      |
| ----- | ------------------------ | -------------------------------------------------------------------------- | --------- |
| P1a   | `ui` / `corporate-site`  | storycap + reg-suit の導入と、ローカル S3 互換ストレージでの差分判定の検証 | D4        |
| P5    | `core` / `ui`            | #47 完了後: endpoint を R2 へ差し替え、story 側 VRT を CI へ載せる         | P1a / #47 |
| P1b   | `e2e` / `corporate-site` | Playwright `toHaveScreenshot` で 3 route × 2 viewport の baseline 確立     | D4        |
| P2    | `core`                   | CI のジョブ構成整理と `.github/workflows/` 実装                            | D6〜D9    |
| P3    | `e2e`                    | Page Object と locator 規約の骨組み                                        | D2 / D5   |
| P4    | `ui` / `e2e` / `context` | 規約の `context/` 反映と ADR 起票                                          | P1〜P3    |

### prompts 生成方針

- VRT (P1) と CI (P2) は対象ファイルが重ならないため並列実装できる
- 規約の文書化 (P4) は実装の実測値を使うため、P1〜P3 の後に置く

## 設計時の論点

| #   | 論点                                                                            | 決定候補                                                                                      | 決定                                                                         |
| --- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| D1  | play テストの対象が現時点で `packages/ui` のみである事実をどう扱うか            | (a) `packages/ui` 限定で確定し island は #26 で追加 / (b) island 前提の基準だけ先に決めておく | **(a) 確定**                                                                 |
| D2  | E2E 5 テストの規模で page 単位 Page Object を導入するか (要求では導入決定済み)  | (a) 決定どおり導入 / (b) locator 規約のみ先行し POM はジャーニー実装時 / (c) 粒度を下げる     | **(a) 確定**                                                                 |
| D3  | VRT を `context/testing.md` の責務分担でどの種別に位置づけるか                  | (a) E2E の一部 / (b) 独立した第 3 種別 / (c) Storybook 側の gate                              | **(b) 確定**                                                                 |
| D4  | VRT の手段                                                                      | (a) Playwright `toHaveScreenshot` / (b) reg-suit + storycap / (c) 併用                        | **(c) 併用 確定。baseline は Cloudflare R2 (#47 で Terraform 管理下に用意)** |
| D5  | locator 規約 (`getByRole` 優先か `data-testid` 優先か)。現状は testid が 24/38  | (a) `getByRole` 優先へ寄せる / (b) `data-testid` を正式規約にする / (c) 用途で使い分ける      | **(c) 確定**                                                                 |
| D6  | `typecheck` / `build` / `knip` / `depcruise` をどこまで CI に載せるか (C-1)     | (a) 全部載せる / (b) pre-commit と重複させず CI のみ / (c) 現状維持                           | **(a) 確定**                                                                 |
| D7  | E2E を CI で回すか (C-2)                                                        | (a) CI で回す / (b) Pages preview で手動 / (c) 主要導線のみ CI                                | **(a) 確定**                                                                 |
| D8  | VRT を CI で回すか、ローカル運用に留めるか (C-3)                                | (a) CI / (b) ローカル / (c) PR ラベル等での opt-in                                            | **(a) 確定**                                                                 |
| D9  | Turbo キャッシュを remote 化するか (C-4) と required status checks の要否 (C-5) | 現状 remote 無効。required checks は private repo のため設定状況が未確認                      | **保留 (実測待ち。下記 未確定事項で管理)**                                   |

## 解決済みの論点

- **D1: play テストの対象は `packages/ui` に限定し、React island 向けの基準は #26 で決める。**
  - 根拠: `client:*` の使用箇所が 0 件で、corporate-site に island が存在しない。対象が無いものへ基準を先に書くと机上になり、#26 の実装時に作り直しになる
  - 対象は `packages/ui` の 11 コンポーネント (button / input / select / textarea / form-field / label / tag / badge / separator / definition-row / link-button)
  - トレードオフ / 却下した代替案: island 向け基準も今決める案は、#26 で対象が具体化してからの方が精度が出るため却下した。play の導入自体を #26 まで保留する案は、既存 11 コンポーネントの interaction が無検証のまま残るため却下した

- **D4: story は reg-suit + storycap、3 route は Playwright `toHaveScreenshot` で撮る併用構成とする。**
  - 根拠: ADR-0012 が「デザイン正本 = 実装 + Storybook」と定めており、story (`packages/ui` 11 + corporate-site セクション 17) が VRT の主対象として最も自然
  - storycap は story しか撮れず、要求の受け入れ基準にある 3 route × 2 viewport を満たせないため、route 側は既存 Playwright 基盤で補う
  - baseline の保管先は route 側 (Playwright) が Git 管理、story 側 (reg-suit) が **Cloudflare R2**
  - R2 は Cloudflare リソースであり ADR-0001 の境界規約に関わるが、**#47 で infra を monorepo へ集約する方針が確定した**ため、R2 は #47 の Terraform 管理下で用意される (2026-08-15, ユーザー)
  - トレードオフ: 実行系と baseline が 2 系統になり保守コストが増える。route を story 化して 1 系統に寄せる案は、ページを story 化する実装コストと二重管理が発生するため却下した
  - **改訂 (2026-08-15)**: #33 の実装範囲は **ローカルの S3 互換ストレージ (Docker) を相手にした仕組み検証まで**とする。R2 バケットの作成・secret 管理・CI からの結線は #47 へ送る。`sdkOptions.endpoint` の差し替えだけでローカルから R2 へ移行できるため、パイプラインの構築を #47 の完了前に進められる
  - **実装順序の制約**: P1a (story 側) の CI 稼働は #47 の完了後。P1b (route 側) は baseline が Git 管理のため #47 に依存せず単独で完結する
  - **検証済 (2026-08-15)**: `reg-publish-s3-plugin` は `sdkOptions` を `S3Client` のコンストラクタへ渡す設計のため R2 で動作する。代替保管先は不要と判断した。実装時に必要な設定は下記 3 点

- **D3: VRT を `context/testing.md` の責務分担で、Unit test / E2E と並ぶ独立した第 3 種別として立てる。**
  - 根拠: D4 で story 系統 (reg-suit + storycap) と route 系統 (Playwright) の 2 つを持つため、E2E の一部として書くと Storybook 基盤側が収まらず、Storybook の gate として書くと Playwright 側が収まらない
  - トレードオフ: 種別が 1 つ増えるが、2 系統を 1 つの責務として説明できる利点が上回る

- **D5: locator は用途で使い分ける。領域の特定に `data-testid`、内部の操作対象に `getByRole` を優先する。**
  - 根拠: セクションやページ領域は role では一意に決まりにくく、既に `home-section-hero` 等 20 箇所の testid 資産がある。一方でボタン・リンク・入力欄は role が最も安定する
  - D2 で Page Object を導入するため、セレクタは Page Object 内に隠蔽され、規約違反が広がりにくい
  - トレードオフ: `getByRole` 優先へ全面的に寄せる案は既存 24 箇所の書き換えが発生し、領域特定では逆に不安定になるため却下した。`data-testid` を正式規約にする案は、アクセシビリティ属性の崩れを検出できないため却下した

- **D6: `typecheck` / `build` / `knip` / `depcruise` をすべて CI に載せる。**
  - 根拠: `lint.yml` の「pre-commit は `--no-verify` で素通しできるため CI を必須 gate にする」という既存の設計思想に一貫する。ローカル hook との重複は意図的な二重化として許容する
  - `typecheck` と `build` は pre-commit にも CI にも無く、現状どこでも自動検証されていない。ここが最大の穴であり本決定で塞ぐ
  - **`pnpm check:specs` は対象外**。`spec-residue.yml` が既に CI で実行しており常設化は完了済みで、同 workflow は「別 PR で spec を清算する運用では無関係な PR が落ちる」ため意図的に PR ゲートから外している。この既存判断を維持する (`context/engineering.md` の「CI への常設化は CI パイプライン方針へ委譲する」は実態より古く、sync phase で更新する)
  - トレードオフ: CI 時間が伸びる。Turbo キャッシュ (D9) で吸収できるかを実測する

- **D7: E2E を CI で回す。**
  - 根拠: 現在 5 テストと小さく、ジャーニー網羅で増やす前に土台を作れる。`context/` にある `127.0.0.1:4321` の bind 制約はローカル sandbox 固有で、Actions の runner には当てはまらない
  - トレードオフ: Playwright ブラウザの導入時間が加わる。Cloudflare Pages preview に対して回す案は、preview URL の取得と待機で構成が複雑になるため却下した

- **D8: VRT の撮影と判定を CI 環境に一本化する。ただし story 側の CI 稼働は #47 完了後とする。**
  - **改訂 (2026-08-15)**: story 側 (reg-suit) は永続ストレージを必要とし、それが #47 に依存するため、#33 の時点ではローカルの Docker S3 互換ストレージで仕組みを検証するに留める。**この段階のローカル baseline は破棄前提の検証用**であり、正となる baseline は #47 完了後に CI 環境で撮り直す
  - route 側 (Playwright) は #33 の時点から CI 一本化を適用する
  - 根拠: フォントのレンダリング差により、ローカル (macOS) と CI (Linux runner) で撮った画像は一致しない。baseline を撮る環境を 1 つに固定しなければ、例外シナリオ #3 の恒常的な差分が必ず起きる
  - reg-suit の baseline 解決は CI の git 情報に依存するため、CI 一本化が想定運用にも合う
  - トレードオフ: ローカルで事前確認できず、差分の確認が CI 実行待ちになる。Docker で環境を固定する案は、ローカルでも同じ画像を得られる利点があるが、Docker 依存と実行時間の増加を招くため今回は採らない

- **D9 (保留): Turbo の remote cache と required status checks は判断を保留し、D6 / D7 適用後の CI 実行時間の実測を待つ。**
  - 根拠: 要求の業務ルール #1 (判断は現規模の実測に基づく) に従う。remote cache は Vercel のサービスかセルフホストが必要で、いずれも新しい依存になるため、必要性を実測で示してから入れる
  - required status checks は private repo のため現状設定を `gh api` で取得できない (403)。ジョブ構成確定後に現状を確認してから設定する
  - **実測の完了条件**: D6 / D7 を適用した CI が develop 向け PR で 1 回以上実行され、総実行時間が記録されていること

- **D2: page 単位の Page Object を、要求の決定どおり導入する。**
  - 根拠: E2E は現在 1 ファイル 5 テストだが、本 spec でジャーニー網羅へ広げる方針 (要求の決定事項 #3) が確定しており、テストが増える前に型を用意する方が移行コストが小さい
  - 規模は 3 route に対応する 3 クラス程度に収まる
  - トレードオフ / 却下した代替案: 現規模では過剰になり得る (要求の業務ルール #1) が、規約だけ先行させる案は、ジャーニー実装 issue が型のない状態で書き始めることになり、後から一括で書き換える手戻りが大きいため却下した

## 未確定事項

設計上の未確定事項はゼロ。D1〜D9 の設計判断はすべて確定した。

残るのは **実装順序の依存と、実装後の運用判断** の 2 件で、いずれも設計をブロックしない。

| #   | 事項                                         | 種別         | 決定者   | 解消時期                     | 影響                                                                  |
| --- | -------------------------------------------- | ------------ | -------- | ---------------------------- | --------------------------------------------------------------------- |
| U1  | R2 バケット / secret / CI 結線               | 実装順序依存 | #47      | #47 の完了時                 | story 側 VRT の **CI 稼働時期**。#33 のローカル検証はブロックされない |
| U2  | Turbo remote cache と required status checks | 運用判断     | ユーザー | D6 / D7 適用後の実測が出た後 | なし (実装後に判断すればよい)                                         |

- U1: #47 で infra を monorepo へ集約し、Terraform 管理下に R2 を用意する (2026-08-15, ユーザー)。**#33 は R2 を待たず、ローカルの S3 互換ストレージで storycap + reg-suit のパイプラインを構築・検証するところまでを完了とする**。R2 への結線と story 側の CI 稼働は #47 の後
- U2: 解消には develop の branch protection の現状確認が必要。private repo のため `gh api` が 403 を返すので Web UI 等で確認する

## 上位資料からの変更点

### PRD への影響

変更なし。本 spec は Non Goals にも Why / What にも触れない。

### Design Doc への影響

| 対象節         | 変更内容                                                | 理由                                                                                                                  |
| -------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| モジュール責務 | 変更なし (継承)                                         | `e2e` = root 管理の枠内に収まるため                                                                                   |
| Future Work    | 「CI パイプライン」行を現状事実へ更新 (source: clarify) | D6 / D7 の実装後、「build / lint / test と docs closeout 検査の CI 常設化が未対応」という記述が事実として古くなるため |

### feature doc への影響

変更なし。corporate-site のテスト観点は継承し、本 spec 側で詳細化する。

### context への影響

| 対象 doc / 節                                       | 変更内容                                                                        | 理由                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `context/testing.md` テスト責務の分担               | VRT の種別と責務を追加 (D3 の決定を反映)                                        | 現在 Unit test / E2E の 2 種別しかない                            |
| `context/testing.md`                                | locator 規約と Page Object 規約を追加                                           | D2 / D5 の決定先                                                  |
| `context/engineering.md` Repository Quality Gate    | CI とローカル hook の責務分担を追加                                             | D6 / D7 の決定先。現在 pre-commit のみ記述                        |
| `context/infrastructure.md` secret の置き場         | R2 の資格情報と VRT 用バケットを追加 (source: clarify)                          | D4 で baseline の保管先を R2 に決めたため。#47 の集約後に確定する |
| `context/infrastructure.md` Infrastructure Contract | 別 repo 依頼の記述を #47 の集約後の実態へ更新 (source: clarify)                 | ADR-0001 の supersede に伴い記述が古くなる                        |
| `context/project.yml` の `commands`                 | VRT 実行コマンドと baseline 更新コマンドを追加 (source: clarify)                | コマンド契約の正本。`meta.updated` も同期する                     |
| `context/engineering.md` Docs Closeout Gate         | 「CI への常設化は CI パイプライン方針へ委譲する」を実態へ更新 (source: clarify) | `spec-residue.yml` が既に CI で実行しており常設化は完了済み       |

### ADR の新規 / 更新

| ADR ID   | 変更内容                                               | 理由                                                                       |
| -------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| 新規     | VRT の手段選択 (D4) と対象セットの決定                 | 候補を比較して決める判断のため                                             |
| 新規     | CI とローカル hook の責務分担 (D6 / D7 / D9)           | 二重実行を許すかを含む運用方針の判断のため                                 |
| ADR-0001 | **#47 側で supersede される** (本 spec では起票しない) | D4 の R2 調達が ADR-0001 と衝突するため。本 spec は #47 の完了を前提にする |

## レビュー

| 日付       | 結果 (PASS / NEEDS_WORK) | 指摘要点                                                                           | 対応                                                                          |
| ---------- | ------------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 2026-08-15 | NEEDS_WORK               | 1 回目。指摘 10 件 (上位文書からの委譲取りこぼし / D4・D8・D9 の未決扱い)          | 8 件反映。**指摘 4 (project.yml) と 8 (変更履歴) は置換が失敗し未反映だった** |
| 2026-08-15 | NEEDS_WORK               | 2 回目。指摘 8 件 (ADR-0001 との衝突未記載 / D8 目標値の記述不整合 / 前回未反映分) | 全 8 件反映済 (各置換を検証済み)                                              |

## 変更履歴

| 日付       | 変更者         | 変更内容                                                                                                                         |
| ---------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-14 | spec-lifecycle | scaffold: index.md を作成。実測棚卸しと論点 D1〜D9 を起票                                                                        |
| 2026-08-15 | spec-lifecycle | clarify: D1〜D9 を確定。play は `packages/ui` 限定、POM 導入、VRT は独立種別で reg-suit + Playwright の併用、CI に一本化         |
| 2026-08-15 | spec-review    | clarify gate 1 回目 NEEDS_WORK (指摘 10 件)。記録は [review.md](review.md)                                                       |
| 2026-08-15 | spec-lifecycle | レビュー対応: `check:specs` の扱いを D6 に追記、EARS を spec 本体へ具体化、`## 備考` を追加。infra 集約を #47 へ切り出し         |
| 2026-08-15 | spec-lifecycle | #47 で infra の monorepo 集約が確定。D4 の baseline を R2 で確定し、U1 を実装順序の依存として再分類                              |
| 2026-08-15 | spec-review    | clarify gate 2 回目 NEEDS_WORK (指摘 8 件)。1 回目の指摘 4 / 8 が未反映だったことが判明                                          |
| 2026-08-15 | spec-lifecycle | 2 回目の指摘 8 件に対応。ADR-0001 との衝突を明記、D8 の目標値の記述を統一、reg-suit の R2 対応を調査し必須設定 3 点を記録        |
| 2026-08-15 | spec-lifecycle | D4 / D8 を改訂。#33 の VRT はローカル S3 互換ストレージでの仕組み検証までとし、R2 結線と story 側の CI 稼働を #47 後の P5 へ分離 |

## 備考

appendix (API / Database / Authorization / Screen spec / testid) はいずれも該当しないため取り込まない。

- API endpoint / 永続データ層 / ロール権限 / 画面コンポーネントツリーを本 spec では扱わない
- `data-testid` 一覧は D5 で locator 規約を決めるのみで、個別の testid 設計はジャーニー実装 issue の担当とする
