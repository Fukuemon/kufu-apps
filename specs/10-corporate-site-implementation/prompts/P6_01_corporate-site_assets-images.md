# Corporate Site Assets And Images

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- design source は `design/features/corporate-site/assets/`、runtime copy は `apps/corporate-site/src/assets/` とする
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

## 作業ステップ

### ステップ 0: ブランチ準備

ブランチ命名と base branch は `AGENTS.md` の `Spec Workflow Contract` および `workflow-git` に従う。

1. 最新の base branch を取得する
2. 作業ブランチ `feature/10` を作成する
3. PR テンプレートを確認し、完了条件を description に転記する
4. Draft PR を作成して push する
5. 検証: `git status --short` で作業ブランチ上にいることを確認する

### ステップ 1: runtime asset copy を追加

1. `apps/corporate-site/src/assets/` を作成する
2. `design/features/corporate-site/assets/` から必要な配信用コピーを配置する
3. 派生元が分かるように PR description または近接コメントで design source を記録する
4. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
5. diff レビューで design source を直接 import していないことを確認する

### ステップ 2: Astro Image / import で section に組み込む

1. LP hero など above-the-fold asset は dimensions を明示して扱う
2. その他画像は lazy loading を基本にする
3. `public` 直置きや remote 画像を使わない
4. 画像なし layout fallback が必要な場合は、表示崩れを避ける最小範囲に留める
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
6. diff レビューで width / height / lazy loading / above-the-fold 扱いを確認する

### ステップ最終: 最終確認

1. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
2. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
3. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
4. `specs/10-corporate-site-implementation/index.md` の `## 上位資料からの変更点` に追記が必要か確認する
5. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/10-corporate-site-implementation/index.md`
- 参照する appendix: `Content / Assets`, `Performance`, `Error / Fallback 設計`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `design/features/corporate-site/assets/corporate-hero-industrial.png`
  - `design/features/corporate-site/assets/corporate-machining-service.png`
  - `design/features/corporate-site/assets/corporate-products-supply.png`
  - `design/features/corporate-site/assets/fukuura-mark.png`
  - `apps/corporate-site/src/assets/`
  - `apps/corporate-site/src/components/features/`

## 前提条件

- 完了しているべき phase / 依存 prompt: `P3_01_corporate-site_home-sections.md`, `P4_01_corporate-site_products-page.md`, `P5_01_corporate-site_contact-page.md`
- 完了後に着手可能になる後続 prompt: `P7_01_e2e_corporate-site-main-flow.md`, `P8_01_corporate-site_quality-guard.md`
- 必要な repo 状態: 画像を差し込む section が存在する

## 不明点ハンドリング

- design source と表示 section の対応が判断できない場合は停止する
- 画像の権利 / 用途 / alt text が不明な場合は推測で公開文言を作らない
- 質問するときは、対象 asset、使う section、判断候補を整理する

## タスク境界

### 実装する範囲

- app runtime 用 asset copy
- Astro Image / import による画像組み込み
- dimensions / lazy loading / above-the-fold の扱い

### 実装しない範囲

- design source の編集
- `.pen` の変更
- remote image 配信
- visual screenshot / VRT
- 新しい画像生成

## 設計仕様

- 画像 asset は `design/features/corporate-site/assets/` を design source とし、runtime で使う配信用コピーを `apps/corporate-site/src/assets` に置く。
- app asset は Astro Image / import で扱い、width / height / lazy loading / format 最適化を build に乗せる。
- `public` 配置は参照追跡と最適化が弱いため使わない。
- design 配下の直接参照は app 実装が design 正本ツリーへ依存して責務境界が曖昧になるため使わない。

## テスト観点

- design source と `src/assets` の配信用コピーの対応が PR review で確認できる。
- 画像の width / height / lazy loading / above-the-fold 扱いが明示されている。
- build が通り、asset graph に乗っている。
- visual screenshot / VRT は #28 で扱い、#10 では導入しない。

## 検証コマンド

- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] `apps/corporate-site/src/assets/` に配信用 asset copy を置いた
- [ ] design source との対応を記録した
- [ ] Astro Image / import で必要 section に組み込んだ
- [ ] width / height / lazy loading / above-the-fold 扱いを明示した
- [ ] design source / `.pen` を変更していない
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] PR を Ready に変更しレビュアーを指名した
- [ ] 未解決の仕様質問が残っていない
