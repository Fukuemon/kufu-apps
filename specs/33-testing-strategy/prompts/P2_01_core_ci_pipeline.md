---
phase: 2
seq: 1
target: core
issue: 33
depends_on: [P1_02_e2e_route_vrt.md]
---

# CI のジョブ構成を整理し `.github/workflows/` へ実装する

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

### ステップ 1: 静的検査のジョブを CI へ追加する

1. `typecheck` / `build` / `knip` / `depcruise` を CI で実行する。既存の `lint.yml` へ足すか別 workflow に分けるかを決め、理由をコメントで残す
2. **ジョブ間の実行順序を暗黙に導入しない。** 順序は D6〜D9 のいずれでも決めていない
3. `## 検証コマンド` を実行する
4. diff レビュー (`spec-review` または repo の標準レビュー手段) を回す
5. 指摘を対応してから次へ

### ステップ 2: E2E と route VRT を CI へ追加する

1. E2E を CI で実行する (D7)。Playwright のブラウザ導入を含める
2. route 側の VRT を CI で実行する (D8)。差分が出たら**ジョブを失敗させる** (D12)
3. 差分画像を artifact として PR から辿れるようにする
4. `## 検証コマンド` を実行する
5. diff レビューを回し、指摘を対応してから次へ

### ステップ 3: ローカル hook との分担を整える

1. `lefthook.yml` の pre-commit を D6 の分担へ揃える。**CI との重複は意図的な二重化として許容する** (削らない)
2. 分担の判断が読み取れるようコメントを残す
3. `## 検証コマンド` を実行する
4. diff レビューを回し、指摘を対応してから次へ

### ステップ 4: PR で実挙動を確認し実測値を採る

1. develop 向けの PR を実際に作り、決定したジョブが実行され結果が PR のチェック欄に返ることを確認する
2. CI の総実行時間を実測し記録する (U2 の判断材料)
3. 失敗したジョブ名とログが PR から辿れることを確認する
4. diff レビューを回し、指摘を対応してから次へ

### ステップ最終: 最終確認

1. 全テスト / lint / typecheck がパスすることを確認
2. spec の `## 上位資料からの変更点` に必要な追記がないかを phase: track に渡す
3. CI の総実行時間の実測値を spec の計測指標へ記録する
4. required status checks の設定はユーザーが判断する (U2)。判断に必要な job 名の一覧を PR に書く
5. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- 読み取り索引: `context/impact-index.yaml` の `ci-pipeline` エントリ (最初に読むのはその `read:` が指すファイル)
- spec: `specs/33-testing-strategy/index.md`
- 参照する appendix:
  - `specs/33-testing-strategy/index.md` の `## 解決済みの論点` の D6 / D7 / D8 / D9 / D12
  - `specs/33-testing-strategy/index.md` の `## 未確定事項` の U2
  - `specs/33-testing-strategy/index.md` の `## Error / Fallback 設計`
- 正本 ADR: `adr/0016-ci-local-hook-responsibility.md` / `adr/0015-visual-regression-testing-policy.md`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `.github/workflows/lint.yml`
  - `.github/workflows/spec-residue.yml` (読むだけ。変更しない)
  - `.github/workflows/spec-closeout.yml` (読むだけ。変更しない)
  - `.github/workflows/storybook-pages.yml` (読むだけ。変更しない)
  - `lefthook.yml`
  - リポジトリ root の `package.json`
  - `turbo.json`

## 前提条件

- 完了しているべき phase / 依存 prompt: `P1_02_e2e_route_vrt.md` (route VRT の実行コマンドが必要)
- 完了後に着手可能になる後続 prompt: `P5_01_core_story_vrt_r2.md`
- 必要な repo 状態: route VRT の baseline がリポジトリにコミット済み

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 実装する範囲

- `typecheck` / `build` / `knip` / `depcruise` の CI 搭載
- E2E の CI 搭載
- route 側 VRT の CI 搭載 (差分でジョブを失敗させる)
- `lefthook.yml` の責務整理
- CI 総実行時間の実測

### 実装しない範囲

- **既存 workflow の作り替え** (`spec-residue.yml` / `spec-closeout.yml` / `storybook-pages.yml`)
- **Storybook build の CI 搭載** — 既に `storybook-pages.yml` が担っており、本 spec は同 workflow を作り替えない
- **`pnpm check:specs` の CI 搭載** — `spec-residue.yml` が既に実行しており常設化は完了済み。同 workflow は「別 PR で spec を清算する運用では無関係な PR が落ちる」ため意図的に PR ゲートから外している。**この既存判断を維持する**
- story 側 VRT の CI 搭載 (#47 完了後。`P5_01_core_story_vrt_r2.md` が行う)
- Turbo remote cache の導入 (U2 の実測後に判断する)
- required status checks の設定 (ユーザー判断)
- Cloudflare Pages のデプロイ設定変更

## 設計仕様

spec からの抜粋。

**D6: `typecheck` / `build` / `knip` / `depcruise` をすべて CI に載せる**

- 根拠: `lint.yml` の「pre-commit は `--no-verify` で素通しできるため CI を必須 gate にする」という既存の設計思想に一貫する
- ローカル hook との重複は**意図的な二重化として許容する**
- `typecheck` と `build` は pre-commit にも CI にも無く、現状どこでも自動検証されていない。**ここが最大の穴であり本決定で塞ぐ**

**D7: E2E を CI で回す**

- 根拠: 現在 5 テストと小さく、ジャーニー網羅で増やす前に土台を作れる
- `context/` にある `127.0.0.1:4321` の bind 制約は**ローカル sandbox 固有**で、Actions の runner には当てはまらない
- Cloudflare Pages preview に対して回す案は、preview URL の取得と待機で構成が複雑になるため却下した

**D8: VRT の撮影と判定を CI 環境に一本化する。ただし story 側の CI 稼働は #47 完了後とする**

- #33 の時点で CI に載るのは **route 側 VRT だけ**である

**D12: VRT の差分が出たら CI を失敗させる (ブロッキング扱い)**

- D10 で閾値を 0 にした以上、非ブロッキングにすると厳しい閾値が実質無意味になる

**D9: CI 実行時間の目標値は置かない**

- D6 / D7 / D8 適用後に実測し、その値を見て Turbo remote cache の要否 (U2) を判断する

**ジョブ順序**

- CI 内のジョブ実行順序は D6〜D9 のいずれでも決めていない。**決定の無い順序依存を実装で導入しない**

**既存の `lint.yml` の構成 (差分実装の起点)**

- `on`: `push` (`branches: ["**"]`) / `pull_request` / `workflow_dispatch`
- `if: github.event_name != 'push' || github.ref_name == github.event.repository.default_branch` で二重実行を回避
- Node 24 (`packages/config` の `.ts` を import する vitest 設定の type stripping に必要)
- `ripgrep` を追加導入 (`check-token-usage.mjs` が使う。runner 標準に無い)
- steps は `pnpm lint` と `pnpm test`

**GitHub Actions の `on:` に関する repo 規約**

- `on:` にブランチ名を直書きしない。`branches: ["**"]` で受けて job 側の `if` で判定する (GitHub 側の制約で固有値を動的解決できないため)

**エラーケース (spec の `## Error / Fallback 設計`)**

| #   | ケース                                    | 見せ方                       | リカバリ                                       |
| --- | ----------------------------------------- | ---------------------------- | ---------------------------------------------- |
| 2   | VRT が環境差で恒常的に差分を出す          | CI を失敗させ差分画像で示す  | 原因要素をマスクし撮影環境を固定する           |
| 4   | CI の E2E が sandbox の bind 制約で落ちる | 失敗ジョブのログに原因を出す | D7 の判断に応じて CI から外し preview へ寄せる |

### 受け入れ基準 (EARS。spec の `## 要件の解釈` から該当分)

- WHEN develop 向けの PR が作成されたとき、システムは `lint` / `test` / `typecheck` / `build` / `knip` / `depcruise` / `e2e` / route の VRT を実行し、各ジョブの成否を PR のチェック欄に返す。
- IF いずれかのジョブが失敗した場合、THEN システムは失敗したジョブ名とログを PR から辿れる状態にする。
- WHERE story 側の VRT は #47 完了後に CI へ載せる。
  (派生) 原文はここまでで、**本 prompt の時点では CI に載せない**というのは同句からの帰結である。

## テスト観点

spec の `## テスト / 評価方針 → テスト観点` から該当分。

- develop 向けの PR を実際に作り、決定したジョブが実行され結果が PR に返ることを確認する
- いずれかのジョブが失敗したとき、失敗したジョブ名とログが PR から辿れることを確認する

## 検証コマンド

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm test`
- `pnpm e2e`
- `pnpm knip && pnpm depcruise`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] 全ステップを順序通りに実行した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `typecheck` / `build` / `knip` / `depcruise` / `e2e` / route VRT が CI で実行される
- [ ] 決定の無いジョブ順序依存を導入していない
- [ ] `spec-residue.yml` / `spec-closeout.yml` / `storybook-pages.yml` を変更していない
- [ ] `lefthook.yml` の責務が D6 と整合し、意図的な二重化がコメントで説明されている
- [ ] 実際の PR でジョブの実行と結果返却を確認した
- [ ] CI の総実行時間を実測し記録した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] required status checks 判断に必要な job 名一覧を PR に書いた
- [ ] PR を Ready に変更しレビュアーを指名した
- [ ] 未解決の仕様質問が残っていない
