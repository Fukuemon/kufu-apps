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
4. **3 entry 配信**: `@kufu/ui/tokens.css` (CSS 変数のみ) / `@kufu/ui/fonts.css` (fontsource font-face) / `@kufu/ui/styles.css` (全量エントリ = `globals.css`。tokens + fonts + Tailwind theme + shadcn 層) に分離する。Astro (corporate-site) は `tokens.css` + `fonts.css` のみ、React app (将来の cms) は `styles.css` を import する。**(2026-06-22 改訂 — 下記「更新」参照)** corporate-site は全量 `styles.css` は取り込まないまま、app-local に lean な Tailwind v4 entry を立てて utility を使えるようにした。不採用にしたのは tw-animate-css / shadcn 層を含む「全量エントリの混入」であり、lean Tailwind 自体ではない。
5. **実績ベースの最小定義**: type scale / spacing / shadow / breakpoint は独自トークンを作らず Tailwind 標準を使う (spacing は 4px グリッド + 推奨リズム 12/16/24/32/48/80 をガイド文書化)。radius は shadcn `--radius` に一本化する。基準値は `0.25rem` (4px) とし、Button 8px / Tag 4px など component 固有値は `@kufu/ui` の component variant で管理する (当初は `.pen` との 二重管理だったが、[ADR-0012](0012-design-source-of-truth-implementation.md) で `.pen` を廃止)。

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

- `packages/ui` への影響: `globals.css` の再設計 (tokens.css / fonts.css 分離)、fontsource 依存追加、旧トークン / TS export の削除 (実装は issue #13 の実装分割)
- `apps/corporate-site` への影響: import を `tokens.css` + `fonts.css` へ移行、`--kufu-font-body` → `--font-sans` 置換 (本実装は #10)
- `design/features/corporate-site/index.pen` への影響: variables の semantic 名への rename と再取り込み
- `e2e` への影響: なし (トークンガード検査の仕組み化は実装側で検討)

## 更新

### 2026-07-26: `.pen` 廃止に伴う参照の整理 (issue #31)

- **背景**: 本 ADR は `.pen` (Pencil) をデザイン正本とする前提で、トークンの一方向同期 (`packages/ui` → Pencil) と variables の rename を定めていた。
- **決定**: [ADR-0012](0012-design-source-of-truth-implementation.md) によりデザイン正本は実装 (コード + Storybook) となり `.pen` は廃止された。本 ADR の 2 層構造・3 entry 配信・semantic 語彙は有効なまま、`.pen` 同期に関する記述は歴史的経緯として読む。
- **影響**: トークン正本は引き続き `packages/ui/src/styles/tokens.css`。消費側は実装のみとなり、デザインツールへの同期は不要になった。

### 2026-07-15: radius 基準値を 4px へ改訂 (issue #10)

- **背景**: 2026-06-12 時点の `.pen` は全面直角だったが、その後の #6 で Button 8px / Tag 4px がデザイン正本へ追加され、#10 の実装でも主要面に4pxの控えめな角丸を採用した。`tokens.css` が0pxのまま app側で値を上書きすると、トークン正本が分裂する。
- **決定**: `tokens.css` の `--radius` を4pxへ変更し、app側の同名上書きを削除する。4pxを共通基準とし、Button 8pxなどの例外はcomponent variantが所有する。
- **影響**: `--radius-*` 派生値を使う共有UIにも新しい基準値が適用される。corporate-siteの現行表示は維持される。

### 2026-06-22: corporate-site に lean app-local Tailwind v4 を採用 (issue #6)

- **背景**: corporate-site の component が scoped `<style>` + `var(--token)` で書かれ、Tailwind を使う `packages/ui` (shadcn) とスタイル記法が分裂していた。決定 2 / 5 で「utility 提供は #10 の実需に応じて」「spacing / type scale は Tailwind 標準を使う」としていた前提を、Storybook catalog の component (#6) を Tailwind へ統一する形で具体化する。
- **決定**: corporate-site に **lean な Tailwind v4 entry** を立てる。`apps/corporate-site/src/styles/globals.css` で `@import "tailwindcss"` + `@kufu/ui/tokens.css` + `@kufu/ui/fonts.css` を読み込み、token → utility の `@theme inline` 写像は新設の **`@kufu/ui/theme.css`** に一元化し (4 entry 目)、`styles.css` (全量) と corporate-site の lean entry の双方が `@import` する。app 固有なのは document-level base。Tailwind の走査は Vite plugin の module graph に任せ、app-local `@source` は置かない。Tailwind v4 は **`@tailwindcss/vite`** で適用し、Astro は `astro.config.mjs` の `vite.plugins` に設定する。Storybook は `@storybook-astro/framework` が Astro config の Vite plugin を自動ロードする。PostCSS config は使わない。Vite 8 の rolldown resolver が `tsconfigPaths` 欠落で落ちるため、`astro.config.mjs` の `vite.resolve.tsconfigPaths` を `true` にする。
- **責務分離**: `tokens.css` は runtime CSS 変数の実体のみ、`theme.css` は Tailwind utility へ公開する `@theme inline` mapping のみ、`globals.css` / `styles.css` は import / source / variant / base layer の entry のみに絞る。
- **不採用との整合**: 「単一 styles.css 配信の維持」を不採用にした理由は tw-animate-css / shadcn 層を含む全量エントリの混入 (性能予算) であり、lean Tailwind はこの層を含まない。Tailwind v4 は検出した使用 utility のみ出力するため、静的配信の CSS payload は限定される。値の正本は引き続き `tokens.css`。
- **影響**: corporate-site の 5 component (`BusinessFeatureRow` / `FeaturedCategoryCard` / `ContactInfoRow` / `ServicePillar` / `SectionHeading`) を scoped CSS から Tailwind utility へ移行。token ガード (design-workflow §6) は `text-foreground` 等 semantic class で自然に担保される。`ProductCategory` 等の本体実装・追加 utility 写像は #10 で継続。

## 関連チケット / PR

- [issue #13](https://github.com/Fukuemon/kufu-apps/issues/13): デザインシステム基盤の決定経緯
- issue #17 (論点 D5 で `.pen` パレット昇格を #13 へ移管した経緯)
- issue #10 (corporate-site 本体実装。本トークン体系を consume)
- issue #6 (Storybook。本トークン体系を前提とする)
- feature doc: [design/features/corporate-site/DesignDoc_corporate-site.md](../design/features/corporate-site/DesignDoc_corporate-site.md) (トークン対応表 / ブランド指針の正本)
- 運用契約: [context/design-workflow.md](../context/design-workflow.md) (正本 path / トークンガード)
