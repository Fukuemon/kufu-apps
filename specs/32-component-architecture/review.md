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

## Review 2026-07-25 (clarify gate 再レビュー)

Verdict: PASS

- 上位文書整合: PASS — 前回指摘①②とも対応済を確認 (突合④の決着 + context / ADR 影響表への記録、ADR 起票要否の更新)。features → sections 改名等の変更提案は sync ハンドオフとして管理。
- 未解決論点: PASS — D1〜D11 全決定、未確定事項なし、突合ゲート 4 件全決着。
- 実装対象明示: PASS — domains と一致、検証コマンドも commands.check と一致。
- template 必須節: PASS — 必須 22 節すべて存在。メタ情報同期も充足。
- EARS acceptance: PASS — WHEN×3 / IF×2、観測可能。requirements と一致。
- prompts 自己完結性 / 正本境界: N/A (prompts 未生成 / sync 未実行段階)。

参考指摘 (non-blocking): D6 の「4 ファイル + 移行受け皿」の数え方が一読で曖昧 (entry 含め実質 5 ファイル)。sync で component-design.md へ反映する際に表記を確定する。

## Review 2026-07-25 (track gate / diagram + track 累積)

Verdict: PASS

- 全観点 PASS (prompts / 正本境界は N/A)。図 3 点は実装・決定内容 (D1〜D11 / 突合①〜④) と突合済みで矛盾なし。変更点テーブルに反映漏れ・二重追記なし。
- 非 blocking 参考指摘:
  1. 未確定事項の「突合ゲート 3 件」が stale (4 件) → **修正済**
  2. Flowchart で common 配置の component が cva 判定 / story 追加へ流れない → sync 反映時に図の経路を補完
  3. 突合③ (fonts `?url`) が ADR-0007「更新」節に未記録 → sync で ADR-0007 更新に含めるか検討

## Review 2026-07-26 (再決定 + スコープ拡大)

Verdict: NEEDS_WORK → 対応済み (再レビュー待ち)

D8 (route 層 → フラット) / D10 (depcruise → 独自スクリプト) の再決定、D12 追加、スコープ拡大 (実装込み) の一貫性を検証。

### 指摘と対応

1. `context/design-workflow.md:88` の Phase C が旧構成 (`components/features/`) のまま → **修正**。`components/sections/<section>/` へ改訂し、context への影響テーブルにも行を追加
2. spec 内に depcruise 前提 / 「設計のみ」/「実施 issue へ引き継ぐ」の stale 記述が残存 (機能仕様・User Flow・Testing・Fallback) → **修正**
3. **(blocking)** D12 の `content/source-references.ts` を「被参照ゼロ」としたのは事実誤認。実際は `content/` の 5 ファイル + `content-data.test.ts` が import している → **D12 の削除対象から除外**。調査時に `components/` と `pages/` のみを走査し content 層内の相互参照を見落としていた旨も spec に記録
4. `component-map.md` が未実施の削除を完了形で記述 → **「削除予定」へ修正**。D12 の durable 記録先を「spec で閉じる」から ADR-0011 (削除判断と復帰条件を追記) へ変更
5. メタ情報の同期漏れ (context 2 本の最終更新日、変更点テーブルの「全行 2026-07-25 反映済」、ADR-0011 の状態) → **修正**。ADR-0011 は実装まで本 issue で行う決定に合わせて「承認」へ
6. 突合⑦ / P6 の対象ファイル名が `.dependency-cruiser.js` (実体は `.cjs`) → **修正**
7. `apps/corporate-site/README.md` の構成記述が P2 の追従対象に未記載 → **P2 に追加**

### 参考 (検証済み・問題なし)

- component-map.md の section → component 対応は実 import と一致 (レビュアーが実装ファイルで検証)
- section 間 import は現状ゼロで、D10 の依存方向規約は現行実装と両立する

## Review 2026-07-26 (2 回目 / 指摘対応後)

Verdict: NEEDS_WORK → 対応済み (再レビュー待ち)

blocking だった指摘 3 (source-references.ts) は論点テーブル / 解決済み / 実装分割 / 図の 4 箇所すべてで訂正済みと確認され、同種の事実誤認も他に検出されなかった。残った指摘への対応:

- **A. `common/` の配置が spec 決定 (移動なし = フラット) と context 正本 (`common/<Component>/`) で矛盾** → D13 として決定を記録し、**フラットを正**として context / component-map を追従 (実装は `packages/ui` も含めフラットで統一されているため移動は発生しない)
- **B. 実装対象テーブルの責務欄が「(設計のみ)」のまま** → スコープ拡大に追従して修正
- **C-1. `context/design-workflow.md` の最終更新日が未同期** → 2026-07-26 へ更新
- **C-2. spec 内に残る「実施 issue へ引き継ぐ」系 stale 3 箇所** (突合④の動作検証 / props 変更 / Security 節) → 修正
- **C-3. 未確定事項の内訳の件数 stale** → D1〜D12 + 突合 7 件へ修正
