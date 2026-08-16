# ADR-0006: corporate-site の IA を 5 ページ構成から 3 route 統合構成へ変更する

## 状態

承認

## 決定日

2026-06-11

## 背景

- corporate-site の IA は issue #11 で 5 ページ構成 (トップ `/` / 事業内容 `/services` / 取扱製品 `/products` / 会社情報 `/company` / お問い合わせ `/contact` + 共通レイアウト G) として確定し、[feature doc](../design/features/corporate-site/DesignDoc_corporate-site.md) を正本としていた。
- issue #16 (デザイン制作ワークフロー定義) のパイロット対象選定中に「そもそも多ページにする必要があるか」という IA レベルの問いが出て、issue #17 へ切り出した。
- #17 では机上比較ではなく、#16 で確定した design-workflow (A0 → A 発散 → import → B 収束) を実走し、実プロト (`design/features/corporate-site/index.pen`) の反復 (デザイン方針 V1〜V16) を通じて IA を再評価した。
- 実走の結果、事業内容と会社情報は LP 内 section で十分な密度を持てる一方、取扱製品 (18 カテゴリ × 延べ約 320 社のメーカー一覧) は分量的に独立ページが必要であることが実プロト上で確認できた。

## 決定

- corporate-site の IA を **3 route 統合構成** にする:
  - `/` — LP。hero / 事業紹介 (旧 P2 事業内容を section 統合) / 取扱製品索引 (18 カテゴリ) / 会社情報 (旧 P4 会社情報を section 統合) / フルフッター
  - `/products` — 取扱製品。18 カテゴリ詳細 (INDEX パネル + 全メーカー一覧)
  - `/contact` — お問い合わせ。連絡先 + 問い合わせフォーム (機能は #14)
- `/services` と `/company` の単独 route は設けない。事業内容・会社情報への直接導線は LP 内アンカーで提供する。
- IA の正本は引き続き feature doc「ページ構成 (IA)」とし、デザイン正本は実装 (コード + Storybook) とする (**2026-07-26 更新**: 決定時は `design/features/corporate-site/index.pen` を正本としたが、[ADR-0012](0012-design-source-of-truth-implementation.md) で実装へ移管し `.pen` は廃止した)。
- 決定経緯 (論点・根拠・受け入れ基準) は [issue #17](https://github.com/Fukuemon/kufu-apps/issues/17) が保持する。

## 代替案

### 1. 多ページ (5 ページ) 構成を維持する

#### Pros

- #11 の確定 IA をそのまま引き継げる。
- ページ単位の SEO (個別 title / description) を最大化できる。

#### Cons

- 事業内容・会社情報は実コンテンツ量が少なく、独立ページにすると密度が薄くなる (実プロトで確認)。
- ページ数に比例して制作・保守・E2E のコストが増える。
- 訪問者の回遊が分断され、訴求 → 信頼 → 接点の流れが切れやすい。

### 2. 完全な単一 LP (1 route) にする

#### Pros

- 制作・保守コストが最小。回遊が 1 ページで完結する。

#### Cons

- 取扱製品 (18 カテゴリ × 全メーカー一覧) を載せると LP が過長になり、初期ロードと走査性を損なう (実プロトで確認)。
- 問い合わせフォーム (#14) を独立 URL で共有・誘導できない。

### 3. 3 route 統合構成 (採用)

#### Pros

- コンテンツ密度と分量に応じた構成: 薄い情報は LP に統合、分量のある取扱製品と機能を持つお問い合わせのみ独立。
- LP 1 ページで訴求 → 信頼 → 接点の流れが完結しつつ、`/products` `/contact` を直接共有できる。
- design-workflow の実プロト反復 (V1〜V16) で妥当性を検証済み。

#### Cons

- 事業内容・会社情報の個別 URL がなくなり、ページ単位 SEO は 5 ページ構成より弱い。
- LP が縦長になるため、画像 lazy-load 等の初期ロード最適化が実装時に必要。

## 影響

### 良い影響

- 実装 (#10) の対象が 3 route に絞られ、制作・保守・E2E のコストが下がる。
- 3 route の IA と実装 (+ Storybook) が 1:1 で対応する。決定時は `.pen` を正本としたが、ADR-0012 が正本を実装へ移管した。
- #16 design-workflow の A→B パイロット検証を兼ねた、実プロト根拠のある IA 決定として残る。

### 悪い影響 / トレードオフ

- `/services` `/company` を前提にした文書・ナビ設計は更新が必要。
- 将来コンテンツが増えて事業内容・会社情報を独立ページへ戻す場合は IA の再変更になる (その際は本 ADR を置換する)。

### 影響範囲

- `apps/corporate-site` への影響: route 構成が `/` `/products` `/contact` の 3 route になる (実装は #10)
- `packages/ui` への影響: なし (トークン整合は #13 で別途)
- `e2e` への影響: 主要導線の検証対象が 3 route 前提になる (#10 で検討)

## 関連チケット / PR

- [issue #17](https://github.com/Fukuemon/kufu-apps/issues/17): IA 再評価の決定経緯
- issue #11 (旧 5 ページ IA の決定経緯)
- issue #16 (design-workflow 定義。本決定がその A→B パイロット)
- issue #10 (本体実装。本 IA を引き継ぐ)
- feature doc: [design/features/corporate-site/DesignDoc_corporate-site.md](../design/features/corporate-site/DesignDoc_corporate-site.md) (IA 正本)
