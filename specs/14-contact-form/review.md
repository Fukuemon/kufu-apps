# Review Log — spec 14 (問い合わせフォーム)

## Review 2026-06-17

Verdict: PASS
Reviewer: spec-review (fresh-context, subagent=Plan)

### 観点別評価

- 上位文書整合: PASS — `## 上位文書整合` (index.md:42-51) が PRD / Design Doc / feature doc / context / ADR-0008 / ADR-0009 と整合。PRD の連絡導線 (PRD.md:54,62,80,126) / Phase1 スコープ (PRD.md:116)、Design Doc のモジュール責務 (DesignDoc.md:124,186)、architecture.md の Runtime Boundary (architecture.md:56-57)、infrastructure.md の Workers 依存・Security (infrastructure.md:26-34,89,92) と矛盾なし。既存 ADR を覆さず ADR-0009 を新規ハンドオフ。
- 未解決論点: PASS — D1〜D7 すべて「確定」(index.md:125-131)、`## 未確定事項` は「なし」(index.md:149)。下流 (Flowchart / Sequence / API / testid) は確定論点のみ参照。
- 実装対象明示: PASS — target が project.md の対象ドメイン (project.md:58) と一致 (index.md:155-162)、責務境界が読め、ui は `@kufu/ui` 公開入口経由で越境なし (index.md:176,199 / architecture.md:22-23)。
- template 必須節: PASS — template.md の全必須節が存在 (メタ情報〜備考、欠落なし)。
- EARS acceptance: PASS — `## 要件の解釈` に WHEN/IF/WHERE/THE SYSTEM SHALL を複数 (index.md:112-117)、data-testid 一覧 (index.md:402-414) / Error ケース表 (index.md:265-269) で観測可能。
- prompts 自己完結性: N/A — `prompts/` 未生成 (実装分割 未着手, index.md:31)。
- 正本境界: PASS — `## 上位資料からの変更点` に design への「反映済」行あり (index.md:453,459-460,468)。durable 成果は ADR-0009 / infrastructure.md / feature doc を正本としてハンドオフ済、二重正本なし (index.md:5,51-53)。

### 俯瞰的なリスク・改善提案 (ブロッカーではない / 下流申し送り)

1. E2E と Turnstile/honeypot の検証境界が「実装で決定」止まり (index.md:209,416)。全部スタブすると D2 の多層防御が E2E で一度も実行されないリスク。honeypot 命中=200 / Turnstile 失敗=400 のどちらを E2E で担保するか prompt で明記する。
2. honeypot 命中時 200 と success 表示の整合 (index.md:316,387,396,412)。testid `contact-message-success` が正常送信と honeypot 破棄で同一表示になるため、E2E は honeypot 空の正常系のみを対象とする旨を prompt で固定する。
3. 送信失敗のステータスコード表記揺れ (index.md:234 vs 395)。「5xx 総称」と「502」が二通り読める。Workers 契約として 502 固定か否かを prompt で一意化する。
4. rate limit の採否が未記載 (index.md:126)。D2 確定は Turnstile + honeypot で rate limit は落ちている。Resend 無料枠 (100通/日, index.md:139) 濫用抑止を「やらないこと」に落とすか実装申し送りに残す。
5. `client:visible` → `client:idle` 切替の判断主体が実装委譲 (index.md:140,182)。Unnecessary Client JS Count ガードレール (index.md:287) レビュー時に判断記録を残す前提を prompt に含める。

→ 5 件はいずれも実装裁量・申し送りレベル。rubric 7 観点すべてで合格根拠を引用できたため spec としては妥当。

---

## Multi-agent review 2026-06-17

| agent  | status      | retries | output                                        |
| ------ | ----------- | :-----: | --------------------------------------------- |
| claude | ok (exit 0) |    0    | .ai-out/agent-runs/20260617-123522/claude.out |
| codex  | ok (exit 0) |    0    | .ai-out/agent-runs/20260617-123522/codex.out  |
| cursor | ok (exit 0) |    0    | .ai-out/agent-runs/20260617-123522/cursor.out |

3/3 エージェント成功。部分結果ではない。観点 = spec 整合 / 検証可能性 / 曖昧さ / security・error・test の穴。

### サマリ

- **総合判定: ブロッカーなし**。3 エージェントとも「上位文書 (PRD / feature doc / ADR-0008・0009 / infrastructure.md) との大筋整合・D1〜D7 解決・#11 からのスコープ委譲は妥当」で一致。指摘はいずれも `spec-prompts` 前に spec 内で詰めると受け入れ基準の検証可能性が上がるレベル。
- **指摘総数: 13 件** (合意 7 + 単独 6) / 重大度内訳: high 0 / medium 10 / low 3。
- **合意 (×2 以上) の要対応 7 件**: ①`send_failed` ステータス揺れ(×3) ②rate limit 濫用制御の未設計(×3) ③API エラー body スキーマ未定義(×2) ④スパム対策の検証境界未確定(×2) ⑤spec-sync 注記の drift(×2) ⑥フェーズ状態の文書内矛盾(×3) ⑦honeypot 200 と 400 系の表記不一致(×2)。
- **単独だが要注目 (security の穴)**: メールヘッダ/本文インジェクション対策の未記載 (claude) / Turnstile token リプレイ・Origin 検証の未定義 (claude)。
- **テーマ別の弱点**: (a) API エラー契約の粒度不足 (②③⑦)、(b) スパム/エラー体験の内部不整合 (④⑦)、(c) E2E 検証境界の曖昧さ (④ + cursor 単独の runtime 整合)、(d) 濫用・可用性リスク (②)、(e) 文書内の状態 drift (⑤⑥)。
- **fresh-context レビュー (上記 PASS) との差分**: 方向性は一致。多エージェントは新たに **2 件のセキュリティ穴 (メールインジェクション / Turnstile リプレイ・Origin) と API body スキーマ未定義** を上乗せ検出。
- **優先対応の推奨**: security/可用性に関わる ②(rate limit) と単独 medium のメールインジェクションを最優先。次に API エラー契約 (①③⑦) を一意化してから `spec-prompts` へ。

### 統合指摘 (重大度順)

- [medium ×3] index.md#エラーコード一覧 — `send_failed` の HTTP ステータスが `502 / 5xx` で揺れ、API エラー契約が実装・テスト可能な粒度に固定されていない / 根拠: エラーコード表は「502 / 5xx」併記、Flowchart/Sequence/Props は「5xx」のみ。実装・E2E の期待値が一意にならない / 提案: 502 固定 (または「5xx・502 を既定」) に統一し全箇所を揃える
- [medium ×3] index.md#Performance／Security設計 — 公開送信 API の濫用 / 流量制御 (rate limit) が未設計 / 根拠: D2 候補に rate limit があったが確定は Turnstile+honeypot のみ。D3 の Resend 無料枠 (100通/日) に依存し、Turnstile 通過後の連投で枠枯渇＝送信不能 (可用性) を招く / 提案: Workers 側に rate limit / quota を設けるか、非採用の根拠・残余リスク・運用検知手段を spec に明記
- [medium ×2] index.md#エラーコード一覧 — `turnstile_failed` / `send_failed` の response body スキーマが未定義 / 根拠: 400 validation の例のみで、各エラーコードと JSON 契約 (`{ ok, code, errors/message }`) が未対応 / 提案: ケース別に HTTP ステータス + body スキーマ + クライアント分岐を API 節に追記
- [medium ×2] index.md#テスト／評価方針 — スパム対策 (Turnstile 失敗 / honeypot) の検証境界が未確定で受け入れ基準が曖昧 / 根拠: Turnstile は「test mode/モック (実装で決定)」、honeypot は E2E 対象外、テスト観点にも Turnstile 失敗 (Error#2) が未マップ。D2 の主要防御がどう検証されるか決まっていない / 提案: API/E2E で `turnstile_failed` と honeypot 200 破棄を検証する境界・fixture・期待結果を固定し、テスト観点に追加
- [medium ×2] index.md#上位資料からの変更点 — spec-sync「反映済」と未反映の forward-looking 注記が drift / 根拠: 表は ADR-0009 / infrastructure.md / feature doc を「反映済」とする一方、節末に「確定したら反映する」「D2〜D7 解決後にまとめて行う」「back-propagation 候補」が残り、正本境界の読み手を誤導 / 提案: 注記を削除、または「反映済 (2026-06-17)」へ更新
- [low ×3] index.md#設計フェーズ状況 — レビュー状態が文書内で矛盾 / 根拠: フェーズ表 #11「レビュー済」は未着手・メタ情報は Draft のまま、一方レビュー節は 2026-06-17 PASS を記録 / 提案: phase #11 とステータスを実態に統一する
- [low ×2] index.md#Sequence / Props・Response — honeypot 200 応答が 400 系 alt にまとめられ、スパム判定失敗の表記が箇所間で不一致 / 根拠: Sequence の `alt 検証 NG` が「400 / スパム破棄」と一括、Props 概要は「スパム判定失敗」を 400 別建て。honeypot は API 節では 200 成功偽装 / 提案: honeypot 命中を独立ブランチ (200 → 完了表示) に分離し、turnstile_failed=400 に一本化

### 単一エージェントのみ (未合意)

- [medium ×1, by claude] index.md#Content／Assets — ユーザー入力をメール化する際のヘッダ/本文インジェクション・HTML エスケープ対策が未記載 / 根拠: name/email/message を Resend へ渡すが security 設計に言及なし / 提案: 宛先・件名はサーバ固定値、ユーザー値は本文に plain text として埋め込みエスケープする旨を Security 節に追記 ※ security の穴のため surface
- [medium ×1, by cursor] index.md#Props／Request／Response — honeypot フィールド名が未確定で API 例と不一致 / 根拠: 項目表 key「(実装で命名)」、API 例は `company_url` 固定。client/Workers/E2E の契約が揺れる / 提案: honeypot key を 1 つに確定し Interface・API・data-testid 方針を同期
- [medium ×1, by cursor] index.md#Testing — E2E runtime と Pages Functions の前提が未整合 / 根拠: testing.md の E2E は `astro preview` のみで Pages Functions `/api/contact` は同 runtime で動かない。intercept 必須が spec レベルで固定されていない / 提案: CI E2E は route intercept 必須、実 Functions 検証は CF Pages preview 手動確認と役割分担を明記
- [medium ×1, by codex] index.md#Content／Data設計 — 「永続化なし」がメール通知経路にも読める / 根拠: Resend 経由で本文をメール送信するため受信箱・メール事業者側には残る / 提案: 「アプリ側で DB 永続化しない」に限定し、メール通知・受信箱・Resend 側の保持範囲と利用目的表記を明記
- [low ×1, by claude] index.md#Security／Privacy — Turnstile token の単回利用 / リプレイ対策と `/api/contact` の Origin/Referer 検証が未定義 / 提案: token 単回検証・Origin チェックを server 検証方針に追記 (または不要判断の根拠を記載)
- [low ×1, by cursor] index.md#Testing — Workers 側検証ロジックの unit テスト方針欠落 / 根拠: testing.md はロジックを Vitest 担当とするが spec は Playwright E2E のみ / 提案: P2 で Workers バリデーション/スパム判定の unit テスト範囲を追記

### エージェント間の相違

- send_failed の重大度: claude/codex = medium、cursor = low。保守的に medium を採用。

### 注記

- skipped なし。3/3 エージェントの結果に基づく完全な結果。
- 総評 (各エージェント共通): 上位文書 (PRD / feature doc / ADR-0008・0009 / infrastructure.md) との大筋整合・D1〜D7 解決・#11 からのスコープ委譲は妥当。**ブロッカー級の矛盾はなし**。残る指摘は API エラー契約の粒度・スパム/エラー体験の内部不整合・E2E 検証境界・濫用制御で、`spec-prompts` 前に spec 内で詰めると受け入れ基準の検証可能性が上がる。
