# ADR-0011: corporate-site の component を section 単位のフラット構成へ再編し、公開面を index.ts + 独自検査で固定する

## 状態

承認

## 決定日

2026-07-26

## 背景

- `apps/corporate-site/src/components/features/` は 7 feature (business / company / consultation / contact / hero / products / services) をフラットに並べており、どのページの構成要素かが物理構造から読めなかった。特に `products` は 14 ファイルでエントリーポイントが不明瞭だった (issue #32)。
- 「feature」の語が domain feature とページ section の両義で使われ、静的サイトの実態 (ページ = section の集合) と合っていなかった。
- pages から feature 内部の任意ファイルを import できるため、公開面 (どこから使ってよいか) が規約でしか表現されず、drift の余地があった。
- app 内 component 間の依存境界は [context/architecture.md](../context/architecture.md) の Package Boundary (app 間 / package 境界) では未定義だった。
- 検討当初は route 層でのグルーピング (`sections/<route>/<section>/`) を採ろうとしたが、実 import 関係の確認で前提が崩れた。`pages/index.astro` (`/`) が `ProductsCategorySection` を import しており、products ドメインの section が home route の構成要素になっている。また `ProductsHero` は `/products` の独立 section ではなく `ProductsDetailSection` の内部 component だった。
- 公開面の機械検査に想定していた dependency-cruiser は `.astro` を解析対象にしていない (cruise 対象 82 modules に `.astro` はゼロ、`no-orphans` の除外にも `\.astro$` を含む)。oxlint も `.astro` 非対応で、corporate-site の `lint` は `astro.config.mjs` と `vitest.config.ts` の 2 ファイルしか見ていない。

## 決定

1. **区切りの概念を feature から section に改め、1 階層のフラット構成にする**: `components/features/<feature>/` → `components/sections/<section>/`。route 層は設けない。ドメインのまとまりはディレクトリ名の接頭辞 (`products-category` / `products-detail`) で表し、ページ対応は [component-map.md](../design/features/corporate-site/component-map.md) の表を正本とする。
2. **section 内部はフラット + `index.ts` 公開面**: section dir 直下に `index.ts` (Section component のみ再輸出) + Section assembly + presentation + story を並べる。`internal/` サブディレクトリは作らない。階層は常に 1 段なので「section の起点は必ず `sections/<section>/index.ts`」という単一規約になる。
3. **products は使用実態に沿って 2 section に分割する**: `products-category` (`/` に載る取扱製品セクション) と `products-detail` (`/products` の詳細)。`ProductsHero` は `products-detail` の内部 component として扱う。
4. **依存方向を `pages → sections (index.ts) → common → @kufu/ui` の一方向に固定する**: pages から section 内部への直接 import 禁止、section 間 import は index 経由でも禁止 (共有は common / `packages/ui` へ昇格)。同 section 内の直接参照 (story 含む) は自由。
5. **境界の機械検査は独自スクリプトで行う**: `.astro` を解析できる既存ツールが無いため、`apps/corporate-site/scripts/check-token-usage.mjs` (ripgrep で `.astro` を走査するトークンガード) と同方式の検査スクリプトを追加し、quality gate に組み込む。
6. **再編に伴い、実ページから未使用の component は削除する**: `ServicePillar` / `ContactInfoRow` は #6 の catalog 整備で作られたが #10 の本実装で使われず、story からのみ参照される状態だった。使われない component を新構成へ移送すると「カタログにあるが実ページにない」ものが恒久化し、section の公開面規約 (どの Section が起点か) も曖昧になるため、story ごと削除する。`.pen` 側の対応要素は残るため、再実装が必要になった時点で [component-map.md](../design/features/corporate-site/component-map.md) から復帰させる。

## 代替案

- **route 層でグルーピングする (`sections/<route>/<section>/`)**: ページ対応が物理構造で一意になる利点があるが、`ProductsCategorySection` のようにドメインと route が一致しない component の置き場が決まらない。さらに IA 変更 (#11 → #17 で 5 page → 3 route の再編実績あり) がディレクトリ移動を強制し、「複数 route で共有されたら common へ昇格」ルールも共有された瞬間に物理移動を要求する。不採用。
- **ドメイン層 + section の 2 階層 (`sections/products/{category,detail}/`)**: ドメインの凝集は保てるが、階層が section によって 1〜2 と不揃いになり、`index.ts` の位置規約が 2 通りに増える。不採用。
- **現行の切り方を維持して改名のみ**: 移行差分は最小だが、`products` に 2 つの Section component が同居したままで、起点が読めない元の課題が解決しない。不採用。
- **`internal/` サブディレクトリを常に強制**: 公開面が物理的にも明示されるが、2〜3 ファイルの section では過剰。`index.ts` + 検査で同じ保証が得られるため不採用。
- **section 間依存を index 経由で許可**: 柔軟だが依存グラフが網目化し「どの section が起点か」が再び曖昧になる。不採用。
- **未使用 component を新構成へそのまま移送する**: catalog 資産として残せるが、実ページに存在しない component が恒久化し、どの Section が起点かの判断を濁す。`.pen` と git 履歴から復元できるため、不採用。
- **eslint + eslint-plugin-astro で境界検査**: 汎用ルール資産に乗れるが、現状 eslint は未導入で oxlint との二重運用と toolchain 方針の見直しが発生する。同種のガードが独自スクリプトで既に運用されている前例に合わせ、不採用。

## 影響

### 良い影響

- section の起点が `sections/<section>/index.ts` に一意化し、探索経路が単純になる。
- 構造が route 構成から独立するため、IA 変更でディレクトリ移動が発生しない。
- 公開面を機械検査でき、規約 drift を quality gate で検出できる。
- Storybook の title 階層 (`Sections/<Section>/<Component>`) をディレクトリから機械的に決められる ([component-design.md](../context/component-design.md))。

### 悪い影響 / トレードオフ

- 既存 import 経路 (pages / 内部 component / story) の書き換えを伴う移行作業が発生する。
- ページ対応が物理構造から読めないため、`component-map.md` の表を維持する運用コストが残る。
- 検査が独自スクリプトになるため、ルール表現力は汎用 linter に劣り、保守は自前になる。

## 実装・運用への反映

- 対象 app / package: `apps/corporate-site` (再編の実施は issue #32 のスコープ内)。`packages/ui` は `@source` 移動と motion トークン追加のみ
- spec 更新要否: 不要 (issue #32 の spec は issue close 時に削除。決定経緯は本 ADR が正本)
- AI 向け設定更新要否: 不要 (規約は [context/component-design.md](../context/component-design.md) / [context/architecture.md](../context/architecture.md) が正本で、AI 設定はそれを参照する)

## 関連ドキュメント

- `design/DesignDoc.md`: モジュール責務 (`apps/corporate-site`)
- [context/component-design.md](../context/component-design.md): ディレクトリ構成 / Storybook 対象 / スタイリング (規約の正本)
- [context/architecture.md](../context/architecture.md): App 内依存方向 (sections 公開面)
- [design/features/corporate-site/component-map.md](../design/features/corporate-site/component-map.md): section → component とページ対応の正本
- [ADR-0006](0006-corporate-site-three-route-ia.md): 3 route IA (本決定は IA から独立した構造にすることで ADR-0006 の変更に耐える)
- [ADR-0007](0007-design-token-architecture.md) / [ADR-0008](0008-astro-react-island-policy.md) / [ADR-0010](0010-shadcn-base-ui-primitive-policy.md): いずれも継承 (supersede なし)
- issue #32 (決定経緯: 設計論点 D8 / D9 / D10 と実装突合ゲート⑤⑥)
