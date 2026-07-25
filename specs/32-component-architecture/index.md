# コンポーネント設計・sections 再編 (Storybook autodocs / cva 集約 / globals.css 分割)

> 対象: corporate-site / packages/ui のコンポーネント設計とディレクトリ構成の見直し方針の詳細化。
> スコープ: Storybook カタログ規約 / cva variants 集約 (アニメーション含む) / globals.css レイヤ分割 / ハードコード基準 / features → sections 再編と index.ts 公開規約。
> 正本境界: 本 spec は issue #32 の論点・決定経緯・受け入れ基準・実装分割を記録する。durable な規約は sync phase で context / feature doc / ADR へハンドオフし、以後そちらを正本とする。要求レベルの決定 7 件は [requirements.md](requirements.md) 決定事項を参照。

## メタ情報

- Issue: `#32`
- ステータス: `In Progress`
- 作成日: 2026-07-25
- 更新日: 2026-07-25
- Branch: `feature/32`
- Owner: Fukuemon

## 設計フェーズ状況

状態は `未着手 / 進行中 / 完了 / レビュー済 / 保留` のいずれか。保留の場合は理由を備考に残す。

| #   | フェーズ                    | 状態   | 最終更新   | 備考                                                             |
| --- | --------------------------- | ------ | ---------- | ---------------------------------------------------------------- |
| 1   | 起票                        | 完了   | 2026-07-25 | issue #32 (spec-requirement で起票、要求論点 7 件解決済み)       |
| 2   | 下書き                      | 完了   | 2026-07-25 | scaffold で index.md 初版生成。実装突合: 対象 (既存実装への増分) |
| 3   | 上位文書突合                | 完了   | 2026-07-25 | 変更提案あり (component-design.md ほか)。sync でハンドオフ予定   |
| 4   | 論点整理                    | 未着手 |            |                                                                  |
| 5   | 論点解決                    | 未着手 |            |                                                                  |
| 6   | Interface / Routing 設計    | 未着手 |            | 本 spec では「規約 (ディレクトリ / 公開面) の設計」として扱う    |
| 7   | Content / Data 設計         | 未着手 |            | ハードコード基準 (content collections / data / 定数化) を扱う    |
| 8   | Performance / Security 設計 | 未着手 |            | CSS payload / island 方針への影響確認                            |
| 9   | Test / Metrics 設計         | 未着手 |            | depcruise / knip による規約の機械検査設計                        |
| 10  | 実装分割                    | 未着手 |            | 実施 issue への移行手順 (段階的移動 / depcruise 検証) を含む     |
| 11  | レビュー済                  | 未着手 |            |                                                                  |

## 上位文書整合

正本 ([Design Doc `## Why / What`](../../design/DesignDoc.md#why--what) / [Design Doc landscape](../../design/DesignDoc.md) / [feature doc](../../design/features/corporate-site/DesignDoc_corporate-site.md) / [context](../../context/) / ADR) のどの節と、どう整合させたかを記録する。

- Design Doc Why / What 更新要否: 不要 (継承。ガードレール「Unnecessary Client JS Count」「Direct UI Duplication Count」の枠内)
- Design Doc 更新要否: 不要 (継承。モジュール責務は変えず、component 規約の詳細化のみ)
- ADR 起票要否: 判断中 (features → sections 再編 + index.ts 公開規約はアーキ判断として ADR 候補。D8 で確定)

| 上位文書    | 節 / 該当箇所                                                      | 整合方針 (継承 / 補足 / 変更提案)                                                              |
| ----------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Design Doc  | Why / What → ガードレール / 設計上の重要ポイント                   | 継承 (性能最優先・最小 island を損なわない)                                                    |
| context     | component-design.md → ディレクトリ構成 / 責務分割 / Storybook 対象 | **変更提案** (features → sections 改名、autodocs 規約、cva 集約、index.ts 公開規約の追記)      |
| context     | component-design.md → スタイリング節                               | **変更提案** (globals.css レイヤ分割、アニメーション共通ユーティリティ / keyframes トークン化) |
| context     | architecture.md → Package Boundary                                 | 補足 (section の内部非公開を depcruise ルール案として詳細化。境界の考え方自体は継承)           |
| feature doc | corporate-site → 設計方針 / component-map.md                       | **変更提案** (sections 再編の移行先マップ、products 再構成など corporate-site 固有規約)        |
| ADR-0007    | デザイントークン 2 層構造 / lean app-local Tailwind entry          | 継承 (globals.css 分割は「entry は import のみ」への詳細化。トークン体系は変えない)            |
| ADR-0008    | Astro static rendering / island 境界                               | 継承 (再編で island 方針は変えない)                                                            |
| ADR-0010    | shadcn primitive 基盤は Base UI                                    | 継承 (packages/ui の component source 方針は変えない)                                          |
| project.yml | forbidden (UI 独自実装 / トークン直書き) / decision_priority       | 継承 (ハードコード基準は forbidden の詳細化)                                                   |

> 変更提案は本 issue の成果物そのものであり、sync phase の正本ハンドオフで context / feature doc / ADR へ反映する。それまで design 側を書き換えない。

## 関連資料

- `design/DesignDoc.md`: ## モジュール責務 / ## 設計上の重要ポイント
- `design/features/corporate-site/DesignDoc_corporate-site.md` / `component-map.md`
- `context/component-design.md` (現行規約の正本) / `context/architecture.md` / `context/design-workflow.md` §6
- `adr/0006` (3 route IA) / `adr/0007` (トークン) / `adr/0008` (island) / `adr/0010` (Base UI)
- 関連 issue: #32 (本 issue) / #33 (testing-strategy: Storybook play テストは対象外としてそちらへ移管) / #6 (Storybook catalog 決定経緯) / #10 (corporate-site 実装)
- [requirements.md](requirements.md): 要求定義と決定済み方針 7 件

## 背景

- corporate-site 実装 (#10) と Storybook catalog (#6) を経て、component 数が増えた結果、現行規約 (context/component-design.md) と実態に次のギャップがある:
  - Storybook がカタログとして探しにくい (タイトル階層・分類の規約がない、バリエーション網羅基準がない)
  - `globals.css` が 799 行に肥大化し、entry point と実体の責務が混在している
  - `components/features/` 配下 7 feature の分割粒度が曖昧で、`products` は 14 ファイルの起点が読めない
  - ハードコード (文言・値) の許容基準が明文化されていない
- Phase 1 完成条件「責務境界が Design Docs と AI 設定に明記されている」の component 規約部分を実態に追いつかせる issue である
- 影響範囲は `apps/corporate-site` と `packages/ui` (規約文書は context / feature doc)

## スコープ

### やること

- Storybook カタログの詳細設計 (autodocs 全面採用を前提としたタイトル階層・分類規約、バリエーション網羅基準)
- cva variants への集約方針の詳細化 (アニメーションの共通ユーティリティ / keyframes トークン化の設計)
- globals.css (799 行) のレイヤ別分割の設計 (@layer 単位のファイル構成、entry point 化、ADR-0007 との整合)
- ハードコード基準の明文化 (文言は content collections / data へ、繰り返し値は定数化、スタイル値はトークン参照のみ)
- features → sections 改名・ページ対応再編の設計 (現 7 features の移行先マップ、共有部品の common への振り分け)
- section の index.ts 再輸出 + 内部非公開規約の設計 (depcruise での機械検査ルール案を含む)
- 決定の context (codebase architecture) / ADR / feature doc への反映 (横断規約は context、corporate-site 固有は feature doc)

### やらないこと

- 個別コンポーネントのリファクタ・ディレクトリ移動の実施 (方針決定後に実施 issue へ)
- Storybook play テスト / E2E の方針決定 (#33 testing-strategy 側)
- デザイントークン体系自体の再設計 (ADR-0007 を覆す場合のみ派生 issue)

## 要件の解釈

### 実現したいユーザー価値

- 開発者 / AI エージェントがコンポーネントを探しやすく、起点と責務が即座に分かり、安心して変更できる
- 区切り方・構成・スタイル規約が明文化され、一貫した実装ができる

### 成功条件

- Storybook がカタログとして機能する構成規約 (階層・分類・網羅基準) が確定し文書化される
- コンポーネント区切り・スタイル分離・globals.css 分割・ハードコード基準が context / ADR に明文化される
- sections 分割基準と section 内部の標準構成が明文化され、products のような大きい section でも起点が一意に分かる

### 対象ユーザー / 操作主体

- 開発者 (本人): UI / corporate-site 実装者
- AI エージェント: 実装・レビューの実行主体

EARS 風で振る舞いを記述する (`<who>` `<trigger>` 時、システムは `<expected behavior>` する)。

- WHEN 本 issue が完了したとき、システム (文書群) は autodocs 全面採用を前提とした Storybook のカタログ構成規約 (階層・分類・バリエーション網羅基準) を保持している
- WHEN 本 issue が完了したとき、システムは cva variants への集約方針、globals.css のレイヤ別分割設計、ハードコード基準を保持している
- WHEN 本 issue が完了したとき、システムは features → sections 改名の移行先マップと、section の index.ts 再輸出 + 内部非公開規約 (products の再構成案を含む) を保持している
- IF 方針が既存 ADR (0007 / 0008 / 0010) と矛盾する場合、THEN 該当 ADR の supersede 案を提示するまで方針を確定しない
- IF 再構成が既存の import 経路を壊す場合、THEN 実施 issue に移行手順 (段階的移動 / depcruise 検証) を引き継ぐまで実施しない

## 設計時の論点

設計 / 実装フェーズへ持ち越す残課題を 1 件ずつ管理する。確定したものは「解決済みの論点」へ移す。

| #   | 論点                                                                                                                                                    | 決定候補                                                                                    | 決定 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---- |
| D1  | Storybook タイトル階層規約: packages/ui と app-local それぞれの `title` 命名体系 (例: `UI/Button` / `Sections/Products/ProductsHero` / `Common/...`)    | sections 再編後のディレクトリと 1:1 対応させる案                                            | 未決 |
| D2  | バリエーション網羅基準: args / argTypes で何をどこまで網羅するか (variant 全列挙 / edge state / 長文・空データ)                                         | variant × 主要 state をマトリクスで必須化する案                                             | 未決 |
| D3  | autodocs 適用範囲: `tags: ['autodocs']` の全面適用の単位 (preview でグローバル指定か story 単位か)、MDX doc の扱い                                      | preview グローバル + 例外 opt-out                                                           | 未決 |
| D4  | cva 集約の適用形態: `.astro` component での cva 利用方法 (frontmatter で class 組み立て中の条件分岐を cva へ置換する範囲)、cva を使わない閾値           | variant を持つ component のみ cva、単純な固定 class は現状維持                              | 未決 |
| D5  | アニメーション設計: keyframes / duration / easing のトークン化の置き場 (`@kufu/ui` tokens.css / theme.css / app-local) と共通ユーティリティの提供形態   | keyframes + motion トークンは `@kufu/ui`、利用 utility は theme.css 写像                    | 未決 |
| D6  | globals.css 分割のファイル構成: @layer (tokens / base / components / utilities) 単位の具体ファイル・置き場・import 順序、ADR-0007 の 4 entry との関係   | `src/styles/` 配下にレイヤ別ファイル + globals.css は import のみ                           | 未決 |
| D7  | ハードコード基準の線引き: 既存「Content 層の選び分け」(plain ts / Content Collections) との統合、繰り返し値の定数の置き場、許容する直書きの範囲         | 現行ハイブリッド基準を包含する 3 区分 (文言 / 値 / スタイル) で明文化                       | 未決 |
| D8  | sections 移行先マップ: 現 7 features (business / company / consultation / contact / hero / products / services) のページ対応再編と common への振り分け  | route (`/` `/products` `/contact`) 対応で再グルーピング                                     | 未決 |
| D9  | section 標準構成: section 内部の標準ファイル構成 (エントリーポイント `index.ts` / Section component / 内部 component) と products 14 ファイルの再構成案 | `index.ts` 再輸出 + `<Feature>Section.astro` を起点とする構成                               | 未決 |
| D10 | 公開面の機械検査: index.ts 経由 import のみ許可する depcruise ルール案 (story ファイル・pages からの参照経路の扱い)                                     | pages → sections は index 経由のみ、story は同 section 内直接参照を許可                     | 未決 |
| D11 | 規約の置き場と ADR 要否: 各決定の反映先 (context/component-design.md / feature doc / component-map.md) の割り付け、sections 再編を ADR として残すか     | 横断規約は component-design.md 改訂、corporate-site 固有は feature doc、再編判断は ADR 起票 | 未決 |

## 解決済みの論点

要求レベルの決定 7 件 (autodocs 全面採用 / cva 集約 / レイヤ別分割 / 文言 content 化・値の定数化 / ページ対応 + common・sections 改名 / index.ts 再輸出 + 内部非公開 / 規約は context と feature doc に分置) は [requirements.md](requirements.md) の決定事項を正とする。本 spec ではその詳細化のみを扱い、要求決定を上書きしない。

## 未確定事項

(決定できない項目を理由とともに残す。1 件でも残っていれば下流 phase は止める)

- D1〜D11 (上表)。clarify phase で全件解決する

## 実装対象

正規 target は `context/project.yml` の対象ドメイン一覧を正本とする。

| モジュール       | 実装有無 | 主な責務                                                                       |
| ---------------- | :------: | ------------------------------------------------------------------------------ |
| `corporate-site` |    ◯     | sections 再編・globals.css 分割・ハードコード基準の適用対象 (設計のみ)         |
| `cms`            |    -     | 将来 app。共通規約の過剰一般化をしない線引きの参照先                           |
| `ui`             |    ◯     | Storybook カタログ規約・アニメーション / keyframes トークンの置き場 (設計のみ) |
| `config`         |    -     |                                                                                |
| `e2e`            |    -     | (play テスト / E2E は #33 側)                                                  |
| `core`           |    -     |                                                                                |

## 機能仕様

本 issue は設計方針の検討 issue であり、成果物は規約文書 (context / feature doc / ADR)。ランタイム機能の追加はない。

### User Flow

1. 開発者 / AI エージェントが component を追加・変更するとき、context/component-design.md (改訂版) で置き場・命名・公開面を判断する
2. Storybook カタログで既存 component とバリエーションを探し、重複実装を避ける
3. 規約違反 (内部直接 import 等) は depcruise / knip の quality gate で検出される

### Reuse Policy

- 第一原則は feature / colocation とする (現行規約を継承)
- 共通化は複数 feature / app をまたぐ再利用が明確になってから行う
- app や feature 内で閉じる UI / utility / asset はローカルに置く

### Performance

- globals.css 分割・cva 集約は CSS payload / JS 出荷量を増やさないこと (decision_priority 1 / ADR-0007 の lean entry 方針を維持)

### Routing / URL State

- 変更なし (sections はページ対応で再編するが routing 自体は 3 route IA (ADR-0006) を継承)

### Content / Assets

- ハードコード基準 (D7): 文言・リストは content collections または `content/<feature>.ts` へ、繰り返し値は定数化、スタイル値はトークン参照のみ

### UI Reuse

- shared primitive は `packages/ui` (ADR-0010 Base UI)、section / 固有 component は app 内 colocation (現行規約を継承)

### Testing

- 規約の機械検査 (depcruise ルール案 D10) を設計に含める。テスト実施・play テストは #33 / 実施 issue 側

## Interface 設計

### UI / API / Event Interface

- section の公開 interface = `index.ts` 再輸出面 (D9 / D10 で設計)。API / Event の追加はない

### Props / Request / Response

- 対象外 (個別 component の props 変更は実施 issue 側)

## Content / Data 設計

### 保存・管理するデータ

- 対象外 (永続データなし。文言・定数の置き場基準のみ D7 で設計)

### コンテンツ配置 / package / route

- ハードコード基準 (D7) と content 層の選び分け (現行規約) の統合を設計する

## Performance / Security 設計

### Performance

- globals.css 分割後も出力 CSS が増えないこと (@layer / import 構成は build 結果で検証。検証手順は実装分割で定義)
- cva 導入が island / JS 出荷量を増やさないこと (表示専用 component は静的描画のまま)

### Security / Privacy

- 対象外 (文書設計 issue のため。secret / 認証情報の扱いに変更なし)

## Error / Fallback 設計

### エラーケース

| #   | ケース                                                            | ユーザーへの見せ方         | リカバリ                                          |
| --- | ----------------------------------------------------------------- | -------------------------- | ------------------------------------------------- |
| 1   | sections 分割基準がどの軸でも一長一短で決めきれない               | 未決事項として比較表を残す | products のみ先行して構成規約を適用し他は現状維持 |
| 2   | スタイル分離方針が Storybook カタログ構成と相互依存で確定できない | 依存関係を未決事項に明記   | カタログ構成を先に確定しスタイル分離を追従させる  |

### Fallback

- 移行が import 経路を壊すリスクは、実施 issue への段階的移動 + depcruise 検証の引き継ぎで吸収する (受け入れ基準 IF 節)

## テスト / 評価方針

### テスト観点

- 規約が `pnpm knip && pnpm depcruise` で機械検査可能か (業務ルール 4)
- 分割後の globals.css で `pnpm build` / Storybook build が通るか (実施 issue 側で検証)

### 計測指標

- 対象外 (文書設計 issue。ガードレール件数は Design Doc の既存定義を継承)

## フロー / シーケンス

(diagram phase で生成。sections 再編の移行先マップ / globals.css entry 構成図を予定)

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

| Phase | 対象 | 概要 | 依存 |
| ----- | ---- | ---- | ---- |
| P1    |      |      |      |

### prompts 生成方針

- track phase 以降で確定する。文書反映 (context / feature doc / ADR) と実施 issue 起票の分割を想定

## 上位資料からの変更点

本 spec で PRD / Design Doc / feature doc / context / 既存 ADR から変更・追加した内容を、反映先別に記録する。track / sync phase で更新する。

### PRD への影響

| 対象節 | 変更内容 | 理由 |
| ------ | -------- | ---- |
|        |          |      |

### Design Doc への影響

| 対象節 | 変更内容 | 理由 |
| ------ | -------- | ---- |
|        |          |      |

### feature doc への影響

| 対象 doc / 節 | 変更内容 | 理由 |
| ------------- | -------- | ---- |
|               |          |      |

### context への影響

| 対象 doc / 節 | 変更内容 | 理由 |
| ------------- | -------- | ---- |
|               |          |      |

### ADR の新規 / 更新

| ADR ID | 変更内容 | 理由 |
| ------ | -------- | ---- |
|        |          |      |

## レビュー

`spec-review` (fresh-context evaluator) の最新結果。完全な記録は `review.md` を参照。

| 日付 | 結果 (PASS / NEEDS_WORK) | 指摘要点 | 対応 |
| ---- | ------------------------ | -------- | ---- |
|      |                          |          |      |

## 変更履歴

| 日付       | 変更者         | 変更内容                                                   |
| ---------- | -------------- | ---------------------------------------------------------- |
| 2026-07-25 | spec-lifecycle | scaffold で index.md 初版生成。設計論点 D1〜D11 を初期抽出 |

## 備考

- appendix (api / database / authorization / screen-spec / testid) は本 issue のスコープ (設計方針の文書化) に該当がないため取り込まない
