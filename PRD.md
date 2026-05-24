# Kufu Monorepo PRD

この文書は Kufu Monorepo のプロダクト要求を整理する PRD である。実装方式の詳細ではなく、Kufu の Web サイトと将来の CMS / 運用アプリ群が誰のどの課題を解決し、どの価値を提供するかを記述する。

## 概要

Kufu Monorepo は、Kufu の LP サイト、将来の CMS アプリ、管理画面、内部業務ツール、共通 UI / 設定 / テスト基盤を pnpm workspace で一元管理するためのリポジトリである。

Phase 1 では Astro による LP サイト構築を最優先にする。将来、LP 掲載投稿を管理する CMS アプリや業務アプリが必要になった場合は、Hono API、Inertia、React などの採用を spec / ADR で判断する。

## プロダクト原則

- LP の性能を最優先する
  - 不要なクライアント JavaScript を増やさず、Astro の静的生成と island を適切に使う。
- 共通化は利用実績に基づく
  - 設定は `packages/config` に集約し、UI は複数 consumer が出た時点で `packages/ui` へ切り出す。
- AI が迷わない構造にする
  - 責務境界、命名、禁止事項、将来拡張の扱いを文書で明確にする。
- TypeScript first で保守する
  - アプリ、UI、設定、テストの境界を型と package boundary で守る。
- 初期スコープと将来構想を混ぜない
  - CMS/API や業務アプリは必要になった時点で設計判断を残す。

## 背景

### Problem Statement

- LP、業務ツール、共通 UI、設定が別々に成長すると、構成や品質基準が分散しやすい。
- LP は表示速度と運用しやすさが重要だが、将来の React アプリや CMS 連携も見据える必要がある。
- AI エージェントに実装を依頼する場合、責務境界や技術選定が曖昧だと、不要な React 化や UI の重複実装が起きやすい。
- 実装前の段階で、PRD、Design Docs、spec、ADR の役割を揃えておく必要がある。

### なぜ今やるか

- Phase 1 の LP サイト構築前に、monorepo の正本ドキュメントを整えることで、後続実装の判断コストを下げられる。
- Astro LP と将来の React ベース CMS アプリでは最適な設計が異なるため、初期から境界を明文化する必要がある。
- React Compiler、TanStack Router、TanStack Query などの前提は、導入時にライブラリ互換性と実装規約を合わせて確認する必要がある。

### フェーズ展望

- Phase 1: Astro LP サイト、共通設定、root 管理の E2E 入口、`packages/ui` skeleton を成立させる。
- Phase 2: LP 掲載投稿を管理する `apps/cms` の責務、公開フロー、データモデル、app shell を設計する。
- Phase 3: `apps/cms` や追加 app の実装、必要に応じた CMS/API 連携や認証を拡張する。

## ペルソナ

### ターゲットユーザー

- Kufu の事業内容や問い合わせ導線を確認する訪問者
- LP の内容更新、改善、公開作業を行う開発者 / 運用者
- 将来の業務効率化ツールを利用する社内メンバー
- AI エージェントに実装や調査を依頼する開発者

### ユーザーストーリー

- 訪問者として、事業内容や問い合わせ方法をすばやく把握したい。そうすれば必要な判断や連絡に進める。
- 運用者として、LP のセクションや文言を安全に更新したい。そうすれば公開サイトを継続的に改善できる。
- 開発者として、LP、CMS アプリ候補、共通 UI の責務境界を迷わず判断したい。そうすれば重複実装や不要な JavaScript を避けられる。
- AI エージェントとして、対象 app / package と禁止事項を明確に把握したい。そうすればプロジェクト方針に沿った実装ができる。

### Primary Jobs To Be Done

1. Astro LP を高いパフォーマンスと保守性で公開できる状態にする。
2. 将来の CMS アプリや業務アプリ追加に耐える monorepo 境界を用意する。
3. AI 向け設定と spec workflow により、実装依頼時の判断ぶれを減らす。

## 期待されるアウトカム

### 定量アウトカム

| 指標                            | 定義                                                     | 目的                     |
| ------------------------------- | -------------------------------------------------------- | ------------------------ |
| LP Build Success Rate           | `apps/lp-site` の build が成功する割合                   | 公開可能性を測る         |
| LP Performance Budget Pass Rate | Lighthouse / Playwright などで定めた性能予算を満たす割合 | LP の体験品質を守る      |
| Shared UI Reuse Rate            | 複数 app で使う UI が `packages/ui` に集約されている割合 | UI 重複を抑える          |
| Spec Completion Rate            | 実装前に必要な spec 節が埋まっている割合                 | AI 実装の入力品質を測る  |
| E2E Critical Flow Coverage      | 主要導線に E2E がある割合                                | 公開前の回帰検知を強める |

### 定性アウトカム

- LP の表示速度と情報設計が損なわれにくい。
- UI と設定の置き場を迷わず判断できる。
- 将来の React アプリ追加時も、LP の方針と衝突しない。
- AI がコピー元由来の古い前提を参照せず、Kufu Monorepo の文脈で作業できる。

### ガードレール

| 指標                                 | 定義                                                           | 意図                       |
| ------------------------------------ | -------------------------------------------------------------- | -------------------------- |
| Unnecessary Client JS Count          | Astro LP に不要な client directive / React island が増えた件数 | LP 性能劣化を防ぐ          |
| Direct UI Duplication Count          | app 配下で共通化すべき UI が重複実装された件数                 | 一貫性を守る               |
| Package Boundary Violation Count     | app から private 実装や別 app の内部へ依存した件数             | monorepo 境界を守る        |
| React Compiler Incompatibility Count | React Compiler 非対応ライブラリや実装が未確認で入った件数      | React 側の将来負債を抑える |

## スコープ

### Phase 1 スコープイン

- `apps/lp-site` を Astro LP として構築する。
- `packages/ui` に shared UI package の skeleton を置く。
- `packages/config` に TypeScript、lint、format などの共有設定を置く。
- root 管理の E2E 入口を整備し、LP の主要導線を公開前に検証できる状態にする。
- AI 向け設定 (`AGENTS.md`、`CLAUDE.md`、`.codex`、`.claude`、`.cursor`) を monorepo 方針に合わせる。
- spec / ADR により、実装前にスコープ、責務、検証方法を整理できる状態にする。

### Phase 1 スコープアウト

- CMS/API の本実装。
- 認証、管理画面、内部業務ツールの本実装。
- 汎用 UI ライブラリの過剰な整備。
- Astro で済む LP 機能の React 化。

## Phase 1 完成条件

- `apps/lp-site` の責務、技術選定、禁止事項が Design Docs と AI 設定に明記されている。
- `packages/ui` の skeleton が将来拡張の入口として配置され、Phase 2 の実装対象と区別されている。
- `packages/config` の役割と export 対象が明確で、root / app / package の責務境界が文書化されている。
- LP の主要ページと問い合わせ導線を検証する E2E 方針がある。
- `packages/ui` と将来の `apps/cms` に対する Rolldown と React Compiler の適用方針が明文化されている。
- 不要依存と境界違反 (循環、未宣言依存、app 間直接依存など) を root から検査できる。
- commit 前に repository quality gate (依存検査・dead code 検出) が自動実行される。
- CMS/API は初期スコープ外であり、必要時に ADR / spec で判断することが明記されている。
- コピー元固有のコード検索やインデックス前提がドキュメントや AI workflow から取り除かれている。

## 要求情報まとめ

### LP 要求

- Astro を基本に、静的生成と最小限の island で構築する。
- 画像、フォント、クライアント JavaScript を性能予算内に収める。
- コンテンツ更新時にセクション責務と配置先が分かる。
- 公開前に主要導線を E2E で確認できる。

### CMS / React アプリ要求

- Phase 1 では `apps/cms` を実装せず、以下は Phase 2 以降の要求として扱う。
- UI は `@kufu/ui` を経由し、app 配下で UI を重複実装しない。
- URL を状態管理の一部として扱い、ルーティング中心で設計する。
- データフェッチ、フォーム、client state、追加ライブラリの採否は Design Doc / ADR で標準を決定する。
- React Compiler 適用を前提とし、非対応ライブラリ・実装の扱いは Design Doc で運用する。

### Monorepo 要求

- monorepo task は workspace 全体で一貫した task runner から実行できる。
- 依存追加は対象 package を明示する手順で行う。
- app ごとの独自 UI 実装を避け、共通化すべきものは複数 consumer が揃った時点で `packages/ui` へ移す。
- lint / format / tsconfig などの開発設定は `packages/config` から共有する。
- 公開前検証 (E2E) は root 管理を正とする。
- 不要依存検出と app 間直接依存禁止を含む repository quality gate を持つ。
- commit 前にこの quality gate が自動実行される。

## 前提・依存関係

- 文書上の正式名は `Kufu Monorepo` とする。
- npm package prefix は `@kufu/*` とする。
- Phase 1 の主対象は Astro LP である。
- `apps/cms` は LP 掲載投稿を管理する将来 app 候補として扱う。
- `packages/ui` は Phase 1 で skeleton まで作り、`apps/cms` の技術選定と機能実装は次フェーズへ送る。
- CMS/API は初期スコープ外で、必要になった時点で Hono API、Inertia、React の採否を判断する。
- 実体コードが未作成の場合でも、ドキュメントは構築予定の repo contract として扱う。

## Open Questions

- LP の主要 KPI (訪問数、問い合わせ転換率、Lighthouse スコア目標値) はいつ・誰が確定するか。
- `apps/cms` の立ち上げ判断基準 (LP 投稿数、運用者人数、外部編集者の有無など) はどの指標で固定するか。
- LP コンテンツ更新の責務分担と承認フローはどのタイミングで明文化するか。
- Cloudflare Pages の preview / production に紐づく domain / branch / secret 運用ルールをどの粒度で repo に残すか (実装方針は Design Doc に委譲)。

## 関連ドキュメント

- 全体設計: [design/DesignDoc.md](design/DesignDoc.md)
- spec 運用: [specs/README.md](specs/README.md)
- ADR 運用: [adr/README.md](adr/README.md)
