# Design System Foundation (デザイントークン定義と正本確立)

> Kufu Platform 全体のデザインシステム基盤を定義する spec。デザイントークン (配色 / タイポ / spacing / radius / shadow / breakpoint) の定義、トークン命名体系の再設計、`.pen` 確定パレットの `globals.css` 昇格 (spec #17 論点 D5 引き継ぎ)、colocation ↔ `packages/ui` 昇格境界の明文化、トーン & マナー指針の文書化を扱う。

## メタ情報

- Issue: `#13`
- ステータス: `Draft`
- 作成日: 2026-06-12
- 更新日: 2026-06-12
- Branch: `feature/13`
- Owner: Fukuemon

## 設計フェーズ状況

状態は `未着手 / 進行中 / 完了 / レビュー済 / 保留` のいずれか。保留の場合は理由を備考に残す。

| #   | フェーズ                    | 状態   | 最終更新   | 備考                                                      |
| --- | --------------------------- | ------ | ---------- | --------------------------------------------------------- |
| 1   | 起票                        | 完了   | 2026-06-01 | issue #13 (2026-06-11 に #17 D5 引き継ぎコメント追加)     |
| 2   | 下書き                      | 進行中 | 2026-06-12 | spec-draft で scaffold                                    |
| 3   | 上位文書突合                | 完了   | 2026-06-12 | PRD / Design Doc / feature doc / context / ADR と突合済み |
| 4   | 論点整理                    | 完了   | 2026-06-12 | D1〜D7 を seed                                            |
| 5   | 論点解決                    | 完了   | 2026-06-12 | D1〜D7 全件解決。暫定割当 / radius は `.pen` 実測で確定   |
| 6   | Interface / Routing 設計    | 完了   | 2026-06-12 | D5 決定 (3 entry 配信) を Interface 設計に反映済み        |
| 7   | Content / Data 設計         | 完了   | 2026-06-12 | D1 / D2 決定 (2 層構造 + 27 変数マッピング表) を反映済み  |
| 8   | Performance / Security 設計 | 完了   | 2026-06-12 | D3 決定 (フォント読み込み戦略) を反映済み                 |
| 9   | Test / Metrics 設計         | 完了   | 2026-06-12 | テスト観点 / 計測指標を定義済み (検査の仕組み化は実装側)  |
| 10  | 実装分割                    | 未着手 |            |                                                           |
| 11  | レビュー済                  | 未着手 |            |                                                           |

## 上位文書整合

正本 ([PRD](../../PRD.md) / [Design Doc](../../design/DesignDoc.md) / [feature doc](../../design/features/) / [context](../../context/) / ADR) のどの節と、どう整合させたかを記録する。

- PRD 更新要否: 不要
- Design Doc 更新要否: 不要 (モジュール責務の枠内で詳細化)
- ADR 起票要否: 要 (ADR-0007 デザイントークン体系を新規起票 — D7 決定)

| 上位文書    | 節 / 該当箇所                                                                                                       | 整合方針 (継承 / 補足 / 変更提案)                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| PRD         | プロダクト原則「共通化は利用実績に基づく」/ Phase 1 スコープ (`packages/ui` skeleton)                               | 継承 (トークン定義は skeleton の範囲。過剰な汎用 UI 整備はしない)             |
| Design Doc  | モジュール責務 → `packages/ui` / Non Goals (過剰抽象化の禁止)                                                       | 補足 (skeleton に design token / font / shared stylesheet の正本責務を具体化) |
| feature doc | [corporate-site](../../design/features/corporate-site/DesignDoc_corporate-site.md) → 新節「デザイントークン対応表」 | 変更提案 (spec #17 から引き継ぎ: `.pen` 変数 ↔ CSS 変数の 1:1 対応表を追加)   |
| context     | [design-workflow.md](../../context/design-workflow.md) §1 一方向原則 / §4 トークン正本 path / §6 トークンガード     | 継承 (現状の fork 状態の回復が本 spec の目的。一方向原則そのものは変えない)   |
| context     | [architecture.md](../../context/architecture.md) Package Boundary (colocation → 昇格ルール)                         | 変更提案 (デザインシステム観点の昇格境界を具体化して追記。issue 完了条件)     |
| ADR-0004    | [design-production-workflow](../../adr/0004-design-production-workflow.md)                                          | 継承 (design-first フロー / `packages/ui` 正本の決定に従う)                   |
| ADR-0006    | [corporate-site-three-route-ia](../../adr/0006-corporate-site-three-route-ia.md)                                    | 継承 (3 route IA / `index.pen` デザイン正本を前提とする)                      |

> 矛盾を検出した場合は `spec-sync` で PRD / Design Doc / feature doc / context / ADR への back-propagation を提案する。
> 本 spec の「変更提案」2 件 (feature doc 対応表 / architecture.md 昇格境界) は issue #13 の成果物そのものであり、論点解決後に `spec-sync` の正本ハンドオフで反映する。draft 段階で design 側は書き換えない。

## 関連資料

- `PRD.md`: プロダクト原則 / Phase 1 スコープ / コーポレートサイト要求
- `design/DesignDoc.md`: モジュール責務 (`packages/ui`) / Non Goals
- 関連 issue / ticket:
  - [#13](https://github.com/Fukuemon/kufu-apps/issues/13) (本 issue) — Refs #3 / #11 / #6、Blocks #10
  - [#17](https://github.com/Fukuemon/kufu-apps/issues/17) → [spec #17](../17-corporate-site-ia/index.md) 解決済み論点 D5・デザイン方針 V14 (引き継ぎ元)
  - [#10](https://github.com/Fukuemon/kufu-apps/issues/10) (corporate-site 本体実装。本 spec が前提) / [#6](https://github.com/Fukuemon/kufu-apps/issues/6) (Storybook 整備)
- トークン正本 (現行): `packages/ui/src/styles/globals.css`
- デザイン正本 (現行): `design/features/corporate-site/index.pen` (Pencil variables 27 変数)
- 運用契約: [context/design-workflow.md](../../context/design-workflow.md) (§1 一方向原則 / §6 トークンガード)

## 背景

- なぜこの spec が必要か
  - `design/features/corporate-site/index.pen` が実質のトークン源泉になっており、トークン正本であるべき `packages/ui/src/styles/globals.css` と値が不一致 (アクセント `#006B6B` vs `#0f766e`、背景の寒色 `#F7F8FA` vs 暖色 `#fffdf8`、Noto Sans JP / Noto Serif JP / Geist Mono 未登録)。design-workflow §1 の一方向原則 (`packages/ui` → Pencil) と §6 トークンガードに違反した二重正本状態を回復する必要がある。
  - 現行 Pencil variables のトークン名 (`paper` / `ink` / `card-overlay` / `photo-tone` 等) は比喩的で意図が読み取りにくく、`globals.css` 側も `--kufu-color-*` 独自系と shadcn semantic 系 (`--primary` 等) が未整理に併存している。命名体系を再設計し、`.pen` ↔ CSS の対応を一意にする。
  - #10 (corporate-site 本体実装) と #6 (Storybook) の前提として、トークン・配色・タイポを先に確定しないと実装が場当たり的になり、Decision Priority「一貫性」を担保できない。
- Phase 1 のどの完成条件に関わるか
  - 「`packages/ui` の skeleton が将来拡張の入口として配置され、Phase 2 の実装対象と区別されている」(PRD Phase 1 完成条件) — skeleton に design token 正本の責務を確立する。
- コーポレートサイト / 業務アプリ / 共通 package のどれに影響するか
  - 直接の実装対象は `packages/ui` (トークン正本)。consumer として `apps/corporate-site` (#10 で consume)、将来の `apps/cms` にも影響する。

## スコープ

### やること

- デザイントークンの定義: 配色 (brand / semantic) / タイポグラフィ / spacing / radius / shadow / breakpoint を整理する
- トークン命名体系の再設計: `.pen` 変数名と CSS 変数名の両方を対象に、層構造 (primitive / semantic) と命名規則を定義する
- `.pen` 確定パレット (27 変数: カラー 18 + フォント 3 + スペーシング 6) の `globals.css` への昇格 (spec #17 D5 の決定方針 a)
- `.pen` 変数 ↔ CSS 変数の 1:1 対応表を feature doc の新節として設計する
- design foundation の参照方針の文書化: `@kufu/ui` の `globals.css` を正本とし、各 app (Astro / React) からどう参照するかを定める
- colocation ↔ `packages/ui` 昇格境界をデザインシステム観点で具体化する (context/architecture.md への追記案)
- トーン & マナー / ブランド表現指針の文書化 (#10 / #6 の前提)
- Pencil variables の rename / 再取り込み手順の確定 (昇格後に `globals.css` → Pencil の一方向 consume を回復する)

### やらないこと

- corporate-site 本体のページ実装 (#10 のスコープ)
- Storybook の整備 (#6 のスコープ)
- `packages/ui` への shadcn/ui コンポーネント本格追加 (複数 consumer が出た時点で判断。PRD「汎用 UI ライブラリの過剰な整備」スコープアウト)
- ダークモード (`.dark` テーマ) の本格対応 (現サイトはダーク面 section を持つがテーマ切替はない。トークン設計上の扱いのみ決める)
- IA / ページ構成の変更 (#17 で確定済み。ADR-0006)

## 要件の解釈

### 実現したいユーザー価値

- 開発者 / AI エージェントが、UI 実装時に参照すべきトークンと置き場所を迷わず判断できる
- デザイン (`.pen`) と実装 (`globals.css` consume) の間で色・フォント・余白の drift が起きない
- トークン名から用途 (どの面に・何のために使う色か) が読み取れる

### 成功条件

- issue #13 完了条件の充足:
  - デザイントークン (配色 / タイポ / spacing 等) が定義され、正本の置き場所が決まっている
  - design foundation を各 app からどう参照するかの方針が文書化されている
  - colocation と `packages/ui` 昇格の境界がデザインシステム観点で明文化されている
  - トーン & マナー / ブランド指針が文書化されている
  - 成果が feature doc / context など正本へ反映 (もしくは反映方針が明確) になっている
- 追加 (本 spec で具体化):
  - `.pen` 変数 ↔ `globals.css` CSS 変数が 1:1 対応し、`.pen` 独自トークン (fork) が解消されている
  - 命名体系が文書化され、新トークン追加時の命名を機械的に決定できる

### 対象ユーザー / 操作主体

- 開発者 / AI エージェント (トークンを consume して UI を実装する)
- デザイン工程の操作者 (Pencil で `globals.css` 由来の variables を使ってデザインする)

EARS 風で振る舞いを記述する (`<who>` `<trigger>` 時、システムは `<expected behavior>` する)。

- WHEN 開発者が UI 実装で色 / フォント / 余白を指定する時、システム (デザインシステム) は `@kufu/ui` のセマンティックトークンのみで指定を完結させる (raw hex / arbitrary value を不要にする)
- WHEN デザイン工程で新しいトークンが必要になった時、システム (運用契約) は先に `packages/ui` (`globals.css`) へレビュー経由で昇格してから Pencil に取り込む手順を提供する
- IF `.pen` に `globals.css` に存在しない独自トークンが検出された場合、システム (トークンガード §6) は差し戻しの判断基準を提供する
- THE SYSTEM SHALL トークンの正本を `packages/ui/src/styles/globals.css` の単一ファイルに限定する

## 設計時の論点

設計 / 実装フェーズへ持ち越す残課題を 1 件ずつ管理する。確定したものは「解決済みの論点」へ移す。

| #   | 論点 | 決定候補 | 決定 |
| --- | ---- | -------- | ---- |

## 解決済みの論点

(`spec-resolve` で確定したものをここに移動する)

- (引き継ぎ済みの前提決定) `.pen` 確定パレットと `globals.css` の整合方向は「a) `.pen` の確定パレットを `globals.css` へ昇格し、1:1 対応表を feature doc に作る」— spec #17 D5 で決定 (2026-06-11)。本 spec はこの方向性を前提に詳細 (D2) を設計する。
- **D1 トークン命名体系 (2026-06-12 決定): a) 2 層構造を採用**
  - **primitive 層**: 色相 + 明度スケールの命名 (`--kufu-<hue>-<scale>`、例: `--kufu-teal-600` = 旧 `accent` `#006B6B`、`--kufu-gray-50` = 旧 `paper` `#F7F8FA`)。`.pen` の比喩名 (`paper` / `ink` / `photo-tone` 等) は廃止する
  - **semantic 層**: shadcn の語彙 (`--background` / `--foreground` / `--primary` / `--card` / `--muted` / `--border` 等) を役割名として採用し、primitive を参照する。将来の cms app (React + shadcn) が同一トークンをそのまま consume できる (design-workflow §5 の「token → primitive → 独自コンポ」積み上げと一致)
  - **ダーク面 section**: `.dark` テーマでなく **inverse スコープ** (semantic 変数を上書きするラッパー class) で表現する。旧 `ink-inverse` 系 6 変数は独立パレットでなく同一 primitive の参照 + スコープ上書きに集約する (具体のスコープ設計・変数割当は D2)
  - shadcn 語彙に無い用途 (旧 `photo-tone` / `card-overlay` 等) は semantic 層に役割ベースの追加名を新設する (命名は D2 のマッピングで確定)
  - Pencil variables は確定した semantic 名へ rename し、`globals.css` → Pencil の一方向 consume (1:1 対応) を回復する
- **D2 昇格マッピング (2026-06-12 決定): a) shadcn semantic を kufu パレットで上書き**
  - 既存 shadcn semantic 変数 (`--background` / `--foreground` / `--primary` 等) の値を kufu primitive への参照に置換し、トークンセットを 1 系統に収束させる
  - 旧 `--kufu-color-*` / `--kufu-font-*` 系 (値が `.pen` と不一致の死にトークン) は削除する (`--kufu-radius-*` の扱いは D4)
  - ダーク面は `.dark` テーマでなく **inverse スコープ** (ラッパー class、名称案 `.surface-inverse`) で semantic 変数を上書きする
  - shadcn デフォルトの `.dark` ブロックは corporate-site では使用しないため未調整のまま温存し、cms (React app) 導入時に kufu パレットで再設計する
  - 具体の 1:1 マッピング案 (決定時スナップショット) は「Content / Data 設計」の対応表を参照。正本反映は `spec-sync` で feature doc 新節へハンドオフする
  - 統合提案: 旧 `ink-panel` `#26323A` と旧 `line-inverse` `#2A3642` は視覚的にほぼ同値かつ両方ボーダー用途のため、primitive `--kufu-gray-800` に一本化する (`.pen` 側も rename 時に統合)
- **D3 タイポグラフィ (2026-06-12 決定): a) 登録方式の方針まで #13 で確定 + type scale は Tailwind 標準**
  - フォント family トークンは semantic 1 層 (`--font-sans` / `--font-serif` / `--font-mono`) とし、システムフォールバックスタックを含めて定義する
  - 登録は `@fontsource-variable/*` (可変フォント) を採用し、日本語サブセット (unicode-range 分割) + `font-display: swap` を方針として文書化する。preload 対象 / 実測チューニングは #10 に委譲する
  - type scale は独自トークンを作らず **Tailwind 標準スケール** (`text-sm`〜`text-6xl`) を既定とする。見出し階層との対応はトーン & マナー指針 (D7) にガイドとして記載し、トークン化はしない (`.pen` にも type scale 変数は存在せず、最小定義の原則に合致)
- **D4 spacing / radius / shadow / breakpoint (2026-06-12 決定): b) 実績ベースの最小定義**
  - **spacing**: 独自トークンを新設しない。4px グリッド + 推奨リズム 6 段 (12/16/24/32/48/80 = Tailwind `3/4/6/8/12/20`) をガイドとして文書化する。`.pen` の `space-*` 変数は Tailwind 標準スケールに写像できるため 1:1 トークンは不要 (Pencil 側は variables として維持してよいが、CSS 側に対応トークンは作らない)
  - **radius**: shadcn の `--radius` (基準値 + 派生スケール) に一本化し、`--kufu-radius-sm/md/lg` は削除する。基準値は `.pen` 実測で確定済み: 全要素で cornerRadius 未使用 (直角デザイン) のため `--radius: 0rem` を基準値とする (角丸が必要になったら #10 以降で再評価)
  - **shadow / breakpoint**: Tailwind 標準を既定とし、独自トークンは作らない。コンテナ幅 1440px / 横 padding 56 は feature doc 確定済み (#17 D6) のレイアウト規約であり、トークン化しない。実需が出たら #10 以降で昇格する
- **D5 参照経路 (2026-06-12 決定): b) トークン部分を分離した 3 entry 構成**
  - `@kufu/ui/tokens.css` (新設): primitive + semantic CSS 変数のみ。フレームワーク非依存
  - `@kufu/ui/fonts.css` (新設): fontsource import による font-face 登録 (D3 の登録方針を実装する場所)
  - `@kufu/ui/styles.css` (既存維持): tokens.css + fonts.css + Tailwind theme (`@theme inline`) + shadcn / tw-animate-css 層を含む全量。React app (将来の cms) 用
  - Astro (corporate-site) は `tokens.css` + `fonts.css` のみ import し、React app 向けの層を配信に含めない (Decision Priority 1: パフォーマンス)
  - corporate-site の Tailwind 統合可否・`@theme` 連携の実装詳細は #10 で扱う (その際も変数正本は `tokens.css`)
- **D6 昇格境界 (2026-06-12 決定): b) デザインシステム資産の昇格判断テーブルを新設**
  - `context/architecture.md` Package Boundary 節に、資産種別 × 正本 × 昇格条件の最小テーブル (4 行) を追記する (`spec-sync` で反映)。決定時スナップショット:

  | 資産種別                     | 正本                              | 昇格条件                                      |
  | ---------------------------- | --------------------------------- | --------------------------------------------- |
  | デザイントークン             | 常に `packages/ui` (`tokens.css`) | 昇格不要 (最初から正本。app 配下で定義しない) |
  | フォント / shared stylesheet | 常に `packages/ui`                | 同上                                          |
  | UI コンポーネント            | app 内 colocation                 | 複数 app / feature で再利用が明確になった時   |
  | utility                      | app 内 colocation                 | 必要性が明確な場合のみ package 化             |
  - 従来の colocation 第一原則 (architecture.md) は変えず、デザインシステム資産 (トークン / フォント / stylesheet) を例外として明示する位置づけ

- **D7 ブランド指針の置き場と ADR (2026-06-12 決定): a) feature doc + ADR 起票**
  - トーン & マナー / ブランド表現指針は `DesignDoc_corporate-site.md` に新節として文書化する (現時点の consumer は corporate-site のみ。PRD「共通化は利用実績に基づく」に従い、cms 等の consumer が増えた時点で platform 級の置き場へ昇格する)
  - トークン命名体系・正本構造の決定 (D1 2 層構造 / D2 shadcn 上書き + inverse スコープ / D5 3 entry 配信) は `adr/0007-design-token-architecture.md` として新規起票する (`spec-sync` で実施)
  - 指針には D3 で決めた見出し階層と type scale の対応ガイド (serif = 見出し / sans = 本文 等) を含める

## 未確定事項

(決定できない項目を理由とともに残す。1 件でも残っていれば下流 phase は止める)

- なし (D1〜D7 全件解決済み。D2 の暫定割当と D4 の radius 基準値は 2026-06-12 の `.pen` 実測で確定)

## 実装対象

正規 target は `corporate-site / cms / ui / config / e2e / future-api`。

| モジュール       | 実装有無 | 主な責務                                                                                    |
| ---------------- | :------: | ------------------------------------------------------------------------------------------- |
| `corporate-site` |    -     | consumer (トークン consume は #10 で実装。本 spec では参照方針の文書化のみ)                 |
| `cms`            |    -     | 将来 consumer (Phase 2)                                                                     |
| `ui`             |    ◯     | トークン正本 `globals.css` の再設計 (命名 / 昇格 / 層構造)、フォント登録、stylesheet export |
| `config`         |    -     |                                                                                             |
| `e2e`            |    -     |                                                                                             |
| `future-api`     |    -     |                                                                                             |

このほか design 正本側の成果物として、`design/features/corporate-site/index.pen` の Pencil variables rename (D1 決定後) と feature doc / context への文書反映 (`spec-sync`) がある。

## 機能仕様

### User Flow

1. 開発者 / AI が UI を実装する際、`@kufu/ui` の `globals.css` セマンティックトークンを参照して色 / フォント / 余白を指定する
2. デザイン工程 (Pencil) では `Create Pencil variables from globals.css` で正本トークンを取り込み、`.pen` 内で variables としてデザインする
3. 新トークンが必要になったら、先に `globals.css` へレビュー経由で昇格し、その後 Pencil へ再取り込みする

### Reuse Policy

- 第一原則は feature / colocation とする — ただし**デザイントークン / フォント / shared stylesheet は例外で、常に `packages/ui` を正本**とする (app 配下でトークンを定義しない)
- コンポーネントの共通化は複数 feature / app をまたぐ再利用が明確になってから行う (従来ルール継承。境界の具体化は D6)
- app や feature 内で閉じる UI / utility / asset はローカルに置く

### Performance

- フォント (Noto Sans JP / Noto Serif JP / Geist Mono) は `@fontsource-variable/*` の可変フォント + 日本語サブセット (unicode-range 分割) + `font-display: swap` で読み込む (D3)。preload 対象と実測は #10
- トークン CSS は静的 stylesheet として配信し、client JS を増やさない

### Routing / URL State

- 該当なし (本 spec は routing を扱わない)

### Content / Assets

- トークン定義の正本は `packages/ui/src/styles/globals.css` (design-workflow §4 で確定済み)
- `.pen` 変数 ↔ CSS 変数の対応表は feature doc 新節に置く (変更提案)

### UI Reuse

- `@kufu/ui` がトークン / フォント / shared stylesheet の正本。corporate-site / cms は consume のみ

### React Compiler

- 該当なし (本 spec はコンポーネント実装を含まない)

### Testing

- トークンガード (§6) の検査方法: 実装コードの raw hex / arbitrary value 検出をどう仕組み化するか (lint / レビュー観点) を Test / Metrics 設計で扱う
- `.pen` fork 検査 (`globals.css` に無い変数の検出) の運用手順

## Interface 設計

### UI / API / Event Interface

- stylesheet export (D5 決定):

  | export 経路           | 内容                                                         | consumer                                         |
  | --------------------- | ------------------------------------------------------------ | ------------------------------------------------ |
  | `@kufu/ui/tokens.css` | primitive + semantic CSS 変数のみ (新設)                     | 全 app (Astro / React)                           |
  | `@kufu/ui/fonts.css`  | fontsource import (font-face 登録、新設)                     | 全 app                                           |
  | `@kufu/ui/styles.css` | tokens + fonts + Tailwind theme + shadcn 層の全量 (既存維持) | React app (将来の cms)。内部で上記 2 つを import |

- corporate-site は自前の `src/styles/globals.css` から `tokens.css` + `fonts.css` を import する (現行の `styles.css` 全量 import から移行。なお現行 corporate-site が参照する `--kufu-font-body` は削除対象のため、移行時に `--font-sans` へ置換する)

### Props / Request / Response

- 該当なし

## Content / Data 設計

### 保存・管理するデータ

- トークンは **2 層構造** (D1 決定) で `globals.css` に定義する:
  - primitive 層: `--kufu-<hue>-<scale>` (色相 + 明度スケール)。値 (hex / oklch) を持つ唯一の層
  - semantic 層: shadcn 語彙の役割名 (`--background` / `--foreground` / `--primary` 等) + 不足分の追加役割名。primitive への参照のみ持つ
  - ダーク面 section: inverse スコープ (ラッパー class) による semantic 変数の上書き
- `.pen` 27 変数 → 新トークンのマッピング案 (D2 決定時スナップショット。正本は `spec-sync` で feature doc 新節へ反映):

  **カラー (ライト面既定)**

  | `.pen` 変数 (旧) | 値          | primitive (新)               | semantic (新)               | 備考                                                                 |
  | ---------------- | ----------- | ---------------------------- | --------------------------- | -------------------------------------------------------------------- |
  | `paper`          | `#F7F8FA`   | `--kufu-gray-50`             | `--background`              | ページ背景                                                           |
  | `paper-soft`     | `#ECEFF3`   | `--kufu-gray-100`            | `--muted` / `--secondary`   | 控えめ背景・帯 section                                               |
  | `paper-line`     | `#CBD2DA`   | `--kufu-gray-300`            | `--border` / `--input`      | 罫線・フォーム枠                                                     |
  | `card`           | `#FFFFFF`   | `--kufu-white`               | `--card` / `--popover`      | カード面                                                             |
  | `card-overlay`   | `#FFFFFFE6` | `--kufu-white` + alpha 90%   | `--card-overlay` (追加)     | 写真上のカード。alpha は semantic 層で `color-mix()` 生成            |
  | `ink`            | `#1F2933`   | `--kufu-gray-900`            | `--foreground`              | 本文                                                                 |
  | `ink-soft`       | `#5B6472`   | `--kufu-gray-600`            | `--muted-foreground`        | 補足テキスト                                                         |
  | `ink-ghost`      | `#1F29330D` | `--kufu-gray-900` + alpha 5% | `--ghost-foreground` (追加) | 装飾ウォーターマーク文字 (ジグザグ section の大型数字) — `.pen` 実測 |

  **カラー (アクセント)**

  | `.pen` 変数 (旧) | 値          | primitive (新)                | semantic (新)                    | 備考                                                                             |
  | ---------------- | ----------- | ----------------------------- | -------------------------------- | -------------------------------------------------------------------------------- |
  | `accent`         | `#006B6B`   | `--kufu-teal-600`             | `--primary` / `--ring`           | ブランドアクセント・CTA                                                          |
  | `accent-deep`    | `#0A3D4A`   | `--kufu-teal-900`             | (semantic なし — primitive のみ) | canvas 直接使用なし (`.pen` 実測)。`--photo-overlay` の基底 primitive として保持 |
  | `accent-soft`    | `#7CC6B6`   | `--kufu-teal-300`             | `--primary-soft` (追加)          | ダーク面上のアクセント文字 (フッター理念 / eyebrow) — `.pen` 実測                |
  | `photo-tone`     | `#0A3D4A1F` | `--kufu-teal-900` + alpha 12% | `--photo-overlay` (追加)         | 写真の色被せ。alpha は semantic 層で生成                                         |

  **カラー (ダーク面 → inverse スコープで semantic を上書き)**

  | `.pen` 変数 (旧)    | 値        | primitive (新)             | inverse スコープでの役割 | 備考                                               |
  | ------------------- | --------- | -------------------------- | ------------------------ | -------------------------------------------------- |
  | `ink-deep`          | `#111827` | `--kufu-gray-950`          | `--background`           | ダーク面背景                                       |
  | `ink-inverse`       | `#FFFFFF` | `--kufu-white`             | `--foreground`           | ダーク面本文                                       |
  | `ink-inverse-soft`  | `#D7DEE6` | `--kufu-gray-200`          | `--secondary-foreground` | ダーク面の準主要テキスト                           |
  | `ink-inverse-muted` | `#7C8694` | `--kufu-gray-500`          | `--muted-foreground`     | ダーク面の補足テキスト                             |
  | `ink-panel`         | `#26323A` | `--kufu-gray-800`          | `--border`               | `line-inverse` と統合 (両方ボーダー用途・ほぼ同値) |
  | `line-inverse`      | `#2A3642` | (`--kufu-gray-800` に統合) | `--border`               | 統合により変数廃止                                 |

  **フォント / スペーシング**

  | `.pen` 変数 (旧)                         | 値                                        | 新トークン                                     | 備考                                                                                                 |
  | ---------------------------------------- | ----------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
  | `font-sans` / `font-serif` / `font-mono` | Noto Sans JP / Noto Serif JP / Geist Mono | `--font-sans` / `--font-serif` / `--font-mono` | 1 層 (semantic のみ)。fontsource-variable + 日本語サブセット + swap、システムフォールバック付き (D3) |
  | `space-12/16/24/32/48/80`                | 12〜80px                                  | (CSS トークン新設なし — D4)                    | Tailwind 標準スケール (`3/4/6/8/12/20`) に写像。4px グリッド + 推奨リズムをガイドとして文書化 (D4)   |

### コンテンツ配置 / package / route

- トークン正本: `packages/ui/src/styles/globals.css`
- 対応表: `design/features/corporate-site/DesignDoc_corporate-site.md` 新節 (spec-sync で反映)
- 命名体系 / 正本構造の決定: `adr/0007-design-token-architecture.md` (新規起票 — D7)
- トーン & マナー / ブランド指針: feature doc (`DesignDoc_corporate-site.md`) 新節 (D7。cms 等 consumer が増えた時点で platform 級へ昇格)

## Performance / Security 設計

### Performance

- フォント読み込み戦略 (D3 決定):
  - `@fontsource-variable/noto-sans-jp` / `@fontsource-variable/noto-serif-jp` / `@fontsource-variable/geist-mono` を `packages/ui` の依存として登録し、`globals.css` から import する
  - 日本語サブセット: fontsource の unicode-range 分割サブセットをそのまま利用し、全 glyph の一括読み込みを避ける
  - `font-display: swap` を採用し、フォント読み込み中もテキストを表示する (FOUT 許容)
  - preload 対象の選定・Lighthouse での実測・性能予算の数値判定は #10 (本体実装) で行う

### Security / Privacy

- 該当なし (秘密情報・個人情報を扱わない)

## Error / Fallback 設計

### エラーケース

| #   | ケース                                            | ユーザーへの見せ方                                                       | リカバリ                                             |
| --- | ------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------- |
| 1   | フォント読み込み失敗 / 遅延                       | フォールバックフォントで表示 (`font-display: swap`、FOUT 許容 — D3 決定) | `font-family` スタックにシステムフォールバックを定義 |
| 2   | 実装コードに raw hex / 独自値が混入               | (開発時) トークンガード検査で検出                                        | 正本トークンへ寄せる修正                             |
| 3   | `.pen` に `globals.css` に無い変数が再発生 (fork) | (デザインレビュー時) §6 検査で検出                                       | 先に `globals.css` へ昇格 → Pencil 再取り込み        |

### Fallback

- フォント: システムフォントスタックへのフォールバックを各フォントトークンに定義する

## テスト / 評価方針

### テスト観点

- `pnpm build` / `pnpm lint` / `pnpm typecheck` が `packages/ui` 変更後も通ること
- `.pen` 変数と `globals.css` の対応表に欠落・不一致がないこと (レビュー観点)
- 実装コード (既存分含む) に raw hex / arbitrary value が残っていないこと

### 計測指標

- `.pen` ↔ `globals.css` の値不一致件数 = 0 (昇格完了の定義)
- トークンガード違反 (raw hex 直書き) 検出件数 = 0

## フロー / シーケンス

(`spec-diagrams` で生成。spec の主要操作を Mermaid 図に落とす)

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

| Phase | 対象 | 概要                                                                                               | 依存 |
| ----- | ---- | -------------------------------------------------------------------------------------------------- | ---- |
| P1    |      | (論点解決後に確定。想定: globals.css 再設計 → Pencil variables rename / 再取り込み → 文書反映の順) |      |

### prompts 生成方針

- `ui` (globals.css / フォント / export) と design 正本側 (`.pen` variables rename、feature doc / context 文書化) で分ける想定
- 文書化タスク (`spec-sync` 対象) と実装タスク (`packages/ui`) は並列可能性あり。論点解決後に確定する

## 上位資料からの変更点

本 spec で PRD / Design Doc / feature doc / context / 既存 ADR から変更・追加した内容を、反映先別に記録する。`spec-track` / `spec-sync` で更新する。

### PRD への影響

| 対象節 | 変更内容 | 理由 |
| ------ | -------- | ---- |
| (なし) |          |      |

### Design Doc への影響

| 対象節                       | 変更内容 | 理由 |
| ---------------------------- | -------- | ---- |
| (なし。モジュール責務の枠内) |          |      |

### feature doc への影響

| 対象 doc / 節                                                        | 変更内容                                                                                                          | 理由                                                                     |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `DesignDoc_corporate-site.md` 新節「デザイントークン対応表」         | 変更提案: `.pen` 変数 ↔ `globals.css` CSS 変数の 1:1 対応表を追加 (spec #17 からの引き継ぎ。D1 / D2 解決後に確定) | 実装 (Astro) が参照するトークン正本を一意にし、§6 ガード違反の再発を防ぐ |
| `DesignDoc_corporate-site.md` 新節「トーン & マナー / ブランド指針」 | 変更提案: ブランド表現指針 + 見出し階層 / type scale 対応ガイドを新節として文書化 (D7 決定。source: spec-resolve) | issue #13 完了条件。#10 / #6 の前提を揃える                              |

### context への影響

| 対象 doc / 節                      | 変更内容                                                                                                                        | 理由                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `architecture.md` Package Boundary | 変更提案: colocation ↔ `packages/ui` 昇格境界をデザインシステム観点 (トークン / フォント / stylesheet は常に正本) で具体化 (D6) | issue #13 完了条件               |
| `design-workflow.md` §6 (必要なら) | 補足候補: トークンガードの検査手順を具体化 (検査方法が決まった場合)                                                             | 一方向原則の運用を仕組みで支える |

### ADR の新規 / 更新

| ADR ID          | 変更内容                                                                                                                                                                                                                                                                 | 理由                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| ADR-0007 (新規) | `0007-design-token-architecture.md` を起票: 2 層構造 (primitive `--kufu-<hue>-<scale>` + semantic shadcn 語彙) / shadcn semantic の kufu パレット上書き / ダーク面 inverse スコープ / 3 entry 配信 (tokens.css / fonts.css / styles.css) (D7 決定。source: spec-resolve) | 長期参照される技術選定のため。#10 / #6 / 将来の cms が従う決定 |

## レビュー

`spec-review` (fresh-context evaluator) の最新結果。完全な記録は `review.md` を参照。

| 日付 | 結果 (PASS / NEEDS_WORK) | 指摘要点 | 対応 |
| ---- | ------------------------ | -------- | ---- |
|      |                          |          |      |

## 変更履歴

| 日付       | 変更者 | 変更内容                                                                                                                                                                                        |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-12 | Claude | `spec-draft` で scaffold。issue #13 + spec #17 D5 引き継ぎ + ユーザー要望 (命名再設計) を反映                                                                                                   |
| 2026-06-12 | Claude | `spec-resolve`: D1 (トークン命名体系) を「a) 2 層構造 (primitive + semantic/shadcn 語彙、ダーク面は inverse スコープ)」で解決。Pencil 現物 27 変数を確認済み                                    |
| 2026-06-12 | Claude | `spec-resolve`: D2 (昇格マッピング) を「a) shadcn semantic を kufu パレットで上書き」で解決。27 変数の 1:1 マッピング案を Content / Data 設計に記録。`ink-panel` / `line-inverse` の統合を提案  |
| 2026-06-12 | Claude | `spec-resolve`: D3 (タイポグラフィ) を「a) 登録方式の方針まで確定 (fontsource-variable + 日本語サブセット + swap) + type scale は Tailwind 標準」で解決                                         |
| 2026-06-12 | Claude | `spec-resolve`: D4 (spacing / radius / shadow / breakpoint) を「b) 実績ベースの最小定義 (spacing はガイド文書化のみ、radius は `--radius` 一本化、shadow / breakpoint は Tailwind 標準)」で解決 |
| 2026-06-12 | Claude | `spec-resolve`: D5 (参照経路) を「b) トークン分離 (tokens.css / fonts.css / styles.css の 3 entry)」で解決。Interface 設計に export 表を記録                                                    |
| 2026-06-12 | Claude | `spec-resolve`: D6 (昇格境界) を「b) 資産種別の昇格判断テーブル新設 (architecture.md へ spec-sync で反映)」で解決                                                                               |
| 2026-06-12 | Claude | `spec-resolve`: D7 (ブランド指針の置き場と ADR) を「a) feature doc 新節 + ADR-0007 起票」で解決。全論点クローズ                                                                                 |
| 2026-06-12 | Claude | `.pen` 実測で暫定 3 件を確定: `ink-ghost` → `--ghost-foreground` (ウォーターマーク) / `accent-deep` は semantic なし (canvas 未使用) / radius 基準値 `0rem` (全面直角)。未確定事項を全クローズ  |

## 備考

- `.pen` 確定トークン 27 変数 (2026-06-12 時点、[issue #13 コメント](https://github.com/Fukuemon/kufu-apps/issues/13#issuecomment-4685264843)より):
  - カラー (ライト面): `paper #F7F8FA` / `paper-soft #ECEFF3` / `paper-line #CBD2DA` / `card #FFFFFF` / `card-overlay #FFFFFFE6` / `ink #1F2933` / `ink-soft #5B6472` / `ink-ghost #1F29330D`
  - カラー (アクセント): `accent #006B6B` / `accent-deep #0A3D4A` / `accent-soft #7CC6B6` / `photo-tone #0A3D4A1F`
  - カラー (ダーク面): `ink-deep #111827` / `ink-panel #26323A` (ボーダー用途のみ) / `ink-inverse #FFFFFF` / `ink-inverse-soft #D7DEE6` / `ink-inverse-muted #7C8694` / `line-inverse #2A3642`
  - フォント: `font-sans "Noto Sans JP"` / `font-serif "Noto Serif JP"` / `font-mono "Geist Mono"`
  - スペーシング: `space-12 / 16 / 24 / 32 / 48 / 80`
- `globals.css` 現行の `--kufu-*` トークン (surface / foreground / border / accent / radius 3 段 / font 2 種) は値・命名とも `.pen` と不一致。D1 / D2 で再設計対象とする
- `.pen` 実測メモ (2026-06-12、Pencil MCP で canvas 調査): cornerRadius は全要素未使用 (直角の工業的デザイン言語) / `accent-deep` は変数定義のみで canvas 直接使用なし / `ink-ghost` はジグザグ section 背景の大型ウォーターマーク数字 / `accent-soft` はダーク面 (`ink-deep` 背景) 上のアクセント文字 / `card-overlay` は写真上のキャプションパネル / `photo-tone` は写真への multiply オーバーレイ
- appendix は判定の結果、取り込みなし (API / DB / 認可 / 画面ツリー / testid のいずれにも該当しない)

<!--
追加 appendix が必要な spec は、templates/specs/appendices/ から該当 topic を取り込むこと:

- API endpoint / request / response → appendices/api.md
- ER 図 / DDL / シードデータ → appendices/database.md
- ロール別 UI 制御 / API 認可マトリクス → appendices/authorization.md
- 画面コンポーネントツリー / 表示条件 → appendices/screen-spec.md
- data-testid 一覧 → appendices/testid.md
-->
