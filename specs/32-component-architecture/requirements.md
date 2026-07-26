# コンポーネント設計・feature 構成の見直し (Storybook カタログ / スタイル分離 / feature 粒度) 要求定義

## チケット情報

- 起点: 自由文 (ユーザーヒアリング 2026-07-25)
- チケットID: #32
- トラッカー: GitHub (Fukuemon/kufu-apps)
- URL: https://github.com/Fukuemon/kufu-apps/issues/32

## 背景・目的

corporate-site / packages/ui のコンポーネント設計とディレクトリ構成に次の課題感がある:

1. **Storybook のカタログ性が弱い**: 現状の Storybook を「コンポーネントカタログ」としてもっと機能させたい (探しやすさ / ドキュメント性 / バリエーション網羅)。
2. **スタイル設計**: アニメーションやスタイルをコンポーネント本体から分離する設計が必要かもしれない。コンポーネントの区切り方 (責務分割) とスタイル設計が適切かを見直したい。
3. **globals.css の肥大化**: `apps/corporate-site/src/styles/globals.css` が 799 行あり、スタイルが凝縮されすぎている。
4. **ハードコードの是非**: 実装内のハードコード (文言・値・スタイル) をどこまで許容するかの基準がない。
5. **feature の粒度**: pages → features 構成における `business / company / consultation / contact / hero / products / services` の分割粒度が適切か確信がない。特に `products` は 14 ファイルあり、どれがエントリーポイントか分かりづらい。

※ Storybook play 関数による interaction テストは本 issue の対象外とし、テスト戦略 (draft-testing-strategy) 側で扱う。

## 想定ユーザー/ステークホルダー

| 区分            | 対象                       | 関心事                                                                               |
| --------------- | -------------------------- | ------------------------------------------------------------------------------------ |
| 開発者 (本人)   | UI / corporate-site 実装者 | コンポーネントを探しやすく、起点と責務が即座に分かり、安心して変更できる状態にしたい |
| AI エージェント | 実装・レビューの実行主体   | 区切り方・構成・スタイル規約が明文化されているほど一貫した実装ができる               |

## 提供価値(成功条件)

- Storybook がカタログとして機能する構成方針が決まる
- コンポーネントの区切り方・スタイル分離 (アニメーション含む)・globals.css の分割方針・ハードコード許容基準が context / ADR に明文化される
- feature 分割の基準と feature 内部の標準構成 (エントリーポイントの示し方を含む) が明文化され、products のような大きい feature でも起点が一意に分かる

## スコープ

### やること (決定済み方針の詳細化と正本反映まで)

- Storybook カタログの詳細設計 (autodocs 全面採用を前提としたタイトル階層・分類規約、バリエーション網羅基準)
- cva variants への集約方針の詳細化 (アニメーションの共通ユーティリティ / keyframes トークン化の設計)
- globals.css (799 行) のレイヤ別分割の設計 (@layer 単位のファイル構成、entry point 化、ADR-0007 との整合)
- ハードコード基準の明文化 (文言は content collections / data へ、繰り返し値は定数化、スタイル値はトークン参照のみ)
- features → sections 改名・ページ対応再編の設計 (現 7 features の移行先マップ、共有部品の common への振り分け)
- section の index.ts 再輸出 + 内部非公開規約の設計 (depcruise での機械検査ルール案を含む)
- 決定の context (codebase architecture) / ADR / feature doc への反映 (横断規約は context、corporate-site 固有は feature doc)

### やらないこと

- 個別コンポーネントのリファクタ・ディレクトリ移動の実施 (方針決定後に別 issue)
- Storybook play テスト / E2E の方針決定 (draft-testing-strategy 側)
- デザイントークン体系自体の再設計 (ADR-0007 を覆す場合のみ派生 issue)

## 業務ルール

| #   | ルール                                                                                    | 理由                                  | 備考                                              |
| --- | ----------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------- |
| 1   | 既存の forbidden (app 配下 UI 独自実装禁止 / トークン直書き禁止) と矛盾する方針を出さない | project.yml の禁止事項が上位          | 変える場合は project.yml 側も更新                 |
| 2   | decision_priority 1 位 (パフォーマンス / 最小 island) を損なう方針を採らない              | Astro 静的生成が前提                  |                                                   |
| 3   | 構成規約は corporate-site 固有事情と将来 app (cms) 共通規約を区別して書く                 | Phase 2 以降の app に過剰一般化しない | 置き場 (context か feature doc か) も決定に含める |
| 4   | `pnpm knip && pnpm depcruise` で検証可能な規約を優先する                                  | 機械検査できる規約は drift しない     | depcruise ルール化は実施 issue 側                 |

## 受け入れ基準 (EARS 風)

- WHEN 本 issue が完了したとき、システム (文書群) は autodocs 全面採用を前提とした Storybook のカタログ構成規約 (階層・分類・バリエーション網羅基準) を保持している。
- WHEN 本 issue が完了したとき、システムは cva variants への集約方針、globals.css のレイヤ別分割設計、ハードコード基準 (文言 content 化 / 値の定数化 / スタイル値トークンのみ) を保持している。
- WHEN 本 issue が完了したとき、システムは features → sections 改名・ページ対応再編の移行先マップと、section の index.ts 再輸出 + 内部非公開規約 (products の再構成案を含む) を保持している。
- IF 方針が既存 ADR (0007 トークン / 0008 island / 0010 primitive) と矛盾する場合、THEN 該当 ADR の supersede 案を提示するまで方針を確定しない。
- IF 再構成が既存の import 経路を壊す場合、THEN 実施 issue に移行手順 (段階的移動 / depcruise 検証) を引き継ぐまで実施しない。

## 例外シナリオ

| #   | シナリオ                                                          | 見せ方                     | 代替手段                                          |
| --- | ----------------------------------------------------------------- | -------------------------- | ------------------------------------------------- |
| 1   | feature 分割基準がどの軸でも一長一短で決めきれない                | 未決事項として比較表を残す | products のみ先行して構成規約を適用し他は現状維持 |
| 2   | スタイル分離方針が Storybook カタログ構成と相互依存で確定できない | 依存関係を未決事項に明記   | カタログ構成を先に確定しスタイル分離を追従させる  |

## 決定事項(解決済み論点)

要求レベルの論点は 2026-07-25 のヒアリングで全件解決済み。未決事項はゼロ。

| #   | 論点                         | 決定 (2026-07-25, ユーザー)                                                                                                            |
| --- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | カタログ強化の具体像         | **autodocs 全面採用 + 分類整理** (タイトル階層規約、args/argTypes でバリエーション網羅)                                                |
| 2   | アニメーション・スタイル分離 | **cva variants に集約**。アニメーションは共通ユーティリティ / keyframes のトークン化。shadcn/ui パターンと整合                         |
| 3   | globals.css 分割の軸         | **レイヤ別に分割** (@layer tokens / base / components / utilities)。globals.css は import のみの entry point に                        |
| 4   | ハードコード許容ライン       | **文言・リストは content collections (または data) へ、繰り返し値は定数化**。スタイル値は既存 forbidden どおりトークン参照のみ         |
| 5   | 分割の軸                     | **ページ対応 + 共有は common**。区切りの概念は feature でなく **section** とし、`components/features/` → `components/sections/` に改名 |
| 6   | エントリーポイント明示       | **index.ts 再輸出 + 内部非公開**。pages からは index 経由の import のみ許可 (depcruise で機械検査)                                     |
| 7   | 規約の置き場                 | **横断規約は context、corporate-site 固有は feature doc** に分けて書く                                                                 |

## 関連 Design Doc 節

- `design/DesignDoc.md` ## モジュール責務、## 設計上の重要ポイント
- `design/features/corporate-site/DesignDoc_corporate-site.md` / `context/component-design.md` (component-map.md は #31 で削除。配置は実装 + Storybook が正本)
- `adr/0006-corporate-site-three-route-ia.md` / `adr/0007-design-token-architecture.md` / `adr/0008-astro-react-island-policy.md` / `adr/0010-shadcn-base-ui-primitive-policy.md`
- `context/design-workflow.md` §6 (トークン正本ガード)

## 権限要件 / バリデーション方針 / 監査・非機能

- 対象外 (設計方針の検討 issue のため)

## 変更履歴

| 日付       | 変更者           | 変更内容                                                                                                        |
| ---------- | ---------------- | --------------------------------------------------------------------------------------------------------------- |
| 2026-07-25 | spec-requirement | draft-component-style-design と draft-feature-structure を統合、play テスト論点を draft-testing-strategy へ移管 |
| 2026-07-25 | spec-requirement | 要求論点 7 件をユーザー対話で解決し決定事項に反映 (features → sections 再編を含む)                              |
