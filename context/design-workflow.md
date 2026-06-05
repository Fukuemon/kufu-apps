# Design Production Workflow

> 最終更新: 2026-06-06

デザイン制作（ワイヤー作成 → デザインシステム適用 → 実装）の **プラットフォーム共通ワークフロー** を定める横断契約。ツール選定の意思決定根拠は [ADR-0004](../adr/0004-design-production-workflow.md)、デザインシステムの _中身_（トークン）は [design system foundation (#13)](https://github.com/Fukuemon/kufu-apps/issues/13) が正本。本書は _どう作るか_ の運用正本。

## 大原則

- **デザインシステム正本は `packages/ui`**（トークン = [`globals.css`](../packages/ui/src/styles/globals.css) の CSS 変数 + コンポーネント）。各ツールはこれを **消費** するだけで fork しない。
- 発散（方向性探索）と収束（UI 確定）は性質が異なるため、フェーズごとにツールを使い分ける。
- durable な設計判断（IA / レイアウト / フロー / アーキ判断）は最終的に [design/features/](../design/features/) と `packages/ui` トークンへ back-propagate し、design 側を正本にする。

## フェーズとツール

| Phase               | ツール                  | 目的                                                             | 入力                         | 成果物の扱い                                          |
| ------------------- | ----------------------- | ---------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------- |
| A 発散（方向性）    | **Claude Design**       | 既存トークン/コンポを踏まえた方向性プロトを2〜3案                | repo / 画像 / 言語化した要件 | 使い捨て HTML。方向性決定のみ採用し **commit しない** |
| B 収束（UI 構造化） | **Pencil.dev**          | 採用方向を `packages/ui` コンポへマッピングし pixel レベルで確定 | phase A の方向性 + IA (#11)  | `.pen`(JSON) を repo に **commit**（Git 管理）        |
| C 実装              | **Claude Code / Codex** | Pencil MCP で canvas を読み Astro + `@kufu/ui` 実装を生成        | `.pen` + design feature doc  | 実装コード。設計判断は design 側へ back-propagate     |

### Phase A — Claude Design（発散）

- codebase を入力に与え、既存の `packages/ui` トークン/コンポを踏まえた方向性を出させる。
- 非デザイナー（オーナー / PM）が方向性を素早く比較・決定する用途に限定する。
- 出力（自己完結 HTML）は**正本にしない**。決定した方向性のみを phase B へ引き継ぐ。

### Phase B — Pencil.dev（収束）

- IDE（VS Code / Cursor）内 canvas で、採用方向を `packages/ui`（shadcn ネイティブ）のコンポーネントへマッピングしながら pixel レベルで確定する。
- `.pen` ファイルは純 JSON のため **repo に commit して Git 管理**する（差分レビュー可能）。外部 SaaS にデザイン正本を置かない方針に合致。

### Phase C — AI Agent（実装）

- Pencil MCP サーバ経由で Claude Code / Codex が canvas を読み、Astro + `@kufu/ui` の実装を生成する。
- 生成コードは `@kufu/ui` のトークン/コンポーネントを参照すること（独自値を散在させない）。
- 性能方針（Astro 静的生成・最小 island）は [architecture.md](architecture.md) / [toolchain.md](toolchain.md) に従う。

## Claude Design → Pencil の受け渡し（変換）

Claude Design の export は **.zip / standalone HTML（fonts・画像・ブランド資産を全てインライン化した単一 .html）/ Handoff to Claude Code（design intent・component 構造・styling を含む handoff bundle）** などがある。Pencil の「Code → Design」import は、**同一 workspace 上のコード/ファイルを AI チャット（Cmd/Ctrl+K）で `Recreate the X component from <path>` のように指示して canvas へ取り込む**方式。raw HTML を直接読む専用 import ではなく「workspace 内のファイルを AI が参照して再現する」点が肝。したがって最適解は2ルート:

- **ルート1（コードファースト・推奨）**: Claude Design → **Handoff to Claude Code** → Claude Code がリポ内に実コンポーネント（Astro + `@kufu/ui` 参照）を生成 → Pencil で「Code → Design」import し canvas で精緻化 → コードへ反映。Claude Design 出力を早期に実装正本へ落とすため drift が最小。
- **ルート2（アーティファクトファースト）**: Claude Design → **standalone HTML** を後述の仮置き場へ出力 → Pencil の AI に「この HTML を再現して」と指示し `.pen` 化 → 精緻化 → コード生成。方向性を視覚のまま持ち込みたい時に使う。

### 仮置き場（staging）

Claude Design 出力は phase A の使い捨て成果なので、**`.pen` や実装コードと混ざらない一時置き場**を用意する。`design/.staging/`（gitignore 推奨）か `specs/<issue>/mocks/` に置き、採用したものだけ phase B/C へ送る。**Claude Design の HTML 自体は正本にしない（commit しない）**。

## ファイル構成

- **`.pen` ファイル**: JSON ベース・version-control friendly。**1プロジェクト＝複数 `.pen` 可**で、`dashboard.pen` / `components.pen` のように目的別に分割してよい。コードと同じ workspace に置き Git 管理する。
- **アセット**: 生成画像は `.pen` と同階層の `images/` に保存される（相対参照）。effect 等も `.pen` からの相対パス参照。
- **変数（tokens）**: Pencil の変数は **CSS custom properties にマップ**できる。`Create Pencil variables from my globals.css` で [`packages/ui/src/styles/globals.css`](../packages/ui/src/styles/globals.css) のトークンを取り込み、視覚編集してコードへ同期可能。→ `packages/ui` を正本に保ったまま Pencil 側で消費できる。

推奨配置（例）: 対象 app/feature の近くに `*.pen` と `images/` を置く（例: `apps/corporate-site/design/home.pen`）。トークンの正本はあくまで `packages/ui`。

## shadcn/ui で表現できないデザインの場合

shadcn/ui は **コードを自分のリポに copy して所有する**モデルなので、「表現できない＝行き止まり」にはならない。優先順:

1. **トークンで寄せる**: 配色・radius・spacing・typography は `packages/ui` の `globals.css` セマンティックトークン（`--primary` 等）の上書きで、コンポーネントを書き換えずに見た目を大きく変えられる。
2. **既存コンポを直接編集**: 所有コードなので CVA の variant 追加・マークアップ変更で拡張する。
3. **wrapper パターン**: 既存コンポにロジック/レイアウトを足す場合は、base を直接汚さず wrapper で包む。
4. **独自コンポーネントを新設**: shadcn の流儀（CVA variants・セマンティックトークン・アクセシビリティは Radix primitives）に沿って `packages/ui` に新規追加する。これが「独自デザインシステムの定義」に相当するが、**別システムを並立させるのではなく `packages/ui` の中で拡張する**（[architecture.md](architecture.md) の colocation→昇格ルールに従う）。

要するに **「shadcn/ui の拡張」と「独自デザインシステム」は対立せず、`packages/ui` を単一正本として token → primitive → 独自コンポと積み上げる**。Figma 由来トークンを使う場合も Tailwind theme / `globals.css` に 1:1 マッピングして drift を防ぐ。

## トークン正本ガード（バリデーション）

- 実装コードが `@kufu/ui` トークンを参照しているか確認する。独自値を検出したら正本へ寄せる。
- デザイン成果物が `packages/ui` を fork していないか確認する。fork を検出したら差し戻す。

## Figma fallback

- チームが既に Figma 主体である、または非エンジニアを含む共同デザインレビューが必要な場合は **Figma + Figma MCP Server** を採用してよい。
- その場合も**正本は `packages/ui`**。Figma frame リンクから MCP 経由で実装へハンドオフし、design 判断は design feature doc へ反映する。

## 運用上の注意

- Claude Design は research preview（利用枠 Pro/Max/Team/Enterprise、機能変動リスク）。枠が確保できない場合は phase A を Pencil/Figma で代替する。
- 本ワークフローは corporate-site の1ページでパイロット実走して検証してから本採用する。パイロットでは Claude Design→Pencil の変換を上記2ルート両方で試し、どちらを既定にするか決める。
- ツール選定を変える場合は [ADR-0004](../adr/0004-design-production-workflow.md) を更新してから本書を改訂する。
