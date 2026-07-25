# Review Log — specs/31-docs-restructure

## Review 2026-07-25 (gate: clarify 完了時。intake / scaffold / clarify の累積)

Verdict: NEEDS_WORK

### 観点別評価

- 上位文書整合: **NEEDS_WORK** — D5 (Pencil 削除・`.pen` 正本廃止) と矛盾する feature doc の記述 (`design/features/corporate-site/DesignDoc_corporate-site.md:59, 70, 89, 217-220` の「デザイン正本 = index.pen」) が、`## 上位文書整合` テーブルと `### feature doc への影響` テーブルの両方から漏れている。Design Doc / context / ADR は記録済みなのに feature doc 行のみ欠落。
- 未解決論点: PASS — 未決ゼロ、D1〜D6 全件に決定日・決定者付き。requirements.md と同期済。
- 実装対象明示: PASS — project.yml の domains と完全一致、`core` のみ ◯。
- template 必須節: PASS — 必須 22 セクションすべて存在。メタ情報同期も良好。
- EARS acceptance: PASS — WHEN 4 件 + IF 1 件、観測可能な記述。requirements.md と一致。
- prompts 自己完結性: N/A (prompts 未生成)
- 正本境界: N/A (sync 前のため spec が作業正本でよい段階)

### 指摘

1. `index.md` ## 上位文書整合 — feature doc 行を追加すること: 「変更提案 (D5 に伴う `.pen` 正本参照の改訂)」
2. `index.md` ### feature doc への影響 — D5 起因の影響行を記録すること (反映実施は sync / 別 issue でよい)
3. (軽微) `index.md` Content / Data 設計の「clarify (D3 / D6) の決定後に記載」placeholder が全件解決後も残存。文言是正を推奨。

対応提案: clarify 補正として 2 テーブルへ feature doc 行を追記後、sync phase で正本ハンドオフを実施する。

## Review 2026-07-25 (再判定)

Verdict: PASS

### 前回指摘の対応確認

1. 上位文書整合テーブルに feature doc 行 (変更提案) 追加を確認 (`index.md:51`)
2. feature doc への影響テーブルに D5 起因の行 (理由・source: clarify 付き) 追加を確認 (`index.md:283-285`)
3. placeholder 是正を確認 (`index.md:199`)

### 観点別評価 (要約)

- 上位文書整合: PASS (D5 と矛盾する feature doc の `.pen` 正本記述が変更提案として捕捉された)
- 未解決論点: PASS (未決ゼロ、D1〜D6 全件決定日・決定者付き)
- 実装対象明示: PASS / template 必須節: PASS / EARS acceptance: PASS
- prompts 自己完結性: N/A (未生成) / 正本境界: N/A (sync 前)

## Review 2026-07-25 (track gate 累積: diagram + track)

Verdict: PASS

### 検証結果 (要約)

- Mermaid 4 図の構文妥当、D6 (L1 = 利用者視点 / L2 = 実在の実行単位のみ) と一致
- 清算 flowchart は D1/D3 の順序と EARS (WHEN 残存ゼロ / IF 削除禁止) に対応
- 変更点テーブルの反映漏れなし (D1〜D6 → PRD / Design Doc / feature doc / context / ADR に捕捉済み)
- 全観点 PASS (prompts / 正本境界は N/A)

### 軽微指摘と対応

1. 「EARS 4 件」表記の不統一 → 5 件 (WHEN 4 + IF 1) に統一済み (typo 相当の自動修正)
2. 清算フロー図で「手順文書化」が注記のみ → prompts 生成時に清算手順文書化を先行タスクとして明示する (持ち越し)
