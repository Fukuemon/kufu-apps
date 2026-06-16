# コーポレートサイト 問い合わせフォーム

> 対象: 有限会社フクウラ コーポレートサイト お問い合わせページ (P6 `/contact`) の問い合わせフォーム機能仕様。
> スコープ: フォーム入力項目 / バリデーション / 送信処理 / スパム対策 / React island 化判断。IA (ページ・section 構成) は [#11](../11-corporate-site-ia/index.md)、デザイントークンは [#13](../13-design-system-foundation/index.md) を正本とする。
> 正本境界: 本 spec は issue #14 の論点・決定経緯・受け入れ基準・実装分割を記録する。durable な設計成果 (送信バックエンド方式 / island ポリシー適用) を確定したら `spec-sync` で feature doc / context / ADR へハンドオフする。

## メタ情報

- Issue: `#14`
- ステータス: `Draft`
- 作成日: 2026-06-16
- 更新日: 2026-06-17
- Branch: `feature/14`
- Owner: Fukuemon

## 設計フェーズ状況

状態は `未着手 / 進行中 / 完了 / レビュー済 / 保留` のいずれか。保留の場合は理由を備考に残す。

| #   | フェーズ                    | 状態   | 最終更新   | 備考                                   |
| --- | --------------------------- | ------ | ---------- | -------------------------------------- |
| 1   | 起票                        | 完了   | 2026-06-16 | issue #14 (Refs #11 / Part of #10)     |
| 2   | 下書き                      | 進行中 | 2026-06-16 | spec-draft で index.md 初版生成        |
| 3   | 上位文書突合                | 完了   | 2026-06-16 | 矛盾なし。送信バックエンド方式を論点化 |
| 4   | 論点整理                    | 進行中 | 2026-06-16 | D1〜D7 を抽出                          |
| 5   | 論点解決                    | 進行中 | 2026-06-17 | D1 確定 (A: Workers 中継)。D2〜D7 残   |
| 6   | Interface / Routing 設計    | 未着手 |            |                                        |
| 7   | Content / Data 設計         | 未着手 |            |                                        |
| 8   | Performance / Security 設計 | 未着手 |            | island コスト / Turnstile / 個人情報   |
| 9   | Test / Metrics 設計         | 未着手 |            | 問い合わせ導線 E2E                     |
| 10  | 実装分割                    | 未着手 |            | `spec-prompts` で生成                  |
| 11  | レビュー済                  | 未着手 |            | `spec-review` 待ち                     |

## 上位文書整合

正本 ([PRD](../../PRD.md) / [Design Doc](../../design/DesignDoc.md) / [feature doc](../../design/features/corporate-site/DesignDoc_corporate-site.md) / [context](../../context/) / ADR) のどの節と、どう整合させたかを記録する。

- PRD 更新要否: 不要 (継承。Phase 1「問い合わせ導線」完成条件の範囲)
- Design Doc 更新要否: 不要 (継承。feature doc 側で扱う)
- ADR 起票要否: **要の見込み** (D1=A 確定により corporate-site が `output: "static"` から Pages Functions/Workers 併用へ移行する新規アーキ判断が発生。最終判断は D7)

| 上位文書    | 節 / 該当箇所                                              | 整合方針 (継承 / 補足 / 変更提案)      |
| ----------- | ---------------------------------------------------------- | -------------------------------------- |
| PRD         | プロダクト原則「コーポレートサイトの性能を最優先する」     | 継承                                   |
| Design Doc  | モジュール責務 → `apps/corporate-site`                     | 継承                                   |
| feature doc | ページ構成 IA → P6 `/contact` 連絡先 + フォーム (機能 #14) | 補足 (本 spec が機能仕様を埋める)      |
| context     | architecture → Runtime Boundary / shadcn island 境界       | 継承 (フォームは island)               |
| context     | infrastructure → Cloudflare Pages / Turnstile / Workers    | 補足 (送信経路を D1 で具体化)          |
| context     | testing → E2E 主要導線 (問い合わせ導線)                    | 継承                                   |
| ADR-0008    | corporate-site の React island policy                      | 継承 (フォームは「最初の主要 island」) |

> 送信バックエンド方式 (D1) を確定したら、infrastructure.md の Infrastructure Contract / Security と feature doc へ `spec-sync` で反映する。新規アーキ判断なら ADR を起票する。

## 関連資料

- `PRD.md`: コーポレートサイト性能原則 / Phase 1「問い合わせ導線」完成条件
- `design/DesignDoc.md`: モジュール責務 (`apps/corporate-site`)
- [feature doc](../../design/features/corporate-site/DesignDoc_corporate-site.md): P6 `/contact` の IA / island 境界
- [spec #11 (IA)](../11-corporate-site-ia/index.md): Q4 でフォーム設置を決定 (機能仕様は本 spec へ委譲)
- [ADR-0008](../../adr/0008-astro-react-island-policy.md): フォームは最初の主要 island
- [context/infrastructure.md](../../context/infrastructure.md): Cloudflare Pages / Turnstile / Workers
- [company-profile.md](../../design/features/corporate-site/reference/company-profile.md): 連絡先正本 (TEL 079-492-6465 / FAX 079-492-6429 / Email fukuura@mist.ocn.ne.jp)
- 関連 issue: #11 (IA) / #10 (本体実装) / #13 (デザイントークン)

## 背景

- なぜこの spec が必要か: IA 設計 (#11 Q4) で「お問い合わせページに問い合わせフォームを設置する」と決定したが、フォームの機能仕様 (送信処理 / バリデーション / スパム対策) は IA のスコープ外として #14 へ委譲された。
- Phase 1 のどの完成条件に関わるか: 「コーポレートサイトの主要ページと問い合わせ導線を E2E で検証できる状態にする」(PRD / feature doc)。フォームは問い合わせ導線の終端 (接点確保 BR2)。
- 影響範囲: **コーポレートサイト** (`apps/corporate-site`)。フォームは ADR-0008 が定める「最初の主要 React island」であり、性能予算 (Unnecessary Client JS Count) と両立させる必要がある。送信経路は Cloudflare Pages の静的配信前提と整合させる。

## スコープ

### やること

- 問い合わせフォームの入力項目定義 (項目 / 必須・任意 / 型) とバリデーション仕様。
- 送信処理の方式 (送信先 / 経路 / 通知手段) の決定。
- スパム対策 (Cloudflare Turnstile 等) の方式決定。
- React island 化の範囲と client directive の選定 (ADR-0008 適用)。
- 個人情報の取り扱い方針 (保存有無 / プライバシー表記) の明記。
- 問い合わせ導線 (フォーム送信成功 / エラー) の E2E 検証方針。

### やらないこと

- ページ / section 構成・連絡先掲載の配置 (IA #11 / feature doc が正本)。
- デザイントークン (配色 / タイポ / spacing) の定義 → #13。
- お問い合わせ以外のページ実装 → #10。
- フォーム本文 (項目ラベル等) の最終コピーライティング。
- CMS 化・問い合わせ内容の永続管理 / 管理画面 (Phase 2 以降の検討事項)。

## 要件の解釈

### 実現したいユーザー価値

- 訪問者 (B2B の取引先・見込み顧客) が、電話 / FAX / メールに加えてフォームから手軽に問い合わせを送れる。
- 送信結果 (成功 / 失敗) が明確に伝わり、問い合わせが届いたか不安にならない。
- 高速な静的サイトの体験を損なわない (フォーム島が性能予算を圧迫しない)。

### 成功条件

- フォーム入力項目とバリデーション仕様が定義されている (完了条件 1)。
- 送信処理とスパム対策の方式が決まっている (完了条件 2)。
- 問い合わせ導線が E2E で検証できる (完了条件 3)。

### 対象ユーザー / 操作主体

- 主要: フクウラへ機械工具 / 加工を発注検討する B2B 担当者。
- 副次: サイト運用者 (届いた問い合わせを受信する側 = fukuura@mist.ocn.ne.jp)。

EARS 風で振る舞いを記述する。

- WHEN 訪問者がお問い合わせページ (P6) でフォームに必須項目を入力し送信したとき、システムは 入力を検証し、スパム対策を通過した場合に問い合わせ内容を送信先へ届ける。
- IF 必須項目が未入力または形式不正のとき、システムは 送信せず該当項目にエラーを表示する。
- IF 送信処理が失敗したとき、システムは エラーを表示し再送可能な状態を保つ (入力値を失わない)。
- WHEN 送信が成功したとき、システムは 完了メッセージを表示する。
- WHERE スパム対策 (D2 で確定する手段)、システムは bot / 自動送信を抑止する。
- THE SYSTEM SHALL 表示専用 UI は静的描画とし、インタラクティブなフォームのみを `client:*` island 化する (ADR-0008)。

## 設計時の論点

設計 / 実装フェーズへ持ち越す残課題を 1 件ずつ管理する。確定したものは「解決済みの論点」へ移す。

| #   | 論点                                     | 決定候補                                                                                 | 決定                                                                                 |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| D1  | 送信バックエンド方式                     | Cloudflare Workers 中継 / 第三者フォームサービス / mailto リンク代替                     | **確定: A. Cloudflare Pages Functions / Workers 中継 (同一オリジン `/api/contact`)** |
| D2  | スパム対策の手段                         | Cloudflare Turnstile / honeypot + rate limit / 併用                                      | 未決                                                                                 |
| D3  | 送信先への通知手段                       | メール送信サービス (Resend / MailChannels 等) / Workers から SMTP / フォームサービス内蔵 | 未決                                                                                 |
| D4  | フォーム入力項目とバリデーション         | 会社名 / 担当者名 / メール / 電話 / 問い合わせ種別 / 本文 の必須・任意・形式             | 未決                                                                                 |
| D5  | React island 化の範囲と client directive | フォーム全体を island / `client:visible` か `client:idle` か `client:load`               | 未決                                                                                 |
| D6  | 個人情報の取り扱い・プライバシー表記     | 保存しない (通知のみ) / プライバシーポリシー / 同意チェックの要否                        | 未決                                                                                 |
| D7  | ADR 起票要否                             | D1 / D2 が新規アーキ判断なら ADR、既存 context 範囲内なら不要                            | 未決                                                                                 |

## 解決済みの論点

(`spec-resolve` で確定したものをここに移動する)

- **D1 送信バックエンド方式** → **A. Cloudflare Pages Functions / Workers 中継**。フォーム island から同一オリジンの `/api/contact` (Pages Functions = Workers) へ POST し、Workers が送信先へ届ける。第三者 API のブラウザ直叩きを避け (architecture.md)、secret を server 側に隠し、Turnstile の server 検証 (D2) も同所で完結させる。Decision Priority「一貫性」(Cloudflare 完結) に合致。波及: D3 (通知手段は Workers 経由前提) / D2 (Turnstile server 検証を Workers が担う) / D7 (Workers 依存追加は新規アーキ判断のため ADR 起票が要の見込み)。

## 未確定事項

(決定できない項目を理由とともに残す。1 件でも残っていれば下流 phase は止める)

- D2〜D7 は未解決。次は D7 (ADR 起票要否) または D3 (通知手段) を D1 の確定を受けて解決する。

## 実装対象

正規 target は `context/project.md` の対象ドメイン一覧を正本とする。

| モジュール       | 実装有無 | 主な責務                                                           |
| ---------------- | :------: | ------------------------------------------------------------------ |
| `corporate-site` |    ◯     | フォーム UI (island) / バリデーション / 送信呼び出し / 結果表示    |
| `cms`            |    -     | Phase 2 以降。問い合わせの永続管理はスコープ外                     |
| `ui`             |    △     | フォーム部品 (Input / Textarea / Button 等) は `@kufu/ui` から消費 |
| `config`         |    -     | 影響なし                                                           |
| `e2e`            |    ◯     | 問い合わせ導線 (入力 → 送信 → 完了 / エラー) の検証                |
| `core`           |    -     | 横断影響なし                                                       |

## 機能仕様

### User Flow

1. 訪問者がお問い合わせページ (P6 `/contact`) に到達し、連絡先とフォームを確認する。
2. フォームに必須項目を入力し、スパム対策 (D2) を満たして送信する。
3. 入力検証を通過すると送信処理 (D1 / D3) が走り、送信先へ問い合わせが届く。
4. 成功時は完了メッセージ、失敗 / 検証エラー時はエラー表示で再送できる。

### Reuse Policy

- 第一原則は feature / colocation。フォームコンポーネントは `apps/corporate-site` 内に colocation する。
- フォーム部品 (Input / Textarea / Select / Button 等) は `@kufu/ui` の shadcn コンポーネントを正本として消費する (app 内で再実装しない)。
- 送信ロジック / バリデーションスキーマは複数 app をまたぐ需要が出るまで colocation に置く。

### Performance

- ADR-0008 に従い、表示専用 UI は静的描画 (JS ゼロ)、フォームのみ `client:*` island 化する。
- island の client directive は遅延系 (`client:visible` / `client:idle`) を既定とする (D5 で確定)。
- `client:*` 総数は PRD ガードレール「Unnecessary Client JS Count」で監視する範囲に収める。

### Routing / URL State

- `/contact` は静的ルート。送信先は同一オリジンの `/api/contact` (Cloudflare Pages Functions = Workers, D1)。
- フォーム状態は island 内のローカル state に閉じ、URL へは寄せない (送信完了をクエリで表すかは D5 で判断)。

### Content / Assets

- 送信は island → 同一オリジン `/api/contact` (Workers) 経由 (D1)。Workers がメール送信 (D3) で連絡先正本 (company-profile.md) の `fukuura@mist.ocn.ne.jp` へ届ける。
- 実値 (メール送信 API key / 宛先 secret / Turnstile secret) は repo に保存せず Cloudflare secret 管理に置き、client bundle に含めない (infrastructure.md / architecture.md)。
- ブラウザから第三者 API を直接叩かず、Workers を中継点にする (architecture.md Runtime Boundary)。
- 問い合わせ内容は永続化しない方針を既定とする (D6 で確定)。

### UI Reuse

- フォーム部品は `@kufu/ui` 経由。横断再利用が明確化した時点で `packages/ui` へ昇格 (architecture.md)。

### React Compiler

- フォームは corporate-site で唯一の主要 React island (ADR-0008)。React Compiler を有効化する場合、フォーム island (React Hook Form 等の利用想定) が Compiler 互換であることを実装時 (#10 / D5) に確認する。
- Astro 静的描画される表示専用 UI は React ランタイムを出荷しないため Compiler の対象外。

### Testing

- Playwright で問い合わせ導線 (入力 → 送信 → 完了) と検証エラー / 送信失敗時の振る舞いを検証する (testing.md)。
- 送信先は同一オリジン `/api/contact` (Workers, D1)。E2E では実メール送信を避けるため、この Workers エンドポイントをモック / スタブ化する境界とする (実装で route intercept か preview 環境のテスト用挙動を選ぶ)。

## Interface 設計

### UI / API / Event Interface

- (D4 で項目確定後に記述) フォーム UI: 入力項目 + 送信ボタン + スパム対策 widget + 結果表示。
- 送信 IF: フォーム island → 同一オリジン `/api/contact` (Cloudflare Pages Functions = Workers, D1) への HTTP POST。Workers が検証・スパム判定 (D2) を行いメール送信 (D3) する。

### Props / Request / Response

- request: 入力項目の payload (D4 で確定) + スパム対策 token (D2)。`POST /api/contact`。
- response: 成功 (200) / バリデーションエラー (400) / スパム判定失敗 / サーバエラー (5xx)。詳細スキーマは D4 / D2 確定後に確定 (api appendix 取り込み時に記述)。

## Content / Data 設計

### 保存・管理するデータ

- 既定は永続化なし (通知のみ)。保存する場合の方針は D6 で確定する。

### コンテンツ配置 / package / route

- フォーム UI (island) は `apps/corporate-site` の `/contact` ページ配下に colocation。
- 送信エンドポイント `/api/contact` は Cloudflare Pages Functions (Workers) として `apps/corporate-site` 側に配置 (D1)。`output: "static"` から Pages Functions 併用へ移行する点は infra contract / ADR (D7) に反映する。

## Performance / Security 設計

### Performance

- island は遅延ディレクティブ既定 (D5)。表示専用部分は静的描画で JS ゼロを保つ。

### Security / Privacy

- 送信は同一オリジン `/api/contact` (Workers) を中継点とし、ブラウザから第三者 API を直接叩かない (D1 / architecture.md Runtime Boundary)。
- スパム / bot 対策を必須とする (D2)。Turnstile を採用する場合の server 側トークン検証は Workers が担う。
- secret (メール送信 API key / 宛先 / Turnstile secret) は client bundle に含めず Cloudflare secret 管理 (architecture.md / infrastructure.md)。
- 個人情報 (氏名 / メール / 電話) を扱うため、保存有無・プライバシー表記・同意取得を D6 で決定する。

## Error / Fallback 設計

### エラーケース

| #   | ケース                        | ユーザーへの見せ方             | リカバリ                          |
| --- | ----------------------------- | ------------------------------ | --------------------------------- |
| 1   | 必須項目未入力 / 形式不正     | 該当項目にインラインエラー表示 | 修正して再送 (入力値は保持)       |
| 2   | スパム対策チェック未通過      | 送信を抑止しエラー表示 (D2)    | 再チャレンジ                      |
| 3   | 送信処理失敗 (ネットワーク等) | エラーメッセージ + 再送可能    | 入力値を失わず再送 / 連絡先へ誘導 |

### Fallback

- 送信バックエンドが障害時でも、ページ上の TEL / FAX / メール (連絡先正本) で接点を確保できる (フォームはあくまで補助導線)。

## テスト / 評価方針

### テスト観点

- 必須項目バリデーションが機能すること (エラーケース #1)。
- 送信成功時に完了表示されること。
- 送信失敗時に入力値を保持し再送できること (エラーケース #3)。
- フォーム以外の表示専用 UI に不要な island が増えていないこと (ADR-0008)。

### 計測指標

- E2E Critical Flow Coverage (問い合わせ導線)。
- Unnecessary Client JS Count (PRD ガードレール) を超過しないこと。

## フロー / シーケンス

(`spec-diagrams` で生成。spec の主要操作を Mermaid 図に落とす)

### Flowchart (ユーザー操作起点)

```mermaid
flowchart TD
```

### Sequence

```mermaid
sequenceDiagram
```

## 実装分割

### 実装タスク案

| Phase | 対象             | 概要                                            | 依存     |
| ----- | ---------------- | ----------------------------------------------- | -------- |
| P1    | `corporate-site` | フォーム UI (island) + バリデーション (D4 / D5) | #13, #10 |
| P2    | `corporate-site` | 送信処理 + スパム対策の組み込み (D1 / D2 / D3)  | P1       |
| P3    | `e2e`            | 問い合わせ導線 (成功 / エラー) の検証           | P1, P2   |

### prompts 生成方針

- `corporate-site` 内でフォーム UI → 送信処理 → e2e の順に依存付け。
- 送信バックエンド (D1) 確定後に P2 を確定する前提を prompt に明記。

## 上位資料からの変更点

本 spec で PRD / Design Doc / feature doc / context / 既存 ADR から変更・追加した内容を、反映先別に記録する。`spec-track` / `spec-sync` で更新する。

### PRD への影響

| 対象節 | 変更内容        | 理由 |
| ------ | --------------- | ---- |
| -      | 影響なし (継承) | -    |

### Design Doc への影響

| 対象節 | 変更内容        | 理由 |
| ------ | --------------- | ---- |
| -      | 影響なし (継承) | -    |

### feature doc への影響

| 対象 doc / 節         | 変更内容 | 理由 |
| --------------------- | -------- | ---- |
| (D1〜D6 確定後に記録) |          |      |

### context への影響

| 対象 doc / 節                               | 変更内容                                                                                                                       | 理由                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| infrastructure.md / Infrastructure Contract | Workers 依存「有」を追加し、送信経路 `/api/contact` (Pages Functions) と必要 secret 名 (メール送信 / Turnstile) を contract 化 | D1=A で Workers 中継を採用 (source: spec-resolve) |
| infrastructure.md / Security・Operations    | フォーム送信経路の bot 対策・監視を Workers 前提で具体化                                                                       | 同上 (source: spec-resolve)                       |

> 上記は `spec-sync` での back-propagation 候補。確定反映は D2〜D7 解決後にまとめて行う。

### ADR の新規 / 更新

| ADR ID            | 変更内容                                                                                                                    | 理由                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| (新規, D7 で確定) | corporate-site の問い合わせ送信を Cloudflare Pages Functions (Workers) 中継にする決定 (`output: "static"` + Functions 併用) | D1=A は静的のみ前提を超える新規アーキ判断 (source: spec-resolve) |

## レビュー

`spec-review` (fresh-context evaluator) の最新結果。完全な記録は `review.md` を参照。

| 日付 | 結果 (PASS / NEEDS_WORK) | 指摘要点 | 対応 |
| ---- | ------------------------ | -------- | ---- |
|      |                          |          |      |

## 変更履歴

| 日付       | 変更者   | 変更内容                                                                             |
| ---------- | -------- | ------------------------------------------------------------------------------------ |
| 2026-06-16 | Fukuemon | spec-draft で index.md 初版生成                                                      |
| 2026-06-17 | Fukuemon | spec-resolve: D1 (送信バックエンド方式) を A (Pages Functions / Workers 中継) で確定 |

## 備考

<!--
追加 appendix が必要な spec は、templates/specs/appendices/ から該当 topic を取り込むこと:

- API endpoint / request / response → appendices/api.md (送信エンドポイントを Workers 中継にする場合 D1 確定後に検討)
- data-testid 一覧 → appendices/testid.md (問い合わせ導線 E2E のため検討)
-->
