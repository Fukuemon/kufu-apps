---
phase: 5
seq: 1
target: core
issue: 33
depends_on: [P1_01_ui_story_vrt.md, P2_01_core_ci_pipeline.md]
---

# story 側 VRT を R2 へ結線し CI へ載せる (#47 完了後)

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- **着手条件**: #47 (infra の monorepo 集約と deploy 経路の再設計) が完了し、R2 バケットと資格情報が用意されていること。**未完了なら着手せず停止する**
- **完了条件のタスク化**: 作業開始前に「完了条件」セクションの各項目を todo として登録し、各ステップ完了時に状態を更新すること。タスク化せずに作業を開始することは禁止

### 実装アンチパターンの回避 (必守)

- スコープ厳守: spec / 本 prompt に明記された機能のみ実装する。未要求の機能追加・
  先回りの抽象化・無関係なリファクタ・暗黙の互換維持をしない。
- 既存規約への整合: 命名・エラー処理・ログ・テスト・API 連携方式は、対象コードベースの
  既存パターンに合わせる。新方式を持ち込む場合は理由を述べて確認を取る。
- 観測可能な契約の保持: UI 文言・イベント名・戻り値・エラーメッセージ・ログ形式・API を
  要求なく変更しない。変更が必要なら理由と影響を明記する。
- 推測の排除: 要件・業務ルール・API 仕様が不明なら停止して確認する。それらしいが
  誤った実装 (存在しない API 呼び出し / 非互換な引数) を避け、import と API の実在を確認する。
- fallback の最小化: `??` / `||` / 既定引数 / 多段 fallback / 暗黙のエラー握り潰しは
  「任意データ」に限定する。必須データの欠落は隠さず明示的に失敗させる。
- 過剰実装の排除: 単純な条件分岐を strategy / handler map に置換しない。
  要求も計測もない caching / memoization を入れない。
- dead code を残さない: 到達不能コード・未使用の変数 / 関数 / import / export・
  変更後に不要化した型定義を削除する。
- 判断の記録: 非自明な設計判断は理由 (or spec / ADR へのリンク) を残す。

## 作業ステップ (この順序で実行する)

### ステップ 0: 着手条件の確認とブランチ準備

1. **#47 が完了していることを確認する。** R2 バケットが存在し、資格情報の置き場が `context/infrastructure.md` に定まっていること。未完了なら**ここで停止しユーザーに報告する**
2. issue #33 の `status:*` が `status:implementing` でなければ付け替え、状態遷移コメントを残す
3. 最新の base branch (`develop`) を取得
4. 作業ブランチ `feature/33` を使う (既存。無ければ作成する)
5. PR テンプレートを確認し、完了条件を description に転記する
6. Draft PR を作成して push する

### ステップ 1: endpoint と資格情報を R2 へ差し替える

1. `reg-publish-s3-plugin` の `sdkOptions.endpoint` を `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` へ向ける
2. **`enableACL: false` と `region: auto` は #33 のローカル検証時と同じ値のまま使う** (差し替え不要)
3. 資格情報は env 経由で渡す。**実値をリポジトリ・spec・commit へ書かない**
4. ローカル検証で使った S3 互換ストレージ (Docker) の定義を、不要になったなら削除する。残す場合は理由をコメントで残す
5. `## 検証コマンド` を実行する
6. diff レビュー (`spec-review` または repo の標準レビュー手段) を回す
7. 指摘を対応してから次へ

### ステップ 2: baseline を CI 環境で撮り直す

1. **ローカル検証で撮った baseline は破棄する。** 正となる baseline は CI 環境で撮り直す
2. CI 環境で 81 story の baseline を publish する
3. `## 検証コマンド` を実行する
4. diff レビューを回し、指摘を対応してから次へ

### ステップ 3: story 側 VRT を CI へ載せる

1. story 側の VRT ジョブを `.github/workflows/` へ追加する。差分が出たら**ジョブを失敗させる** (D12)
2. **ジョブ間の実行順序を暗黙に導入しない**
3. UI 無変更で 2 回連続実行し差分 0 件になることを CI 上で確認する
4. 意図的なスタイル変更で差分が検出されることを CI 上で確認する。確認後に変更を戻す
5. `## 検証コマンド` を実行する
6. diff レビューを回し、指摘を対応してから次へ

### ステップ 4: 差分レポートの閲覧経路を確定する

1. reg-suit の差分レポートを PR から辿れる経路を用意する (U1 の残り)
2. **R2 バケットを公開設定にしない**
3. diff レビューを回し、指摘を対応してから次へ

### ステップ最終: 最終確認

1. 全テスト / lint / typecheck がパスすることを確認
2. spec の `## 上位資料からの変更点` に必要な追記がないかを phase: track に渡す
3. CI の総実行時間 (story 側 VRT 追加後) を実測し、spec の計測指標へ記録する
4. U1 (R2 / 差分レポート閲覧経路) を解消済みとして記録する
5. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- 読み取り索引: `context/impact-index.yaml` の `ci-pipeline` エントリ (最初に読むのはその `read:` が指すファイル)
- spec: `specs/33-testing-strategy/index.md`
- 参照する appendix:
  - `specs/33-testing-strategy/index.md` の `## 機能仕様 → Content / Assets`
  - `specs/33-testing-strategy/index.md` の `## Performance / Security 設計`
  - `specs/33-testing-strategy/index.md` の `## 未確定事項` の U1
  - `specs/33-testing-strategy/index.md` の `## 解決済みの論点` の D4 / D8 / D12
- 正本 ADR: `adr/0015-visual-regression-testing-policy.md` / `adr/0016-ci-local-hook-responsibility.md`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `.github/workflows/` (`P2_01_core_ci_pipeline.md` で追加した分)
  - `P1_01_ui_story_vrt.md` で追加した reg-suit / storycap の設定
  - `context/infrastructure.md`

## 前提条件

- 完了しているべき phase / 依存 prompt: `P1_01_ui_story_vrt.md` / `P2_01_core_ci_pipeline.md`
- **外部依存**: #47 の完了 (R2 バケットの調達と資格情報の置き場の確定)
- **phase 4 が欠番である理由**: 規約の `context/` 反映と ADR 起票 (spec の実装分割 P4) は spec-lifecycle の sync phase で実施済みのため、prompt 化していない
- 完了後に着手可能になる後続 prompt: なし (本 prompt が #33 の最終工程)
- 必要な repo 状態: story 側 VRT がローカル S3 互換ストレージで成立していること

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 実装する範囲

- reg-suit の endpoint と資格情報の R2 への差し替え
- CI 環境での baseline 撮り直し
- story 側 VRT の CI 搭載
- 差分レポートの閲覧経路の確定 (U1 の残り)

### 実装しない範囲

- **R2 バケットの作成そのもの** (#47 が Terraform で行う)
- Cloudflare の資格情報の発行と権限設計 (#47)
- route 側 VRT の変更 (`P1_02` で確立済み。触らない)
- 既存 workflow (`spec-residue.yml` / `spec-closeout.yml` / `storybook-pages.yml`) の作り替え
- ADR-0001 の supersede (#47 が行う)

## 設計仕様

spec からの抜粋。

**D8: VRT の撮影と判定を CI 環境に一本化する。ただし story 側の CI 稼働は #47 完了後とする**

- 本 prompt がその「#47 完了後」の工程である

**保管先の移行 (D4)**

| 系統                | #33 の状態                              | 本 prompt 完了後 |
| ------------------- | --------------------------------------- | ---------------- |
| reg-suit + storycap | ローカル S3 互換 (Docker、**破棄前提**) | R2               |
| Playwright          | リポジトリ (Git 管理)                   | 変更なし         |

**ローカル検証で撮った baseline は破棄前提。** 正となる baseline は #47 完了後に **CI 環境で撮り直す**。

**reg-suit の必須設定 (正本: ADR-0015)**

| #   | 設定                                      | R2 への差し替え時         |
| --- | ----------------------------------------- | ------------------------- |
| 1   | `enableACL: false`                        | **同じ値のまま**          |
| 2   | `sdkOptions.region: auto`                 | **同じ値のまま**          |
| 3   | `customDomain` と `endpoint` を併用しない | 維持する                  |
|     | `sdkOptions.endpoint`                     | R2 のエンドポイントへ変更 |

**Security (spec の `## Performance / Security 設計`)**

- **Cloudflare R2 の資格情報という新しい secret が増える。** 置き場と権限の絞り方は `context/infrastructure.md` に従い、**書き込み権限を VRT 用のバケットに限定する**
- **R2 バケットを公開設定にしない**
- VRT の baseline 画像に非公開情報を含めない。撮影対象は公開サイトの 3 route と Storybook に限る

**D12: VRT の差分が出たら CI を失敗させる (ブロッキング扱い)**

**U1 の解消**

- U1 は「R2 の調達 (#47) と差分レポートの閲覧経路」。本 prompt の完了をもって解消として記録する

**許容 diff (D10)**

- 初期値は 0 (完全一致)。CI 環境での実測で flake が出た場合のみ、マスク → 撮影環境の固定 → 閾値緩和の順で対処する

### 受け入れ基準 (EARS。spec の `## 要件の解釈` から該当分)

- WHERE story 側の VRT は #47 完了後に CI へ載せる。**本 prompt がこの条件を満たす工程である。**
- WHILE UI に変更がない間、システムは VRT を 2 回連続実行しても差分 0 件を返す。
- WHEN 開発者が意図的に 1 箇所のスタイルを変更したとき、システムは VRT で差分を 1 件以上検出する。
- (派生基準) WHEN develop 向けの PR が作成されたとき、システムは story 側の VRT も実行し、成否を PR のチェック欄に返す。
  spec の EARS 原文は route の VRT までを列挙しており、これは **WHERE 句が満たされた後の派生**である。

## テスト観点

spec の `## テスト / 評価方針 → テスト観点` から該当分。

- CI 環境で UI 無変更の 2 回連続実行が差分 0 件になること (flake しないこと) を確認する
- 意図的に 1 箇所スタイルを変えて差分が検出されること (検出力) を CI 上で確認する
- 差分が出たときに CI が失敗し、差分レポートが PR から辿れることを確認する

## 検証コマンド

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm knip && pnpm depcruise`
- `P1_01_ui_story_vrt.md` で定義した VRT 実行コマンド

## 完了条件

- [ ] #47 の完了を確認した (R2 バケットと資格情報の置き場)
- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] 全ステップを順序通りに実行した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] endpoint が R2 を向き、`enableACL: false` と `region: auto` が維持されている
- [ ] 資格情報の実値がリポジトリ・commit に含まれていない
- [ ] R2 バケットが公開設定になっていない
- [ ] ローカル検証の baseline を破棄し、CI 環境で撮り直した
- [ ] story 側 VRT が CI で実行され、差分でジョブが失敗する
- [ ] 差分レポートを PR から辿れる
- [ ] CI 上で差分 0 件と検出力の両方を実測した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] U1 を解消済みとして記録した
- [ ] PR を Ready に変更しレビュアーを指名した
- [ ] 未解決の仕様質問が残っていない
