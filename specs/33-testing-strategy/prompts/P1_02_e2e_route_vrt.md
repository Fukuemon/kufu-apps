---
phase: 1
seq: 2
target: e2e
issue: 33
depends_on: []
---

# route 側 VRT を Playwright の `toHaveScreenshot` で確立する

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
2. 最新の base branch (`develop`) を取得
3. 作業ブランチ `feature/33` を使う (既存。無ければ作成する)
4. PR テンプレートを確認し、完了条件を description に転記する
5. Draft PR を作成して push する

### ステップ 1: route VRT の spec ファイルを追加する

1. テストを先に書く。`e2e/corporate-site/` に route VRT の spec を追加し、3 route × desktop / mobile の 2 viewport で `toHaveScreenshot` を呼ぶ
2. 既存の `e2e/corporate-site/smoke.spec.ts` は**書き換えない** (Page Object 化は `P3_01_e2e_page_object.md` が行う)
3. `## 検証コマンド` を実行する
4. diff レビュー (`spec-review` または repo の標準レビュー手段) を回す
5. 指摘を対応してから次へ

### ステップ 2: flake 要因をマスクする

1. 撮影を 2 回連続実行し、差分が出る要素を特定する
2. 地図 iframe / 外部画像 / アニメーションが差分要因なら、`mask` オプションで該当要素を除外する
3. マスクした要素と理由をコメントで残す
4. `## 検証コマンド` を実行する
5. diff レビューを回し、指摘を対応してから次へ

### ステップ 3: baseline を確立し検出力を確認する

1. baseline (6 枚) をリポジトリへコミットする
2. UI 無変更で再実行し差分 0 件になることを確認する
3. 意図的に 1 箇所スタイルを変え、差分が検出されることを確認する。確認後に変更を戻す
4. baseline 更新の手順 (Playwright の `--update-snapshots`) をコマンドとして整える
5. `## 検証コマンド` を実行する
6. diff レビューを回し、指摘を対応してから次へ

### ステップ最終: 最終確認

1. 全テスト / lint / typecheck がパスすることを確認
2. spec の `## 上位資料からの変更点` に必要な追記がないかを phase: track に渡す
3. 撮影枚数と連続実行での差分数の実測値を spec の計測指標へ記録する
4. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- 読み取り索引: `context/impact-index.yaml` の `testing-strategy` エントリ (最初に読むのはその `read:` が指すファイル)
- spec: `specs/33-testing-strategy/index.md`
- 参照する appendix:
  - `specs/33-testing-strategy/index.md` の `## 機能仕様 → Content / Assets`
  - `specs/33-testing-strategy/index.md` の `## Content / Data 設計`
  - `specs/33-testing-strategy/index.md` の `## Error / Fallback 設計`
  - `specs/33-testing-strategy/index.md` の `## 解決済みの論点` の D4 / D10 / D12
- 正本 ADR: `adr/0015-visual-regression-testing-policy.md`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `playwright.config.ts`
  - `e2e/corporate-site/smoke.spec.ts` (読むだけ。書き換えない)
  - `apps/corporate-site/src/pages/`

## 前提条件

- 完了しているべき phase / 依存 prompt: なし (`P1_01_ui_story_vrt.md` とは対象ファイルが重ならないため並列実装できる)
- 完了後に着手可能になる後続 prompt: `P2_01_core_ci_pipeline.md` (route VRT を CI へ載せるため)
- 必要な repo 状態: `pnpm install` 済み。Playwright のブラウザが導入済み

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 実装する範囲

- 3 route × 2 viewport = 6 枚の baseline 確立
- flake 要因のマスク
- baseline 更新手順のコマンド化

### 実装しない範囲

- story 側 VRT (`P1_01_ui_story_vrt.md` が行う)
- CI への搭載 (`P2_01_core_ci_pipeline.md` が行う)
- `smoke.spec.ts` の Page Object 化 (`P3_01_e2e_page_object.md` が行う)
- E2E ジャーニーのテストコード実装 (本 spec の「やらないこと」)

## 設計仕様

spec からの抜粋。

**対象セット (D4 / ADR-0015)**

| 項目     | 値                                                          |
| -------- | ----------------------------------------------------------- |
| 撮影対象 | 3 route (`/` / `/products` / `/contact`)                    |
| viewport | desktop / mobile の 2 種 (**2 viewport は route 側に適用**) |
| 撮影枚数 | 3 × 2 = 6 枚                                                |
| 保管先   | リポジトリ (Git 管理。Playwright 既定)                      |

baseline を Git 管理に置く理由は、**差分が PR レビューに乗る**ため。story 側と保管先を分けるのは D4 の決定である。

**Playwright の既存設定 (`playwright.config.ts`)**

- `testDir` は `./e2e/${target}`。`target` は `E2E_TARGET` (既定 `corporate-site`)
- `baseURL` は `E2E_BASE_URL` または `http://127.0.0.1:${E2E_PORT ?? 4321}`
- `webServer.command` は `pnpm --filter @kufu/corporate-site run e2e:serve` (= `pnpm build && pnpm preview`)
- `retries` は CI で 2、ローカルで 0

**許容 diff (D10)**

- 初期値は **0 (完全一致)**
- flake が実測された場合にのみ、その実測値を上回る最小値まで緩める
- 環境差への一次対処は閾値の引き上げではなく、**原因要素のマスクと撮影環境の固定**とする

**差分成果物の扱い**

- Playwright の差分画像は CI の artifact / ローカル出力に置き、**リポジトリには残さない**

**Fallback (エスカレーション順。D10 / D12)**

1. 差分の原因要素をマスクする (地図 iframe / 外部画像 / アニメーション)
2. 撮影環境を固定する
3. 1・2 でも解消しない場合に限り、実測した差分量を上回る最小値まで閾値を緩める
4. マスク適用後も 3 回連続で差分が出る場合に限り required checks から外す。**この判断はユーザーが行う**

**プロダクションコードへの制約**

- VRT のためにプロダクションコードへ待機用の実装を入れない。テスト都合で island を増やさない

### 受け入れ基準 (EARS。spec の `## 要件の解釈` から該当分)

- WHEN 開発者が VRT の実行コマンドを実行したとき、システムは対象セットを撮影し baseline との差分件数を終了コードと標準出力で返す。
- WHILE UI に変更がない間、システムは VRT を 2 回連続実行しても差分 0 件を返す。
- IF 意図した UI 変更で差分が出た場合、THEN システムは baseline 更新コマンドで差分を 0 件に解消できる。
- WHEN 開発者が意図的に 1 箇所のスタイルを変更したとき、システムは VRT で差分を 1 件以上検出する。

## テスト観点

spec の `## テスト / 評価方針 → テスト観点` から該当分。

- UI 無変更で 2 回連続実行し、差分 0 件になること (flake しないこと) を実測で確認する
- 意図的に 1 箇所スタイルを変えて差分が検出されること (検出力) を確認する
- 地図 iframe / 外部画像で撮影が不安定になる場合は、該当要素をマスクして撮影する

## 検証コマンド

- `pnpm lint`
- `pnpm typecheck`
- `pnpm e2e` (既定 target は corporate-site)
- `pnpm knip && pnpm depcruise`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] 全ステップを順序通りに実行した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] 3 route × 2 viewport = 6 枚の baseline がリポジトリに存在する
- [ ] UI 無変更での 2 回連続実行で差分 0 件を実測した
- [ ] 意図的なスタイル変更で差分が検出されることを実測した
- [ ] マスクした要素と理由がコメントで残っている
- [ ] 差分画像がリポジトリに残っていない
- [ ] `smoke.spec.ts` を書き換えていない
- [ ] `## 検証コマンド` がすべてパスする
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] 撮影枚数と差分数の実測値を spec の計測指標へ記録した
- [ ] PR を Ready に変更しレビュアーを指名した
- [ ] 未解決の仕様質問が残っていない
