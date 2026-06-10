# corporate-site IA — 多ページ構成 (5ページ) の妥当性再検討

> Kufu Monorepo の spec 本体。
> IA の durable 成果の正本は feature doc [`DesignDoc_corporate-site.md`](../../design/features/corporate-site/DesignDoc_corporate-site.md) と spec #11。本 spec は issue #17 の意思決定記録であり、確定した IA は `spec-sync` で feature doc へハンドオフする。

## メタ情報

- Issue: `#17`
- ステータス: `In Progress`
- 作成日: 2026-06-07
- 更新日: 2026-06-07
- Branch: `feature/17`
- Owner: Fukuemon

## 設計フェーズ状況

状態は `未着手 / 進行中 / 完了 / レビュー済 / 保留` のいずれか。保留の場合は理由を備考に残す。

| #   | フェーズ                    | 状態   | 最終更新   | 備考                                                 |
| --- | --------------------------- | ------ | ---------- | ---------------------------------------------------- |
| 1   | 起票                        | 完了   | 2026-06-07 | issue #17 本文で intake 済 (requirements doc は省略) |
| 2   | 下書き                      | 進行中 | 2026-06-07 | `spec-draft` scaffold                                |
| 3   | 上位文書突合                | 進行中 | 2026-06-07 | feature doc IA を再評価対象として突合                |
| 4   | 論点整理                    | 進行中 | 2026-06-07 | D1〜D4 を seed                                       |
| 5   | 論点解決                    | 未着手 |            | `spec-resolve` (design-workflow A 発散の比較で決定)  |
| 6   | Interface / Routing 設計    | 未着手 |            | IA 決定後                                            |
| 7   | Content / Data 設計         | 未着手 |            | IA 決定後                                            |
| 8   | Performance / Security 設計 | 未着手 |            |                                                      |
| 9   | Test / Metrics 設計         | 未着手 |            |                                                      |
| 10  | 実装分割                    | 未着手 |            | A0→B までの工程分割 (実装 phase C は #10)            |
| 11  | レビュー済                  | 未着手 |            | `spec-review` 待ち                                   |

## 上位文書整合

正本 ([PRD](../../PRD.md) / [Design Doc](../../design/DesignDoc.md) / [feature doc](../../design/features/) / [context](../../context/) / ADR) のどの節と、どう整合させたかを記録する。

- PRD 更新要否: 不要 (現時点)
- Design Doc 更新要否: 不要 (現時点)
- ADR 起票要否: 不要 (IA 見直し結果が大きい場合に再判断)

| 上位文書      | 節 / 該当箇所                                                                    | 整合方針 (継承 / 補足 / 変更提案)                           |
| ------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| PRD           | Phase 1 スコープ (corporate-site + `packages/ui` skeleton)                       | 継承                                                        |
| Design Doc    | feature 単位設計は `design/features/` を正本                                     | 継承                                                        |
| feature doc   | `DesignDoc_corporate-site.md` 「ページ構成 (IA)」(P1/P2/P3/P4/P6 + 共通 G)       | **再評価対象** (継承で開始、IA 決定後に補足/変更提案へ更新) |
| context       | `context/design-workflow.md` §2 フェーズ分担 (A0→A→import→B) / §6 トークンガード | 継承 (工程を consume)                                       |
| ADR (なら ID) | 該当なし                                                                         | —                                                           |

> 矛盾を検出した場合は `spec-sync` で PRD / Design Doc / feature doc / context / ADR への back-propagation を提案する。現状、feature doc IA は本 spec の「再評価対象」であり矛盾ではない (本 spec が変更提案元になりうる)。

## 関連資料

- `PRD.md`: Phase 1 = corporate-site 主対象
- `design/DesignDoc.md`: feature 単位設計の正本境界
- `design/features/corporate-site/DesignDoc_corporate-site.md`: 現行 IA 正本 (再評価対象)
- `context/design-workflow.md`: 実走するデザイン制作ワークフロー正本
- 関連 issue / ticket:
  - #16 — carve-out 元 (デザイン制作ワークフロー定義)。本 issue が A→B パイロット検証を兼ねる
  - #11 — IA / サイトマップの決定経緯
  - #10 — phase C 本体実装 (本 issue の決定 IA / `.pen` を引き継ぐ)。本 issue が Blocks
  - #13 — デザイントークン定義 (consume のみ)

## 背景

- #16 (デザイン制作ワークフロー確定) の論点 D1「パイロット対象ページ選定」を検討中に、「そもそも corporate-site を多ページ (P1〜P6 / 5ページ) にする必要があるか」という IA レベルの問いが出た。
- これは「デザインを **どう作るか**」(#16 のプロセス) ではなく「**どんな IA にするか**」の問題で #16 スコープ外。IA 正本は feature doc と #11 のため、#16 内で蒸し返すと正本の二重管理 (drift) になる。本 issue へ切り出す。
- 抽象的な机上比較ではなく、**#16 で確定した design-workflow を実走させながら IA を決める**。Claude Design の発散 (phase A) で「単一 LP / 多ページ / 統合」を実プロトとして並べ比較する。
- これにより本 issue は **#16 が求めたワークフローの A→B パイロット検証も兼ねる**。影響範囲は corporate-site (Phase 1 主対象)。

## スコープ

### やること

- 現行 IA (`DesignDoc_corporate-site.md` の「ページ構成 (IA)」: トップ / 事業内容 / 取扱製品 / 会社情報 / お問い合わせ + 共通レイアウト) の妥当性を、design-workflow の実プロトで再評価する。
- 代替案 (単一 LP / ページ統合など) と比較し、多ページ構成を維持するか見直すかを決定する。
- design-workflow の工程を実走する:
  - **A0**: `design-prompt` skill で IA 探索用 `.prompt.md` を作成・commit (`design/features/corporate-site/`)。
  - **A (発散 / GUI)**: Claude Design で方向案を 2〜3 出す (使い捨て HTML、`design/.staging/` = gitignore)。
  - **判断**: A 比較で IA を決定し本 spec の論点を解決する。
  - **import → B (収束 / GUI)**: 決めた方向を Pencil で `.pen` 正本に固めて commit (共通要素は `<feature>.lib.pen`)。
- SDD spec フローで進める。論点 / 決定経緯 / 受け入れ基準を本 spec で管理する。
- IA 決定 (durable 成果) を feature doc (正本) / #11 / 必要なら ADR へ back-propagate する (`spec-sync`)。

### やらないこと

- #16 のデザイン制作ワークフロー**定義** (確定済。本 issue はそれを**使う**側)。
- #10 corporate-site 本体実装 (phase C)。本 issue は A0→B まで。
- #13 デザイントークン定義 (既存 `globals.css` のトークンを consume するのみ。トークンガード §6 遵守)。

## 要件の解釈

### 実現したいユーザー価値

- サイト訪問者 (取引先 / 候補者) が目的の情報へ最短で到達でき、信頼性と訴求が成立する情報設計。
- 開発者にとって、design-workflow を実走して IA を実プロト比較で根拠を持って決められる (パイロット検証)。

### 成功条件

- 単一 LP / 多ページ / 統合の実プロトを並べ比較し、多ページ構成を維持/見直すかを**根拠付きで決定**できる。
- 決定が feature doc / #11 に正本反映され、#10 (実装) が引き継げる状態になる。
- A0→A→import→B の工程が回り、#16 ワークフローの A→B パイロットとして検証結果が残る。

### 対象ユーザー / 操作主体

- サイト訪問者 (取引先 / 採用候補者)。
- 制作する開発者 (design-workflow パイロット実走者)。

EARS 風で振る舞いを記述する。

- WHEN 訪問者が任意の入口に着地した時、システムは目的情報 (事業 / 製品 / 会社情報 / 問い合わせ) への導線を提供する。
- WHERE 全ページ共通レイアウトにおいて、システムはナビゲーションと問い合わせ CTA、会社概要要約 + 連絡先を提示する。
- THE SYSTEM SHALL IA 決定を feature doc 正本に反映し、`.pen` をデザイン正本として保持する。

## 設計時の論点

設計 / 実装フェーズへ持ち越す残課題を 1 件ずつ管理する。確定したものは「解決済みの論点」へ移す。

| #   | 論点                                                | 決定候補                                                            | 決定 |
| --- | --------------------------------------------------- | ------------------------------------------------------------------- | ---- |
| D1  | IA 構造をどうするか (本 issue の中心論点)           | a) 多ページ (現行 5p) 維持 / b) 単一 LP / c) ページ統合案           | 未決 |
| D2  | A 発散で実プロトを比較する評価軸                    | 回遊 UX / コンテンツ密度 / SEO / パフォーマンス / 保守性 の重み付け | 未決 |
| D3  | A0 依頼文 (`.prompt.md`) の対象範囲                 | a) 全体 IA を 1 prompt / b) 方向案 (LP/多ページ/統合) ごとに分割    | 未決 |
| D4  | 決定 IA を上位資料へ反映する範囲 (`spec-sync` 計画) | feature doc のみ / + #11 更新 / + ADR 新規                          | 未決 |

## 解決済みの論点

(`spec-resolve` で確定したものをここに移動する)

- (なし)

## 未確定事項

(決定できない項目を理由とともに残す。1 件でも残っていれば下流 phase は止める)

- D1〜D4 はいずれも design-workflow phase A (発散) の実プロト比較を経て解決する想定。比較前に確定させない。

## 実装対象

正規 target は `corporate-site / cms / ui / config / e2e / future-api`。

| モジュール       | 実装有無 | 主な責務                                                                           |
| ---------------- | :------: | ---------------------------------------------------------------------------------- |
| `corporate-site` |    ◯     | IA 再評価対象。`.prompt.md` (A0) / `.pen` (B) 制作、design-workflow パイロット実走 |
| `cms`            |    -     | 対象外                                                                             |
| `ui`             |    -     | `packages/ui` / `globals.css` のセマンティックトークンを consume するのみ          |
| `config`         |    -     | 対象外                                                                             |
| `e2e`            |    -     | 対象外 (実装 phase C / #10 で検討)                                                 |
| `future-api`     |    -     | 対象外                                                                             |

## 機能仕様

### User Flow

現行サイトマップ (再評価のベースライン。IA 決定により変動しうる):

1. 全ページ共通ヘッダー (ナビ + 問い合わせ CTA) から入場。
2. トップ (P1) → 事業内容 (P2) / 取扱製品 (P3) / 会社情報 (P4) への回遊。
3. 各ページ → CTA → お問い合わせ (P6) で接点確保。
4. 全ページ共通フッター (会社概要要約 + 連絡先) で離脱前の補助導線。

### Reuse Policy

- 第一原則は feature / colocation。共通化は複数 feature / app をまたぐ再利用が明確になってから。
- corporate-site 内で閉じる section / asset はローカルに置く。

### Performance

- Astro 静的生成を優先し、client JS / island を最小化。単一 LP 案を採る場合はスクロール深度に伴う初期ロード/画像最適化に留意。

### Routing / URL State

- IA 決定により route 構成が変わる (多ページ: `/services` `/products` 等の個別 route / 単一 LP: アンカー section)。決定後に確定。

### Content / Assets

- 実コンテンツ (company-profile / manufacturers 等) を参照。ダミーテキストを使わない。

### UI Reuse

- `@kufu/ui` のセマンティックトークンを consume。raw hex / arbitrary value 直書きは禁止 (トークンガード §6)。

### React Compiler

- (該当なし。本 issue は IA / デザイン制作までで React 実装は #10)

### Testing

- (該当なし。E2E / unit は実装 phase C / #10 で検討)

## Interface 設計

### UI / API / Event Interface

- (該当なし — IA / デザイン制作スコープ。Interface 詳細は #10)

### Props / Request / Response

- (該当なし)

## Content / Data 設計

### 保存・管理するデータ

- (該当なし — 静的コンテンツのみ。データ層は持たない)

### コンテンツ配置 / package / route

- A0 `.prompt.md` / B `.pen` + `images/`: `design/features/corporate-site/`
- A 発散 HTML (使い捨て): `design/.staging/` (gitignore)

## Performance / Security 設計

### Performance

- Astro 静的生成・最小 island を IA 選択の評価軸 (D2) に含める。

### Security / Privacy

- (該当なし — 静的サイト。問い合わせフォーム機能は #14)

## Error / Fallback 設計

### エラーケース

| #   | ケース                   | ユーザーへの見せ方 | リカバリ |
| --- | ------------------------ | ------------------ | -------- |
| 1   | (該当なし — IA スコープ) |                    |          |

### Fallback

- (該当なし)

## テスト / 評価方針

### テスト観点

- 実プロト (A) を評価軸 (D2) で比較し、IA 決定の根拠が spec に残ること。
- 決定 IA が feature doc 正本に反映され、#10 が引き継げること。

### 計測指標

- (定性評価中心。回遊 UX / コンテンツ密度 / SEO / パフォーマンスの比較メモを A 判断時に残す)

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

| Phase | 対象           | 概要                                                              | 依存         |
| ----- | -------------- | ----------------------------------------------------------------- | ------------ |
| P1    | corporate-site | A0: `design-prompt` skill で IA 探索 `.prompt.md` 作成・commit    | #13 トークン |
| P2    | corporate-site | A: Claude Design で単一 LP / 多ページ / 統合の方向案 2〜3 を発散  | P1           |
| P3    | (spec)         | 判断: A 比較で D1 を解決し本 spec の論点を更新                    | P2           |
| P4    | corporate-site | import → B: 決定方向を Pencil で `.pen` 正本化・commit            | P3           |
| P5    | (上位資料)     | `spec-sync`: 決定 IA を feature doc / #11 / (必要なら) ADR へ反映 | P3           |

### prompts 生成方針

- 本 issue は GUI 工程 (A/import/B) が中心で `spec-prompts` の実装プロンプト主対象は #10。
- spec として残すのは IA 決定の論点 / 受け入れ基準 / 工程分割。

## 上位資料からの変更点

本 spec で PRD / Design Doc / feature doc / context / 既存 ADR から変更・追加した内容を、反映先別に記録する。`spec-track` / `spec-sync` で更新する。

### PRD への影響

| 対象節                     | 変更内容 | 理由 |
| -------------------------- | -------- | ---- |
| (未確定 — IA 決定後に判断) |          |      |

### Design Doc への影響

| 対象節                     | 変更内容 | 理由 |
| -------------------------- | -------- | ---- |
| (未確定 — IA 決定後に判断) |          |      |

### feature doc への影響

| 対象 doc / 節                                     | 変更内容                                                    | 理由                             |
| ------------------------------------------------- | ----------------------------------------------------------- | -------------------------------- |
| `DesignDoc_corporate-site.md` 「ページ構成 (IA)」 | (IA 決定後に確定。多ページ維持なら追認、見直しなら IA 更新) | 本 spec が IA 再評価の正本反映元 |

### context への影響

| 対象 doc / 節                                                           | 変更内容 | 理由 |
| ----------------------------------------------------------------------- | -------- | ---- |
| (未確定 — A→B パイロットの知見があれば `design-workflow.md` へ補足検討) |          |      |

### ADR の新規 / 更新

| ADR ID                                           | 変更内容 | 理由 |
| ------------------------------------------------ | -------- | ---- |
| (未確定 — IA を大きく見直す場合に新規起票を判断) |          |      |

## レビュー

`spec-review` (fresh-context evaluator) の最新結果。完全な記録は `review.md` を参照。

| 日付 | 結果 (PASS / NEEDS_WORK) | 指摘要点 | 対応 |
| ---- | ------------------------ | -------- | ---- |
|      |                          |          |      |

## 変更履歴

| 日付       | 変更者   | 変更内容                                                                                                    |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| 2026-06-07 | Fukuemon | 初版 (spec-draft scaffold)                                                                                  |
| 2026-06-07 | Fukuemon | Screen Spec に単一 LP `.pen` デザイン方針 (V1〜V7) を追記 (B 収束)                                          |
| 2026-06-10 | Fukuemon | デザイン方針 V8〜V10 を追記 (stat カード全廃 / 18 カテゴリ索引 UI / メーカー一覧一本化)。`index.pen` へ反映 |

## 備考

- 本 spec の正本境界: IA の durable 成果は feature doc / #11 が正本。本 spec は決定経緯のスナップショット。`spec-sync` でハンドオフ後は durable 成果を二重に持たない。

## Screen Spec

spec が画面 / 主要 UI を追加・変更する場合のみ取り込む。

> 下記は**再評価のベースライン** (現行 feature doc IA)。IA 再評価 (D1) により本一覧は変動しうる。確定は `spec-resolve` 後。

### 画面一覧

| 画面 ID | 画面名       | パス / Route | 備考                                                     |
| ------- | ------------ | ------------ | -------------------------------------------------------- |
| P1      | トップ       | `/`          | hero (理念/事業要約) / 事業概要 / 取扱領域サマリ / CTA   |
| P2      | 事業内容     | `/services`  | 見積もり・販売 / 加工 (機械・樹脂・板金溶接・ゴム) / CTA |
| P3      | 取扱製品     | `/products`  | 製品カテゴリ × 代表メーカー (18 区分)                    |
| P4      | 会社情報     | `/company`   | 会社概要 / 経営理念 / 沿革 / 代表挨拶 / アクセス・地図   |
| P6      | お問い合わせ | `/contact`   | 連絡先 (TEL/FAX/メール) / 問い合わせフォーム (#14)       |
| G       | 全ページ共通 | —            | ヘッダー (ナビ + CTA) / フッター (会社概要要約 + 連絡先) |

### コンポーネントツリー

```text
<Layout (G: Header / Footer)>
├── <Header />  (ナビ + 問い合わせ CTA)
├── <Page (P1〜P6)>
│   └── <Section />  (各ページの section 群。詳細は B / #10 に委譲)
└── <Footer />  (会社概要要約 + 連絡先)
```

### 各コンポーネント仕様

| #   | コンポーネント | 概要                              | 表示条件 | 活性条件 |
| --- | -------------- | --------------------------------- | -------- | -------- |
| 1   | Header (G)     | 全ページ共通ナビ + 問い合わせ CTA | 常時     | —        |
| 2   | Footer (G)     | 会社概要要約 + 連絡先             | 常時     | —        |
| —   | (各 Page 詳細) | IA 決定後に B / #10 で確定        | —        | —        |

### 単一 LP `.pen` デザイン方針 (B 収束 / 2026-06-07)

> design-workflow phase B (収束) で `design/features/corporate-site/index.pen` (単一 LP「Fukuura Single LP」) を確定する際に合意した**ビジュアル設計判断**のスナップショット。durable 成果 (IA / デザイン言語) の feature doc への正本反映 (`spec-sync`) は別途 (D4 / phase 状況#5 以降) で行う。各判断は `globals.css` のセマンティックトークンを consume し、トークンガード (design-workflow §6) を遵守する。

- **V1 配色**: warm paper (`$paper` 系) + teal green アクセント (`$accent`) + warm ink を**維持し一貫適用**する。工業系ブルー等への変更はしない (上品で差別化が効くため。ユーザー確認済み)。
- **V2 言語 / 英字表記**: 日本向けのため**ヘッダーの英字社名サブ (`FUKUURA CO., LTD.`) は表示しない**。英字モノスペースはセクション見出し等の意匠アクセントとしてのみ使う。
- **V3 ヘッダーロゴ**: ロゴを社名 (ブランド) 横に**統合**し、単独配置のロゴは廃止する (「有限会社フクウラ」セクションにロゴを内包)。
- **V4 リスト表現**: 飾りの em-dash「—」を**全廃**する。事業品目はチップ、加工メニュー / 各種一覧は**ヘアライン区切り**で表現し、意味の不明な記号を排して視認性を上げる。
- **V5 取扱製品 (P3)**: カードグリッドを廃し、**ヘアラインのインデックス** (番号 / カテゴリ + 取扱メーカー数 / メーカー一覧) で 18 カテゴリを網羅する。カード高さ不揃いによる余白問題を構造的に解消し、網羅性と走査性を両立する。
- **V6 会社概要 (P4)**: **枠線 (ボックス) を廃止**し、ヘアライン + 余白の編集的スタイルに統一する。基本情報は塗りキー欄の表を**ヘアライン定義リスト**に変更し、経営理念 / 代表挨拶 / アクセスも囲みなしで統一する。
- **V7 一貫性**: セクション余白 (上下) / アイブロウ (mono `$accent` weight 500 ls 2.2) / 見出しサイズを統一し、フォントサイズ・レイアウトの不揃いを解消する。
- **V8 数値訴求の扱い (2026-06-10)**: 大きな数字を並べる stat カード (「18 / 約320 / 1個から」) を**全廃**する。テンプレート的な数字訴求は信頼を損なうため、事実 (18 カテゴリ / 延べ約320社) はリード文等の**文章の中でのみ**述べる。
- **V9 取扱製品カテゴリ索引 (2026-06-10)**: LP の取扱製品セクションは創作した「6領域」要約をやめ、正本 ([company-profile.md](../../design/features/corporate-site/reference/company-profile.md)) の **18 カテゴリをヘアライン区切りの 3 段組索引** (番号 mono / カテゴリ名 / メーカー数) で網羅する。取扱製品ページは見出し直下に同形式の**目次 (INDEX) パネル**を置き、長い詳細リストへのアンカーとして機能させる。
- **V10 メーカー一覧の一本化 (2026-06-10)**: 取扱製品ページの各カテゴリで「代表メーカー (強調)」と「全メーカー」を二重掲載していた構造を廃止し、**全メーカー 1 リスト** (`$ink-soft` 13px / 行間 1.9) に統一する。同一社名の重複表示を解消する。
