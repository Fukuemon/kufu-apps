---
phase: 3
seq: 1
target: corporate-site
issue: 32
depends_on: [P2_01_corporate-site_sections_migration.md]
---

# Storybook カタログ規約への追従 (D1 / D2 / D3 / 突合②)

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

### ステップ 0: 前提確認

1. `P2_01` が完了し、`components/sections/<section>/` 構成になっていることを確認する
2. 現在のブランチが `feature/32` であることを確認する

### ステップ 1: autodocs をグローバル適用する

1. `apps/corporate-site/.storybook/preview.ts` に `tags: ["autodocs"]` を追加する (グローバル適用)
2. `packages/ui/.storybook/preview.ts` にも同様に追加する
3. 個別 story 側の `tags: ["autodocs"]` 指定が重複していれば削除する (グローバルに集約)
4. `## 検証コマンド` の Storybook build を実行する
5. diff レビューを回し、指摘を対応してから次へ

### ステップ 2: title 階層をディレクトリと 1:1 にする

各 story の `title` を下表に合わせる。

| story ファイルの位置                                   | title                                       |
| ------------------------------------------------------ | ------------------------------------------- |
| `sections/hero/Hero.stories.ts`                        | `Sections/Hero/Hero`                        |
| `sections/business/BusinessSection.stories.ts`         | `Sections/Business/BusinessSection`         |
| `sections/business/BusinessFeatureRow.stories.ts`      | `Sections/Business/BusinessFeatureRow`      |
| `sections/company/CompanySection.stories.ts`           | `Sections/Company/CompanySection`           |
| `sections/consultation/ConsultationSection.stories.ts` | `Sections/Consultation/ConsultationSection` |
| `sections/products-category/*.stories.ts`              | `Sections/ProductsCategory/<Component>`     |
| `sections/products-detail/*.stories.ts`                | `Sections/ProductsDetail/<Component>`       |
| `sections/contact/ContactSection.stories.ts`           | `Sections/Contact/ContactSection`           |
| `common/<Component>.stories.ts`                        | `Common/<Component>`                        |

`packages/ui` 側の story は `UI/<Component>` に揃える。

### ステップ 3: バリエーション網羅を補完する

presentation component (Section assembly 以外) の story に、次を追加する:

1. variant を持つ component は、その全組み合わせを args で列挙した story
2. edge state の story (長文 / 空データ / 最小構成のうち、その component で意味を持つもの)

Section story は「ページ文脈での確認入口」として代表ケースのみでよい (網羅対象外)。fixture は story 内に閉じ、本番 content / secret / 外部 API call を持ち込まない。

### ステップ最終: 最終確認

1. `## 検証コマンド` がすべてパスすることを確認
2. Storybook のサイドバー階層がディレクトリ構造と 1:1 になっていることを目視確認する
3. 変更をコミットする (commit message に `Refs #32` を含める)

## 実装コンテキスト

- spec: `specs/32-component-architecture/index.md` (D1 / D2 / D3 / 突合② / 実装分割 P3)
- 参照する path:
  - `apps/corporate-site/.storybook/`
  - `apps/corporate-site/src/components/` (sections / common の story)
  - `packages/ui/.storybook/` と `packages/ui/src/components/` の story
- 規約の正本: `context/component-design.md` (Storybook 対象節)
- title の対応表: `design/features/corporate-site/component-map.md`

## 前提条件

- 完了しているべき phase / 依存 prompt: `P2_01_corporate-site_sections_migration.md`
- 完了後に着手可能になる後続 prompt: なし (P3 は他の phase をブロックしない)
- 必要な repo 状態: sections 構成への移行が完了していること

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 実装する範囲

- autodocs のグローバル適用 (corporate-site / packages/ui の preview)
- 全 story の title 階層の是正
- presentation component の variant 全列挙 story と edge state story の追加

### 実装しない範囲

- Storybook play 関数による interaction テスト (#33 testing-strategy の責務)
- component 実装の変更 (props 追加 / variant 追加は行わない。既存 variant を story で列挙するだけ)
- MDX 概要ページの新規作成 (D3 により必須としない)
- cva 化 (P5 の責務)

## 設計仕様

spec の D1〜D3 / 突合② より抜粋:

> **D1: Storybook title はディレクトリと 1:1 対応**。app-local は `Sections/<Section>/<Component>` と `Common/<Component>`、packages/ui は `UI/<Component>`。title はファイルの物理配置から機械的に決まる。
>
> **D2: バリエーションは variant 全列挙 + edge 必須**。cva variants の全組み合わせを args で列挙する story を必須にする。edge state (長文 / 空データ / 最小構成) の story を必須にする。網羅の単位は presentation component。Section story は fixture 差し替えの代表ケースのみでよい。
>
> **D3: autodocs は preview グローバル + opt-out**。`.storybook/preview` の `tags: ['autodocs']` で全 story に適用し、例外は story 側で `!autodocs`。MDX 概要ページは必須にしない。
>
> **突合②: section assembly の story を公認**。Section story を「ページ文脈での確認入口」としてカタログに含める。条件: fixture は story 内に限定し、本番 content / secret / 外部 API call を story に持ち込まない。

## テスト観点

- Storybook build が通るか
- 全 story に autodocs が適用され、docs ページが生成されるか
- title 階層がディレクトリ構造と 1:1 か

## 検証コマンド

- `pnpm --filter @kufu/corporate-site storybook:build`
- `pnpm --filter @kufu/ui storybook:build`
- `pnpm --filter @kufu/corporate-site typecheck`

## 完了条件

- [ ] 全ステップを順序通りに実行した
- [ ] autodocs が両 Storybook の preview でグローバル適用されている
- [ ] 全 story の title がディレクトリ構造と 1:1 になっている
- [ ] presentation component に variant 全列挙 story と edge state story がある
- [ ] Section story の fixture が story 内に閉じている
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] 変更を `Refs #32` 付きでコミットした
- [ ] 未解決の仕様質問が残っていない
