# ADR-0007: デザイントークンを 2 層構造 + shadcn 語彙で再設計し 3 entry で配信する

## 状態

承認

## 決定日

2026-06-13

## 背景

- `design/features/corporate-site/index.pen` が実質のトークン源泉になり、トークン正本であるべき `packages/ui` の stylesheet と値が不一致だった (アクセント `#006B6B` vs `#0f766e`、背景の寒色 / 暖色不一致、Noto 系フォント未登録)。design-workflow の一方向原則 (`packages/ui` → Pencil) に違反した二重正本状態。
- `.pen` の変数名は比喩的 (`paper` / `ink` / `photo-tone` 等) で用途が読み取れず、CSS 側も `--kufu-color-*` 独自系と shadcn semantic 系 (`--primary` 等) が未整理に併存していた。
- #10 (corporate-site 本体実装) / #6 (Storybook) の前提として、トークン体系を先に固定する必要があった (issue #13)。

## 決定

1. **2 層構造**: トークンを primitive 層 (`--kufu-<hue>-<scale>`、例: `--kufu-teal-600` / `--kufu-gray-50`。値を持つ唯一の層) と semantic 層 (shadcn 語彙 `--background` / `--foreground` / `--primary` 等の役割名。primitive への参照のみ) に分離する。`.pen` の比喩名は廃止し、Pencil variables は semantic 名へ rename する。
2. **shadcn semantic の上書き**: 既存 shadcn semantic 変数の値を kufu primitive への参照に置換し、トークンセットを 1 系統に収束させる。shadcn 語彙に無い用途は役割ベースの追加 semantic 名 (`--photo-overlay` / `--card-overlay` / `--ghost-foreground` / `--primary-soft`) を新設する。これが安全な理由と制約:
   - **変数名は shadcn の契約**である。コンポーネントは `bg-primary` 等のクラスで `var(--primary)` を参照しており、見ているのは「名前」だけで値の中身は関知しない。よって**値の差し替え (primitive への向け替え) は shadcn 公式のテーマ機構そのもので安全**だが、**名前の改名・削除は契約破りでコンポーネントが壊れる**。
   - **未使用の shadcn 変数も名前を消さない**: `--chart-*` / `--sidebar-*` / `--destructive` / `--accent` 系は現状 corporate-site で未使用だが、#10 で該当コンポーネント (アラート / チャート / ドロップダウン等) を入れた時に名前が無いと壊れる。デフォルト値のまま温存し、kufu パレット化は #10 で行う。
   - **`-foreground` ペアの整合を保つ**: shadcn は面 (`--primary`) とその上の文字 (`--primary-foreground`) をペアで使う。面だけ変えてコントラストが崩れないよう、必ずペアで割り当てる。
   - **追加した独自 semantic (`--primary-soft` 等) を `bg-*` 等のユーティリティで使うには `@theme inline` への追加マッピングが必要** (生 CSS の `var()` 直書きなら不要)。ユーティリティ提供は #10 の実需に応じて行う。
3. **ダーク面は inverse スコープ**: `.dark` テーマでなく、semantic 変数を上書きするラッパー class (案: `.surface-inverse`) で section 単位のダーク面を表現する。class 内で `--background` / `--foreground` 等を上書きすると、**そのスコープ内の shadcn コンポーネントもカスケードで自動的にダーク面の見た目へ再テーマされる** (`.dark` と同じ機構)。名前を保って値だけ差し替える設計の利点。
4. **3 entry 配信**: `@kufu/ui/tokens.css` (CSS 変数のみ) / `@kufu/ui/fonts.css` (fontsource font-face) / `@kufu/ui/styles.css` (全量エントリ = `globals.css`。tokens + fonts + Tailwind theme + shadcn 層) に分離する。Astro (corporate-site) は `tokens.css` + `fonts.css` のみ、React app (将来の cms) は `styles.css` を import する。
5. **実績ベースの最小定義**: type scale / spacing / shadow / breakpoint は独自トークンを作らず Tailwind 標準を使う (spacing は 4px グリッド + 推奨リズム 12/16/24/32/48/80 をガイド文書化)。radius は shadcn `--radius` に一本化し、`.pen` 実測 (全面直角) に基づき基準値 `0rem` とする。

## 代替案

- **比喩名を primitive 層として温存し semantic 層のみ新設**: `.pen` の変更は最小だが、わかりにくい名前が残り課題 (命名の可読性) が解決しない。不採用。
- **shadcn semantic 命名に全面統一 (1 層フラット)**: 変数は最少だが、shadcn 語彙に無い用途 (写真オーバーレイ / ダーク面 6 変数) で場当たり的な名前が増え、テーマ展開の基盤 (primitive) も失う。不採用。
- **`--kufu-*` 独自 semantic 系と shadcn 系の併存**: corporate-site と React app でトークン系が分裂し、二重正本の再発リスク。不採用。
- **単一 styles.css 配信の維持**: DX はシンプルだが、Astro 側に React app 向けの層 (tw-animate-css 等) が混入し性能予算を圧迫しうる。不採用 (Decision Priority 1: パフォーマンス)。

## 影響

### 良い影響

- トークン名から用途が読め、新トークン追加時の命名を機械的に決定できる (primitive はスケール、semantic は役割)。
- 将来の cms (React + shadcn) が同一トークンを無変換で consume できる。
- Astro 配信物にトークン + フォントだけが含まれ、不要 CSS が混入しない。
- `.pen` ↔ CSS の 1:1 対応が回復し、design-workflow の一方向原則とトークンガードが機能する。

### 悪い影響 / トレードオフ

- `.pen` variables の一括 rename と再取り込みが必要 (27 変数 → 統合 / rename 後の新体系)。
- 既存の `--kufu-color-*` / `--kufu-radius-*` / `--kufu-font-*` と TS export (`./tokens` / `./theme` / `./fonts`) を参照するコードは削除・置換が必要 (corporate-site の `--kufu-font-body` 参照は同一変更内で置換する)。
- design-workflow 等の文書で `globals.css` 参照の全数更新が必要。

### 影響範囲

- `packages/ui` への影響: `globals.css` の再設計 (tokens.css / fonts.css 分離)、fontsource 依存追加、旧トークン / TS export の削除 (実装は spec #13 の実装分割)
- `apps/corporate-site` への影響: import を `tokens.css` + `fonts.css` へ移行、`--kufu-font-body` → `--font-sans` 置換 (本実装は #10)
- `design/features/corporate-site/index.pen` への影響: variables の semantic 名への rename と再取り込み
- `e2e` への影響: なし (トークンガード検査の仕組み化は実装側で検討)

## 関連チケット / PR

- issue #13 (デザインシステム基盤。決定経緯: [specs/13-design-system-foundation/](../specs/13-design-system-foundation/index.md) 論点 D1〜D7)
- issue #17 (論点 D5 で `.pen` パレット昇格を #13 へ移管した経緯)
- issue #10 (corporate-site 本体実装。本トークン体系を consume)
- issue #6 (Storybook。本トークン体系を前提とする)
- feature doc: [design/features/corporate-site/DesignDoc_corporate-site.md](../design/features/corporate-site/DesignDoc_corporate-site.md) (トークン対応表 / ブランド指針の正本)
- 運用契約: [context/design-workflow.md](../context/design-workflow.md) (正本 path / トークンガード)
