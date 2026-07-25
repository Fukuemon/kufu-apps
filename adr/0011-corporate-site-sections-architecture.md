# ADR-0011: corporate-site の component を sections (route 層) で再編し、section 公開面を index.ts + depcruise で固定する

## 状態

提案

## 決定日

2026-07-25

## 背景

- `apps/corporate-site/src/components/features/` は 7 feature (business / company / consultation / contact / hero / products / services) をフラットに並べており、どのページの構成要素かが物理構造から読めなかった。特に `products` は 14 ファイルでエントリーポイントが不明瞭だった (issue #32)。
- 「feature」の語が domain feature とページ section の両義で使われ、静的サイトの実態 (ページ = section の集合) と合っていなかった。
- pages から feature 内部の任意ファイルを import できるため、公開面 (どこから使ってよいか) が規約でしか表現されず、drift の余地があった。
- app 内 component 間の依存境界は [context/architecture.md](../context/architecture.md) の Package Boundary (app 間 / package 境界) では未定義だった。

## 決定

1. **区切りの概念を feature から section に改め、route 層でグルーピングする**: `components/features/<feature>/` → `components/sections/<route>/<section>/`。ページとの対応が物理構造で一意になる (corporate-site は `home/` `products/` `contact/` の 3 route。実マップは [component-map.md](../design/features/corporate-site/component-map.md))。
2. **section 内部はフラット + `index.ts` 公開面**: section dir 直下に `index.ts` (Section component のみ再輸出) + Section assembly + presentation + story を並べる。`internal/` サブディレクトリは作らない。
3. **products は hero / category / detail の 3 section に分割**: ページ内ナビ (`ProductsSidebarNav`) は detail に同居させる。
4. **依存方向を `pages → sections (index.ts) → common → @kufu/ui` の一方向に固定する**: pages から section 内部への直接 import 禁止、section 間 import は index 経由でも禁止 (共有は common / `packages/ui` へ昇格)。同 section 内の直接参照 (story 含む) は自由。dependency-cruiser で機械検査する (ルール実装は実施 issue)。

## 代替案

- **フラットのまま改名のみ (`sections/` 直下に 7 section)**: 移動コスト最小だが、ページ対応が文書でしか表現されず課題 (探しにくさ) が解決しない。不採用。
- **route 層 + section はファイル直置き (section dir なし)**: 階層は浅いが products 14 ファイル問題が残り、公開面も定義できない。不採用。
- **`internal/` サブディレクトリを常に強制**: 公開面が物理的にも明示されるが、2〜3 ファイルの section では過剰。index.ts + depcruise 検査で同じ保証が得られるため不採用。
- **section 間依存を index 経由で許可**: 柔軟だが依存グラフが網目化し「どの section が起点か」が再び曖昧になる (本 issue の課題の再発)。不採用。

## 影響

### 良い影響

- ページ → section → component の探索経路が物理構造と一致し、起点 (`index.ts`) が一意になる。
- 公開面が depcruise で機械検査でき、規約 drift を quality gate で検出できる。
- Storybook の title 階層 (`Sections/<Route>/<Section>/<Component>`) をディレクトリから機械的に決められる ([component-design.md](../context/component-design.md))。

### 悪い影響 / トレードオフ

- 既存 import 経路 (pages / story) の書き換えを伴う移行作業が発生する。段階的移動 + depcruise 検証を実施 issue に引き継ぐ (issue #32 受け入れ基準)。
- route 追加時に sections 直下の route dir 追加が必要になる (ページ対応の明示とのトレードオフ)。

## 実装・運用への反映

- 対象 app / package: `apps/corporate-site` (再編の実施は別 issue)。`packages/ui` は対象外
- spec 更新要否: 不要 (issue #32 の spec は issue close 時に削除。決定経緯は本 ADR が正本)
- AI 向け設定更新要否: 不要 (規約は [context/component-design.md](../context/component-design.md) / [context/architecture.md](../context/architecture.md) が正本で、AI 設定はそれを参照する)

## 関連ドキュメント

- `design/DesignDoc.md`: モジュール責務 (`apps/corporate-site`)
- [context/component-design.md](../context/component-design.md): ディレクトリ構成 / Storybook 対象 / スタイリング (規約の正本)
- [context/architecture.md](../context/architecture.md): App 内依存方向 (sections 公開面)
- [design/features/corporate-site/component-map.md](../design/features/corporate-site/component-map.md): 移行先マップの正本
- [ADR-0007](0007-design-token-architecture.md) / [ADR-0008](0008-astro-react-island-policy.md) / [ADR-0010](0010-shadcn-base-ui-primitive-policy.md): 本決定はいずれも継承 (supersede なし)
- issue #32 (決定経緯: 設計論点 D8 / D9 / D10)
