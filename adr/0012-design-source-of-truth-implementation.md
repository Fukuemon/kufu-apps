# ADR-0012: デザイン正本を実装 (コード + Storybook) とし Pencil (.pen) を廃止する

## 状態

承認 (本 ADR は [ADR-0004](0004-design-production-workflow.md) を置換する)

## 決定日

2026-07-25

## 背景

- ADR-0004 (状態: 提案のまま未承認) は、デザイン制作を「Claude Design (発散) → Pencil (`.pen` = デザイン正本) → 実装」の 3 段構成とし、`design/features/corporate-site/index.pen` をデザイン正本として commit する運用を定めていた。
- しかし `.pen` は実装の更新に追従できておらず、実態と乖離した。「デザイン正本 = `.pen`」「実装正本 = コード」の二重正本は、実装側だけが進化すると drift が構造的に発生する。
- corporate-site の主要画面は実装済みで、Storybook (コンポーネントカタログ) も整備されている。デザインの現状を確認する手段としては実装 + Storybook の方が新鮮で正確になっている。

## 決定

- **デザイン正本を実装 (コード + Storybook) とする。** `.pen` を含む中間デザイン正本を持たない。
- ADR-0004 は **置換 (superseded)** とする。
- デザイン制作フローは次のとおり簡素化する:

  | Phase       | ツール             | 目的                                   | 成果の扱い                          |
  | ----------- | ------------------ | -------------------------------------- | ----------------------------------- |
  | A0 依頼設計 | 手動 / Claude Code | Claude Design 依頼文を組む             | `.prompt.md` を commit (再現性)     |
  | A 方向性    | Claude Design      | 方向性プロトを 2〜3 案出して比較・決定 | 使い捨て HTML。commit しない        |
  | C 実装      | Claude Code 等     | 採用案を参照して直接実装               | `.astro` / React + Storybook (正本) |

  確認・レビューは Storybook と実画面で行う。Pencil (旧 phase B) と import 工程は廃止する。

- `design/features/corporate-site/index.pen` の実削除と、`context/design-workflow.md` の全面改訂は本判断を根拠に **issue #31 で実施する** (2026-07-26 にスコープ拡大。改訂方針: `.pen` 正本前提の §1 正本 / §2 フロー / §4 配置規約を上表のフローに書き換える)。
- デザイントークンの正本は従来どおり `packages/ui` ([ADR-0007](0007-design-token-architecture.md))。本 ADR はトークン体系を変更しない。

## 代替案

### 1. `.pen` を実装に追従させて維持する

- 利点: canvas 上での pixel 調整と、デザイン意図の構造化データが残る。
- 欠点: デザイン変更のたびに `.pen` とコードの二重更新が必要で、追従コストが乖離の原因そのもの。Pencil は `.astro` 非対応のため round-trip もできない。
- 不採用理由: 追従できていない実績があり、二重正本の drift は運用で解消できないため。

### 2. デザインツールフローを全廃する (Claude Design も使わない)

- 利点: 最軽量。
- 欠点: 非デザイナーが方向性を素早く探索する手段 (phase A の価値) を失う。
- 不採用理由: Claude Design は Pencil 非依存で、使い捨て運用ならば正本問題を生まないため残す価値がある。

## 影響

### 良い影響

- デザインの「今の事実」が実装 + Storybook に一意化され、乖離した中間文書が残らない。
- デザイン変更が「コードを直す」1 系統になり、二重更新が消える。

### 悪い影響 / トレードオフ

- pixel 単位の canvas 調整工程がなくなり、細部の詰めは実装 + Storybook レビューに依存する。
- 過去の `.pen` に込めたデザイン意図の構造化データは失われる (必要な意図は feature doc に文章で残す)。

## 実装・運用への反映

- 対象 app / package: `apps/corporate-site` (実装正本) / `packages/ui` (トークン正本、変更なし)
- spec 更新要否: 要 (issue #31 の spec に決定経緯を記録済み)
- AI 向け設定更新要否: 要。context/design-workflow.md の改訂は issue #31 で実施。`design-prompt` skill (共有プロセス層) の Pencil 言及の見直しは sdd-template 側の課題として扱う

## 関連ドキュメント

- [ADR-0004](0004-design-production-workflow.md): 本 ADR により置換
- [ADR-0007](0007-design-token-architecture.md): トークン正本 (変更なし)
- `context/design-workflow.md`: 改訂対象 (issue #31 で実施)
- `design/features/corporate-site/DesignDoc_corporate-site.md`: `index.pen` 正本参照の改訂対象 (issue #31 で実施)
- `specs/31-docs-restructure/`: 決定経緯 (issue close 時に削除)
