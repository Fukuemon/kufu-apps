# コーポレートサイト 問い合わせフォーム

> 対象: 有限会社フクウラ コーポレートサイト お問い合わせページ (P6 `/contact`) の問い合わせフォーム機能仕様。
> スコープ: フォーム入力項目 / バリデーション / 送信処理 / スパム対策 / React island 化判断。IA (ページ・section 構成) は [#11](../11-corporate-site-ia/index.md)、デザイントークンは [#13](../13-design-system-foundation/index.md) を正本とする。
> 正本境界: 本 spec は issue #14 の論点・決定経緯・受け入れ基準・実装分割を記録する。durable な設計成果 (送信バックエンド方式 / island ポリシー適用) を確定したら `spec-sync` で feature doc / context / ADR へハンドオフする。

## メタ情報

- Issue: `#14`
- ステータス: `Review`
- 作成日: 2026-06-16
- 更新日: 2026-06-17
- Branch: `feature/14`
- Owner: Fukuemon

## 設計フェーズ状況

状態は `未着手 / 進行中 / 完了 / レビュー済 / 保留` のいずれか。保留の場合は理由を備考に残す。

| #   | フェーズ                    | 状態   | 最終更新   | 備考                                                                                       |
| --- | --------------------------- | ------ | ---------- | ------------------------------------------------------------------------------------------ |
| 1   | 起票                        | 完了   | 2026-06-16 | issue #14 (Refs #11 / Part of #10)                                                         |
| 2   | 下書き                      | 完了   | 2026-06-16 | spec-draft で index.md 初版生成                                                            |
| 3   | 上位文書突合                | 完了   | 2026-06-16 | 矛盾なし。送信バックエンド方式を論点化                                                     |
| 4   | 論点整理                    | 完了   | 2026-06-16 | D1〜D7 を抽出                                                                              |
| 5   | 論点解決                    | 完了   | 2026-06-17 | D1〜D13 全件確定 (D8〜D13 は Rv 由来)                                                      |
| 6   | Interface / Routing 設計    | 完了   | 2026-06-17 | API appendix (`/api/contact`) + 図化済                                                     |
| 7   | Content / Data 設計         | 完了   | 2026-06-17 | 永続化なし / Resend 通知                                                                   |
| 8   | Performance / Security 設計 | 完了   | 2026-06-17 | 単一island / Turnstile+honeypot / 個人情報                                                 |
| 9   | Test / Metrics 設計         | 完了   | 2026-06-17 | testid appendix + 問い合わせ導線 E2E                                                       |
| 10  | 実装分割                    | 未着手 |            | `spec-prompts` で生成                                                                      |
| 11  | レビュー済                  | 完了   | 2026-06-17 | spec-review PASS + 多エージェント Rv → 指摘 D8〜D13 対応 + spec-sync → 再 spec-review PASS |

## 上位文書整合

正本 ([PRD](../../PRD.md) / [Design Doc](../../design/DesignDoc.md) / [feature doc](../../design/features/corporate-site/DesignDoc_corporate-site.md) / [context](../../context/) / ADR) のどの節と、どう整合させたかを記録する。

- PRD 更新要否: 不要 (継承。Phase 1「問い合わせ導線」完成条件の範囲)
- Design Doc 更新要否: 不要 (継承。feature doc 側で扱う)
- ADR 起票要否: **要 → 反映済 (D7)**。新規 [ADR-0009](../../adr/0009-corporate-site-contact-form-backend.md) を `spec-sync` で起票済み。corporate-site の問い合わせ送信を Cloudflare Pages Functions (Workers) 中継にする決定 (`output: "static"` + Functions 併用) を記録した。

| 上位文書    | 節 / 該当箇所                                              | 整合方針 (継承 / 補足 / 変更提案)                                          |
| ----------- | ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| PRD         | プロダクト原則「コーポレートサイトの性能を最優先する」     | 継承                                                                       |
| Design Doc  | モジュール責務 → `apps/corporate-site`                     | 継承                                                                       |
| feature doc | ページ構成 IA → P6 `/contact` 連絡先 + フォーム (機能 #14) | 補足 (本 spec が機能仕様を埋める)                                          |
| context     | architecture → Runtime Boundary / shadcn island 境界       | 継承 (フォームは island)                                                   |
| context     | infrastructure → Cloudflare Pages / Turnstile / Workers    | 補足 (送信経路を D1 で具体化)                                              |
| context     | testing → E2E 主要導線 (問い合わせ導線)                    | 継承                                                                       |
| ADR-0008    | corporate-site の React island policy                      | 継承 (フォームは「最初の主要 island」)                                     |
| ADR-0009    | 問い合わせ送信を Workers 中継にする決定 (本 spec で起票)   | **正本** (spec-sync で起票。アーキ決定は ADR-0009 / infra contract が正本) |

> 送信バックエンド方式 (D1) は確定済。infrastructure.md の Infrastructure Contract / Security と feature doc / ADR-0009 へ `spec-sync` で反映済 (2026-06-17)。

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
- WHERE スパム対策 (Turnstile + honeypot, D2)、システムは bot / 自動送信を抑止する。
- THE SYSTEM SHALL 表示専用 UI は静的描画とし、インタラクティブなフォームのみを `client:*` island 化する (ADR-0008)。

## 設計時の論点

設計 / 実装フェーズへ持ち越す残課題を 1 件ずつ管理する。確定したものは「解決済みの論点」へ移す。

| #   | 論点                                                     | 決定候補                                                                                                                | 決定                                                                                          |
| --- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| D1  | 送信バックエンド方式                                     | Cloudflare Workers 中継 / 第三者フォームサービス / mailto リンク代替                                                    | **確定: A. Cloudflare Pages Functions / Workers 中継 (同一オリジン `/api/contact`)**          |
| D2  | スパム対策の手段                                         | Cloudflare Turnstile / honeypot + rate limit / 併用                                                                     | **確定: C. Turnstile + honeypot 併用 (Workers で多層検証)**                                   |
| D3  | 送信先への通知手段                                       | メール送信サービス (Resend / MailChannels 等) / Workers から SMTP / フォームサービス内蔵                                | **確定: A. Resend (Workers から HTTP API で送信)**                                            |
| D4  | フォーム入力項目とバリデーション                         | 会社名 / 担当者名 / メール / 電話 / 問い合わせ種別 / 本文 の必須・任意・形式                                            | **確定: 下記項目セット (client + Workers の二重検証)。詳細は解決済み / Interface 参照**       |
| D5  | React island 化の範囲と client directive                 | フォーム全体を island / `client:visible` か `client:idle` か `client:load`                                              | **確定: フォーム全体を単一 island + `client:visible` (ADR-0008 既定)**                        |
| D6  | 個人情報の取り扱い・プライバシー表記                     | 保存しない (通知のみ) / プライバシーポリシー / 同意チェックの要否                                                       | **確定: 保存しない (通知のみ) + 利用目的明記 + 送信＝同意の注記 (checkbox なし, B)**          |
| D7  | ADR 起票要否                                             | D1 / D2 が新規アーキ判断なら ADR、既存 context 範囲内なら不要                                                           | **確定: 要・新規 ADR-0009 を起票 (Workers 中継の送信バックエンド)**                           |
| D8  | rate limit / 濫用制御の方針 (Rv ②)                       | Workers 側 rate limit / quota を採用 / Phase 1 は非採用 (理由明記) / Turnstile のみで足りる                             | **確定: A. 採用。`/api/contact` に Cloudflare Rate Limiting (5 req/min/IP) を設定**           |
| D9  | API エラー response body スキーマ (Rv ③)                 | 全コード共通 `{ ok, code, message?, errors? }` / コード別個別 body / 現状 (例のみ) 維持                                 | **確定: A. 全エラー共通 `{ ok:false, code, message?, errors? }`**                             |
| D10 | スパム対策・Workers ロジックの検証境界 (Rv ④)            | E2E は route intercept 必須 + 実 Functions は CF preview 手動 / Workers 検証を Vitest unit / Turnstile test mode の扱い | **確定: A. E2E=route intercept 必須 + Workers ロジック=Vitest unit + 実結線=CF preview 手動** |
| D11 | メール生成時のインジェクション対策 (Rv security)         | 宛先・件名はサーバ固定 + 本文 plain text エスケープ / ヘッダ無害化のみ / 対策不要と判断                                 | **確定: A. 宛先・件名サーバ固定 + 本文 plain text 無害化 + ヘッダ CRLF 除去**                 |
| D12 | Turnstile token リプレイ防止 + Origin 検証 (Rv security) | token 単回検証 + Origin/Referer チェック / siteverify のみで十分と判断                                                  | **確定: A. token 単回検証 (siteverify 依拠) + Workers で Origin/Referer チェック**            |
| D13 | 「永続化なし」の射程明確化 (Rv codex)                    | 「アプリ側で DB 永続化しない」に限定し通知経路 (Resend / 受信箱) の保持範囲・利用目的を明記 / 現状表現維持              | **確定: A. 「アプリ側で DB/ストレージ/ログに永続化しない」に限定 + 通知経路の保持を明記**     |

## 解決済みの論点

(`spec-resolve` で確定したものをここに移動する)

- **D1 送信バックエンド方式** → **A. Cloudflare Pages Functions / Workers 中継**。フォーム island から同一オリジンの `/api/contact` (Pages Functions = Workers) へ POST し、Workers が送信先へ届ける。第三者 API のブラウザ直叩きを避け (architecture.md)、secret を server 側に隠し、Turnstile の server 検証 (D2) も同所で完結させる。Decision Priority「一貫性」(Cloudflare 完結) に合致。波及: D3 (通知手段は Workers 経由前提) / D2 (Turnstile server 検証を Workers が担う) / D7 (Workers 依存追加は新規アーキ判断のため ADR 起票)。
- **D7 ADR 起票要否** → **要・新規 ADR-0009 を起票**。D1=A は corporate-site を `output: "static"` のみの前提から Pages Functions (Workers) 併用へ移行させる新規アーキ判断であり、infrastructure.md (Workers 依存「有」) にも波及する。ADR 本体の作成と infrastructure.md への反映は `spec-sync` で行う。
- **D3 送信先への通知手段** → **A. Resend (HTTP メール API)**。Workers から Resend の HTTP API を fetch で呼び、問い合わせ内容を連絡先正本 `fukuura@mist.ocn.ne.jp` へメール通知する。無料枠 (100通/日・3,000通/月) が問い合わせ量に十分で、配信信頼性と実装の単純さを優先。Resend API key は Cloudflare Worker secret に置き client へ露出させない。送信ドメインの SPF/DKIM 検証が前提 (infra contract に記載)。MailChannels (無料提供終了) / 直接 SMTP (Workers で不安定) は不採用。
- **D5 React island 化の範囲と client directive** → **フォーム全体を単一 island + `client:visible`**。入力欄 / Turnstile widget / バリデーション / 送信 / 結果表示を1つの React コンポーネントとして island 化し、`/contact` の `client:*` を 1 個に抑える (性能予算)。directive は ADR-0008 既定の `client:visible` (フォームはスクロール到達が自然で JS を最大限遅延、Turnstile script も表示時に初読込)。実装時にフォームがファーストビュー内に収まるレイアウトなら `client:idle` へ切替可と申し送る。
- **D6 個人情報の取り扱い・プライバシー表記** → **保存しない (通知のみ) + 利用目的明記 + 送信＝同意の注記 (B)**。(1) Workers は受信内容を Resend 経由でメール通知するだけで DB / ログに本文を残さない (調査用の最小ログも個人情報を含めない)。(2) フォーム近傍に利用目的テキスト (例:「ご入力情報はお問い合わせ対応のみに利用します」) を表示し、個人情報保護法の利用目的明示に対応。(3) 同意は checkbox を設けず「送信をもって同意とみなす」旨を注記する (B2B 問い合わせの一般運用)。プライバシーポリシーページ新設 (IA #11 スコープ) には依存せず #14 内で完結する。
- **D4 フォーム入力項目とバリデーション** → 下記項目セットで確定。会社名 (任意/最大100) / 担当者名 (必須/1〜50) / メールアドレス (必須/メール形式) / 電話番号 (任意/数字・ハイフン・最大20) / 問い合わせ種別 (必須/select: 見積もり・販売について・加工について・その他) / 問い合わせ内容 (必須/10〜2,000) + honeypot 隠しフィールド (D2) + Turnstile token (D2)。バリデーションは **client (即時) と Workers (再検証) の二重**で行い、Workers は client を信頼せず同一スキーマで検証して不正は 400 を返す。実装は `@kufu/ui` のフォーム部品 + React Hook Form + zod 等を検討 (#10 / D5)。問い合わせ種別は事業の二本柱 (BR1) に対応。プライバシー同意 checkbox を追加するかは D6 で決定。
- **D2 スパム対策の手段** → **C. Cloudflare Turnstile + honeypot 併用**。client に Turnstile widget (site key) を置き、Workers が token を Turnstile `siteverify` (secret key) で検証する。加えて隠し honeypot フィールドを設け、値が入っていれば bot とみなし成功を装って黙って破棄する。Turnstile で巧妙な bot、honeypot でほぼゼロコストに単純 bot を弾く多層防御。Turnstile は Cloudflare ネイティブで一貫性が高く infrastructure.md の候補に合致。honeypot は client JS 追加なし。波及: D4 (隠し honeypot フィールドを項目に含める) / D5 (Turnstile の client script を island/directive 選定で考慮) / infra (Turnstile site key / secret key を contract に追加)。
- **D8 rate limit / 濫用制御の方針** → **A. 採用。`/api/contact` に Cloudflare Rate Limiting を設定 (叩き台: 同一 IP 5 req/min)**。Turnstile (巧妙 bot) + honeypot (単純 bot) + rate limit (Turnstile 通過後の連投・大量送信) の多層の最終段。Resend 無料枠 (100通/日, D3) の枯渇による送信不能 (可用性) を防ぐのが主目的。Cloudflare ネイティブの設定 (config レベル) で完結しコード追加は最小、Decision Priority「一貫性」(Cloudflare 完結) にも合致。しきい値は運用観測で調整可とし実装/運用へ申し送る。波及: infra (Rate Limiting ルールを Infrastructure Contract / Security に追加 → `spec-sync`) / D9 (rate limit 超過時の応答 429 `rate_limited` を共通エラー body に含める)。
- **D9 API エラー response body スキーマ** → **A. 全エラー共通 `{ ok: false, code, message?, errors? }`**。成功は `{ ok: true }`。`code` は `validation_error` (400) / `turnstile_failed` (400) / `rate_limited` (429, D8) / `send_failed` (502) の 4 種。`errors` はフィールド別エラー (`validation_error` 時のみ)、`message` は任意の表示用文言。honeypot 命中時は 200 `{ ok: true }` を装う (D2, 変更なし)。client はこの `code` で分岐し、`rate_limited` は「時間をおいて再送」、`send_failed` は「再送 + 連絡先誘導」を表示する。これで client 分岐と E2E 期待値が一意になる。波及: API 節 (レスポンス例・エラーコード一覧)・エラーケース表に反映。
- **D13 「永続化なし」の射程明確化** → **A. 「アプリ側で DB/ストレージ/ログに永続化しない」に限定し、通知経路の保持を明記**。「永続化なし」はアプリ (Workers) が DB / ストレージ / ログに本文を残さないことを指す。一方で Resend 経由のメール送信 → 受信箱 (`fukuura@mist.ocn.ne.jp`) および Resend 側の一時保持にはデータが残る旨を明記し、誤読を防ぐ。利用目的 (問い合わせ対応のみ) は D6 でカバー済で整合。spec 内 (Content/Data 設計・Security/Privacy) で完結。
- **D12 Turnstile token リプレイ防止 + Origin 検証** → **A. token 単回検証 + Workers で Origin/Referer チェック**。(1) Turnstile `siteverify` は同一 token の二度目の検証を拒否する仕様に依拠し token を単回利用とする (Workers 側に追加のストアは不要)。(2) Workers で `/api/contact` のリクエスト元 Origin/Referer を自サイトに限定し、外部オリジンからの直接 POST を弾く (CSRF/リプレイ耐性の一段上げ)。低コストで防御を強化。波及: Security 節に反映 + durable なセキュリティ判断として infrastructure.md / ADR-0009 へ `spec-sync`。
- **D11 メール生成時のインジェクション対策** → **A. 宛先・件名サーバ固定 + 本文 plain text 無害化 + ヘッダ CRLF 除去**。(1) Resend へ渡す宛先・件名はサーバ固定値とし、ユーザー入力を件名/宛先に展開しない。(2) ユーザー入力 (name / email / phone / company / message / category) は本文に **plain text としてのみ** 埋め込み、改行・制御文字 (`\r` `\n` 等) を無害化してメールヘッダインジェクションを防ぐ。(3) email を Reply-To に使う場合も CRLF 除去・単一値に制限してヘッダ無害化する。(4) 使用する値は zod でサーバ再検証済 (D4) のものだけ。波及: Security 節に反映 + durable なセキュリティ判断として infrastructure.md / ADR-0009 へ `spec-sync`。
- **D10 スパム対策・Workers ロジックの検証境界** → **A. 3 層の役割分担を固定** (`context/testing.md` の「ロジック=Vitest / 導線=Playwright」に整合)。(1) **E2E (Playwright)**: `/api/contact` を **route intercept してモック必須**とし、成功 (200) / `validation_error` (400) / `turnstile_failed` (400) / `rate_limited` (429) / `send_failed` (502) を fixture 化して導線・エラー表示・入力値保持を検証する。Turnstile は Cloudflare の **test mode キー** (常時 pass/fail) を使用、honeypot は正常系で空のまま (E2E 対象外)。`astro preview` (E2E runtime) では Pages Functions が動かないため実 Functions には依存させない。(2) **Workers ユニット (Vitest)**: 二重バリデーション (zod スキーマ) / honeypot 判定 / Turnstile `siteverify` 分岐 / エラー code マッピングを単体検証する。(3) **実 Functions 結線**: Cloudflare Pages preview で手動スモーク確認 (CI 対象外)。これで D2 の多層防御と D9 のエラー契約が回帰検証可能になる。波及: Testing 節・テスト/評価方針・data-testid 注記に反映。

## 未確定事項

(決定できない項目を理由とともに残す。1 件でも残っていれば下流 phase は止める)

- なし。D1〜D13 をすべて解決済み。D8 (rate limit) / D11 (メールインジェクション) / D12 (リプレイ・CSRF) の durable なセキュリティ判断は infrastructure.md / ADR-0009 へ `spec-sync` で反映済 (2026-06-17)。以後 infrastructure.md / ADR-0009 が durable 成果の正本。

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
- フォーム全体を単一 island とし、directive は `client:visible` (D5)。`/contact` の `client:*` は 1 個に収める。
- `client:*` 総数は PRD ガードレール「Unnecessary Client JS Count」で監視する範囲に収める。

### Routing / URL State

- `/contact` は静的ルート。送信先は同一オリジンの `/api/contact` (Cloudflare Pages Functions = Workers, D1)。
- フォーム状態は単一 island 内のローカル state に閉じ、URL へは寄せない (送信完了表示も island 内 state で扱う, D5)。

### Content / Assets

- 送信は island → 同一オリジン `/api/contact` (Workers) 経由 (D1)。Workers が Resend の HTTP API (D3) で連絡先正本 (company-profile.md) の `fukuura@mist.ocn.ne.jp` へメール通知する。
- 実値 (Resend API key / 宛先 / Turnstile secret) は repo に保存せず Cloudflare secret 管理に置き、client bundle に含めない (infrastructure.md / architecture.md)。送信ドメインの SPF/DKIM 検証が前提。
- ブラウザから第三者 API を直接叩かず、Workers を中継点にする (architecture.md Runtime Boundary)。
- 問い合わせ内容は永続化しない方針を既定とする (D6 で確定)。

### UI Reuse

- フォーム部品は `@kufu/ui` 経由。横断再利用が明確化した時点で `packages/ui` へ昇格 (architecture.md)。

### React Compiler

- フォームは corporate-site で唯一の主要 React island (ADR-0008)。React Compiler を有効化する場合、フォーム island (React Hook Form 等の利用想定) が Compiler 互換であることを実装時 (#10 / D5) に確認する。
- Astro 静的描画される表示専用 UI は React ランタイムを出荷しないため Compiler の対象外。

### Testing

- 検証境界は 3 層で固定する (D10, testing.md の「ロジック=Vitest / 導線=Playwright」に整合):
  - **E2E (Playwright)**: 問い合わせ導線 (入力 → 送信 → 完了) と各エラー時の振る舞いを検証する。`/api/contact` は **route intercept してモック必須** (実メール送信を避ける)。成功 (200) / `validation_error` (400) / `turnstile_failed` (400) / `rate_limited` (429) / `send_failed` (502) を fixture 化する。Turnstile は test mode キー、honeypot は正常系で空のまま (E2E 対象外)。`astro preview` では Pages Functions が動かないため実 Functions には依存させない。
  - **Workers ユニット (Vitest)**: 二重バリデーション (zod) / honeypot 判定 / Turnstile `siteverify` 分岐 / エラー code マッピングを単体検証する。
  - **実 Functions 結線**: Cloudflare Pages preview で手動スモーク確認 (CI 対象外)。

## Interface 設計

### UI / API / Event Interface

- フォーム UI (D4): 会社名 / 担当者名 / メールアドレス / 電話番号 / 問い合わせ種別 (select) / 問い合わせ内容 (textarea) + Turnstile widget + 送信ボタン + 結果表示 (成功 / エラー)。honeypot は非表示フィールド。送信ボタン近傍に利用目的テキストと「送信をもって同意とみなす」注記を表示する (D6=B, 同意 checkbox は設けない)。
- 送信 IF: フォーム island → 同一オリジン `/api/contact` (Cloudflare Pages Functions = Workers, D1) への HTTP POST。Workers が入力検証 + スパム判定 (Turnstile `siteverify` + honeypot, D2) を行い、通過時に Resend HTTP API (D3) でメール通知する。

### Props / Request / Response

入力項目 (D4):

| 項目           | key (案)                | 必須/任意 | 型/UI    | バリデーション                                   |
| -------------- | ----------------------- | :-------: | -------- | ------------------------------------------------ |
| 会社名         | `company`               |   任意    | text     | 最大 100 文字                                    |
| 担当者名       | `name`                  |   必須    | text     | 1〜50 文字                                       |
| メールアドレス | `email`                 |   必須    | email    | メール形式 (RFC 準拠の簡易チェック)              |
| 電話番号       | `phone`                 |   任意    | tel      | 入力時のみ: 数字・ハイフン, 最大 20 文字         |
| 問い合わせ種別 | `category`              |   必須    | select   | 選択肢から 1 つ (見積もり・販売 / 加工 / その他) |
| 問い合わせ内容 | `message`               |   必須    | textarea | 10〜2,000 文字                                   |
| (honeypot)     | `company_url`           |  hidden   | input    | 空であること (値があれば bot, D2)                |
| (Turnstile)    | `cf-turnstile-response` |     —     | widget   | Workers が `siteverify` で検証 (D2)              |

- request: 上記 payload + Turnstile token + honeypot。`POST /api/contact`。
- response: 成功 (200 `{ ok:true }`) / エラーは共通スキーマ `{ ok:false, code, message?, errors? }` (D9)。code = `validation_error` (400) / `turnstile_failed` (400) / `rate_limited` (429, D8) / `send_failed` (502)。honeypot 命中時は 200 を装い黙って破棄する (D2)。詳細は `## API` 参照。
- バリデーションは client (即時) と Workers (同一スキーマで再検証) の二重。実装は zod 等の共有スキーマを検討 (#10)。

## Content / Data 設計

### 保存・管理するデータ

- **アプリ側で永続化なし (通知のみ) で確定 (D6 / 射程は D13)**。「永続化なし」は **アプリ (Workers) が DB / ストレージ / ログに本文を残さない** ことを指す。Workers は受信内容を Resend のメール通知に渡すのみ。エラー調査用の最小ログも個人情報を含めない。
- ただし通知経路にはデータが残る (D13): Resend 経由のメール送信 → 受信箱 (`fukuura@mist.ocn.ne.jp`) および Resend 側の一時保持。これは通知という利用目的 (D6, 問い合わせ対応のみ) の範囲内。

### コンテンツ配置 / package / route

- フォーム UI (island) は `apps/corporate-site` の `/contact` ページ配下に colocation。
- 送信エンドポイント `/api/contact` は Cloudflare Pages Functions (Workers) として `apps/corporate-site` 側に配置 (D1)。`output: "static"` から Pages Functions 併用へ移行する点は infra contract / ADR (D7) に反映する。

## Performance / Security 設計

### Performance

- フォーム全体を単一 island とし directive は `client:visible` (D5)。表示専用部分は静的描画で JS ゼロを保つ。

### Security / Privacy

- 送信は同一オリジン `/api/contact` (Workers) を中継点とし、ブラウザから第三者 API を直接叩かない (D1 / architecture.md Runtime Boundary)。
- スパム / bot 対策は Turnstile + honeypot の併用 (D2)。Turnstile token の server 検証 (`siteverify`) と honeypot フィールド判定を Workers が担う。honeypot 命中時は成功を装い黙って破棄する。
- リプレイ / CSRF 対策 (D12): Turnstile token は単回利用 (`siteverify` の二度目拒否に依拠) とし、Workers で `/api/contact` のリクエスト元 Origin/Referer を自サイトに限定する。
- 濫用 / 連投対策として `/api/contact` に Cloudflare Rate Limiting (叩き台: 同一 IP 5 req/min) を設定する (D8)。Turnstile 通過後の連投・大量送信による Resend 無料枠 (D3) の枯渇 = 送信不能 (可用性) を防ぐ多層の最終段。超過時は 429 を返す。しきい値は運用観測で調整する。
- secret (Resend API key / 宛先 / Turnstile secret) は client bundle に含めず Cloudflare secret 管理 (architecture.md / infrastructure.md)。送信ドメインの SPF/DKIM 検証を前提とする。
- メール生成時のインジェクション対策 (D11): Resend へ渡す宛先・件名はサーバ固定値とし、ユーザー入力は本文に plain text としてのみ埋め込み、改行・制御文字 (`\r` `\n`) を無害化する。email を Reply-To に使う場合も CRLF 除去・単一値に制限する。使用値は zod でサーバ再検証済 (D4) のもののみ。
- 個人情報 (担当者名 / メール / 電話 / 会社名 / 本文) を扱うが **アプリ側では保存しない (通知のみ, D6)**。「永続化なし」の射程はアプリ (Workers) の DB/ストレージ/ログに限り、通知経路 (Resend / 受信箱) には残る (D13)。フォーム近傍に利用目的テキストを表示し、同意は checkbox を設けず「送信をもって同意とみなす」旨を注記する (D6=B, 個人情報保護法の利用目的明示に対応)。

## Error / Fallback 設計

### エラーケース

| #   | ケース                                                | ユーザーへの見せ方             | リカバリ                          |
| --- | ----------------------------------------------------- | ------------------------------ | --------------------------------- |
| 1   | 必須項目未入力 / 形式不正 (`validation_error` 400)    | 該当項目にインラインエラー表示 | 修正して再送 (入力値は保持)       |
| 2   | スパム対策チェック未通過 (`turnstile_failed` 400, D2) | 送信を抑止しエラー表示         | 再チャレンジ                      |
| 3   | 連投で rate limit 超過 (`rate_limited` 429, D8)       | 「時間をおいて再送」を表示     | 入力値を保持し時間をおいて再送    |
| 4   | 送信処理失敗 (`send_failed` 502 / ネットワーク等)     | エラーメッセージ + 再送可能    | 入力値を失わず再送 / 連絡先へ誘導 |

### Fallback

- 送信バックエンドが障害時でも、ページ上の TEL / FAX / メール (連絡先正本) で接点を確保できる (フォームはあくまで補助導線)。

## テスト / 評価方針

### テスト観点

- 必須項目バリデーションが機能すること (エラーケース #1 / E2E + Workers unit, D10)。
- 送信成功時に完了表示されること (E2E, モック 200)。
- スパム判定失敗時にエラー表示されること (`turnstile_failed` 400 / E2E モック + Workers unit, D2/D10)。
- 連投時に rate limit エラー表示されること (`rate_limited` 429 / E2E モック, D8)。
- 送信失敗時に入力値を保持し再送できること (エラーケース #4, `send_failed` 502 / E2E モック)。
- Workers ロジック (二重バリデーション / honeypot 判定 / Turnstile 分岐 / エラー code マッピング) が Vitest unit で検証されること (D10)。
- フォーム以外の表示専用 UI に不要な island が増えていないこと (ADR-0008)。

### 計測指標

- E2E Critical Flow Coverage (問い合わせ導線)。
- Unnecessary Client JS Count (PRD ガードレール) を超過しないこと。

## フロー / シーケンス

(`spec-diagrams` で生成。spec の主要操作を Mermaid 図に落とす)

### Flowchart (ユーザー操作起点)

```mermaid
flowchart TD
    Start(["訪問者が /contact のフォームに到達"]) --> Fill["項目を入力 (担当者名/メール/種別/本文 ほか)"]
    Fill --> Turnstile["Turnstile widget が token 発行 (D2)"]
    Turnstile --> Submit["送信 (送信=同意の注記, D6)"]
    Submit --> ClientValid{"client バリデーション OK? (D4)"}
    ClientValid -->|"NG"| FieldErr["該当項目にインラインエラー表示<br/>(入力値は保持)"]
    FieldErr --> Fill
    ClientValid -->|"OK"| Post["POST /api/contact (同一オリジン Workers, D1)"]

    Post --> Honeypot{"honeypot 空? (D2)"}
    Honeypot -->|"値あり = bot"| SilentDrop["成功を装い黙って破棄"]
    Honeypot -->|"空"| Verify{"Turnstile siteverify OK? (D2)"}
    Verify -->|"NG"| SpamErr["スパム判定エラー表示"]
    Verify -->|"OK"| ServerValid{"Workers 再検証 OK? (D4)"}
    ServerValid -->|"NG (400)"| FieldErr
    ServerValid -->|"OK"| Send{"Resend で通知 (D3)"}

    Send -->|"成功 (200)"| Done(["完了メッセージ表示"])
    Send -->|"失敗 (502)"| SendErr["エラー表示 + 再送可能<br/>(連絡先 TEL/FAX/メールへ誘導)"]
    SendErr --> Fill
    SilentDrop --> Done

    Note["送信内容は永続化せず通知のみ (D6)"]
```

### Sequence

```mermaid
sequenceDiagram
    actor User as 訪問者
    participant Island as フォーム island (client:visible, D5)
    participant TS as Cloudflare Turnstile
    participant Fn as Pages Functions /api/contact (Workers, D1)
    participant Resend as Resend API (D3)
    participant Mail as fukuura@mist.ocn.ne.jp

    User->>Island: 項目入力 + 送信
    Island->>TS: token 取得 (D2)
    TS-->>Island: Turnstile token
    Island->>Island: client バリデーション (D4)
    Island->>Fn: POST /api/contact (payload + token + honeypot)
    Fn->>Fn: honeypot 判定 (D2)
    alt honeypot 命中 (bot)
        Fn-->>Island: 200 (成功を装い黙って破棄)
        Island-->>User: 完了メッセージ表示
    else honeypot 空
        Fn->>TS: siteverify (secret key)
        TS-->>Fn: 検証結果
        Fn->>Fn: server 側再検証 (D4)
        alt 検証 NG (turnstile_failed / validation_error)
            Fn-->>Island: 400
            Island-->>User: エラー表示 (入力値保持)
        else 検証 OK
            Fn->>Resend: メール送信要求 (API key は secret)
            Resend->>Mail: 問い合わせ通知メール
            Resend-->>Fn: 送信結果
            Fn-->>Island: 200 (成功) / 502 (send_failed)
            Island-->>User: 完了 or 再送可能なエラー
        end
    end
    Note over Fn: 受信内容は永続化しない (D6)
```

## API

問い合わせ送信エンドポイント (D1: Cloudflare Pages Functions = Workers, 同一オリジン)。

### エンドポイント一覧

| #   | メソッド | パス           | 操作                                      | 備考                             |
| --- | -------- | -------------- | ----------------------------------------- | -------------------------------- |
| 1   | POST     | `/api/contact` | 問い合わせ送信 (検証 → スパム判定 → 通知) | Pages Functions。永続化なし (D6) |

### リクエスト / レスポンス

```jsonc
// POST /api/contact
// Request (application/json)
{
  "company": "株式会社サンプル",        // 任意, 最大100
  "name": "山田太郎",                  // 必須, 1〜50
  "email": "taro@example.com",        // 必須, メール形式
  "phone": "079-000-0000",            // 任意, 数字・ハイフン, 最大20
  "category": "quote",                // 必須, enum: quote(見積もり・販売) | machining(加工) | other(その他)
  "message": "○○について...",          // 必須, 10〜2,000
  "company_url": "",                  // honeypot: 常に空であること (D2)
  "cf-turnstile-response": "<token>"  // Turnstile token (D2)
}

// Response 200 (送信成功 / honeypot 命中時も成功を装う)
{ "ok": true }

// Response (エラー共通スキーマ, D9): { ok:false, code, message?, errors? }
// 400 validation_error
{ "ok": false, "code": "validation_error", "errors": { "email": "メール形式が不正です", "message": "10文字以上で入力してください" } }
// 400 turnstile_failed
{ "ok": false, "code": "turnstile_failed", "message": "送信を確認できませんでした。再度お試しください。" }
// 429 rate_limited (D8)
{ "ok": false, "code": "rate_limited", "message": "短時間に送信が集中しています。時間をおいて再度お試しください。" }
// 502 send_failed
{ "ok": false, "code": "send_failed", "message": "送信に失敗しました。お手数ですがお電話・メールでもご連絡いただけます。" }
```

> エラーは全コード共通スキーマ `{ ok:false, code, message?, errors? }` で返す (D9)。`errors` は `validation_error` 時のみ。
> honeypot 命中時はスパムとして成功 (200 `{ ok:true }`) を装い黙って破棄する (bot に学習させない, D2)。

### エラーコード一覧

| エラーコード       | HTTPステータス | 発生条件                                | クライアント挙動                          |
| ------------------ | -------------- | --------------------------------------- | ----------------------------------------- |
| `validation_error` | 400            | server 側再検証で必須/形式/文字数が不正 | フィールド別インラインエラー (入力値保持) |
| `turnstile_failed` | 400            | Turnstile `siteverify` が失敗           | スパム判定エラー表示                      |
| `rate_limited`     | 429            | Rate Limiting 超過 (連投, D8)           | 「時間をおいて再送」を表示 (入力値保持)   |
| `send_failed`      | 502            | Resend 送信失敗 (外部障害等)            | エラー表示 + 再送可能、連絡先へ誘導       |
| (honeypot 命中)    | 200            | honeypot フィールドに値あり (bot)       | 完了表示 (実際は破棄)                     |

## data-testid 一覧

E2E (問い合わせ導線) 用。命名規則: `{画面}-{要素種別}-{名前}` (画面 = `contact`)。

| data-testid                | 要素                     | 用途                                 |
| -------------------------- | ------------------------ | ------------------------------------ |
| `contact-form`             | フォーム要素 (`<form>`)  | フォーム到達 / 送信トリガ            |
| `contact-input-company`    | 会社名 input             | 任意項目入力                         |
| `contact-input-name`       | 担当者名 input           | 必須項目入力 / バリデーション検証    |
| `contact-input-email`      | メール input             | 必須・形式バリデーション検証         |
| `contact-input-phone`      | 電話番号 input           | 任意・形式バリデーション検証         |
| `contact-select-category`  | 問い合わせ種別 select    | 必須選択検証                         |
| `contact-textarea-message` | 問い合わせ内容 textarea  | 必須・文字数バリデーション検証       |
| `contact-button-submit`    | 送信ボタン               | 送信操作                             |
| `contact-message-success`  | 完了メッセージ           | 送信成功の検証                       |
| `contact-message-error`    | 送信失敗メッセージ       | 送信失敗 / 再送導線の検証            |
| `contact-error-{field}`    | 各項目のインラインエラー | フィールド別バリデーションエラー検証 |

> honeypot フィールドは E2E 検証対象外 (人間/正常系では空のまま)。Turnstile は E2E では test mode キーを使用し、`/api/contact` は route intercept でモックする (D10)。

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

| 対象 doc / 節                                              | 変更内容                                                                                                                  | 理由                                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| DesignDoc_corporate-site.md / 設計方針・ページ構成 (IA) P6 | **反映済** (spec-sync)。問い合わせフォームの送信を Workers 中継 (ADR-0009) とし、機能仕様の正本が spec #14 である旨を補足 | フォーム backend / island 方針のトレーサビリティ確保 (source: spec-sync) |

### context への影響

| 対象 doc / 節                                                     | 変更内容                                                                                                                                                    | 理由                                                                            |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| infrastructure.md / Infrastructure Contract                       | **反映済** (spec-sync, ADR-0009)。Workers 依存「有」+ 送信経路 `/api/contact` + secret 名 (Resend / 宛先 / Turnstile site+secret) + SPF/DKIM を contract 化 | D1=A / D3=A / D2=C を採用 (source: spec-resolve)。以後 infrastructure.md が正本 |
| infrastructure.md / Security・Operations                          | **反映済** (spec-sync, ADR-0009)。bot 対策 (Turnstile + honeypot) を Workers 側多層検証で記載 + 個人情報は永続化なし・利用目的明示を記載                    | D2=C / D6 を採用 (source: spec-resolve)。以後 infrastructure.md が正本          |
| infrastructure.md / Security・Operations (rate limit)             | **反映済** (spec-sync)。`/api/contact` に Cloudflare Rate Limiting (叩き台 5 req/min/IP, 超過 429) を Infrastructure Contract / Security + ADR-0009 に追加  | D8=A を採用 (source: spec-resolve)。以後 infrastructure.md / ADR-0009 が正本    |
| infrastructure.md / Security・Operations (メールインジェクション) | **反映済** (spec-sync)。Resend へのメール生成時の入力無害化 (宛先・件名固定 / 本文 plain text / ヘッダ CRLF 除去) を Security + ADR-0009 に追加             | D11=A を採用 (source: spec-resolve)。以後 infrastructure.md / ADR-0009 が正本   |
| infrastructure.md / Security・Operations (リプレイ/CSRF)          | **反映済** (spec-sync)。Turnstile token 単回利用 + `/api/contact` の Origin/Referer 検証を Security + ADR-0009 に追加                                       | D12=A を採用 (source: spec-resolve)。以後 infrastructure.md / ADR-0009 が正本   |

> rate limit (D8) / メールインジェクション (D11) / リプレイ・CSRF (D12) を含め全行 `spec-sync` で back-propagation 済 (2026-06-17)。以後 infrastructure.md / ADR-0009 が durable 成果の正本。

### ADR の新規 / 更新

| ADR ID   | 変更内容                                                                                                                                                   | 理由                                                                                                             |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| ADR-0009 | **反映済** (spec-sync)。corporate-site の問い合わせ送信を Cloudflare Pages Functions (Workers) 中継にする決定 (`output: "static"` + Functions 併用) を起票 | D1=A は静的のみ前提を超える新規アーキ判断 / D7=要で確定 (source: spec-resolve)。以後 ADR-0009 がアーキ決定の正本 |

## レビュー

`spec-review` (fresh-context evaluator) の最新結果。完全な記録は `review.md` を参照。

| 日付       | 結果 (PASS / NEEDS_WORK)                    | 指摘要点                                                                                                                                                                                                                                                                                                                  | 対応                                                          |
| ---------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 2026-06-17 | PASS                                        | rubric 7 観点すべて合格根拠を引用。俯瞰指摘 5 件はいずれも実装裁量・申し送りレベルでブロッカーなし (E2E と多層防御の検証境界 / honeypot 200 と success 表示の整合 / send_failed のステータス揺れ / rate limit 採否 / client:idle 切替の判断記録)                                                                          | 次 phase (実装分割・spec-prompts) で 5 件を prompt に申し送り |
| 2026-06-17 | 多エージェント Rv (claude/codex/cursor 3/3) | ブロッカーなし。合意指摘: send_failed ステータス揺れ(×3) / rate limit 濫用制御(×3) / API エラー body 未定義(×2) / スパム検証境界(×2) / spec-sync 注記 drift(×2) / フェーズ状態の文書内矛盾(×3)。単独 medium: メールインジェクション対策・honeypot key 未確定・E2E runtime と Functions 整合・「永続化なし」の通知経路射程 | spec-prompts 前に spec 内で詰める (詳細 `review.md`)          |
| 2026-06-17 | 再 spec-review (fresh-context) PASS         | Rv 指摘を A=直接修正 / B=論点 D8〜D13 確定 + spec-sync で全件対応。ステータス一意化・drift 解消を確認                                                                                                                                                                                                                     | レビューゲート通過。次は spec-prompts (実装分割)              |

## 変更履歴

| 日付       | 変更者   | 変更内容                                                                                                                                                                                                      |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-16 | Fukuemon | spec-draft で index.md 初版生成                                                                                                                                                                               |
| 2026-06-17 | Fukuemon | spec-resolve: D1 (送信バックエンド方式) を A (Pages Functions / Workers 中継) で確定                                                                                                                          |
| 2026-06-17 | Fukuemon | spec-resolve: D7 (ADR 起票要否) を要・新規 ADR-0009 起票で確定                                                                                                                                                |
| 2026-06-17 | Fukuemon | spec-resolve: D3 (通知手段) を A (Resend HTTP API) で確定                                                                                                                                                     |
| 2026-06-17 | Fukuemon | spec-resolve: D2 (スパム対策) を C (Turnstile + honeypot 併用) で確定                                                                                                                                         |
| 2026-06-17 | Fukuemon | spec-resolve: D4 (入力項目とバリデーション) を確定 (6 項目 + honeypot + Turnstile, 二重検証)                                                                                                                  |
| 2026-06-17 | Fukuemon | spec-resolve: D6 (個人情報) を保存しない + 利用目的明記 + 送信＝同意注記 (B) で確定                                                                                                                           |
| 2026-06-17 | Fukuemon | spec-resolve: D5 (island 化) をフォーム全体を単一 island + `client:visible` で確定 (全論点解決)                                                                                                               |
| 2026-06-17 | Fukuemon | spec-sync: ADR-0009 起票 + infrastructure.md (Infrastructure Contract / Security) に反映。アーキ決定の正本を ADR-0009 / infra へハンドオフ                                                                    |
| 2026-06-17 | Fukuemon | spec-sync: feature doc (DesignDoc_corporate-site) の設計方針・P6 に ADR-0009 / spec #14 参照を補足                                                                                                            |
| 2026-06-17 | Fukuemon | spec-diagrams: 送信〜検証〜通知の Flowchart / Sequence を生成                                                                                                                                                 |
| 2026-06-17 | Fukuemon | appendix 取り込み: API (`/api/contact`) + data-testid 一覧を追加                                                                                                                                              |
| 2026-06-17 | Fukuemon | Rv 対応 A (直接修正): send_failed=502 一意化 / honeypot 200 を Sequence・Props で独立化 + turnstile_failed=400 一本化 / honeypot key=`company_url` 確定 / spec-sync 注記を反映済へ更新 / フェーズ#11 状態整合 |
| 2026-06-17 | Fukuemon | Rv 対応 B (起票): 未決設計判断を論点 D8〜D13 として起票 (rate limit / API エラー body / 検証境界 / メールインジェクション / Turnstile リプレイ・Origin / 永続化なし射程)                                      |
| 2026-06-17 | Fukuemon | spec-resolve: D8 (rate limit / 濫用制御) を A (Cloudflare Rate Limiting 5 req/min/IP, 超過 429) で確定。Security 節・infra への spec-sync 候補を反映                                                          |
| 2026-06-17 | Fukuemon | spec-resolve: D9 (API エラー body) を A (共通 `{ ok:false, code, message?, errors? }`) で確定。API レスポンス例・エラーコード一覧・エラーケース表 (rate_limited 429 追加) を同期                              |
| 2026-06-17 | Fukuemon | spec-resolve: D10 (検証境界) を A (E2E=route intercept 必須 / Workers=Vitest unit / 実結線=CF preview 手動) で確定。Testing 節・テスト観点・data-testid 注記を同期                                            |
| 2026-06-17 | Fukuemon | spec-resolve: D11 (メールインジェクション) を A (宛先・件名固定 / 本文 plain text 無害化 / ヘッダ CRLF 除去) で確定。Security 節・infra への spec-sync 候補を反映                                             |
| 2026-06-17 | Fukuemon | spec-resolve: D12 (リプレイ/CSRF) を A (token 単回利用 + Origin/Referer 検証) で確定。Security 節・infra への spec-sync 候補を反映                                                                            |
| 2026-06-17 | Fukuemon | spec-resolve: D13 (永続化なし射程) を A (アプリ側 DB/ストレージ/ログに限定 + 通知経路の保持を明記) で確定。Content/Data・Security/Privacy を同期。D8〜D13 全件解決                                            |
| 2026-06-17 | Fukuemon | spec-sync: D8 (rate limit) / D11 (メールインジェクション) / D12 (リプレイ・CSRF) + D9/D10/D13 を infrastructure.md (Contract / Security) と ADR-0009 (決定・トレードオフ) へ back-propagation                 |
| 2026-06-17 | Codex    | Rv 指摘対応: メタ情報のステータスを再 spec-review PASS 済みの実態に合わせて `Review` へ更新                                                                                                                   |

## 備考

- 取り込み済 appendix: `## API` (`/api/contact`, appendices/api.md 由来) / `## data-testid 一覧` (appendices/testid.md 由来)。DB / 認可 / 画面ツリーの appendix は本スコープでは不要 (永続化なし・権限なし・単一フォーム)。
- 実装は #10 (corporate-site 本体) と協調。デザイントークンは #13、IA は feature doc が正本。
