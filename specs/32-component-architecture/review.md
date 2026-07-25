# Review Log — spec #32

## Review 2026-07-25 (clarify gate / scaffold + clarify 累積)

Verdict: NEEDS_WORK

### 観点別評価

- 上位文書整合: **NEEDS_WORK** — テーブル自体は充実 (index.md 上位文書整合、ADR-0007/0008/0010 の継承根拠、変更提案の sync ハンドオフ明記)。ただし指摘 1 の ADR-0007 / component-design.md との未記録の矛盾 (`@source`) が 1 件。
- 未解決論点: **PASS** — 未確定事項「なし」、論点テーブル決定欄は全行埋まり、各行が「解決済みの論点」へ対応。下流 (diagram) の先走りなし。
- 実装対象明示: **PASS** — 実装対象テーブルは `context/project.yml` の domains と 6 件完全一致。検証コマンドも commands.check と一致。
- template 必須節: **PASS** — 必須 22 節すべて存在。メタ同期も clarify 完了と整合 (指摘 2 の軽微 stale あり)。
- EARS acceptance: **PASS** — WHEN 3 件 + IF/THEN 2 件、観測可能。requirements.md と一致。
- prompts 自己完結性: **N/A** — prompts/ 未生成 (レビュー範囲どおり)。
- 正本境界: **N/A** — sync 未実行段階として適切。準備 (source コメント付き反映先テーブル、正本境界宣言) は良好。

### 指摘

1. **D6 の `@source` が ADR-0007 / component-design.md の「app-local `@source` は置かない」と矛盾し、未記録** (index.md D6)。現行実装 `globals.css:7-8` に `@source` 2 行が存在 (実装 drift) し、D6 はこれを entry 構成に取り込む形だが、実装突合ゲートにも「context への影響」にも記録がない。受け入れ基準 (IF ADR 矛盾 THEN supersede 案提示まで確定しない) に照らし、①突合ゲートへの追記 (どちらを正とするか)、②「context への影響」への改訂行追加、のいずれかが必要。clarify へ 1 件差し戻し (D6 補記) を推奨。
2. **「ADR 起票要否: 判断中 (D8 で確定)」が stale** (index.md 上位文書整合)。D11 で「新規 ADR 1 本、sync で起票」と確定済み。「要 (D11 で確定、sync phase で起票)」へ更新し、D8 → D11 の記述も訂正。

### 対応 (2026-07-25)

- 指摘 1: ユーザー決定 (案 B) — `@source` は `@kufu/ui/theme.css` へ移動し app entry は import のみへ。突合ゲート 4 件目として記録、context への影響 (component-design.md スタイリング節) と ADR-0007 更新行を追記。動作検証は実施 issue へ引き継ぐ。
- 指摘 2: 「ADR 起票要否: 要 (D11 で確定、sync phase で起票 + ADR-0007 更新)」へ修正。ADR-0007 の整合方針も継承 → 変更提案 (更新追記) へ訂正。
- 再レビュー: 下記 Review 参照。
