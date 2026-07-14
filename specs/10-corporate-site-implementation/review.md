## Review 2026-06-23 08:43

Verdict: NEEDS_WORK
Reviewer: multi-agent-review (external CLI: codex, cursor; skipped: claude auth 401)

### 実行状況

| agent  | status | retries | output                                                        |
| ------ | ------ | ------- | ------------------------------------------------------------- |
| claude | auth   | 0       | skipped: 401 Invalid authentication credentials               |
| codex  | ok     | 0       | `.ai-out/agent-runs/20260623-084045-spec10-review/codex.out`  |
| cursor | ok     | 0       | `.ai-out/agent-runs/20260623-084045-spec10-review/cursor.out` |

補足: 権限変更前に内部 subagent 1 件も完了しており、外部 CLI 結果とは別枠の参考指摘として扱う。

### 観点別評価

- 上位文書整合: PASS / NEEDS_WORK mixed
  - codex / cursor は `specs/10-corporate-site-implementation/index.md:40-55` の上位文書整合テーブルと ADR-0006〜0009 継承方針を根拠に PASS。
  - 内部 subagent は `/contact` のフォーム island / API を #26 に委譲する境界が、feature doc と ADR-0009 の「P6 = 連絡先 + 問い合わせフォーム」表現とズレて見えるとして NEEDS_WORK。
- 未解決論点: PASS
  - D1〜D8 は決定済みで、未解決事項なし。
- 実装対象明示: PASS
  - `corporate-site` / `ui` / `e2e` の target は `context/project.md` の対象ドメイン内で、責務境界も読める。
- template 必須節: NEEDS_WORK
  - `hooks/spec/validate_document.sh` が要求する `### React Compiler` 節が `## 機能仕様` 配下にない。
- EARS acceptance: PASS / NEEDS_WORK mixed
  - route 表示・導線・静的描画などは観測可能。
  - cursor は `THE SYSTEM SHALL content 正本と表示先の対応を追跡可能にし` が検証方法と結びついていないとして NEEDS_WORK。
- prompts 自己完結性: N/A
  - prompts 未生成。
- 正本境界: N/A
  - `反映済` 行がなく、spec-sync 済みではない。

### 統合指摘

- [high x2] `specs/10-corporate-site-implementation/index.md:184-246` — `## 機能仕様` に `### React Compiler` 必須サブ節が欠落している。
  - 根拠: `hooks/spec/validate_document.sh:97-109` が Kufu Monorepo 固有論点として `### React Compiler` を要求。現状は `### Testing` の後に `## Interface 設計` が続く。
  - 提案: `### React Compiler` を追加し、#10 は Astro 静的サイトで React Compiler 非対象、#26 のフォーム island 実装時は React Compiler 方針を #26 が引き継ぐ旨を明記する。

### 単一エージェントのみ (未合意)

- [medium x1, by cursor] `specs/10-corporate-site-implementation/index.md:414` — P5 の依存に `#26` が含まれ、D4 の「#10 はフォーム差し込み境界まで」と矛盾して見える。
  - 提案: P5 の依存を `P1 / P2 / #14` に修正し、#26 は後続連携または optional 依存として分離する。
- [medium x1, by cursor] `specs/10-corporate-site-implementation/index.md:25-29` — 設計フェーズ 6〜9 が「未着手」だが、対応する設計節はすでに記述済み。
  - 提案: 6〜9 を「完了」または「進行中」に更新するか、該当節をドラフト扱いにする。
- [medium x1, by cursor] `specs/10-corporate-site-implementation/index.md:517-528` — Screen Spec のコンポーネントツリーが全 route に全 section を同居させており、表示条件表と矛盾して見える。
  - 提案: route 別ツリーに分割するか、各 branch に表示条件を注記する。
- [low x1, by cursor] `specs/10-corporate-site-implementation/index.md:135` — EARS「追跡可能にし」が観測不能。
  - 提案: 実装データに reference パスを明記し、代表コンテンツ表示や PR review で確認する、など検証可能な形に書き換える。
- [low x1, by cursor] `specs/10-corporate-site-implementation/index.md:351` — `content data` と reference markdown の同期確認が Unit test として実施されるのか、PR review なのか曖昧。
  - 提案: schema validation unit test に限定するか、manual / PR checklist 観点へ移す。
- [high x1, by internal subagent] `specs/10-corporate-site-implementation/index.md:55` — #10 がフォーム island / API を #26 へ委譲する一方、feature doc / ADR-0009 は P6 を問い合わせフォーム込みで記述しているため、上位文書側で #10 と #26 の実装フェーズ境界を明示した方がよい可能性がある。
  - 提案: `spec-sync` で反映要否を再確認するか、spec 側で #10 は placeholder / contact-info phase、#26 は form/API phase と明示する。

### エージェント間の相違

- 上位文書整合: 外部 CLI 2 件は PASS、内部 subagent はフォーム実装境界を high 指摘。外部 CLI の primary result では合意なしだが、#26 委譲境界は次回修正時に再確認する。
- EARS acceptance: codex は PASS、cursor は一部 NEEDS_WORK。観測不能表現は low 指摘として採用する。

### 次アクション

1. `### React Compiler` 節を追加する。
2. P5 の `#26` 依存、設計フェーズ状況、Screen Spec ツリー、EARS / test 表現を修正する。
3. フォーム境界について `spec-sync` 相当で feature doc / ADR への反映要否を再確認する。
4. 修正後に `hooks/spec/validate_document.sh specs/10-corporate-site-implementation/index.md` と再 review を実行する。

### 対応状況 2026-06-23

- `### React Compiler` 節を追加し、#10 は React Compiler 非対象、#26 がフォーム island の互換性確認を担うことを明記した。
- P5 の依存から `#26` を外し、#10 は #14 の contract を参照してフォーム差し込み境界を用意するだけにした。
- 設計フェーズ 6〜10 を完了に更新し、レビュー phase は NEEDS_WORK 対応後の再 review 待ちにした。
- Screen Spec のコンポーネントツリーを route 別に分け、全 route に全 section が載るように読める表現を解消した。
- EARS の content 追跡条件を、参照元 reference path の明記、代表コンテンツ表示確認、PR review で観測できる形に修正した。
- Unit test 観点は schema validation に限定し、reference markdown との手動転記差分確認は Review 観点へ移した。
- フォーム境界は上位文書を書き換えず、上位文書整合テーブルで「P6 の完成形は feature doc、#10 は連絡先表示と #26 用フォーム境界まで」と明記した。
- hook 入力形式で `printf '%s' '{"file_path":"specs/10-corporate-site-implementation/index.md"}' | bash hooks/spec/validate_document.sh` を実行し、品質ゲート通過を確認した。

## Review 2026-06-23 08:51

Verdict: PASS
Reviewer: spec-review (fresh-context, subagent=explorer)

### 観点別評価

- 上位文書整合: PASS — `specs/10-corporate-site-implementation/index.md:40-55` で Design Doc Why / What / Design Doc landscape / feature doc / context / ADR-0006〜0009 との継承方針を明示。Design Doc Why / What の Phase 1 route / E2E / island 方針と矛盾なし。
- 未解決論点: PASS — D1〜D8 はすべて決定済み (`specs/10-corporate-site-implementation/index.md:141-150`) で、未確定事項もなし (`specs/10-corporate-site-implementation/index.md:165-169`)。
- 実装対象明示: PASS — target は `corporate-site`, `cms`, `ui`, `config`, `e2e`, `core` (`context/project.md:60-63`) と一致し、責務境界も明示 (`specs/10-corporate-site-implementation/index.md:171-183`)。
- template 必須節: PASS — 必須節は存在確認済み。例: メタ情報〜備考 (`specs/10-corporate-site-implementation/index.md:5-508`)、Interface / Content / Data / Performance / Security / Error / Test / Flow / 実装分割 / 上位資料変更点も存在 (`specs/10-corporate-site-implementation/index.md:253-480`)。
- EARS acceptance: PASS — WHEN / IF / THE SYSTEM SHALL 形式の受け入れ基準があり、route 表示、問い合わせ導線、form slot、参照元明記など観測可能 (`specs/10-corporate-site-implementation/index.md:128-135`)。
- prompts 自己完結性: N/A — `prompts/` は未生成で、対象 spec は prompts 生成方針のみを持つ段階 (`specs/10-corporate-site-implementation/index.md:426-438`)。
- 正本境界: PASS — spec は上位正本を継承する作業正本と明記 (`specs/10-corporate-site-implementation/index.md:1-3`)。`## 上位資料からの変更点` は「影響なし / spec 内補足のみ」で、durable 成果の新規ハンドオフ対象を作っていない (`specs/10-corporate-site-implementation/index.md:440-480`)。

### 指摘

- なし
