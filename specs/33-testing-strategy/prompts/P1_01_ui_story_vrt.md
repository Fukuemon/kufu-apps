---
phase: 1
seq: 1
target: ui
issue: 33
depends_on: []
---

# story 側 VRT (storycap + reg-suit) をローカル S3 互換ストレージで成立させる

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
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

### ステップ 0: ブランチ準備と着手記録

ブランチ命名と base branch は `context/project.yml` の `naming.branch` (`feature/<issue-number>`) および `workflow-git` に従う。

1. issue #33 の `status:*` が `status:implementing` でなければ付け替え、状態遷移コメントを残す
   (`workflow-git` の `references/issue-status.md`。既に implementing なら何もしない)
2. 最新の base branch (`develop`) を取得
3. 作業ブランチ `feature/33` を使う (既存。無ければ作成する)
4. PR テンプレートを確認し、完了条件を description に転記する
5. Draft PR を作成して push する

### ステップ 1: ローカル S3 互換ストレージを起動できる状態にする

1. Docker で起動する S3 互換ストレージの compose 定義を追加する
2. バケット作成とエンドポイント / 資格情報の受け渡し手順を README または `docs` 相当の場所へ書く。**資格情報の実値をリポジトリへ書かない** (ローカル検証用のダミー値も env 経由で渡す)
3. `## 検証コマンド` の該当分を実行する
4. diff レビュー (`spec-review` または repo の標準レビュー手段) を回す
5. 指摘を対応してから次へ

### ステップ 2: storycap で 2 つの Storybook を撮影する

1. `@kufu/ui` と `@kufu/corporate-site` の Storybook をそれぞれ build し、storycap で撮影する
2. 2 系統の撮影結果を reg-suit の比較対象 1 つへまとめる。**衝突しないディレクトリ規則**を決め、理由をコメントで残す
3. fixture story (`apps/corporate-site/scripts/__fixtures__/section-boundary/`) を撮影対象から除外する
4. `## 検証コマンド` を実行する
5. diff レビューを回し、指摘を対応してから次へ

### ステップ 3: reg-suit で差分判定を成立させる

1. `reg-publish-s3-plugin` をローカル S3 互換ストレージへ向けて設定する (下記「設計仕様」の必須設定 3 点)
2. baseline を一度 publish し、UI 無変更で再実行して差分 0 件になることを確認する
3. 意図的に 1 箇所スタイルを変え、差分が 1 件以上検出されることを確認する。確認後に変更を戻す
4. `## 検証コマンド` を実行する
5. diff レビューを回し、指摘を対応してから次へ

### ステップ 4: 実行コマンドを整える

1. VRT 実行コマンドと baseline 更新コマンドを `package.json` の scripts として定義する
2. コマンド名を `## 上位資料からの変更点` へ渡すため、決定したコマンド名を spec へ記録する (`context/project.yml` の `commands` 反映は P4 相当の作業として phase: track へ渡す)
3. `## 検証コマンド` を実行する
4. diff レビューを回し、指摘を対応してから次へ

### ステップ最終: 最終確認

1. 全テスト / lint / typecheck がパスすることを確認
2. spec の `## 上位資料からの変更点` に必要な追記がないかを phase: track に渡す
3. 撮影枚数と連続実行での差分数の実測値を spec の `## テスト / 評価方針 → 計測指標` へ記録する
4. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/33-testing-strategy/index.md`
- 参照する appendix:
  - `specs/33-testing-strategy/index.md` の `## 機能仕様 → Content / Assets`
  - `specs/33-testing-strategy/index.md` の `## Content / Data 設計`
  - `specs/33-testing-strategy/index.md` の `## 解決済みの論点` の D3 / D4 / D8 / D10 / D12
- 正本 ADR: `adr/0015-visual-regression-testing-policy.md`
- target を `ui` にした理由: 撮影対象の主体が `packages/ui` の story (47 / 81) であるため。Docker compose 定義と root `package.json` の scripts 追加を含むが、これらは撮影を成立させるための付随作業であり、CI 設定 (`core`) には触れない
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `packages/ui/src/components/*.stories.tsx`
  - `apps/corporate-site/src/**/*.stories.ts`
  - `apps/corporate-site/scripts/__fixtures__/section-boundary/` (除外対象)
  - `scripts/build-storybook-pages.mjs`
  - リポジトリ root の `package.json`

## 前提条件

- 完了しているべき phase / 依存 prompt: なし (本 prompt が phase 1 の起点)
- 完了後に着手可能になる後続 prompt: `P5_01_core_story_vrt_r2.md`
- 必要な repo 状態: `pnpm install` 済み。Docker が利用できること

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 実装する範囲

- ローカル S3 互換ストレージ (Docker) の起動定義と、そこへ baseline を publish する設定
- storycap による 2 つの Storybook の撮影と、reg-suit の比較対象への集約
- reg-suit の差分判定が成立することの実測確認 (差分 0 / 検出力)
- VRT 実行コマンドと baseline 更新コマンドの定義

### 実装しない範囲

- Cloudflare R2 への結線 (#47 完了後。`P5_01_core_story_vrt_r2.md` が行う)
- story 側 VRT を CI へ載せること (同上)
- route 側 VRT (`P1_02_e2e_route_vrt.md` が行う)
- play テストの実装 (本 spec の「やらないこと」)
- `storybook-pages.yml` の作り替え (本 spec の「やらないこと」)
- `components.css` の colocation 移行そのもの

## 設計仕様

spec からの抜粋。

**対象セット (D4 / ADR-0015)**

| 項目             | 値                                                                    |
| ---------------- | --------------------------------------------------------------------- |
| 撮影対象         | 81 story (`packages/ui` 47 + `apps/corporate-site` 34)                |
| viewport         | 既定 viewport 1 種のみ (2 viewport は route 側に適用する)             |
| 撮影枚数の初期値 | 81 枚                                                                 |
| 除外             | fixture story (`scripts/__fixtures__/section-boundary/`)              |
| 保管先           | #33 はローカル S3 互換 (Docker、**破棄前提**)。#47 完了後に R2 へ移行 |

story 数 81 は `*.stories.*` の**ファイル数 29 とは別**である。CSF3 は 1 ファイルが複数 story を export するため、
ファイル数を撮影枚数として扱ってはならない。

**Storybook は 2 インスタンスある。** `pnpm storybook:build` は `@kufu/ui` と `@kufu/corporate-site` を
別々に build し、`scripts/build-storybook-pages.mjs` が `.storybook-pages/ui/` と `.storybook-pages/corporate-site/` へ
**別の静的サイト**として配置する。統合された 1 つの Storybook は存在しないため、storycap は 2 回撮影して
reg-suit の比較対象へまとめる必要がある。

**reg-suit を S3 互換ストレージへ接続するときの必須設定 (正本: ADR-0015)**

`reg-publish-s3-plugin` は `sdkOptions` を `S3Client` のコンストラクタへ渡すため S3 互換ストレージで動作する。
既定値のままでは失敗するため次の 3 点を設定する。

| #   | 設定                                      | 理由                                                                                                          |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | `enableACL: false` を明示する             | plugin の既定は `enableACL: true` / `acl: public-read`。R2 はオブジェクト ACL を未実装で PutObject が失敗する |
| 2   | `sdkOptions.region` に `auto` を指定する  | R2 の region は `auto` が正                                                                                   |
| 3   | `customDomain` と `endpoint` を併用しない | 併用すると差分レポートの URL が二重に組み立てられる既知の不具合がある                                         |

`sdkOptions.endpoint` は #33 ではローカル S3 互換ストレージのエンドポイントへ向ける。#47 完了後に R2 の
`https://<ACCOUNT_ID>.r2.cloudflarestorage.com` へ差し替える。**`enableACL` と `region` は差し替え後も同じ値のまま使える。**

**許容 diff (D10)**

- 初期値は **0 (完全一致)**
- flake が実測された場合にのみ、その実測値を上回る最小値まで緩める
- 環境差への一次対処は閾値の引き上げではなく、**原因要素のマスクと撮影環境の固定**とする

**baseline の扱い**

- #33 のローカル検証で撮った baseline は**破棄前提**とする。正となる baseline は #47 完了後に CI 環境で撮り直す

**secret の扱い**

- 資格情報の実値をリポジトリ・spec・commit へ書かない。ローカル検証用の値も env 経由で渡す

### 受け入れ基準 (EARS。spec の `## 要件の解釈` から該当分)

- WHEN 開発者が VRT の実行コマンドを実行したとき、システムは対象セットを撮影し baseline との差分件数を終了コードと標準出力で返す。
- WHILE UI に変更がない間、システムは VRT を 2 回連続実行しても差分 0 件を返す。
- IF 意図した UI 変更で差分が出た場合、THEN システムは baseline 更新コマンドで差分を 0 件に解消できる。
- WHEN 開発者が意図的に 1 箇所のスタイルを変更したとき、システムは VRT で差分を 1 件以上検出する。
- WHERE story 側の VRT は #47 完了後に CI へ載せる。#33 の時点ではローカルの S3 互換ストレージに対して実行し、差分判定が成立することを確認する。

## テスト観点

spec の `## テスト / 評価方針 → テスト観点` から該当分。

- UI 無変更で 2 回連続実行し、差分 0 件になること (flake しないこと) を実測で確認する
- 意図的に 1 箇所スタイルを変えて差分が検出されること (検出力) を確認する
- 地図 iframe / 外部画像 / アニメーションが flake 要因になる場合は、該当要素をマスクして撮影する

## 検証コマンド

`context/project.yml` の `commands` にある標準 task。

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm knip && pnpm depcruise` (健全性検査)
- 本 prompt で新設した VRT 実行コマンド

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] 全ステップを順序通りに実行した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] ローカル S3 互換ストレージ (Docker) が起動し、baseline を publish できる
- [ ] 81 story を 2 つの Storybook から撮影し、reg-suit の比較対象へまとめられている
- [ ] fixture story が撮影対象から除外されている
- [ ] UI 無変更での 2 回連続実行で差分 0 件を実測した
- [ ] 意図的なスタイル変更で差分が 1 件以上検出されることを実測した
- [ ] 資格情報の実値がリポジトリ・commit に含まれていない
- [ ] `## 検証コマンド` がすべてパスする
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] 撮影枚数と差分数の実測値を spec の計測指標へ記録した
- [ ] PR を Ready に変更しレビュアーを指名した
- [ ] 未解決の仕様質問が残っていない
