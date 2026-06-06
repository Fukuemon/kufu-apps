# ADR-0005: AI エージェントの hook PATH 解決を `$(ghq root)/<repo-path>` ベースに統一する

## 状態

承認

## 決定日

2026-06-06

## 背景

- 本リポは AI エージェント設定を [.rulesync/](.rulesync/) を単一正本として管理し、rulesync で **claudecode / codexcli / cursor** の3プロバイダへ生成している（[rulesync.jsonc](../rulesync.jsonc)）。hook 定義も [.rulesync/hooks.json](../.rulesync/hooks.json) が正本で、`.claude/settings.json` / `.codex/hooks.json` / `.cursor/hooks.json` へ**同一のコマンド文字列**として展開される。
- hook はリポジトリ直下の [hooks/](../hooks/) 配下のスクリプト（`protected-branch/pre_tool_use.py`、`markdown/format_markdown.sh`、`spec/validate_*.sh`）を呼ぶ。各プロバイダの hook runner は別物だが、単一ソースのため **コマンドはどの runner でも動く素のシェル式**でなければならない。
- 従来は hook スクリプトの絶対パスを `python3 "$(git rev-parse --show-toplevel)/hooks/..."` で解決していた。
- **観測された事故 (2026-06-06)**: Claude Code の Bash ツールで一度 `cd /tmp` した結果、以後の hook 実行時 cwd が `/tmp`（git repo 外）に固定され、`$(git rev-parse --show-toplevel)` が失敗 → スクリプトパスが空 → `Edit` / `Write` / `Bash` が全面ブロックされ、セッション内で自己回復不能になった。
- 根本原因は **hook コマンドを「実行時 cwd」起点で評価していること**。cwd が repo 外だと解決失敗、cwd が _別の_ git repo 内だと _別 repo の root を黙って返す_ 誤動作も起こり得る。

### 解決方式の制約（三すくみ）

hook コマンドは「① provider 非依存（単一ソース → 3プロバイダ）」「② cwd 非依存（本事故の回避）」「③ 環境ポータブル（CI / 非ghqクローン）」を同時に満たしたいが、各候補は2つしか満たさない:

| 候補                                        | ① provider 非依存 | ② cwd 非依存 | ③ 環境ポータブル       |
| ------------------------------------------- | :---------------: | :----------: | :--------------------- |
| `$(git rev-parse --show-toplevel)`（従来）  |        ✅         |      ❌      | ✅                     |
| `$CLAUDE_PROJECT_DIR`                       |   ❌ claude専用   |      ✅      | △                      |
| `$(ghq root)/github.com/Fukuemon/kufu-apps` |        ✅         |      ✅      | ❌ ghq前提・path直書き |

`$CLAUDE_PROJECT_DIR` は claudecode 以外で空になり、codexcli / cursor の生成物が破綻するため **単一ソースの恩恵を失う**（rulesync 方針と非整合）。

## 決定

- hook スクリプトの PATH 解決を **`$(ghq root)/github.com/Fukuemon/kufu-apps/<hook-path>`** ベースに統一する。`.rulesync/hooks.json` の全 hook コマンドを次の形に変更し、rulesync で再生成する。

  ```text
  python3 "$(ghq root)/github.com/Fukuemon/kufu-apps/hooks/protected-branch/pre_tool_use.py"
  bash    "$(ghq root)/github.com/Fukuemon/kufu-apps/hooks/markdown/format_markdown.sh"
  bash    "$(ghq root)/github.com/Fukuemon/kufu-apps/hooks/spec/validate_document.sh"
  bash    "$(ghq root)/github.com/Fukuemon/kufu-apps/hooks/spec/validate_prompts.sh"
  ```

- 根拠:
  - **規約一貫性**: [CLAUDE.md](../CLAUDE.md) の Repository Reference Rules が既に「本プロジェクトは ghq 管理」「path 記載は `$(ghq root)/<repository-path>/...` を優先」と宣言済み。hook を ghq ベースにするのは**新規依存の追加ではなく既存規約への一貫化**。
  - **cwd 完全非依存**: `ghq root` は cwd に依存せず固定の管理ルートを返すため、`cd` でどこに逸れても、別 repo 内にいても、常に正しい repo root を解決する（本事故を構造的に排除）。
  - **provider 非依存**: 素のシェル置換なので claudecode / codexcli / cursor のいずれの runner でも同一に動く。単一ソースを維持。
  - **ghq 依存の実害が小さい**: これらの hook は **AI エージェントのローカル実行時のみ**発火する。CI は hook を走らせないため「非 ghq な CI 環境」は実害なし。

## 代替案

- **`$CLAUDE_PROJECT_DIR` 単体**: cwd 非依存だが claudecode 専用。codexcli / cursor で空になり破綻 → 却下（rulesync 単一ソース非整合）。
- **ハイブリッド `${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}`**: 新規依存ゼロで観測事故（Claude の cwd ドリフト）を最小修正できるが、codex/cursor は git フォールバックのまま cwd 安定が前提で潜在的脆さが残る。また Claude 固有トークンが混じり可読性が落ちる → 今回は不採用（将来 ghq 非標準化時の代替候補として保持）。
- **ハイブリッド `${CLAUDE_PROJECT_DIR:-$(ghq root)/...}`**: 全 provider で cwd 完全非依存かつ Claude は ghq 不要で最も堅牢だが、最も複雑で2機構が混在 → over-engineering と判断し不採用。
- **生成時に絶対パスを埋め込む**: マシン固有パスが committed になり共有不能 → 却下。

## 影響

### 良い影響

- 今回のような cwd ドリフトによる hook 全面ブロックを構造的に排除（自己回復不能の deadlock 解消）。
- cwd が別 git repo 内のときに別 repo root を誤解決する潜在バグも排除。
- 既存の ghq 規約・path 表記規約と一貫し、設定の読み手の認知負荷が下がる。

### 悪い影響 / トレードオフ

- **ghq 必須**: ghq を使わず手動 clone した環境では `ghq root` が当該 repo を指さず hook が解決失敗する。本リポが ghq 管理を標準化している前提で許容する。
- **repo path 直書き**: `github.com/Fukuemon/kufu-apps` がコマンドに固定される。**fork / repo リネーム時は [.rulesync/hooks.json](../.rulesync/hooks.json) の更新 + 再生成が必要**（README / 移行手順に明記する）。
- ghq のインストールパス / バージョン差で `ghq root` の挙動が変わる可能性（通常は安定）。

## 実装・運用への反映

- 対象 app / package: なし（リポジトリ横断の AI エージェント設定）。変更対象は [.rulesync/hooks.json](../.rulesync/hooks.json) と生成物 `.claude/settings.json` / `.codex/hooks.json` / `.cursor/hooks.json`。
- 編集は **`rulesync-sync` skill 経由**で `.rulesync/hooks.json` を直し、各プロバイダへ再生成する（生成物の直接編集は禁止）。
- spec 更新要否: 不要。
- AI 向け設定更新要否: 要（本 ADR の主対象）。fork / リネーム時の更新手順を README 等に追記する。

## 関連ドキュメント

- `CLAUDE.md`: Repository Reference Rules（ghq 管理・`$(ghq root)/<repository-path>/...` 表記規約）
- `.rulesync/hooks.json`: hook 定義の単一正本
- `rulesync.jsonc`: 生成ターゲット（cursor / claudecode / codexcli）
- `hooks/`: 実体スクリプト群
- `adr/0001-terraform-infra-repository-boundary.md`: ghq 前提のリポジトリ境界
