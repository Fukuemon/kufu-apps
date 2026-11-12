# ADR-0012: デザイン制作のワークフローを Claude Design → Pencil.dev → AI Agent の 3 段構成で確定する

## Status

ADR-0012 に置換

## Context

- コーポレートサイト（`apps/corporate-site`）のデザイン制作を本格化するにあたり、「ワイヤー作成 → デザインシステムの定義 → 実装」をどのツールチェーンで回すかを確定する必要がある。
- 当初の想定は、**Claude Design（方向性・プロトタイプ）→ Pencil.dev（UI の調整）→ AI Agent（Claude Code / Codex で実装）** の 3 段である。
  - これが現フローに最適かを、代替（Figma + MCP）と比較して判断したい。
- 現フローの制約は次のとおり。
  - Astro の静的生成が中心で、island は最小にする。
  - デザインシステムの基準は `packages/ui`（shadcn/ui ベース、トークンは `globals.css` の CSS 変数）である。
  - IA / サイトマップは確定済みである。
  - 本リポは「基準は repo 内に置き、外部のデザインファイルを committed にしない」方針を取る。
- デザインシステムの _中身_（配色 / タイポ / spacing 等のトークン）は、別の issue が担う。
  - ADR-0007: [デザイントークンの体系](0007-design-token-architecture.md)
- 本 ADR は、デザインを _どう作るか_ の **プロセス / ツールの選定** を確定し、プラットフォーム共通の基準とする。
- 調べたときのツールの状況は次のとおり。
  - **Claude Design**（Anthropic Labs, research preview, Pro/Max/Team/Enterprise）: prompt-to-prototype。codebase / 画像 / ドキュメントを入力に design system を自動で構築し、以後自動で適用する。出力は自己完結の HTML アーティファクト。
  - **Pencil.dev**: IDE（VS Code / Cursor）内の canvas。MCP サーバ経由で Claude Code が canvas を読み、pixel-perfect な React / HTML / CSS を生成する。shadcn UI をビルトインでサポートする。`.pen` ファイルは純 JSON で、Git でバージョン管理できる。Figma からの貼り付けで取り込める。
  - **Figma + Figma MCP Server**（AI agent との双方向の対応が GA）: code と canvas を双方向に同期する。frame のリンクから layout / styles / component / design token を構造化して抽出し、実装の精度が高い。成熟度とコラボは最も強い。

## Decision

- デザイン制作のワークフローを、次の **design-first** な単一のフローに確定する。
  - **デザインシステムの基準は常に `packages/ui`（トークン + コンポーネント）とし、各ツールはこれを消費するだけで fork しない。**

  | Phase       | ツール                 | 目的                                         | 成果の扱い                                     |
  | ----------- | ---------------------- | -------------------------------------------- | ---------------------------------------------- |
  | A0 依頼設計 | 手動 / Claude Code     | Claude Design への依頼文を組む               | `.prompt.md` を commit（再現性）               |
  | A 方向性    | Claude Design          | 方向性のプロトを 2〜3 案出して比較・決定     | 使い捨ての HTML。commit しない                 |
  | import      | Claude Design → Pencil | 採用案の HTML を Pencil の canvas へ取り込む | 中間成果（`.pen` の元）                        |
  | B 収束      | Pencil + 内蔵の Agent  | canvas で pixel を精緻化し `.pen` を確定     | `.pen` + `images/` を commit（デザインの基準） |
  | C 実装      | Claude Code / Codex    | `.pen`（JSON）とデザインを参照して実装       | `.astro` / React（静的生成・最小の island）    |

- **デザイン → コードは一方向に確定する。Pencil へコードを round-trip しない。**
  - 理由の 1 つめ: Pencil は `.astro` に対応せず（React/Vue/Svelte/HTML のみ）、Astro が中心の本リポと噛み合わない。
  - 理由の 2 つめ: Pencil の code↔design は AI の再生成で非可逆である（複雑なレイアウトで 4〜8px のズレの報告がある）。
  - よって `.pen` をデザインの基準にし、コードは `.pen` から生成し、デザインの変更は `.pen` を直してから該当するコードを再生成する。
- **Pencil.dev を中核のデザインツールとして採用する。** 理由は次の 4 つ。
  - IDE 内で動く。
  - shadcn ネイティブで、`packages/ui` と整合する。
  - `.pen` が JSON で Git で管理でき、本リポの「基準は repo 内」の方針に合う。
  - トークンを `globals.css` から取り込んで消費できる。
- **ディレクトリの規約を確定する。**
  - デザインの成果物（依頼文 / `.pen` / `images/`）は `design/features/<feature>/` 以下に集約する（commit）。
  - Claude Design の仮置きは `design/.staging/`（gitignore）とする。
  - 実装は `apps/<app>/src/` とする。
  - トークンの基準は `packages/ui/src/styles/globals.css` とする。
- **Claude Design は phase A（発散）の補助として採用する。**
  - 非デザイナー（オーナー / PM）が方向性を素早く探索する用途に限り、確定した成果物の基準にはしない。
- **Figma + MCP は fallback として位置づける。**
  - チームが既に Figma 主体である場合、または非エンジニアを含む共同のデザインレビューが必要な場合に採用し、その際は Figma MCP で実装へハンドオフする。
- ツールの導入の妥当性は、corporate-site の 1 ページで phase A→C を実走するパイロットで検証してから本採用とする。

## Considered Options

| 選択肢                                                                                                    | 強み                                                                                                                                                                                                  | 弱み                                                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** Claude Design（発散）→ Pencil.dev（収束、`.pen` をデザインの基準）→ AI Agent（実装）の 3 段構成 | 発散と収束の役割が分離し、各フェーズの成果物の基準の所在が一意になる。`.pen`（JSON）を Git で管理し、デザインも repo 内でバージョン管理できる。shadcn ネイティブな Pencil と `packages/ui` が整合する | Claude Design は research preview で、利用枠と機能の変動のリスクがある。Pencil.dev は Figma より成熟度が低い。3 つのツールを運用するため、学習とセットアップの初期コストが発生する                                                                                   |
| Figma + MCP を中核に据える                                                                                | ツールとして最も成熟している。design token / component の構造化した抽出で実装の精度が高い（well-structured なら ~90%）。非エンジニアを含む共同のデザインレビュー・コメントの運用が強い                | デザインの基準が外部の SaaS に分散し、「基準は repo 内 / 外部のデザインファイルを committed にしない」本リポの方針と摩擦する。Git ベースのバージョン管理・差分のレビューが `.pen`（JSON）ほど自然に機能しない                                                        |
| 単一のツール（Pencil のみ / Claude Design のみ）で完結する                                                | 学習・運用のコストが最小。フェーズの間の受け渡しのロスがない                                                                                                                                          | Claude Design 単独では、precise な UI の確定・実装へのハンドオフが弱い（出力が使い捨ての HTML）。Pencil 単独では、非デザイナーの発散・方向性の探索の起点が弱く、白紙からの立ち上げが重い。発散と収束は要求される性質が異なり、1 つのツールに寄せると一方が犠牲になる |
| デザインツールを使わず AI Agent が直接実装する                                                            | 中間の成果物がなく、`packages/ui` から直接組み上げられる                                                                                                                                              | 方向性・トーン&マナーの合意形成を可視化する場がなく、場当たり的になりやすい（[判断の優先順位](../design/DesignDoc.md#判断の優先順位)の「一貫性」を損なう）。非エンジニアがレビュー・意思決定に参加しにくい                                                           |

## Consequences

### Positive

- 発散（Claude Design）と収束（Pencil）の役割が分離し、各フェーズの成果物の基準の所在が一意になる。
- `.pen`（JSON）を Git で管理することで、デザインも repo 内の基準としてバージョン管理できる（差分は描画/スクショで確認）。
- shadcn ネイティブな Pencil と `packages/ui` が整合し、実装のコードが `@kufu/ui` のトークンを自然に参照する。
- プラットフォーム共通のフローのため、corporate-site 以降の app / feature でも再利用できる。

### Negative

- Claude Design は research preview で、利用枠（Pro/Max/Team/Enterprise）の確保と機能の変動のリスクがある。
- Pencil.dev は Figma より成熟度が低く、想定外の制約に当たる可能性がある（パイロットで検証）。
- 3 つのツールを運用するため、学習・セットアップ（特に Pencil MCP）の初期コストが発生する。
- トークンの基準を `packages/ui` に一元化する制約を、ツールの側に守らせる運用の規律が必要になる。
- `.pen` → コードは一方向のため、実装の後にコードを直接変更すると `.pen` と drift する。
  - `.pen` をデザインの基準として扱い、デザインの変更は `.pen` を起点に行う運用の規律でカバーする。
- `.pen` は幾何のツリーで意味論を持たず、レスポンシブ / 状態 / 動的データ / 実コンテンツも表現しにくい。
  - 実装のときに `@kufu/ui` への写像と、spec / feature doc での補完が必須になる。
- `.pen`（JSON）の座標の差分は PR で読みづらく、レビューはレンダリング/スクショに依存する。
  - `.pen` をトークンの源泉にしない（一方向 `packages/ui` → Pencil）governance が必要になる。
