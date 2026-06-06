# ADR-0004: デザイン制作ワークフローを Claude Design → Pencil.dev → AI Agent の3段構成で確定する

## 状態

提案

## 決定日

2026-06-06

## 背景

- コーポレートサイト (`apps/corporate-site`) のデザイン制作を本格化するにあたり、「ワイヤー作成 → デザインシステム定義 → 実装」をどのツールチェーンで回すかを確定する必要がある。
- 当初想定は **Claude Design（方向性・プロトタイプ）→ Pencil.dev（UI 調整）→ AI Agent（Claude Code / Codex で実装）** の3段。これが現フローに最適か、代替（Figma + MCP）と比較して判断したい。
- 現フローの制約: Astro 静的生成中心（最小 island）、デザインシステム正本は `packages/ui`（shadcn/ui ベース、トークンは `globals.css` の CSS 変数）、IA / サイトマップは issue #11 で確定済み。本リポは「正本は repo 内に置き、外部デザインファイルを committed にしない」方針を取る。
- デザインシステムの _中身_（配色 / タイポ / spacing 等のトークン）は issue #13 が担う。本 ADR はデザインを _どう作るか_ の **プロセス / ツール選定** を確定し、プラットフォーム共通の正本とする（issue #16）。
- リサーチ時点（2026-06）のツール状況:
  - **Claude Design**（Anthropic Labs, 2026-04 公開・research preview, Pro/Max/Team/Enterprise）: prompt-to-prototype。codebase / 画像 / ドキュメントを入力に design system を自動構築し以後自動適用。出力は自己完結 HTML アーティファクト。
  - **Pencil.dev**: IDE（VS Code / Cursor）内の canvas。MCP サーバ経由で Claude Code が canvas を読み pixel-perfect な React / HTML / CSS を生成。shadcn UI をビルトインサポート。`.pen` ファイルは純 JSON で Git バージョン管理可能。Figma からの貼り付け取り込み可。
  - **Figma + Figma MCP Server**（2026-03 に AI agent 双方向対応 GA）: code ↔ canvas を双方向同期。frame リンクから layout / styles / component / design token を構造化抽出し実装精度が高い。成熟度・コラボ最強。

## 決定

- デザイン制作ワークフローを次の **design-first** な単一フローに確定する。**デザインシステム正本は常に `packages/ui`（トークン + コンポーネント）とし、各ツールはこれを消費するだけで fork しない。**

  | Phase       | ツール               | 目的                                      | 成果の扱い                                   |
  | ----------- | -------------------- | ----------------------------------------- | -------------------------------------------- |
  | A0 依頼設計 | 手動 / Claude Code   | Claude Design 依頼文を組む                | `.prompt.md` を commit（再現性）             |
  | A 方向性    | Claude Design        | 方向性プロトを2〜3案出して比較・決定      | 使い捨て HTML。commit しない                 |
  | import      | Claude Design→Pencil | 採用案の HTML を Pencil canvas へ取り込む | 中間成果（`.pen` の元）                      |
  | B 収束      | Pencil + 内蔵 Agent  | canvas で pixel 精緻化し `.pen` を確定    | `.pen` + `images/` を commit（デザイン正本） |
  | C 実装      | Claude Code / Codex  | `.pen`(JSON)+デザインを参照して実装       | `.astro` / React（静的生成・最小 island）    |

- **デザイン → コードは一方向に確定**する。**Pencil へコードを round-trip しない**。理由: ① Pencil は `.astro` 非対応（React/Vue/Svelte/HTML のみ）で Astro 中心の本リポと噛み合わない ② Pencil の code↔design は AI 再生成で非可逆（複雑レイアウトで 4〜8px のズレ報告）。よって `.pen` をデザイン正本にし、コードは `.pen` から生成、デザイン変更は `.pen` を直してから該当コードを再生成する。
- **Pencil.dev を中核デザインツールとして採用**する。理由: ① IDE 内で動く ② shadcn ネイティブで `packages/ui` と整合 ③ `.pen` が JSON で Git 管理可能、本リポの「正本は repo 内」方針に合致 ④ トークンを `globals.css` から取り込み消費できる。
- **ディレクトリ規約を確定**する: Claude Design 仮置き = `design/.staging/`（gitignore）、デザイン正本 = `apps/<app>/design/<screen>.pen`（+ `images/`、commit）、実装 = `apps/<app>/src/`、トークン正本 = `packages/ui/src/styles/globals.css`。詳細は `context/design-workflow.md`。
- **Claude Design は phase A（発散）の補助**として採用する。非デザイナー（オーナー / PM）が方向性を素早く探索する用途に限定し、確定成果物の正本にはしない。
- **Figma + MCP は fallback** として位置づける。チームが既に Figma 主体である、または非エンジニアを含む共同デザインレビューが必要な場合に採用し、その際は Figma MCP で実装へハンドオフする。
- ツール導入の妥当性は、corporate-site の1ページで phase A→C を実走するパイロットで検証してから本採用とする。

## 代替案

### 1. Figma + MCP を中核に据える

#### Pros

- ツールとして最も成熟。design token / component の構造化抽出で実装精度が高い（well-structured なら ~90%）。
- 非エンジニア含む共同デザインレビュー・コメント運用が強い。

#### Cons

- デザイン正本が外部 SaaS に分散し、「正本は repo 内 / 外部デザインファイルを committed にしない」本リポ方針と摩擦する。
- Git ベースのバージョン管理・差分レビューが `.pen`（JSON）ほど自然に効かない。

### 2. 単一ツール（Pencil のみ / Claude Design のみ）で完結する

#### Pros

- 学習・運用コストが最小。フェーズ間の受け渡しロスがない。

#### Cons

- Claude Design 単独では precise な UI 確定・実装ハンドオフが弱い（出力が使い捨て HTML）。
- Pencil 単独では非デザイナーの発散・方向性探索の入口が弱く、白紙からの立ち上げが重い。
- 発散と収束は要求される性質が異なり、1ツールに寄せると一方が犠牲になる。

### 3. デザインツールを使わず AI Agent が直接実装する

#### Pros

- 中間成果物がなく、`packages/ui` から直接組み上げられる。

#### Cons

- 方向性・トーン&マナーの合意形成を可視化する場がなく、場当たり的になりやすい（Decision Priority「一貫性」を損なう）。
- 非エンジニアのレビュー・意思決定参加が難しい。

## 影響

### 良い影響

- 発散（Claude Design）と収束（Pencil）の役割が分離し、各フェーズの成果物の正本所在が一意になる。
- `.pen`(JSON) を Git 管理することで、デザインも repo 内正本としてバージョン管理できる（差分は描画/スクショで確認）。
- shadcn ネイティブな Pencil と `packages/ui` が整合し、実装コードが `@kufu/ui` トークンを自然に参照する。
- プラットフォーム共通フローのため、corporate-site 以降の app / feature でも再利用できる。

### 悪い影響 / トレードオフ

- Claude Design は research preview で、利用枠（Pro/Max/Team/Enterprise）確保と機能変動のリスクがある。
- Pencil.dev は Figma 比で成熟度が低く、想定外の制約に当たる可能性がある（パイロットで検証）。
- 3ツール運用のため学習・セットアップ（特に Pencil MCP）の初期コストが発生する。
- トークン正本を `packages/ui` に一元化する制約をツール側に守らせる運用規律が必要。
- `.pen` → コードは一方向のため、実装後にコードを直接変更すると `.pen` と drift する。`.pen` をデザイン正本として扱い、デザイン変更は `.pen` 起点で行う運用規律でカバーする。
- `.pen` は幾何ツリーで意味論を持たず、レスポンシブ / 状態 / 動的データ / 実コンテンツも表現しにくい。実装時に `@kufu/ui` への写像と spec/feature doc での補完が必須（緩和策は context/design-workflow.md §8）。
- `.pen`(JSON) の座標差分は PR で読みづらく、レビューはレンダリング/スクショ依存になる。`.pen` をトークン源泉にしない（一方向 `packages/ui` → Pencil）governance が必要。

### 影響範囲

- apps への影響: `apps/corporate-site`（最初の適用対象）、将来の app へ横展開
- packages への影響: `packages/ui`（デザインシステム正本として全フェーズが参照）
- デザインワークフローへの影響: 本 ADR が新規にプロセスを定義する（context/design-workflow.md が運用正本）

## 実装・運用への反映

- 対象: `apps/corporate-site`、`packages/ui`、`context/design-workflow.md`
- ツール導入: Claude Design アクセス枠の確保、Pencil + MCP のセットアップ（論点 #16-1 / #16-2）
- 検証: corporate-site 1ページでの phase A→C パイロット実走後に本採用判断

## 関連チケット / PR

- issue #16: 本 ADR の起点（デザイン制作ワークフロー確定）
- issue #13: デザインシステム（トークン）の中身定義
- issue #11: IA / サイトマップ（確定済み）
- issue #10: corporate-site 本体実装（Blocks）
- issue #6: Storybook 導線整備
- `context/design-workflow.md`: 確定ワークフローの運用正本
