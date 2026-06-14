# Kufu Monorepo PRD

> 最終更新: 2026-06-14 / Status: 確定 (Phase 1 要求)

この文書は Kufu Monorepo のプロダクト要求を整理する PRD である。実装方式の詳細ではなく、Kufu の Web サイトと将来の CMS / 運用アプリ群が誰のどの課題を解決し、どの価値を提供するかを記述する。

## 概要

Kufu Monorepo は、Kufu のコーポレートサイト、将来の CMS アプリ、管理画面、内部業務ツール、共通 UI / 設定 / テスト基盤を pnpm workspace で一元管理するためのリポジトリである。

Phase 1 では Astro によるコーポレートサイト構築を最優先にする。将来、コーポレートサイト掲載投稿を管理する CMS アプリや業務アプリが必要になった場合は、Hono API、Inertia、React などの採用を spec / ADR で判断する。

## プロダクト原則

- コーポレートサイトの性能を最優先する
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

- コーポレートサイト、業務ツール、共通 UI、設定が別々に成長すると、構成や品質基準が分散しやすい。
- コーポレートサイトは表示速度と運用しやすさが重要だが、将来の React アプリや CMS 連携も見据える必要がある。
- AI エージェントに実装を依頼する場合、責務境界や技術選定が曖昧だと、不要な React 化や UI の重複実装が起きやすい。
- 実装前の段階で、PRD、Design Docs、spec、ADR の役割を揃えておく必要がある。

### なぜ今やるか

- Phase 1 のコーポレートサイト構築前に、monorepo の正本ドキュメントを整えることで、後続実装の判断コストを下げられる。
- Astro コーポレートサイトと将来の React ベース CMS アプリでは最適な設計が異なるため、初期から境界を明文化する必要がある。
- React Compiler、TanStack Router、TanStack Query などの前提は、導入時にライブラリ互換性と実装規約を合わせて確認する必要がある。

### フェーズ展望

- Phase 1: Astro コーポレートサイト、共通設定、root 管理の E2E 入口、`packages/ui` skeleton を成立させる。
- Phase 2: コーポレートサイト掲載投稿を管理する `apps/cms` の責務、公開フロー、データモデル、app shell を設計する。
- Phase 3: `apps/cms` や追加 app の実装、必要に応じた CMS/API 連携や認証を拡張する。

## 想定ユーザー / ステークホルダー

Phase 1 の主対象はコーポレートサイト訪問者である。開発者 / AI エージェントは、訪問者向け価値を安全に実装・運用するためのステークホルダーとして扱う。

| 区分         | 対象                                         | 関心事                                                                                        | Phase 1 優先度 |
| ------------ | -------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------- |
| Primary user | 工業製品・機械工具の調達 / 保全 / 購買担当者 | Kufu が扱う製品カテゴリ、メーカー、加工・販売の対応範囲、問い合わせ先を短時間で把握できること | 高             |
| Primary user | 既存取引先・紹介経由の見込み顧客             | 会社情報、連絡先、取扱領域を確認し、電話 / FAX / メール / フォームのいずれかで連絡できること  | 高             |
| Operator     | Kufu 側の内容更新者 / 公開作業者             | 会社概要、取扱製品、メーカー情報、問い合わせ導線を安全に更新・検証できること                  | 中             |
| Developer    | 実装・保守を行う開発者 / AI エージェント     | app / package / spec / ADR の責務境界を参照し、不要な React 化や UI 重複を避けられること      | 中             |
| Future user  | 将来の CMS / 業務アプリ利用者                | コーポレートサイト公開後に、必要性が具体化した段階で管理機能を利用できること                  | 低             |

### ユーザーストーリー

- 調達 / 保全担当者として、取扱製品カテゴリとメーカーを確認したい。そうすれば Kufu に相談できる対象か判断できる。
- 見込み顧客として、会社概要と問い合わせ先をすばやく確認したい。そうすれば電話 / FAX / メール / フォームのいずれかで連絡できる。
- 内容更新者として、会社情報や取扱情報の正本と掲載箇所を把握したい。そうすれば公開サイトを安全に更新できる。
- 開発者 / AI エージェントとして、対象 app / package と禁止事項を明確に把握したい。そうすればプロジェクト方針に沿った実装ができる。

### Primary Jobs To Be Done

1. 訪問者が Kufu の取扱領域と問い合わせ方法を短時間で判断できるコーポレートサイトを公開する。
2. 内容更新者が会社情報・取扱製品・メーカー情報を安全に更新できる正本と検証導線を用意する。
3. 将来の CMS アプリや業務アプリ追加に耐える monorepo 境界を用意する。
4. AI 向け設定と spec workflow により、実装依頼時の判断ぶれを減らす。

## 期待されるアウトカム

### 成功条件

| #   | 成功条件                                          | 測定方法                                                                     | Phase 1 target                                     |
| --- | ------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------- |
| 1   | コーポレートサイトを公開可能な状態で build できる | `pnpm build` / CI build                                                      | 成功率 100%                                        |
| 2   | 訪問者が取扱領域と問い合わせ先へ到達できる        | `/`, `/products`, `/contact` の Playwright E2E                               | 主要 route と問い合わせ導線を E2E で通す           |
| 3   | Astro の静的生成と最小 island 方針を守る          | client directive / React island の review、必要時の bundle / Lighthouse 確認 | 表示専用 UI の不要な island 追加 0 件              |
| 4   | コンテンツ正本と掲載箇所が追跡できる              | `design/features/corporate-site/reference/` と feature doc の対応確認        | 会社概要・取扱製品・メーカー情報の正本リンクを維持 |
| 5   | AI / 開発者が責務境界を参照できる                 | spec / ADR / context / AGENTS の整合確認                                     | 実装前 spec と関連正本リンクを保持                 |

### 定性アウトカム

- コーポレートサイトの表示速度と情報設計が損なわれにくい。
- UI と設定の置き場を迷わず判断できる。
- 将来の React アプリ追加時も、コーポレートサイトの方針と衝突しない。
- AI がコピー元由来の古い前提を参照せず、Kufu Monorepo の文脈で作業できる。

### ガードレール

| 指標                                 | 定義                                                                          | 意図                             |
| ------------------------------------ | ----------------------------------------------------------------------------- | -------------------------------- |
| Unnecessary Client JS Count          | Astro コーポレートサイトに不要な client directive / React island が増えた件数 | コーポレートサイト性能劣化を防ぐ |
| Direct UI Duplication Count          | app 配下で共通化すべき UI が重複実装された件数                                | 一貫性を守る                     |
| Package Boundary Violation Count     | app から private 実装や別 app の内部へ依存した件数                            | monorepo 境界を守る              |
| React Compiler Incompatibility Count | React Compiler 非対応ライブラリや実装が未確認で入った件数                     | React 側の将来負債を抑える       |

未確定の数値目標 (例: Lighthouse スコア、問い合わせ転換率、訪問数) は Phase 1 公開後の計測基盤と運用体制が決まってから確定する。現時点では build / E2E / island 方針 / 正本リンクを Phase 1 の検証可能な成功条件とする。

## スコープ

### Phase 1 スコープイン

- `apps/corporate-site` を Astro コーポレートサイトとして構築する。
- `packages/ui` に shared UI package の skeleton を置く。
- `packages/config` に TypeScript、lint、format などの共有設定を置く。
- root 管理の E2E 入口を整備し、コーポレートサイトの主要導線を公開前に検証できる状態にする。
- AI 向け設定 (`AGENTS.md`、`CLAUDE.md`、`.agents`、`.codex`、`.claude`、`.cursor`) を monorepo 方針に合わせる。
- spec / ADR により、実装前にスコープ、責務、検証方法を整理できる状態にする。

### Phase 1 スコープアウト

- CMS/API の本実装。
- 認証、管理画面、内部業務ツールの本実装。
- 汎用 UI ライブラリの過剰な整備。
- Astro で済むコーポレートサイト機能の React 化。

## Phase 1 完成条件

- `apps/corporate-site` の責務、技術選定、禁止事項が Design Docs と AI 設定に明記されている。
- `packages/ui` の skeleton が将来拡張の入口として配置され、Phase 2 の実装対象と区別されている。
- `packages/config` の役割と export 対象が明確で、root / app / package の責務境界が文書化されている。
- コーポレートサイトの主要ページと問い合わせ導線を検証する E2E 方針がある。
- 将来の React 化と build 最適化の適用方針が Design Doc / context / ADR で明文化されている。
- 不要依存と境界違反 (循環、未宣言依存、app 間直接依存など) を root から検査できる。
- commit 前に repository quality gate (依存検査・dead code 検出) が自動実行される。
- CMS/API は初期スコープ外であり、必要時に ADR / spec で判断することが明記されている。
- コピー元固有のコード検索やインデックス前提がドキュメントや AI workflow から取り除かれている。

## 要求情報まとめ

### コーポレートサイト要求

- Astro を基本に、静的生成と最小限の island で構築する。
- 画像、フォント、クライアント JavaScript を性能予算内に収める。
- コンテンツ更新時にセクション責務と配置先が分かる。
- 公開前に主要導線を E2E で確認できる。

### CMS / React アプリ要求

- Phase 1 では `apps/cms` を実装せず、以下は Phase 2 以降の要求として扱う。
- UI は `@kufu/ui` を経由し、app 配下で UI を重複実装しない。
- URL を状態管理の一部として扱い、ルーティング中心で設計する。
- データフェッチ、フォーム、client state、追加ライブラリの採否は feature doc / ADR で標準を決定する。
- React Compiler 適用を前提とし、非対応ライブラリ・実装の扱いは feature doc で運用する。

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
- Phase 1 の主対象は Astro コーポレートサイトである。
- `apps/cms` はコーポレートサイト掲載投稿を管理する将来 app 候補として扱う。
- `packages/ui` は Phase 1 で skeleton まで作り、`apps/cms` の技術選定と機能実装は次フェーズへ送る。
- CMS/API は初期スコープ外で、必要になった時点で Hono API、Inertia、React の採否を判断する。
- 実体コードが未作成の場合でも、ドキュメントは構築予定の repo contract として扱う。

## 未決事項

| #   | 論点                                                                                  | 決定者               | 期限             | 状態 | メモ                                                                            |
| --- | ------------------------------------------------------------------------------------- | -------------------- | ---------------- | ---- | ------------------------------------------------------------------------------- |
| 1   | コーポレートサイト公開後の事業 KPI (訪問数、問い合わせ転換率など) をどの指標で見るか  | Kufu owner           | Phase 1 公開後   | 未決 | Phase 1 中は build / E2E / 導線確認を成功条件とする                             |
| 2   | Lighthouse / bundle size など performance budget の具体値                             | 開発者 + Kufu owner  | 公開前検証 phase | 未決 | Astro 静的生成と不要 island 0 件を先に守る                                      |
| 3   | `apps/cms` の立ち上げ判断基準                                                         | Kufu owner           | Phase 2 着手前   | 未決 | 投稿数、更新頻度、運用者人数、外部編集者の有無で判断する                        |
| 4   | コーポレートサイトコンテンツ更新の責務分担と承認フロー                                | Kufu owner           | 初回運用開始前   | 未決 | CMS 化前は committed reference と PR review を正本運用にする                    |
| 5   | Cloudflare Pages の preview / production に紐づく domain / branch / secret 運用ルール | 開発者 + infra owner | 本番公開前       | 未決 | 実装方針は [context/infrastructure.md](context/infrastructure.md) と ADR へ委譲 |

## 変更履歴

| 日付       | 変更者 | 変更内容                                                             |
| ---------- | ------ | -------------------------------------------------------------------- |
| 2026-06-14 | Codex  | ターゲット、成功条件、未決事項を styleguide-documents に沿って具体化 |

## 関連ドキュメント

- 全体設計 (landscape): [design/DesignDoc.md](design/DesignDoc.md)
- feature 設計 (How): [design/features/](design/features/)
- 技術規約 / 運用契約: [context/](context/)
- spec 運用: [specs/README.md](specs/README.md)
- ADR 運用: [adr/README.md](adr/README.md)
