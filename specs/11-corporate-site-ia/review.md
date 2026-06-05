# Review Log — specs/11-corporate-site-ia

## Review 2026-06-03 09:12

Verdict: NEEDS_WORK
Reviewer: spec-review (fresh-context, subagent=Plan)

### 観点別評価

- 上位文書整合: PASS — `## 上位ドキュメント確認` の整合テーブルは PRD (Phase 1 / コーポレートサイト要求)、Design Doc (モジュール責務 / Open Questions「具体的なページ構成」)、feature doc、context (colocation→`packages/ui` 昇格 / E2E 主要導線 / Cloudflare CDN)、ADR-0003 (Phase 1 は corporate-site のみ) のいずれとも矛盾なし。back-propagation も相互反映済。新規 ADR 不要の判断も妥当。
- 未解決論点: PASS — Q1〜Q5 は決定付きで「解決済みの論点」へ移動済。D1〜D3 は決定欄あり (残課題管理)。`## 未確定事項` は「なし」。下流 (図) は確定済構成のみに基づく。
- 実装対象明示: PASS — target は正規一覧と一致。責務境界が読め、app/package 間の直接依存なし。
- template 必須節: NEEDS_WORK — `## レビュー` 欠落、`## 上位資料からの変更点` の節名逸脱 + 反映先別分割なし、`### 設計時の論点` がトップレベル `## 論点一覧` に置換。
- EARS acceptance: PASS — WHEN / WHERE / THE SYSTEM SHALL / IF 形式が 8 件、いずれも観測可能。曖昧動詞のみの acceptance なし。
- prompts 自己完結性: N/A — `prompts/` は未生成。

### 指摘 (NEEDS_WORK)

- `specs/11-corporate-site-ia/index.md` (セクション構成) — template 必須節 `## レビュー` (spec-review 結果テーブル) が存在しない。追加が必要。
- `specs/11-corporate-site-ia/index.md:383` — `## 既存資料からの変更点` は template の必須節 `## 上位資料からの変更点` と節名が異なり、PRD / Design Doc / feature doc / context / ADR の反映先別サブテーブル分割もない。
- `specs/11-corporate-site-ia/index.md:120` — `## 論点一覧` がトップレベルに置かれており、template の `### 設計時の論点` (`## 要件の解釈` 配下) と所在が一致しない (内容自体は存在)。
- `specs/11-corporate-site-ia/index.md:243` / `:288` — 配置マッピング見出しと V1 テスト観点が `企業情報.md` を参照。spec 自身 (line 3 / 225 / 251-252) が正本は committed の `company-profile.md` / `manufacturers.md` で `.ai-out/` は正本にしないと宣言しており内部不整合。`company-profile.md` / `manufacturers.md` へ修正すべき。
- `specs/11-corporate-site-ia/index.md:404` — `## 備考` が本文調達元候補として `.ai-out/企業情報/パンフレット/1-6.jpg` を #10 に提示しているが、`.ai-out/*` は gitignore 対象 (未追跡)。spec が「正本にしない」としたスクラッチを下流調達元に指しており source-of-truth 方針と矛盾。

### 対応 2026-06-03

- **指摘 1 (`## レビュー` 欠落)**: 対応済 — `## レビュー` 節を追加 (本テーブル)。
- **指摘 2 (`## 上位資料からの変更点` 改名・反映先別分割)** / **指摘 3 (`## 設計時の論点` への改名)**: **解消済 (2026-06-03 テンプレ統一)**。当初は `templates/specs/template.md` (contract / rubric の正本) と `specs/TEMPLATE.md` (validation hook の参照先) が乖離しており保留としていたが、`templates/specs/template.md` を単一 canonical に統一し (rich 節を fold)、hook・specs/README をそちらへ寄せ、`specs/TEMPLATE.md` を削除した。本 spec も canonical 規約 (`## 上位文書整合` / `## 設計時の論点` / `## 上位資料からの変更点` 反映先別分割) へ移行済。#3 も同様に移行。
- **指摘 4 (`企業情報.md` 参照不整合)**: 対応済 — L243 を `company-profile.md / manufacturers.md`、L288 を `company-profile.md` に修正。
- **指摘 5 (`.ai-out/` 調達元参照)**: 対応済 — 備考を「素材は未追跡スクラッチ `.ai-out/` にあり正本ではない / 本文化時に committed reference へ取り込む」旨に書き換え。

## Review 2026-06-03 23:06

Verdict: PASS
Reviewer: spec-review (fresh-context, subagent=Plan)

### 観点別評価

- 上位文書整合: PASS — `## 上位文書整合` テーブルは埋まっており、PRD (Phase 1 / コーポレートサイト要求)、Design Doc (モジュール責務 / Open Questions「具体的なページ構成」)、feature doc、context (architecture colocation→`packages/ui` 昇格 / testing E2E / infrastructure Cloudflare CDN)、ADR-0003 と矛盾なし。Design Doc / feature doc への back-propagation も現物で反映確認済。新規 ADR 不要の判断も妥当。
- 未解決論点: PASS — Q1〜Q5 は決定付きで「解決済みの論点」へ移動済。D1〜D3 は決定欄あり (残課題管理)。`## 未確定事項` は「なし」。下流 (図 / 分割) は確定済構成のみに基づく。
- 実装対象明示: PASS — target は正規一覧と一致。corporate-site ◯ / ui △ / e2e △ の責務境界が読め、app/package 間の直接依存なし。
- template 必須節: PASS — minimal core 全必須節が存在。前回 NEEDS_WORK の指摘 1 (`## レビュー` 欠落) / 2 (節名・反映先別分割) / 3 (`## 設計時の論点` 改名) はいずれも反映済。
- EARS acceptance: PASS — WHEN / WHERE / THE SYSTEM SHALL / IF 形式が 8 件、いずれも観測可能。曖昧動詞のみの acceptance なし。
- prompts 自己完結性: N/A — `prompts/` 未生成。

### 補足 (PASS / 非ブロッキング)

- 前回指摘 4・5 (`.ai-out/` / `企業情報.md` 参照不整合) は index.md line 3 / 243 / 288 / 436 で committed reference (`company-profile.md` / `manufacturers.md`) 正本に統一済を確認。spec 内の内部不整合なし。
- (参考) `requirements.md` は旧 `.ai-out/...` を「元データ」として残すが、レビュー対象の一次情報 index.md は正本宣言が一貫しており評価に影響なし。
