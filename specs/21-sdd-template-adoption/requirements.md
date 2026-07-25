# sdd-template SDD 基盤移植 要求定義

## 要求フェーズ状況

`/requirements-full` 用。状態は `未着手 / 進行中 / 完了 / レビュー済 / 保留` のいずれか。
保留の場合は理由(ユーザー判断待ち等)を備考に記載する。

| #   | フェーズ           | 状態 | 最終更新   | 備考                    |
| --- | ------------------ | ---- | ---------- | ----------------------- |
| 1   | 受付               | 完了 | 2026-06-14 |                         |
| 2   | 下書き             | 完了 | 2026-06-14 |                         |
| 3   | スコープ/成功条件  | 完了 | 2026-06-14 |                         |
| 4   | 業務仕様           | 完了 | 2026-06-14 |                         |
| 5   | バリデーション方針 | 完了 | 2026-06-14 |                         |
| 6   | 権限要件           | 完了 | 2026-06-14 | 対象外                  |
| 7   | 監査/非機能        | 完了 | 2026-06-14 |                         |
| 8   | 未決事項解消       | 完了 | 2026-06-14 |                         |
| 9   | 最終レビュー       | 完了 | 2026-06-14 | format / lint 確認済    |
| 10  | 公開/同期          | 完了 | 2026-06-14 | GitHub Issue #21 起票済 |

## チケット情報

- 起点: 自由文
- チケットID: #21
- トラッカー: GitHub
- URL: https://github.com/Fukuemon/kufu-apps/issues/21

## 背景・目的

`kufu-apps` の SDD workflow は、現状プロジェクト固有値が `.rulesync/rules/CLAUDE.md` に直書きされている。一方、`sdd-template` は `context/project.yml` をプロジェクト固有値の唯一の正本とし、skills / templates / rules が固有値を直接持たない構成になっている。

`sdd-template` の構成を `kufu-apps` へ適用し、今後の SDD workflow 改善を取り込みやすくする。あわせて Kufu 固有の design workflow は失わず、`context/project.yml` と既存 context に退避・明文化する。

## 想定ユーザー/ステークホルダー

- `kufu-apps` で spec-driven development を行う開発者
- Codex / Claude / Cursor などの AI agent
- `sdd-template` を保守し、各 repository に展開する運用者

## 提供価値(成功条件)

- AI agent が Kufu 固有値と SDD 共通ルールを混同しない。
- `sdd-template` 由来の skill / template 更新を追従しやすくなる。
- `kufu-apps` 固有の `design-prompt` / `context/design-workflow.md` を維持したまま、SDD 基盤だけを抽象化できる。
- `.rulesync/` を正本として provider 生成物を一貫して更新できる。

## スコープ

### やること

- `context/project.yml` を追加し、repository path、commands、naming、対象ドメイン、Issue Tracker、Source of Truth、Templates、Decision Priority を Kufu 向けに記述する。
- `.rulesync/rules/CLAUDE.md` を `sdd-template` 型へ寄せ、プロジェクト固有値の直書きを `context/project.yml` 参照へ移す。
- `.rulesync/skills` の SDD 共通 skill / workflow skill を `sdd-template` ベースへ更新する。
- `context-bootstrap` / `design-doc` / `styleguide-documents` skill を追加する。
- `design-prompt` と `context/design-workflow.md` は Kufu 固有 workflow として維持し、agent contract から参照できる状態にする。
- `templates/context/`, `templates/prd/`, `templates/design-doc/` を追加する。
- 既存の `templates/specs`, `templates/requirements`, `templates/features`, `templates/adr` は `sdd-template` 版を基準に更新する。
- `rulesync-sync` 経由で `AGENTS.md` / `CLAUDE.md` / `.codex/` / `.claude/` / `.cursor/` を再生成する。

### やらないこと

- `sdd-template` repository 自体の変更。
- Kufu の Design Doc Why / What / landscape / ADR の内容刷新。
- `apps/` や `packages/` の実装コード変更。
- Kufu 固有の design workflow の削除。
- provider 生成物の手動編集。

## 業務ルール

| #   | ルール                                           | 理由                                               | 備考                                                 |
| --- | ------------------------------------------------ | -------------------------------------------------- | ---------------------------------------------------- |
| 1   | SDD 共通ルールは `sdd-template` を基準にする     | template 追従を容易にするため                      | `.rulesync/skills`, `templates`, root rule が主対象  |
| 2   | Kufu 固有値は `context/project.yml` を正本にする | skill / rule への project 固有値直書きを避けるため | commands, tracker, domains, paths を集約             |
| 3   | Kufu 固有 workflow は context に残す             | design workflow を失わないため                     | `design-prompt`, `context/design-workflow.md` を維持 |
| 4   | AI provider 生成物は `.rulesync/` から生成する   | generated artifact の drift を防ぐため             | `rulesync-sync` に従う                               |

## 入出力要件

### 入力

| #   | 項目               | 必須/任意 | 形式         | 制約/備考                                      |
| --- | ------------------ | --------- | ------------ | ---------------------------------------------- |
| 1   | 参照元 repository  | 必須      | path         | `$(ghq root)/github.com/Fukuemon/sdd-template` |
| 2   | 適用先 repository  | 必須      | path         | `$(ghq root)/github.com/Fukuemon/kufu-apps`    |
| 3   | Kufu 固有 workflow | 必須      | docs / skill | `design-prompt`, `context/design-workflow.md`  |
| 4   | Issue tracker      | 必須      | GitHub       | `Fukuemon/kufu-apps`                           |

### 出力

| #   | 出力                                             | 条件                   | 備考                                                         |
| --- | ------------------------------------------------ | ---------------------- | ------------------------------------------------------------ |
| 1   | `specs/21-sdd-template-adoption/requirements.md` | Issue 起票後           | 起票前は `specs/draft-sdd-template-adoption/requirements.md` |
| 2   | `context/project.yml`                            | 実装時                 | Kufu 固有値の正本                                            |
| 3   | `.rulesync/` 更新                                | 実装時                 | rules / skills / hooks / permissions 等                      |
| 4   | `templates/` 更新                                | 実装時                 | `sdd-template` ベース                                        |
| 5   | provider 生成物                                  | `rulesync generate` 後 | `AGENTS.md`, `CLAUDE.md`, `.codex/`, `.claude/`, `.cursor/`  |

## 例外シナリオ

| #   | シナリオ                                             | ユーザーへの見せ方                               | 代替手段                                                |
| --- | ---------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| 1   | `sdd-template` と `kufu-apps` の workflow が衝突する | 衝突箇所と採用方針を差分として提示する           | 共通部分は template、Kufu 固有部分は context に分離する |
| 2   | `rulesync generate` が失敗する                       | エラー原因と対象 `.rulesync/` ファイルを提示する | 生成物を手編集せず `.rulesync/` を修正して再実行する    |
| 3   | GitHub label が存在しない                            | Issue は起票し、label 未付与を報告する           | label 整備を別 task にする                              |

## バリデーション方針（業務観点）

| #   | 対象                | ルール                                                          | エラー時の扱い                                 |
| --- | ------------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| 1   | agent contract      | 固有値は `context/project.yml` 参照になっている                 | `.rulesync/rules/CLAUDE.md` を修正する         |
| 2   | skills              | skill 本体に project 固有 path / CLI / framework を直書きしない | 該当 skill を `context/project.yml` 参照に戻す |
| 3   | generated artifacts | `.rulesync/` の意図と生成先差分が一致する                       | `rulesync generate` を再実行し、差分を確認する |
| 4   | Kufu 固有 workflow  | `design-prompt` / `context/design-workflow.md` が維持されている | context 参照を追加する                         |

## 権限要件

この要求ではアプリケーション権限や利用者ロールは扱わない。

| #   | 機能              | ロール                | 許可/条件                          | 根拠                   |
| --- | ----------------- | --------------------- | ---------------------------------- | ---------------------- |
| 1   | GitHub Issue 起票 | repository maintainer | `gh issue create` が実行できること | Spec Workflow Contract |

## 監査/非機能要件

### 監査・運用

- `requirements.md` と GitHub Issue に背景、実施内容、完了条件を残す。
- `.rulesync/` と provider 生成物の差分を review 可能にする。

### 非機能(性能/可用性/セキュリティ/保守)

- 実装コードや runtime behavior には影響を与えない。
- provider 生成物を手動編集せず、保守時の drift を抑える。
- `sdd-template` 更新追従時に差分確認しやすい構造にする。

## 未決事項（論点）

| #   | 論点                                                      | 決定者     | 期限   | 状態   | メモ                                                      |
| --- | --------------------------------------------------------- | ---------- | ------ | ------ | --------------------------------------------------------- |
| 1   | `sdd-template` との差分のうち Kufu 固有として残す追加項目 | repo owner | 実装中 | 解決済 | `design-prompt` / `context/design-workflow.md` は維持する |
| 2   | Issue 粒度                                                | repo owner | 起票前 | 解決済 | 1 issue で移植する                                        |

## 設計着手条件チェック

- [x] 業務ルールが確定している
- [x] 入出力要件が確定している
- [x] 例外シナリオが確定している
- [x] バリデーション方針が確定している
- [x] 権限要件が確定している（記述がある場合はマスター突合済）
- [x] 監査/非機能要件が確定している
- [x] 未決事項がゼロ、または担当者・期限付きで管理されている

## 既存資料からの変更点

| 対象                        | 変更内容                                                   | 理由                                     |
| --------------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| `.rulesync/rules/CLAUDE.md` | Kufu 固有値の直書きを `context/project.yml` 参照へ変更する | SDD workflow の抽象化                    |
| `context/`                  | `project.yml` を追加し、既存 context との役割を整理する    | プロジェクト固有値の正本化               |
| `.rulesync/skills`          | `sdd-template` の共通 skill 構成へ更新する                 | template 追従性向上                      |
| `templates/`                | `sdd-template` の template 構成へ更新する                  | spec / design / context の scaffold 統一 |

## 変更履歴

| 日付       | 変更者 | 変更内容                       |
| ---------- | ------ | ------------------------------ |
| 2026-06-14 | Codex  | 初版作成                       |
| 2026-06-14 | Codex  | Issue #21 起票と検証結果を反映 |

## 備考

### 非対象（開発設計で扱う）

- アプリケーション実装
- DDL / ER 図
- API エンドポイント・JSON 詳細
- 認可 matrix
