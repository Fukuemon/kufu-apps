# Prompt Scaffold (`.prompt.md`)

`apps/<app>/design/<screen>.prompt.md` の穴埋めスケルトン。原則・背景は `context/design-workflow.md` §3 Phase A0 が正本なので、ここでは構造だけを示す (二重記載しない)。

## スケルトン

```md
# <app> / <screen> — Claude Design prompt

## 依頼文 (Claude Design 投入用 / 密な1段落で書く)

<goal> を作りたい。<layout: セクション順・グリッド・nav 形式>。
content は <ドメイン> で、実テキストは <company-profile / manufacturers 等の要点>。
audience は <誰向け>。配色/タイポ/spacing/radius は packages/ui のトークンに従う。
<制約: Astro 静的・最小 island・性能予算・レスポンシブ desktop/mobile>。
出力は standalone HTML で 2〜3 案。empty / error / loading / データ量違いの状態も示す。

## メモ

- 参照例 (任意):
- 確定した方向性 (A で更新):
```

## 各項目の要点

| 項目     | 入れるもの                                                            |
| -------- | --------------------------------------------------------------------- |
| goal     | 何の画面/セクションを何のために                                       |
| layout   | 視覚構造 (セクション順 / グリッド / nav)。IA は #11 / feature doc     |
| content  | ドメイン + **実コンテンツ素材** (ダミー回避)                          |
| audience | 誰向けか (例: 取引先 / 採用候補)                                      |
| 制約     | packages/ui トークン踏襲、Astro 静的・最小 island、性能、レスポンシブ |
| 出力     | standalone HTML、2〜3 案、対象画面サイズ                              |
| 状態     | empty / error / loading / データ量違い (§8 課題3/4 の前倒し)          |

## 書き方の注記

- **否定形でなく具体指定**: ×「クリーム色を使わない」→ ○「淡いシルバーグレー〜ブルーグレー、角丸 4px、角張った sans-serif」。
- 汎用 AI 然とした既定 (Inter/Roboto・紫グラデ) を避け、ブランド固有の選択を明示する。
- **コンポーネント名を一貫**させる (import/実装まで名前が伝わる)。
- 1段落・具体的だと初稿が約 2/3 で実用、曖昧だとほぼゼロ (Claude Design ベストプラクティス)。
