# Review Log — specs/17-corporate-site-ia

## Review 2026-06-12

Verdict: NEEDS_WORK
Reviewer: spec-review (fresh-context, subagent=Plan)

### 観点別評価

- 上位文書整合: NEEDS_WORK — feature doc / ADR-0006 / PRD は整合。ただし (1) `design/DesignDoc.md:154` Open Questions が「主要 5 ページ + 共通レイアウト」のまま D1 (3 route / ADR-0006) と矛盾、(2) `context/design-workflow.md` §4 の `.pen` 分割規約 (`<screen>.pen` + `<feature>.lib.pen`) に対し実成果は単一 `index.pen` で逸脱。パイロット知見の back-propagation が未実施
- 未解決論点: NEEDS_WORK — D1〜D8 は解決済みだが、「上位資料からの変更点」の PRD / Design Doc 行が「(未確定 — IA 決定後に判断)」のままで「未確定事項: 残作業なし」と内部矛盾
- 実装対象明示: PASS — 正規 target と一致、責務境界明確、越境なし
- template 必須節: PASS (軽微) — 必須節すべて存在。「フロー / シーケンス」の Mermaid 2 つが空プレースホルダのまま
- EARS acceptance: PASS — 3 件とも観測可能、成果物で充足確認済み
- prompts 自己完結性: N/A — prompts/ なし (実装プロンプトは #10 主対象と明記済み)
- 正本境界: PASS (軽微) — Screen Spec はスナップショット明示 + 正本リンクでハンドオフ成立。spec 冒頭/備考の「正本は feature doc と spec #11」が二重正本気味で、feature doc 単独正本へ文言統一を推奨

### 指摘

1. `design/DesignDoc.md:154` — Open Questions の「主要 5 ページ + 共通レイアウト」が 3 route IA と矛盾。spec の「Design Doc 更新要否: 不要」(index.md:38) / 「Design Doc への影響」(index.md:303) を改め、spec-sync で更新すること
2. `specs/17-corporate-site-ia/index.md:298,303` — PRD / Design Doc への影響が「(未確定)」のまま。確定させること
3. `context/design-workflow.md` §4 — 単一 `index.pen` 運用は分割規約から逸脱。例外を認めて §4 を更新するか、#10 前に分割するかを決定し back-propagate すること
4. `specs/17-corporate-site-ia/index.md:261-269` — 空の Mermaid プレースホルダ。「該当なし (feature doc 参照)」と明示するか生成すること (軽微)
5. `specs/17-corporate-site-ia/index.md:4,354` — 「正本は feature doc と spec #11」を feature doc 単独正本の表現に揃えること (軽微)

> 指摘 1〜3 が解消されれば PASS 可能な水準。spec 中核 (D1〜D8 の決定・根拠・ハンドオフ) は高品質で、ADR-0006 / feature doc / `.pen` 成果物との突合はすべて一致。

## Review 2026-06-12 (2 回目 / 再評価)

Verdict: PASS
Reviewer: spec-review (fresh-context, subagent=Plan)

### 前回指摘の解消確認

1. Design Doc Open Questions — 解消済 (3 route + #17 / ADR-0006 リンクへ更新)
2. 変更点テーブル未確定行 — 解消済 (PRD: 影響なし確定 / Design Doc: 反映済)
3. design-workflow §4 乖離 — 解消済 (単一 `.pen` 既定へ更新、パイロット知見を明記)
4. 空 Mermaid プレースホルダ — 解消済 (feature doc の図への正本参照で明示)
5. 正本表現の二重化 — 解消済 (feature doc 単独正本へ統一)

### 観点別評価

- 上位文書整合: PASS — PRD / Design Doc / feature doc / context / ADR-0006 すべて矛盾なし。実ファイル突合で spec の記録通りに更新済みを確認
- 未解決論点: PASS — 論点テーブル空、D1〜D8 すべて決定・根拠・決定日あり。内部矛盾解消
- 実装対象明示: PASS / template 必須節: PASS / EARS acceptance: PASS / prompts 自己完結性: N/A / 正本境界: PASS

### 非ブロッキングの観察 (対応任意)

- コンポーネント仕様表の「6 種 (V15)」参照は V17 で 8 種に増えた現状と差分 → spec 側で 8 種へ更新済み (本レビュー後対応)
- ADR-0006 の「6 種」は決定日時点の記録として維持 (遡及不要)
