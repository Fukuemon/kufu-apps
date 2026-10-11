# ADR-0005: AI エージェントの hook の PATH の解決を `$(ghq root)/<repo-path>` ベースに統一する

## Status

承認

## Context

- 本リポは AI エージェントの設定を `.rulesync/` を単一の基準として管理し、rulesync で **claudecode / codexcli / cursor** の 3 つのプロバイダへ生成している（`rulesync.jsonc`）。
  - hook の定義も `.rulesync/hooks.json` が基準で、`.claude/settings.json` / `.codex/hooks.json` / `.cursor/hooks.json` へ**同一のコマンド文字列**として展開される。
- hook は、リポジトリ直下の `hooks/` 配下のスクリプト（`protected-branch/pre_tool_use.py`、`markdown/format_markdown.sh`、`spec/validate_*.sh`）を呼ぶ。
  - 各プロバイダの hook runner は実装が異なるが、ソースが 1 つのため、**コマンドはどの runner でも動く素のシェル式**でなければならない。
- 従来は、hook のスクリプトの絶対パスを `python3 "$(git rev-parse --show-toplevel)/hooks/..."` で解決していた。
- **観測された障害**: Claude Code の Bash ツールで一度 `cd /tmp` した結果、以後の hook の実行時の cwd が `/tmp`（git repo の外）に固定された。
  - `$(git rev-parse --show-toplevel)` が失敗し、スクリプトのパスが空になった。
  - `Edit` / `Write` / `Bash` が全面的にブロックされ、セッション内で自己回復できなくなった。
- 根本原因は、**hook のコマンドを「実行時の cwd」を起点に評価していること**である。
  - cwd が repo の外だと解決に失敗する。
  - cwd が _別の_ git repo 内だと、_エラーを出さずに別の repo の root を返す_ 誤動作も起こりうる。

hook のコマンドは、次の 3 つを同時に満たしたいが、各候補は 2 つしか満たさない（三すくみ）。

1. provider に依存しない（単一のソース → 3 つのプロバイダ）。
2. cwd に依存しない（観測された障害の回避）。
3. 環境をまたいで動く（CI / ghq を使わないクローン）。

| 候補                                        | ① provider 非依存         | ② cwd 非依存 | ③ 環境ポータブル                        |
| ------------------------------------------- | ------------------------- | ------------ | --------------------------------------- |
| `$(git rev-parse --show-toplevel)`（従来）  | 満たす                    | 満たさない   | 満たす                                  |
| `$CLAUDE_PROJECT_DIR`                       | 満たさない（claude 専用） | 満たす       | 一部                                    |
| `$(ghq root)/github.com/Fukuemon/kufu-apps` | 満たす                    | 満たす       | 満たさない（ghq が前提・path を直書き） |

`$CLAUDE_PROJECT_DIR` は claudecode 以外で空になり、codexcli / cursor の生成物が動かなくなる。  
そのため、**ソースを 1 つにする恩恵を失う**（rulesync の方針と整合しない）。

## Decision

- hook のスクリプトの PATH の解決を、**`$(ghq root)/github.com/Fukuemon/kufu-apps/<hook-path>`** ベースに統一する。
  - `.rulesync/hooks.json` の全 hook のコマンドを次の形に変更し、rulesync で再生成する。

  ```text
  python3 "$(ghq root)/github.com/Fukuemon/kufu-apps/hooks/protected-branch/pre_tool_use.py"
  bash    "$(ghq root)/github.com/Fukuemon/kufu-apps/hooks/markdown/format_markdown.sh"
  bash    "$(ghq root)/github.com/Fukuemon/kufu-apps/hooks/spec/validate_document.sh"
  bash    "$(ghq root)/github.com/Fukuemon/kufu-apps/hooks/spec/validate_prompts.sh"
  ```

- 根拠は次の 4 つ。
  - **規約との一貫性**: hook を ghq ベースにするのは、**新しい依存の追加ではなく、既存の規約への一貫化**である。
    - `CLAUDE.md` の Repository Reference Rules が、既に「本プロジェクトは ghq 管理」「path の記載は `$(ghq root)/<repository-path>/...` を優先」と宣言している。
    - ADR-0001: [infra repo の配置先も ghq を前提にする](0001-terraform-infra-repository-boundary.md)
  - **cwd に完全に依存しない**: `ghq root` は cwd に依存せず、固定の管理ルートを返す。
    - `cd` でどこに逸れても、別の repo 内にいても、常に正しい repo root を解決する（観測された障害を構造的に排除する）。
  - **provider に依存しない**: 素のシェルの置換なので、claudecode / codexcli / cursor のいずれの runner でも同一に動く。
    - ソースを 1 つに保つ。
  - **ghq への依存の実害が小さい**: これらの hook は、**AI エージェントのローカルでの実行時だけ**発火する。
    - CI は hook を実行しないため、「ghq を使わない CI の環境」での実害はない。

## Considered Options

| 選択肢                                                                             | 強み                                                                               | 弱み                                                                                                                                                                                                               |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **採用:** `$(ghq root)/github.com/Fukuemon/kufu-apps/<hook-path>` ベースに統一する | provider と cwd のどちらにも依存しない。既存の ghq の規約と一貫する                | ghq が必須になる。repo の path をコマンドに直書きする                                                                                                                                                              |
| `$CLAUDE_PROJECT_DIR` 単体                                                         | cwd に依存しない                                                                   | claudecode 専用。codexcli / cursor で空になり、生成物が動かなくなる。rulesync の単一ソースと整合しないため却下                                                                                                     |
| ハイブリッド `${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}`             | 新しい依存がゼロで、観測された障害（Claude の cwd のドリフト）を最小の修正で直せる | codex/cursor は git のフォールバックのままで、cwd が安定する前提の潜在的な脆さが残る。Claude 固有のトークンが混じり、可読性が落ちる。今回は不採用とし、将来 ghq を標準にしなくなったときの代替の候補として保持する |
| ハイブリッド `${CLAUDE_PROJECT_DIR:-$(ghq root)/...}`                              | 全 provider で cwd に完全に依存せず、Claude は ghq が不要で最も堅牢                | 最も複雑で、2 つの機構が混在する。over-engineering と判断し不採用                                                                                                                                                  |
| 生成時に絶対パスを埋め込む                                                         | 記載なし                                                                           | マシン固有のパスが committed になり、共有できないため却下                                                                                                                                                          |

## Consequences

### Positive

- cwd のドリフトによる hook の全面的なブロックを、構造的に排除する（自己回復できない deadlock を解消する）。
- cwd が別の git repo 内にあるとき、別の repo root を誤って解決する潜在的なバグも排除する。
- 既存の ghq の規約・path の表記の規約と一貫し、設定の読み手の認知負荷が下がる。

### Negative

- **ghq が必須になる**: ghq を使わず手動で clone した環境では、`ghq root` が当該の repo を指さず、hook の解決に失敗する。
  - 本リポが ghq 管理を標準にしている前提で許容する。
- **repo の path を直書きする**: `github.com/Fukuemon/kufu-apps` がコマンドに固定される。
  - **fork / repo のリネームのときは、`.rulesync/hooks.json` の更新と再生成が必要になる**（README / 移行の手順に明記する）。
- ghq のインストールのパス / バージョンの差で、`ghq root` の挙動が変わる可能性がある（通常は安定）。
