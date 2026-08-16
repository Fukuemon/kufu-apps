# ADR-0009: corporate-site の問い合わせ送信を Cloudflare Pages Functions (Workers) 中継にする

## 状態

承認

## 決定日

2026-06-17

## 背景

- `apps/corporate-site` は Astro 静的生成 (`output: "static"`) で Cloudflare Pages へ配信する前提である。動的サーバ処理は持たない。
  - 根拠: [context/infrastructure.md](../context/infrastructure.md) の Infrastructure / Deployment — Cloudflare を公開基盤とし、Node.js 常駐サーバや専用 VM を前提にしないと定める
- IA 設計で「お問い合わせページ (P6 `/contact`) に問い合わせフォームを設置する」と決定した。送信処理の方式は IA のスコープ外として #14 へ委譲された。
  - 根拠: [issue #11](https://github.com/Fukuemon/kufu-apps/issues/11) — corporate-site の IA を確定した issue
- フォーム送信を成立させるには、入力検証 / スパム判定 / メール通知を行う server 側処理が必要だが、静的配信のみの前提では置き場所が未確定だった。
- 既存方針の制約: [context/architecture.md](../context/architecture.md) の Runtime Boundary は「ブラウザから直接第三者 API を叩く構成を標準にせず、必要に応じて Workers を中継点にする」「秘密情報を client bundle に含めない」と定める。context/infrastructure.md は Cloudflare Turnstile / Workers を bot 対策・API 中継の候補として挙げている。

## 決定

corporate-site の問い合わせ送信を **Cloudflare Pages Functions (Workers) 中継**で実装する。

- 根拠: [issue #14](https://github.com/Fukuemon/kufu-apps/issues/14) — 送信方式を検討し本決定に至った issue

1. **送信経路**: フォーム (React island) → 同一オリジンの `/api/contact` (Cloudflare Pages Functions = Workers) へ HTTP POST する。ブラウザから第三者 API を直接叩かない。
2. **配信構成**: 静的生成 (`output: "static"`) を維持しつつ、送信エンドポイントのみ Pages Functions を併用する。Node.js 常駐サーバや専用 VM は引き続き持たない。
3. **検証**: Workers が入力を server 側で再検証 (client を信頼しない) し、スパム対策として Cloudflare Turnstile token の `siteverify` 検証 + honeypot 判定を行う。
4. **通知**: 検証通過後、Workers が Resend の HTTP API でメール通知する (送信先は連絡先正本の `fukuura@mist.ocn.ne.jp`)。
5. **secret**: Resend API key / Turnstile secret key / 宛先などの秘匿値は Cloudflare の secret 管理に置き、client bundle・repo に含めない。送信ドメインの SPF/DKIM 検証を前提とする。
6. **永続化なし (射程)**: 問い合わせ内容は **アプリ側 (Workers) で DB / ストレージ / ログに保存せず**、メール通知のみとする (個人情報の最小取り扱い)。「永続化なし」の射程はアプリ側に限り、通知経路 (Resend 経由のメール送信 → 受信箱・Resend 側の一時保持) には通知という利用目的の範囲でデータが残る (issue #14 D13)。
7. **濫用 / 連投対策**: `/api/contact` に Cloudflare Rate Limiting (叩き台: 同一 IP 5 req/min、超過 429) を設定し、Turnstile 通過後の連投による Resend 無料枠枯渇 = 送信不能 (可用性) を防ぐ (issue #14 D8)。
8. **リプレイ / CSRF 対策**: Turnstile token は単回利用 (`siteverify` の二度目拒否に依拠) とし、Workers で `/api/contact` のリクエスト元 Origin / Referer を自サイトに限定する (issue #14 D12)。
9. **メール生成時のインジェクション対策**: Resend へ渡す宛先・件名はサーバ固定値とし、ユーザー入力は本文に plain text としてのみ埋め込み、改行・制御文字 (CRLF) を無害化する。email を Reply-To に使う場合も CRLF 除去・単一値に制限する (issue #14 D11)。
10. **API エラー契約**: エラーは全コード共通スキーマ `{ ok:false, code, message?, errors? }` で返す。`code` は `validation_error` (400) / `turnstile_failed` (400) / `rate_limited` (429) / `send_failed` (502) (issue #14 D9)。

## 代替案

- **第三者フォームサービス (Formspree / Web3Forms 等) へブラウザから直接 POST**: 実装は最短だが、architecture.md の「第三者 API をブラウザから直接叩く構成を標準にしない」に反し、endpoint / token が client に露出する。外部 SaaS 依存・無料枠制限・ベンダーロックインもあり不採用。
- **mailto: リンク代替 (フォーム送信をやめる)**: バックエンド不要だが、#11 Q4「フォーム設置」の決定に未達で UX も劣るため不採用。
- **MailChannels (Workers から無料送信)**: 2024 に Cloudflare Workers 向け無料提供が終了し、Resend に対する利点が消失したため不採用。
- **Workers から直接 SMTP**: Workers での raw SMTP は扱いづらく不安定なため不採用。

## 影響

### 良い影響

- secret を server (Workers) 側に隠蔽でき、client bundle に秘匿値が漏れない。
- 同一オリジン経由で第三者 API 直叩きを避け、architecture.md Runtime Boundary と整合する。
- Turnstile の server 検証と honeypot を Workers に集約でき、スパム対策が一箇所で完結する。
- Cloudflare 完結 (Pages Functions + Turnstile) で Decision Priority「一貫性」に合致する。

### 悪い影響 / トレードオフ

- 純静的 (`output: "static"`) のみの前提から Pages Functions 併用へ一歩踏み出し、infra 側に Workers 依存が増える。
- Resend (外部メール送信サービス) への依存と、送信ドメインの SPF/DKIM 設定が必要になる。
- E2E では実メール送信を避けるため `/api/contact` を route intercept でモックする (Playwright)。Workers のロジック (二重バリデーション / honeypot / Turnstile 分岐 / エラー code マッピング) は Vitest unit、実 Functions 結線は Cloudflare Pages preview で手動確認する (issue #14 D10)。

### 影響範囲

<!-- 対象モジュールは context/project.yml の対象ドメインから選ぶ。固有名を直書きしない。 -->

- 対象モジュール / package: `corporate-site` (フォーム island + `/api/contact` Functions), `e2e` (問い合わせ導線の検証)
- infra: Cloudflare Pages の Functions 併用 / 必要 secret / SPF・DKIM。Infrastructure Contract 経由で `kufu-infra` へ渡す

## 実装・運用への反映

- spec 更新要否: 要 (機能仕様の正本は feature doc。実装は #10 と協調)
- context / AI 向け設定更新要否: 要。context/infrastructure.md の Infrastructure Contract / Security へ、Workers 依存・secret・bot 対策を反映する

## 関連ドキュメント / チケット

- [design/DesignDoc.md](../design/DesignDoc.md): モジュール責務 (`apps/corporate-site`)
- [ADR-0008](0008-astro-react-island-policy.md): フォームは corporate-site の最初の主要 React island
- [ADR-0003](0003-phase1-corporate-site-only-and-cms-deferred.md): Phase 1 は corporate-site のみ
- [context/infrastructure.md](../context/infrastructure.md): Cloudflare Pages / Turnstile / Workers
- issue: [#14](https://github.com/Fukuemon/kufu-apps/issues/14) 問い合わせフォーム / Refs #11 / Part of #10
- [context/architecture.md](../context/architecture.md): Runtime Boundary / Edge API / Error Contract
