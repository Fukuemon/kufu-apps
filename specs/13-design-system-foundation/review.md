# Review Log: spec #13 design-system-foundation

## Review 2026-06-13 (1 回目)

Verdict: NEEDS_WORK
Reviewer: spec-review (fresh-context, subagent=Plan)

### 観点別評価

- 上位文書整合: NEEDS_WORK — 整合テーブルは全行埋まっており PRD / Design Doc / ADR-0004 / 0006 との矛盾はない。ただし D5 / D6 が「変数正本は `tokens.css`」と定める一方、design-workflow.md §4 は「トークン正本 = `globals.css`、ここでしか定義しない」を規定しており、この差分が「context への影響」に変更提案として記録されていない (整合テーブルで §4 を「継承」と宣言したまま)。spec 内部でも正本ファイルの記述が分裂している。
- 未解決論点: PASS — 設計時の論点テーブルに未決行なし、未確定事項は「なし」で根拠 (`.pen` 実測) 付き。
- 実装対象明示: PASS — target は正規 6 種と一致。実装は `ui` のみ ◯ で責務境界が明確。
- template 必須節: PASS — 必須節はすべて存在する。
- EARS acceptance: NEEDS_WORK — EARS 4 件目「THE SYSTEM SHALL トークンの正本を `globals.css` の単一ファイルに限定する」が D5 の 3 entry 構成決定と正面から矛盾。成功条件「`.pen` 独自トークン (fork) が解消され 1:1 対応」も D4 の spacing 決定 (CSS トークンを作らず `.pen` 側 `space-*` 維持) と両立しない。
- prompts 自己完結性: N/A — `prompts/` 未生成。
- 正本境界: N/A — 全件「変更提案」のまま spec-sync 未実施。スナップショット明示・ハンドオフ先指定済みでこの段階の要件は満たす。

### 指摘

1. index.md 要件の解釈 (EARS) vs D5 / D6 — トークン正本ファイルの記述が `globals.css` と `tokens.css` で分裂。一意に定義し EARS / Content・Data 設計 / User Flow を揃えること。
2. index.md 上位文書整合 / context への影響 — design-workflow §4 (正本 path)・§2 Phase B (`Create Pencil variables from globals.css`) の更新を変更提案として記録すること (§4 を「継承」のままにしない)。
3. index.md 成功条件 / EARS IF vs D4 spacing — `.pen` の `space-*` 維持と「fork 解消・1:1 対応」の矛盾。成功条件を限定修正し、design-workflow §6 ガードへの spacing 例外を変更提案として追記すること。
4. (軽微) フロー / シーケンスが template 初期状態のまま空。`spec-diagrams` の実行か、不要の明記を推奨。
5. (軽微) `packages/ui` の既存 `./tokens` (TS) export と新設 `./tokens.css` の名称近接。旧 TS export の扱いを明記すると安全。

## Review 対応 2026-06-13

- 指摘 1: トークン (CSS 変数) の定義先を `tokens.css` に一意化。EARS / User Flow / Content・Data 設計 / コンテンツ配置 / スコープを `tokens.css` 表記へ統一 (`styles.css` は内包エントリと明記)
- 指摘 2: 整合テーブルの design-workflow 行を「継承 + 変更提案」へ変更し、「context への影響」に §2/§4 (正本 path・Pencil 取り込み記述) の変更提案行を追加
- 指摘 3: 成功条件を「カラー / フォントは 1:1、spacing は Tailwind スケール写像」に限定修正。EARS IF に spacing 例外を明記し、design-workflow §6 への spacing 例外追記を変更提案に追加
- 指摘 4: フロー / シーケンス節に「spec-diagrams で次フェーズ生成」の注記を追加
- 指摘 5: 既存 TS export 3 系統 (`./tokens` / `./theme` / `./fonts`) が削除対象 `--kufu-*` 変数を参照する死に export であることを実測確認し、廃止方針を Interface 設計と実装対象に明記

## Review 2026-06-13 (2 回目)

Verdict: NEEDS_WORK
Reviewer: spec-review (fresh-context, subagent=Plan)

### 観点別評価

- 上位文書整合: NEEDS_WORK — 前回 blocking 3 件の対応は確認。ただし fontsource の import 先が「Performance / Security 設計」では `globals.css`、D5 / Interface 設計では `fonts.css` と分裂 (前回指摘 1 と同種の掃き残し 1 件)。
- 未解決論点: PASS / 実装対象明示: PASS / template 必須節: PASS / EARS acceptance: PASS (前回矛盾は解消済み)
- prompts 自己完結性: N/A / 正本境界: N/A

### 指摘

1. Performance / Security 設計 — blocking: fontsource import 先を `fonts.css` に統一すること (3 entry 分離が成立しない)。
2. (軽微) design-workflow の `globals.css` 参照は §1 / §5 にも存在。変更提案を §2/§4 限定にせず全数更新と明記すること。
3. (軽微) corporate-site が参照中の `--kufu-font-body` の削除と置換の順序制約を実装分割に明記すること。
4. (軽微) 実装タスク案の placeholder が論点全解決の現状と齟齬。

## Review 対応 2026-06-13 (2 回目)

- 指摘 1: フォント import 先を `fonts.css` に統一 (`styles.css` が内包、Astro は直接 import と明記)
- 指摘 2: 整合テーブルと「context への影響」を `globals.css` 参照箇所の全数更新 (§1 / §2 / §4 / §5) へ拡大
- 指摘 3 / 4: 実装タスク案を P1〜P3 (案) へ更新。P1 に corporate-site の `--kufu-font-body` → `--font-sans` 置換を同一変更内で行う順序制約を明記

## Review 2026-06-13 (3 回目)

Verdict: NEEDS_WORK
Reviewer: spec-review (fresh-context, subagent=Plan)

### 観点別評価

- 上位文書整合: PASS (変更提案の全数記録と ADR-0007 起票方針を確認。spec の現状記述が実コードと一致することも照合済み)
- 未解決論点: PASS / template 必須節: PASS / EARS acceptance: PASS
- 実装対象明示: NEEDS_WORK — 実装対象テーブルが corporate-site を「-」とする一方、P1 (案) は corporate-site のコード変更 (`--kufu-font-body` 置換) を含み矛盾 (2 回目対応の掃き残し)
- prompts 自己完結性: N/A / 正本境界: N/A

### 指摘

1. 実装対象 (corporate-site 行) vs 実装分割 P1 (案) — blocking: corporate-site を ◯ (責務: dangling 参照置換のみ) に更新して一致させること。
2. (軽微) prompts 生成方針「P1 と P3 は P1 完了後に並列可能」の誤記 → P2 と P3。
3. (軽微) Phase B の取り込み記述は design-workflow §3 (§2 でなく)。
4. (軽微) メタ情報の更新日が 2026-06-12 のまま。

## Review 対応 2026-06-13 (3 回目)

- 指摘 1: 実装対象の corporate-site を ◯ に更新し、責務を「dangling 参照の置換のみ (P1 と同一変更内)。本実装は #10」と明記
- 指摘 2: 「P2 と P3 は P1 完了後に並列実行可能」へ修正
- 指摘 3: §2 Phase B → §3 Phase B に訂正 (整合テーブル / context への影響の両方)
- 指摘 4: 更新日を 2026-06-13 に更新

## Review 2026-06-13 (4 回目)

Verdict: PASS
Reviewer: spec-review (fresh-context, subagent=Plan)

### 観点別評価

- 上位文書整合: PASS — 変更提案の全数記録 (design-workflow §1/§3/§4/§5 + §6 例外 / architecture.md / feature doc 新節 2 件 / ADR-0007) を確認。spec の現状記述は実コードと照合一致
- 未解決論点: PASS — D1〜D7 全件解決、未確定事項なし (根拠付き)
- 実装対象明示: PASS — ui / corporate-site の責務境界が一致 (3 回目指摘の解消を確認)
- template 必須節: PASS / EARS acceptance: PASS (tokens.css 一意化 + spacing 例外の反映を確認)
- prompts 自己完結性: N/A / 正本境界: N/A

### 補足 (non-blocking)

- 一部に残る `globals.css` 表記は「styles.css = globals.css (全量エントリ)」の等価が明示されており矛盾ではない。spec-sync 時に語彙を揃えると良い
- 3 巡の指摘がすべて本文反映済みであることを確認。下流 phase (spec-sync / spec-prompts) へ進んでよい品質
