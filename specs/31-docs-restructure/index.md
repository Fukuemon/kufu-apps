# ドキュメント体制の見直し (specs 廃止 / Pencil 削除 / DesignDoc 現状事実化)

> 対象: リポジトリの設計文書運用 (specs / design / ADR / DesignDoc 記述方針) の再設計。issue #31 の論点・決定経緯を記録する。
> スコープ: 方針決定と正本 (ADR / DesignDoc / context) への反映まで。大規模な書き直し・削除の実施は別 issue。
> 要求正本: [requirements.md](requirements.md) (要求レベル論点 4 件は 2026-07-25 ヒアリングで全件解決済み)。

## メタ情報

- Issue: `#31`
- ステータス: `In Progress`
- 作成日: 2026-07-25
- 更新日: 2026-07-25
- Branch: `feature/31`
- Owner: Fukuemon

## 設計フェーズ状況

状態は `未着手 / 進行中 / 完了 / レビュー済 / 保留` のいずれか。保留の場合は理由を備考に残す。

| #   | フェーズ                    | 状態   | 最終更新   | 備考                                                               |
| --- | --------------------------- | ------ | ---------- | ------------------------------------------------------------------ |
| 1   | 起票                        | 完了   | 2026-07-25 | issue #31。requirements.md の intake 再検証済 (欠落なし)           |
| 2   | 下書き                      | 完了   | 2026-07-25 | scaffold で index.md 初版生成。実装突合: 対象 (既存文書群への増分) |
| 3   | 上位文書突合                | 完了   | 2026-07-25 | 変更提案 5 件を検出 (本 issue の成果物そのもの。sync phase で反映) |
| 4   | 論点整理                    | 完了   | 2026-07-25 | D1〜D6 を抽出                                                      |
| 5   | 論点解決                    | 未着手 |            |                                                                    |
| 6   | Interface / Routing 設計    | 未着手 |            | 対象外 (文書運用 issue のため。clarify で最終判定)                 |
| 7   | Content / Data 設計         | 未着手 |            | 文書構成 (どの文書に何を置くか) の設計として扱う                   |
| 8   | Performance / Security 設計 | 未着手 |            | 対象外 (文書運用 issue のため)                                     |
| 9   | Test / Metrics 設計         | 未着手 |            | 受け入れ基準 (EARS) の検証方法として扱う                           |
| 10  | 実装分割                    | 未着手 |            | `prompts` phase で生成                                             |
| 11  | レビュー済                  | 未着手 |            |                                                                    |

## 上位文書整合

正本 ([Design Doc `## Why / What`](../../design/DesignDoc.md#why--what) / [Design Doc landscape](../../design/DesignDoc.md) / [context](../../context/) / ADR) のどの節と、どう整合させたかを記録する。

- Design Doc Why / What 更新要否: 要 (specs 前提の記述・Phase 表現の見直し対象)
- Design Doc 更新要否: **要** (C4 図 1 枚化 / 現状事実化 / モジュール責務 `specs` 行)
- ADR 起票要否: **要** (業務ルール 1 により 1 判断 1 ファイル。specs 存廃 / Pencil 正本扱い / phase 記述方針)

本 issue は上位文書の変更**そのもの**を成果物とするため、以下の「変更提案」は矛盾による停止対象ではなく、clarify で内容を確定し sync phase で反映するハンドオフ対象として扱う。spec 単独で上位文書を書き換えない原則は維持する。

| 上位文書         | 節 / 該当箇所                                                        | 整合方針 (継承 / 補足 / 変更提案)                                  |
| ---------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Design Doc       | アーキテクチャ概観 (C4 L1/L2)                                        | 変更提案 (1 枚の簡素な図へ統合)                                    |
| Design Doc       | Why / What のフェーズ展望・Phase 1 記述 / モジュール責務 `specs` 行  | 変更提案 (現状事実のみ化・specs 廃止の反映)                        |
| CLAUDE.md (契約) | Spec Workflow Contract (正本境界 / closeout / spec-\* skill)         | 変更提案 (specs 廃止。正本は sdd-template repo 側 → 業務ルール 2)  |
| context          | design-workflow.md (§1 正本 / §2 フロー / §4 配置規約の `.pen` 前提) | 変更提案 (Pencil 削除に伴う改訂)                                   |
| ADR-0003 / 0004  | phase 分割 / design workflow (Pencil 中核採用)                       | 変更提案 (0004 改訂 or 差し替え。将来計画の集約先として 0003 参照) |

> 反映は phase: sync の正本ハンドオフで行う。

## 関連資料

- `design/DesignDoc.md`: ## アーキテクチャ概観 / ## 詳細の所在 / ## Open Questions / Future Work
- `CLAUDE.md`: Spec Workflow Contract (正本境界 / closeout)
- `adr/0003` (Phase 1 分割) / `adr/0004` (design workflow) / `context/design-workflow.md`
- 関連 issue / ticket: [#31](https://github.com/Fukuemon/kufu-apps/issues/31)

## 背景

- SDD 契約上 spec は issue close 時に削除するが、close 済み分を含む 9 ディレクトリが `specs/` に残存し、契約と実態が乖離している。spec という中間文書自体を廃止し design / ADR / issue に集約する方が運用負荷が低い、という判断が要求レベルで確定した。
- `design/features/corporate-site/index.pen` (Pencil デザイン正本) が実装に追従できておらず乖離。実装 (コード + Storybook) を正とし削除する判断が確定した。
- `design/DesignDoc.md` に Phase 1/2/3 の時系列記述が多く「今の事実」が読み取りにくい。C4 L1/L2 の 2 枚も要点が掴みにくい。
- 影響先はコーポレートサイト実装ではなく、リポジトリ横断の文書運用 (`domain:core`)。

## スコープ

### やること

- specs 廃止の移行設計: 残存 9 ディレクトリの sync 状況確認と削除手順、spec-review 等 phase gate の代替、SDD workflow への影響整理
- Pencil 削除の影響整理: design-workflow (ADR-0004 / context/design-workflow.md) の改訂方針
- DesignDoc 書き換え方針の具体化: 現状事実のみ化の対象節の特定、将来計画の集約先、C4 図の 1 枚化の内容
- 決定の ADR / DesignDoc / context への反映 (sync phase)

### やらないこと

- 大規模な文書の書き直し・削除の実施 (方針決定後に別 issue。決定に伴う軽微なメタ情報更新は可)
- sdd-template repo 側の skill / rule 本体の改修 (必要なら派生 issue)

## 要件の解釈

### 実現したいユーザー価値

- 開発者 (リポジトリ管理者): 文書のメンテナンスコストを下げ、実装と乖離しない状態を保てる
- AI エージェント: 正本文書が少なく・新鮮で・矛盾がないほど設計 / 実装の精度が上がる

### 成功条件

- 文書の種類と正本境界が削減・単純化され、「どこを読めば今の事実が分かるか」が一意になる
- 実装と乖離した文書 (Pencil / 古い spec / phase 記述) が残らない運用になる

### 対象ユーザー / 操作主体

- 開発者 (本人) / AI エージェント (SDD workflow 実行主体)

EARS 風受け入れ基準 (requirements.md より):

- WHEN 本 issue が完了したとき、システム (文書群) は specs 廃止 (design / ADR への集約) の判断と移行手順を ADR として保持している。
- WHEN 本 issue が完了したとき、システムは Pencil 削除 (実装を正とする) の判断を ADR として保持し、design-workflow (ADR-0004 / context/design-workflow.md) の改訂方針を示している。
- WHEN 本 issue が完了したとき、システムは DesignDoc を現状事実のみに書き換える方針 (将来計画の集約先を含む) と C4 図の 1 枚化方針を保持している。
- IF specs の移行手順 (残存 9 ディレクトリの扱い、SDD workflow への影響範囲) が文書化されていない場合、THEN 実削除を行わない。

## 設計時の論点

設計 / 実装フェーズへ持ち越す残課題を 1 件ずつ管理する。確定したものは「解決済みの論点」へ移す。

| #   | 論点                                                                                                           | 決定候補                                                                                      | 決定 |
| --- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---- |
| D1  | specs 廃止後、spec が担っていた役割 (論点管理 / 受け入れ基準 / 実装分割 / prompts) をどこへ移すか              | issue 本文 + コメント / design 直編集 + ADR / 併用                                            | 未決 |
| D2  | phase gate (spec-review / fresh-context evaluator) の代替をどうするか                                          | PR review に統合 / design 差分への evaluator 適用 / gate 自体を廃止                           | 未決 |
| D3  | 残存 9 ディレクトリの移行手順 (sync 済み確認 → 削除) と削除の実施範囲 (本 issue で消すか別 issue か)           | 本 issue = 手順文書化まで (IF 基準遵守)、実削除は別 issue                                     | 未決 |
| D4  | sdd-template 共有プロセスとの衝突の扱い (spec-\* skill は残存するが本 repo では使わない状態になる)             | 本 repo ローカルの運用差分として文書化 / テンプレ側改修の派生 issue を切る / 両方             | 未決 |
| D5  | Pencil 削除後のデザイン制作フロー (ADR-0004 の A0/A/B/C の何を残すか、デザイン正本の代替をどう定義するか)      | 実装 (コード + Storybook) を正本にし ADR-0004 を改訂 / 新 ADR で差し替え (0004 は superseded) | 未決 |
| D6  | DesignDoc 現状事実化の対象節の特定と将来計画の集約先、C4 1 枚化の図の内容 (含める実行単位とデータフローの範囲) | 将来計画は ADR-0003 / Open Questions へ集約。図は mermaid flowchart 1 枚                      | 未決 |

## 解決済みの論点

要求レベルの論点 4 件 (specs 存廃 / Pencil / phase 記述 / C4 図) は requirements.md の「決定事項」で確定済み。設計レベルの解決は clarify phase で行う。

-

## 未確定事項

(決定できない項目を理由とともに残す。1 件でも残っていれば下流 phase は止める)

- D1〜D6 (上記論点一覧。clarify で解決予定)

## 実装対象

正規 target は `context/project.yml` の対象ドメイン一覧を正本とする。

| モジュール       | 実装有無 | 主な責務                                                  |
| ---------------- | :------: | --------------------------------------------------------- |
| `corporate-site` |    -     |                                                           |
| `cms`            |    -     |                                                           |
| `ui`             |    -     |                                                           |
| `config`         |    -     |                                                           |
| `e2e`            |    -     |                                                           |
| `core`           |    ◯     | リポジトリ横断の文書運用 (specs / design / adr / context) |

## 機能仕様

### User Flow

1. 開発者 / AI エージェントが「今の事実」を知りたいとき、design / context / ADR のいずれかを読めば一意に到達できる
2. 設計判断が発生したとき、ADR に 1 判断 1 ファイルで記録し、design / context の該当節を更新する
3. 実装と文書が乖離したとき、実装を正として文書側を追従させる (Pencil のような追従不能な中間正本を持たない)

### Reuse Policy

- 対象外 (文書運用 issue のため)

### Performance

- 対象外

### Routing / URL State

- 対象外

### Content / Assets

- 文書の配置と正本境界の再設計そのものが本 issue の対象 (D1 / D6)

### UI Reuse

- 対象外

### Testing

- 受け入れ基準 (EARS 4 件) の充足を最終 gate の spec-review で検証する

## Interface 設計

### UI / API / Event Interface

- 対象外 (文書運用 issue のため)

### Props / Request / Response

- 対象外

## Content / Data 設計

### 保存・管理するデータ

- 対象: 文書群の構成 (specs 廃止後の情報の置き場、DesignDoc の節構成、ADR 一覧)。clarify の決定後に確定する

### コンテンツ配置 / package / route

- clarify (D1 / D6) の決定後に記載

## Performance / Security 設計

### Performance

- 対象外

### Security / Privacy

- 対象外 (secret / 個人情報を扱わない)

## Error / Fallback 設計

### エラーケース

| #   | ケース                                             | ユーザーへの見せ方       | リカバリ                                                                  |
| --- | -------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------- |
| 1   | specs 廃止が sdd-template の共有プロセスと衝突する | 検討結果に衝突内容を明記 | 本 repo ローカルの運用差分として扱うか、テンプレ側改修の派生 issue を切る |
| 2   | 移行手順が未文書化のまま削除が進みそうになる       | IF 基準 (EARS) で禁止    | 手順文書化を先行させる                                                    |

### Fallback

- specs 廃止の運用が回らない場合、契約 (closeout 削除) の徹底のみで残す縮小案に戻れるよう、判断は ADR に代替案込みで記録する

## テスト / 評価方針

### テスト観点

- EARS 受け入れ基準 4 件が成果物 (ADR / 改訂方針文書) で充足されているか
- 変更提案 5 件が sync で反映され、上位文書間に矛盾が残っていないか

### 計測指標

- 対象外 (定量指標なし。成功条件は文書構造の単純化)

## フロー / シーケンス

(phase: diagram で生成。文書の正本境界と情報フローを Mermaid 図に落とす)

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

| Phase | 対象 | 概要 | 依存 |
| ----- | ---- | ---- | ---- |
| P1    |      |      |      |

### prompts 生成方針

- 対象ドメインは `core` のみ。ADR 起票 / DesignDoc 改訂 / context 改訂 / specs 移行手順の単位で分割候補 (clarify 後に確定)

## 上位資料からの変更点

本 spec で Design Doc / context / 既存 ADR から変更・追加した内容を、反映先別に記録する。clarify / track で更新する。

### PRD への影響

| 対象節 | 変更内容 | 理由 |
| ------ | -------- | ---- |
|        |          |      |

### Design Doc への影響

| 対象節 | 変更内容 | 理由 |
| ------ | -------- | ---- |
|        |          |      |

### feature doc への影響

| 対象 doc / 節 | 変更内容 | 理由 |
| ------------- | -------- | ---- |
|               |          |      |

### context への影響

| 対象 doc / 節 | 変更内容 | 理由 |
| ------------- | -------- | ---- |
|               |          |      |

### ADR の新規 / 更新

| ADR ID | 変更内容 | 理由 |
| ------ | -------- | ---- |
|        |          |      |

## レビュー

`spec-review` (fresh-context evaluator) の最新結果。完全な記録は `review.md` を参照。

| 日付 | 結果 (PASS / NEEDS_WORK) | 指摘要点 | 対応 |
| ---- | ------------------------ | -------- | ---- |
|      |                          |          |      |

## 変更履歴

| 日付       | 変更者         | 変更内容                                            |
| ---------- | -------------- | --------------------------------------------------- |
| 2026-07-25 | spec-lifecycle | scaffold: index.md 初版生成、初期論点 D1〜D6 を抽出 |

## 備考

- 文書運用 issue のため appendix (api / database / authorization / screen-spec / testid) は取り込まない
