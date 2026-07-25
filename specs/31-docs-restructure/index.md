# ドキュメント体制の見直し (specs closeout 徹底 / Pencil 削除 / DesignDoc 現状事実化)

> 対象: リポジトリの設計文書運用 (specs / design / ADR / DesignDoc 記述方針) の再設計。issue #31 の論点・決定経緯を記録する。
> スコープ: 方針決定と正本 (ADR / DesignDoc / context) への反映まで。大規模な書き直し・削除の実施は別 issue。
> 要求正本: [requirements.md](requirements.md) (要求レベル論点 4 件は解決済み。決定事項 #1 は 2026-07-25 の clarify で「廃止」→「存続 + closeout 徹底」に更新)。

## メタ情報

- Issue: `#31`
- ステータス: `In Progress`
- 作成日: 2026-07-25
- 更新日: 2026-07-25
- Branch: `feature/31`
- Owner: Fukuemon

## 設計フェーズ状況

状態は `未着手 / 進行中 / 完了 / レビュー済 / 保留` のいずれか。保留の場合は理由を備考に残す。

| #   | フェーズ                    | 状態       | 最終更新   | 備考                                                                       |
| --- | --------------------------- | ---------- | ---------- | -------------------------------------------------------------------------- |
| 1   | 起票                        | 完了       | 2026-07-25 | issue #31。requirements.md の intake 再検証済 (欠落なし)                   |
| 2   | 下書き                      | 完了       | 2026-07-25 | scaffold で index.md 初版生成。実装突合: 対象 (既存文書群への増分)         |
| 3   | 上位文書突合                | 完了       | 2026-07-25 | 変更提案を検出 (本 issue の成果物そのもの。sync phase で反映)              |
| 4   | 論点整理                    | 完了       | 2026-07-25 | D1〜D6 を抽出                                                              |
| 5   | 論点解決                    | レビュー済 | 2026-07-25 | D1〜D6 全件解決。未決定ゼロ (D6: Future Work 一元化 + C4 L1/L2 内容再設計) |
| 6   | Interface / Routing 設計    | 完了       | 2026-07-25 | 対象外で確定 (文書運用 issue のため。clarify 全件解決時に判定)             |
| 7   | Content / Data 設計         | 完了       | 2026-07-25 | 文書構成は D1/D3/D6 で確定。diagram で清算フロー・検査・C4 再設計案を図化  |
| 8   | Performance / Security 設計 | 完了       | 2026-07-25 | 対象外で確定 (文書運用 issue のため)                                       |
| 9   | Test / Metrics 設計         | 未着手     |            | 受け入れ基準 (EARS) の検証方法として扱う                                   |
| 10  | 実装分割                    | 未着手     |            | `prompts` phase で生成                                                     |
| 11  | レビュー済                  | 未着手     |            |                                                                            |

## 上位文書整合

正本 ([Design Doc `## Why / What`](../../design/DesignDoc.md#why--what) / [Design Doc landscape](../../design/DesignDoc.md) / [context](../../context/) / ADR) のどの節と、どう整合させたかを記録する。

- Design Doc Why / What 更新要否: 要 (フェーズ展望など時系列記述の現状事実化の対象)
- Design Doc 更新要否: **要** (C4 図 1 枚化 / 現状事実化)
- ADR 起票要否: **要** (業務ルール 1 により 1 判断 1 ファイル。specs 運用是正 / Pencil 正本扱い / phase 記述方針)

本 issue は上位文書の変更**そのもの**を成果物とするため、以下の「変更提案」は矛盾による停止対象ではなく、clarify で内容を確定し sync phase で反映するハンドオフ対象として扱う。spec 単独で上位文書を書き換えない原則は維持する。

| 上位文書         | 節 / 該当箇所                                                                                           | 整合方針 (継承 / 補足 / 変更提案)                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Design Doc       | アーキテクチャ概観 (C4 L1/L2)                                                                           | 変更提案 (L1/L2 を維持し内容再設計)                                      |
| Design Doc       | Why / What のフェーズ展望・Phase 1 記述                                                                 | 変更提案 (現状事実のみ化)                                                |
| Design Doc       | モジュール責務 `specs` 行                                                                               | 継承 (specs 存続のため変更不要)                                          |
| CLAUDE.md (契約) | Spec Workflow Contract (正本境界 / closeout)                                                            | 継承 + 補足 (closeout 契約は現行のまま。徹底する運用 / 検査を追加)       |
| context          | design-workflow.md (§1 正本 / §2 フロー / §4 配置規約の `.pen` 前提)                                    | 変更提案 (Pencil 削除に伴う改訂)                                         |
| feature doc      | corporate-site → デザイン正本 = `index.pen` の参照記述 (概要 / デザイントークン / コンポーネント節ほか) | 変更提案 (D5 に伴う `.pen` 正本参照の改訂。正本 = コード + Storybook へ) |
| ADR-0003 / 0004  | phase 分割 / design workflow (Pencil 中核採用)                                                          | 変更提案 (0004 改訂 or 差し替え。将来計画の集約先として 0003 参照)       |

> 反映は phase: sync の正本ハンドオフで行う。

## 関連資料

- `design/DesignDoc.md`: ## アーキテクチャ概観 / ## 詳細の所在 / ## Open Questions / Future Work
- `CLAUDE.md`: Spec Workflow Contract (正本境界 / closeout)
- `adr/0003` (Phase 1 分割) / `adr/0004` (design workflow) / `context/design-workflow.md`
- 関連 issue / ticket: [#31](https://github.com/Fukuemon/kufu-apps/issues/31)

## 背景

- SDD 契約上 spec は issue close 時に削除するが、close 済み issue 分の 9 ディレクトリが `specs/` に残存し、契約と実態が乖離している。当初は spec 廃止 (design / ADR への集約) も検討したが、clarify (2026-07-25) で **spec 運用は現行契約のまま存続し、closeout の徹底を是正する** 方針に確定した (D1)。
- `design/features/corporate-site/index.pen` (Pencil デザイン正本) が実装に追従できておらず乖離。実装 (コード + Storybook) を正とし削除する判断が確定した。
- `design/DesignDoc.md` に Phase 1/2/3 の時系列記述が多く「今の事実」が読み取りにくい。C4 L1/L2 の 2 枚も要点が掴みにくい。
- 影響先はコーポレートサイト実装ではなく、リポジトリ横断の文書運用 (`domain:core`)。

## スコープ

### やること

- specs closeout 徹底の是正: 残存 9 ディレクトリの sync 状況確認 → 清算手順の文書化 → 全件削除の実施 (D3 でスコープ拡大)、close 時削除を担保する検査スクリプトの設計
- Pencil 削除の影響整理: design-workflow (ADR-0004 / context/design-workflow.md) の改訂方針
- DesignDoc 書き換え方針の具体化: 現状事実のみ化の対象節の特定、将来計画の Future Work 節への一元化、C4 図 (L1/L2) の内容再設計
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
- 実装と乖離した文書 (Pencil / 残存 spec / phase 記述) が残らない運用になる

### 対象ユーザー / 操作主体

- 開発者 (本人) / AI エージェント (SDD workflow 実行主体)

EARS 風受け入れ基準 (requirements.md より):

- WHEN 本 issue が完了したとき、システム (文書群) は specs 存続 + closeout 徹底 (廃止案の却下理由を含む) の判断と、残存 spec の清算手順・削除を担保する運用 / 検査の方針を ADR として保持している。
- WHEN 本 issue が完了したとき、システムは Pencil 削除 (実装を正とする) の判断を ADR として保持し、design-workflow (ADR-0004 / context/design-workflow.md) の改訂方針を示している。
- WHEN 本 issue が完了したとき、システムは DesignDoc を現状事実のみに書き換える方針 (将来計画の集約先を含む) と C4 図 (L1/L2) の内容再設計方針を保持している。
- WHEN 本 issue が完了したとき、`specs/` に close 済み issue の spec ディレクトリが残存していない (残存 9 ディレクトリの清算完了)。
- IF specs の清算手順 (残存 9 ディレクトリごとの sync 済み確認) が文書化されていない場合、THEN 実削除を行わない。

## 設計時の論点

設計 / 実装フェーズへ持ち越す残課題を 1 件ずつ管理する。確定したものは「解決済みの論点」へ移す。

| #   | 論点                                                        | 決定候補 | 決定 |
| --- | ----------------------------------------------------------- | -------- | ---- |
| —   | (未決の設計論点なし。D1〜D6 は全件「解決済みの論点」へ移動) | —        | —    |

## 解決済みの論点

要求レベルの論点 4 件 (specs 存廃 / Pencil / phase 記述 / C4 図) は requirements.md の「決定事項」で確定済み (決定事項 #1 は下記 D1 で更新)。

- **D1: specs は存続し closeout (issue close 時削除) を徹底する** (2026-07-25, ユーザー)。当初の要求決定「廃止し design / ADR に集約」と clarify 中の暫定決定「issue 集約」を撤回し、requirements.md 決定事項 #1 を更新した。spec 運用 (作成 → 設計 → sync → close 時削除) は現行契約のまま。本 issue の成果は残存 9 dir の清算手順と、削除を担保する運用 / 検査の設計。
- **D2: phase gate (spec-review) は現行のまま存続する** (2026-07-25, ユーザー)。specs が存続するため評価対象の差し替えは不要。gate 代替の設計は論点から取り下げ。
- **D3: 残存 9 dir は本 issue で全件清算し、検査はスクリプト方式とする** (2026-07-25, ユーザー)。清算は「dir ごとの sync 済み確認 → 未 sync 分の sync → 手順文書化 → 全件削除」の順 (IF 基準: 手順文書化前の削除は禁止)。今後の close 時削除は、closed issue × `specs/` 残存を照合する検査スクリプト (手動 + 将来 CI [#12] で実行、hook には組み込まない) で担保する。requirements.md のスコープを「削除実施まで」に拡大済み。
- **D4: 検査は本 repo ローカル完結とし、テンプレ側の手順改修は派生 issue を起票する** (2026-07-25, ユーザー)。検査スクリプト + コマンド登録 + context/engineering.md 記載は本 repo に閉じる。closeout 手順 (`spec-lifecycle` の closeout.md) へ検査実行ステップを足す sdd-template 側の派生 issue を sync phase で起票する (他の消費 repo にも展開されるため)。
- **D5: 新 ADR で ADR-0004 を supersede し、デザインフローは「Claude Design → 実装直結」とする** (2026-07-25, ユーザー)。新 ADR「デザイン正本を実装 (コード + Storybook) とする」を起票し、0004 は superseded に更新。フローは A0 依頼文 (.prompt.md, commit) → A: Claude Design で発散 (使い捨て) → C: 採用案を参照し直接実装 → 確認は Storybook + 実画面。Pencil (phase B) と `.pen` 中間正本を廃止。`index.pen` の実削除と context/design-workflow.md の書き換えは改訂方針を示した上で別 issue。
- **D6: 将来計画は DesignDoc の Open Questions / Future Work 節に一元化し、C4 図は L1/L2 の階層を維持して内容を再設計する** (2026-07-25, ユーザー。要求決定 #3/#4 の詳細化。#4 の「1 枚統合」は撤回し requirements.md を更新)。他の全節から Phase 語彙・将来記述を排除し「今の事実」のみにする (根拠は ADR-0003 へリンク)。L1 = 利用者視点に絞る: 訪問者・内容更新者 → コーポレートサイト → 外部サービス (Cloudflare / Resend)。開発者・GitHub・docs workflow は除外し、記法は C4Context → flowchart。L2 = 実在の実行単位とデータの流れのみ: corporate-site / Pages Functions / packages (ui・config) / e2e / 外部サービス。未実装 `apps/cms` (点線) と正本ドキュメント群のノードは除外 (cms は Future Work 節、docs は「詳細の所在」節へ)。図の具体化は diagram phase で行う。

## 未確定事項

(決定できない項目を理由とともに残す。1 件でも残っていれば下流 phase は止める)

- なし (設計論点 D1〜D6 は全件解決済み)

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
3. issue が close されたとき、spec は sync 済み確認の上削除され、`specs/` に乖離した文書が残らない
4. 実装と文書が乖離したとき、実装を正として文書側を追従させる (Pencil のような追従不能な中間正本を持たない)

### Reuse Policy

- 対象外 (文書運用 issue のため)

### Performance

- 対象外

### Routing / URL State

- 対象外

### Content / Assets

- 文書の配置と正本境界の再設計そのものが本 issue の対象 (D3 / D6)

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

- 対象: 文書群の構成 (specs 清算後の状態、DesignDoc の節構成、ADR 一覧)
- D1 決定 (存続 + closeout 徹底): spec の役割・置き場は現行契約のまま。変わるのは「close 時削除の担保」(清算手順 + 検査スクリプト) のみ
- D3 決定: 残存 9 dir は sync 確認 → 手順文書化 → 本 issue で全件削除。検査スクリプトは scripts 配下 + コマンド登録 (CI 常設化は #12)

### コンテンツ配置 / package / route

- 清算後の `specs/` は「open issue の spec のみ存在」が定常状態。DesignDoc の節構成は D6 (Future Work 一元化 + C4 L1/L2 再設計) に従い sync で確定

## Performance / Security 設計

### Performance

- 対象外

### Security / Privacy

- 対象外 (secret / 個人情報を扱わない)

## Error / Fallback 設計

### エラーケース

| #   | ケース                                                            | ユーザーへの見せ方       | リカバリ                                                                  |
| --- | ----------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------- |
| 1   | closeout 検査の追加が sdd-template の共有プロセス層の変更を要する | 検討結果に影響範囲を明記 | 本 repo ローカルの運用差分として扱うか、テンプレ側改修の派生 issue を切る |
| 2   | 清算手順が未文書化のまま削除が進みそうになる                      | IF 基準 (EARS) で禁止    | 手順文書化を先行させる                                                    |

### Fallback

- 自動検査 (hook / CI) が導入できない場合でも、closeout 手順 (`spec-lifecycle` の closeout.md) の手動運用で削除を担保する。判断は ADR に代替案込みで記録する

## テスト / 評価方針

### テスト観点

- EARS 受け入れ基準 4 件が成果物 (ADR / 改訂方針文書) で充足されているか
- 上位文書整合テーブルの変更提案が sync で反映され、上位文書間に矛盾が残っていないか

### 計測指標

- 対象外 (定量指標なし。成功条件は文書構造の単純化)

## フロー / シーケンス

### Flowchart (ユーザー操作起点): specs 清算 / closeout フロー

残存 9 dir の一括清算と、今後の issue close 時の closeout 運用は同じフローに乗る (D1 / D3)。

```mermaid
flowchart TD
    Start["開発者 / AI エージェント: 清算開始 (issue close 前 or 一括清算)"] --> Pick["対象 spec dir を選ぶ"]
    Pick --> Check{"durable 成果は design / context / ADR に sync 済みか"}
    Check -->|"未 sync"| Sync["sync 実行 (design 側へ正本ハンドオフ)"]
    Sync --> Check
    Check -->|"sync 済み"| Delete["spec dir を削除して commit"]
    Delete --> More{"残りの対象 dir はあるか"}
    More -->|"あり"| Pick
    More -->|"なし"| Verify["検査スクリプト実行"]
    Verify -->|"残存なし"| Done["完了 (issue close 可)"]
    Verify -->|"残存あり"| Pick
```

- IF 基準 (EARS): 清算手順が文書化される前に Delete へ進むことは禁止 (D3)
- 一括清算では 9 dir を順に Pick する。今後の closeout では close 対象 issue の 1 dir のみ

### Sequence: 検査スクリプト (closed issue × specs/ 照合)

```mermaid
sequenceDiagram
    actor Dev as 開発者 / AI エージェント
    participant Script as 検査スクリプト
    participant FS as specs/
    participant GH as GitHub

    Dev->>Script: 実行 (手動。将来は CI [#12] へ常設化)
    Script->>FS: spec ディレクトリ一覧を取得 (issue-id を抽出)
    Script->>GH: 各 issue の state を照会 (gh CLI)
    GH-->>Script: OPEN / CLOSED
    alt CLOSED issue の spec dir が残存
        Script-->>Dev: 違反一覧を出力し失敗 (exit 1)
        Dev->>Dev: 清算フロー (上図) へ
    else 残存なし
        Script-->>Dev: OK (exit 0)
    end
```

### C4 再設計案 (D6。DesignDoc への反映は sync / 別 issue)

L1 (System Context) — 利用者視点に絞る。開発者 / GitHub / docs workflow は載せない:

```mermaid
flowchart LR
    Visitor["訪問者 (調達 / 保全 / 購買担当者・見込み顧客)"] -->|"閲覧・問い合わせ"| Site["Kufu コーポレートサイト"]
    Operator["内容更新者"] -->|"掲載内容の更新・確認"| Site
    Site -->|"配信"| CF["Cloudflare Pages / CDN"]
    Site -->|"問い合わせ通知"| Resend["Resend (メール送信)"]
```

L2 (Container) — 実在の実行単位とデータの流れのみ。未実装 `apps/cms` と正本ドキュメント群は載せない:

```mermaid
flowchart TD
    Visitor["訪問者"] --> Corp["apps/corporate-site (Astro 静的生成)"]
    Corp --> CF["Cloudflare Pages / CDN (配信)"]
    Corp --> Fn["Pages Functions /api/contact (ADR-0009)"]
    Fn --> Resend["Resend (問い合わせメール通知)"]
    UI["packages/ui (デザイントークン / 共有 UI)"] --> Corp
    Config["packages/config (共有設定)"] --> Corp
    E2E["e2e + playwright.config.ts (公開前検証)"] --> Corp
```

## 実装分割

### 実装タスク案

| Phase | 対象 | 概要 | 依存 |
| ----- | ---- | ---- | ---- |
| P1    |      |      |      |

### prompts 生成方針

- 対象ドメインは `core` のみ。ADR 起票 / DesignDoc 改訂 / context 改訂 / specs 清算手順の単位で分割候補 (clarify 後に確定)

## 上位資料からの変更点

本 spec で Design Doc / context / 既存 ADR から変更・追加した内容を、反映先別に記録する。clarify / track で更新する。

### PRD への影響

| 対象節 | 変更内容 | 理由 |
| ------ | -------- | ---- |
|        |          |      |

### Design Doc への影響

| 対象節                                                                                                 | 変更内容                                                                                                                | 理由                      |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| アーキテクチャ概観 → System Context (L1)                                                               | 利用者視点に絞る (訪問者・内容更新者 → サイト → Cloudflare / Resend)。開発者・GitHub を除外し flowchart 記法へ          | D6 決定 (source: clarify) |
| アーキテクチャ概観 → Container (L2)                                                                    | 実在の実行単位とデータの流れのみに絞る。未実装 `apps/cms` 点線と正本ドキュメント群ノードを除外                          | D6 決定 (source: clarify) |
| Why/What フェーズ展望・スコープ・Lower-Priority Goals・設計上の前提・モジュール責務 `apps/cms` 行 ほか | Phase 語彙・将来記述を排除し現状事実のみ化。将来計画は Open Questions / Future Work 節へ一元化 (根拠は ADR-0003 リンク) | D6 決定 (source: clarify) |

### feature doc への影響

| 対象 doc / 節                                                                                              | 変更内容                                                                                                  | 理由                      |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------- |
| corporate-site → DesignDoc_corporate-site.md の `index.pen` 正本参照 (デザイン正本リンク・`.pen` 運用記述) | 「デザイン正本 = index.pen」記述を「正本 = 実装 (コード + Storybook)」へ改訂 (反映実施は sync / 別 issue) | D5 決定 (source: clarify) |

### context への影響

| 対象 doc / 節                                          | 変更内容                                                                                                                          | 理由                      |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| engineering.md (quality gate) / project.yml (commands) | specs 残存検査スクリプト (closed issue × `specs/` 照合) の追加とコマンド登録。CI 常設化は #12 に委譲                              | D3 決定 (source: clarify) |
| design-workflow.md (§1 正本 / §2 フロー / §4 配置規約) | Pencil (phase B) と `.pen` 正本の記述を廃し、Claude Design → 実装直結 + 正本 = コード + Storybook に改訂 (書き換え実施は別 issue) | D5 決定 (source: clarify) |

### ADR の新規 / 更新

| ADR ID                | 変更内容                                                                                  | 理由                              |
| --------------------- | ----------------------------------------------------------------------------------------- | --------------------------------- |
| 新規 (specs 運用是正) | specs 存続 + closeout 徹底 (廃止案の却下理由含む) と残存 9 dir の清算手順・検査方針を起票 | D1・D3・D4 決定 (source: clarify) |
| 新規 (デザイン正本)   | デザイン正本を実装 (コード + Storybook) とし、Claude Design → 実装直結フローを定める      | D5 決定 (source: clarify)         |
| ADR-0004              | 状態を superseded (新デザイン正本 ADR による置換) に更新                                  | D5 決定 (source: clarify)         |

## レビュー

`spec-review` (fresh-context evaluator) の最新結果。完全な記録は `review.md` を参照。

| 日付       | 結果 (PASS / NEEDS_WORK) | 指摘要点                                                                                                   | 対応                                                             |
| ---------- | ------------------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 2026-07-25 | NEEDS_WORK               | D5 と矛盾する feature doc (`.pen` 正本記述) が上位文書整合・影響テーブルから漏れ (+軽微: placeholder 残存) | 3 件対応済 (feature doc 行を 2 テーブルへ追記、placeholder 是正) |
| 2026-07-25 | PASS                     | 再判定: 指摘 3 件の対応を確認。全観点 PASS (prompts / 正本境界は N/A)                                      | —                                                                |

## 変更履歴

| 日付       | 変更者                   | 変更内容                                                                                                       |
| ---------- | ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| 2026-07-25 | spec-lifecycle           | scaffold: index.md 初版生成、初期論点 D1〜D6 を抽出                                                            |
| 2026-07-25 | spec-lifecycle (clarify) | D1 を「存続 + closeout 徹底」へ方針転換 (issue 集約案を撤回)、D2 を取り下げ。requirements.md も同期            |
| 2026-07-25 | spec-lifecycle (clarify) | D3 解決: 残存 9 dir を本 issue で全件清算、検査はスクリプト方式。スコープ / EARS を同期                        |
| 2026-07-25 | spec-lifecycle (clarify) | D4 解決: 検査はローカル完結、closeout 手順改修の sdd-template 派生 issue を sync で起票                        |
| 2026-07-25 | spec-lifecycle (clarify) | D5 解決: 新 ADR で 0004 を supersede、フローは Claude Design → 実装直結 (正本 = コード + Storybook)            |
| 2026-07-25 | spec-lifecycle (clarify) | D6 解決: 将来計画は Future Work 節へ一元化、C4 は L1/L2 維持で内容再設計 (要求決定 #4 を更新)。全論点解決      |
| 2026-07-25 | spec-review 対応         | gate レビュー指摘 3 件対応: feature doc 整合行 (D5 起因) を 2 テーブルへ追記、Content/Data の placeholder 是正 |
| 2026-07-25 | spec-lifecycle (diagram) | 清算 / closeout フロー図・検査スクリプトシーケンス・C4 L1/L2 再設計案 (D6) を生成                              |

## 備考

- 文書運用 issue のため appendix (api / database / authorization / screen-spec / testid) は取り込まない
