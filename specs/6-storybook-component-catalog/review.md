## Review 2026-06-18 22:34

Verdict: NEEDS_WORK
Reviewer: multi-agent-review + spec-review rubric (fresh-context CLI agents: claude, codex, cursor)

| agent  | status | retries | output                                          |
| ------ | ------ | ------: | ----------------------------------------------- |
| claude | ok     |       0 | `.ai-out/agent-runs/20260618-223036/claude.out` |
| codex  | ok     |       0 | `.ai-out/agent-runs/20260618-223036/codex.out`  |
| cursor | ok     |       0 | `.ai-out/agent-runs/20260618-223036/cursor.out` |

### 観点別評価

- 上位文書整合: NEEDS_WORK — `specs/6-storybook-component-catalog/index.md:184` の D7 が `context/component-design.md` を同期候補として残す一方、`index.md:52` / `index.md:548` は反映済としている。
- 未解決論点: PASS — `index.md:190` に D1〜D7 は解決済み、未確定事項なしと記載されている。
- 実装対象明示: NEEDS_WORK — `index.md:137` 以降で app-local Storybook を決定しているが、`index.md:78-88` のスコープには corporate-site app-local Storybook が明示されていない。
- template 必須節: PASS — template 必須節は一通り存在する。
- EARS acceptance: NEEDS_WORK — `index.md:123-127` に「起動導線を提供する」「対応する」など観測条件が弱い acceptance が残る。
- prompts 自己完結性: N/A — `prompts/` は未生成。
- 正本境界: NEEDS_WORK — `index.md:57` / `index.md:542-548` で sync 済みとする durable 成果が、`index.md:205-280` / `index.md:296-389` に正本リンクなしで詳細再掲されている。

### 統合指摘 (重大度順)

- [high x3] `specs/6-storybook-component-catalog/index.md:57` — sync 済みの durable 成果が spec 側に正本級の詳細として残っている。`context/component-design.md` / `context/engineering.md` を正本として明示し、spec 側は決定時スナップショットへ降格する。
- [high x2] `specs/6-storybook-component-catalog/index.md:184` — D7 は `context/component-design.md` への同期を「候補」と書くが、同 spec は `反映済` と記録しており状態が矛盾している。D7 を同期済みに更新するか、反映済行を戻して状態を揃える。
- [medium x2] `specs/6-storybook-component-catalog/index.md:137` — app-local Storybook が D3 / 実装分割で要求される一方、スコープの「やること」に明示されていない。対象 component、root script、build gate をスコープへ追加する。
- [medium x2] `specs/6-storybook-component-catalog/index.md:25` — Interface / Content / 実装分割が「進行中」のままレビュー対象になっている。完了に更新するか、未完点を未確定事項へ戻す。
- [medium x2] `specs/6-storybook-component-catalog/index.md:123` — EARS acceptance の観測可能性が不足している。起動コマンド、story 表示、対応表の存在など検証可能な結果へ書き換える。

### 単一エージェントのみ (未合意)

- [high x1, by cursor] `specs/6-storybook-component-catalog/index.md:157` — app-local Storybook が `.astro` Presentation component を対象にするが、Storybook framework / builder の前提が未定義。
- [high x1, by cursor] `specs/6-storybook-component-catalog/index.md:152` — GenericComponents 11 件を `packages/ui` 初期 catalog に置く例外理由が、Design Doc Why / What / landscape の「複数 consumer」原則に対して明示不足。
- [medium x1, by cursor] `specs/6-storybook-component-catalog/index.md:264` — app-local Storybook の必須 component 一覧が候補一覧、ファイル構成例、story 命名表で揃っていない。
- [medium x1, by cursor] `specs/6-storybook-component-catalog/index.md:112` — `.pen` component と実装 component の対応表が成果物として必須化されていない。
- [medium x1, by cursor] `specs/6-storybook-component-catalog/index.md:259` — `Select` などインタラクティブ primitive の Astro / island 利用境界が未定義。
- [medium x1, by cursor] `context/design-workflow.md:88` — Phase C の実装配置が `src/components/<feature>/` のままで、spec / `context/component-design.md` の `src/components/features/<feature>/` とずれている。
- [low x1, by claude] `specs/6-storybook-component-catalog/index.md:203` — docs sync 作業がある一方、実装対象表の `core` は実装無しになっている。
- [low x1, by claude] `specs/6-storybook-component-catalog/index.md:310` — `storybook:corporate` の root script 化が D3 の決定文に明示されていない。

### エージェント間の相違

- `specs/6-storybook-component-catalog/index.md:184` — cursor は high、claude は medium。sync 状態の矛盾は phase gate に影響するため high として扱う。
- `specs/6-storybook-component-catalog/index.md:123` — cursor は medium、codex は low。EARS rubric が観測可能性を必須にしているため medium として扱う。

### 次アクション

1. sync 済み成果の正本境界を整理する。
2. D7 / 上位資料からの変更点 / phase 状態表の整合を直す。
3. app-local Storybook のスコープ、対象 component、framework 前提、検証可能な EARS を追記する。
4. 修正後に spec-review を再実行する。

### 対応状況 2026-06-18

- 正本境界: `index.md` の機能仕様 / Interface / Content Data に、決定時スナップショットであることと `context/component-design.md` / `context/engineering.md` / `context/project.md` への正本リンクを追記。
- D7 同期状態: `context/component-design.md` への同期を「候補」から「同期済み」に更新。
- app-local Storybook スコープ: `apps/corporate-site` の Storybook 起動・build 導線をスコープに追加。ただし framework / builder は D8 として未決定化。
- phase 状態表: D8〜D10 の未決定に合わせ、Interface / Content / 実装分割を保留へ更新。
- EARS acceptance: 起動コマンド、story の存在、対応表、review checklist 記録に基づく観測可能な表現へ更新。
- 論点化: D8 (app-local Storybook framework)、D9 (GenericComponents 初期 catalog 例外理由)、D10 (app-local component 一覧 / 対応表成果物) を未決定論点として追加。
- 上位同期: `context/design-workflow.md` Phase C の component path を `src/components/features/<feature>/` へ更新。

### 追加論点の解決 2026-06-18

- D8: Storybook Astro framework (`@storybook/astro`) を採用。`.astro` Presentation component を直接確認し、実装時に成立しない場合は app-local Storybook を後続 issue へ分離する。
- D9: `GenericComponents` 相当 11 件は shadcn primitive / token / shared component 表示契約の検証として初期 `packages/ui` catalog に含める。business wording や page 文脈を持つ component は含めない。
- D10: app-local Storybook 初期対象は `ServicePillar` / `BusinessFeatureRow` / `ContactInfoRow` の 3 component に固定。`.pen` 対応表は `design/features/corporate-site/component-map.md` として追加。

## Review 2026-06-18 23:36

Verdict: PASS
Reviewer: spec-review (fresh-context, subagent=codex exec)

### 観点別評価

- 上位文書整合: PASS — spec `## 上位文書整合` が Design Doc Why / What / landscape / feature doc / context / ADR-0004 / ADR-0007 / ADR-0008 との整合方針を明示し、`GenericComponents` 初期 catalog も `## 解決済みの論点` D9 で例外理由を限定している。
- 未解決論点: PASS — spec `## 設計時の論点` は D1〜D10 の決定欄が埋まり、`## 未確定事項` は「なし。D1〜D10 は解決済み。」として下流 phase が進められる状態。
- 実装対象明示: PASS — spec `## 実装対象` が `corporate-site`, `ui`, `config`, `e2e`, `core` を `context/project.md` の対象ドメインと一致する形で列挙し、責務も分離している。
- template 必須節: PASS — spec は `## メタ情報` から `## 備考` まで rubric の必須節を一通り持ち、Interface / Content / Performance / Security / Error / Fallback / Test / Flow / Sequence / 実装分割も存在する。
- EARS acceptance: PASS — spec `## 要件の解釈` の EARS 記述が `WHEN` / `IF` で始まり、実行可能 script、Storybook story 表示、対応表、review checklist 記録など観測可能な条件になっている。
- prompts 自己完結性: N/A — 今回のレビュー対象は spec 本体であり、`prompts/` 配下は指定していない。
- 正本境界: PASS — spec `## 上位資料からの変更点` に `反映済` 行があり、`## 機能仕様` / `## Interface 設計` / `## Content / Data 設計` が決定時スナップショットとして `context/component-design.md`, `context/engineering.md`, `context/project.md` へ正本リンクしている。

### 指摘

- なし。
