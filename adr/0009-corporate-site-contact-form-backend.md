# ADR-0009: corporate-site の問い合わせの送信は Cloudflare Pages Functions（Workers）で中継する

## Status

承認

## Context

- `apps/corporate-site` は Astro の静的な生成（`output: "static"`）で、Cloudflare Pages へ配信する前提にしている。動的なサーバーの処理は持たない。
  - 出典: [operations.md](../context/operations.md#environments)
  - ADR-0003: [Phase 1 は corporate-site だけを作る](0003-phase1-corporate-site-only-and-cms-deferred.md)
- 情報設計で、お問い合わせのページ（`/contact`）に問い合わせフォームを置くと決めた。送信の方式は、情報設計の範囲の外に残した。
- フォームの送信には、入力の検証、スパムの判定、メールの通知を行うサーバーの処理が要る。静的な配信だけの前提では、その置き場が決まっていなかった。
- 既存の方針は、ブラウザから第三者の API を直接呼ぶ構成を標準にせず、必要なら Workers を中継点にすると定める。秘密の情報を client の bundle に含めないとも定める。
  - 出典: [codebase.md](../context/codebase.md#edge-api)
- 基盤の方針は、bot の対策と API の中継の候補に、Cloudflare Turnstile と Workers を挙げている。
  - 出典: [operations.md](../context/operations.md#secrets)

## Decision

corporate-site の問い合わせの送信を、**Cloudflare Pages Functions（Workers）で中継**して作る。

1. **送信の流れ**: フォーム（React の island）から、同じオリジンの `/api/contact`（Cloudflare Pages Functions、つまり Workers）へ HTTP の POST を送る。ブラウザから第三者の API を直接呼ばない。
   - ADR-0008: [フォームは corporate-site の最初の主な React の island](0008-astro-react-island-policy.md)
2. **配信の構成**: 静的な生成（`output: "static"`）を保ち、送信の endpoint だけに Pages Functions を使う。Node.js の常駐するサーバーと専用の VM は、引き続き持たない。
   - この判断は ADR-0023 で置き換えた。
   - ADR-0023: [配信基盤を Cloudflare Pages から Workers static assets へ移す](0023-workers-static-assets-over-pages.md)
3. **検証**: Workers が入力をサーバーの側で検証し直し、client を信頼しない。スパムの対策として、Cloudflare Turnstile の token の `siteverify` での検証と、honeypot の判定を行う。
4. **通知**: 検証を通った後、Workers が Resend の HTTP API でメールを通知する。
5. **secret**: Resend の API key、Turnstile の secret key、宛先などの秘匿する値は Cloudflare の secret の管理に置き、client の bundle と repo に含めない。送信のドメインで SPF と DKIM を検証できることを前提にする。
6. **永続化しない範囲**: 問い合わせの内容は、**アプリの側（Workers）で DB、ストレージ、ログに保存せず**、メールで通知するだけにする。個人情報の扱いを最小にするためである。
   - 永続化しないのはアプリの側に限る。
   - 通知の仕組み（Resend 経由のメールの送信、受信箱、Resend の側の一時的な保持）には、通知という目的の範囲でデータが残る。
7. **乱用と連投の対策**: `/api/contact` に Cloudflare Rate Limiting を設定する。Turnstile を通った後の連投で Resend の無料の枠を使い切り、送信できなくなる（可用性を失う）のを防ぐ。
8. **リプレイと CSRF の対策**: Turnstile の token を 1 回だけ使えるものにし、リクエストの Origin と Referer を自分のサイトに限る。
9. **メールの生成でのインジェクションの対策**: Resend へ渡す宛先と件名をサーバーの固定値にし、利用者の入力を本文に plain text としてだけ埋め込む。
10. **API のエラーの契約**: エラーは、すべての code に共通の schema で返す。

入力の項目、API の契約、セキュリティの細目は [問い合わせフォームの Design Doc](../design/features/contact-form/DesignDoc.md) が持つ。

## Considered Options

| 選択肢                                                                                | 強み                                                                                              | 弱み                                                                                                                                                                |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** Cloudflare Pages Functions（Workers）で中継し、Resend でメールを通知する    | secret をサーバーの側に隠せる。第三者の API をブラウザから直接呼ばない。Cloudflare の中で完結する | 静的な配信だけの前提から一歩出て、Workers への依存が増える。Resend への依存と、SPF と DKIM の設定が要る                                                             |
| 第三者のフォームのサービス（Formspree、Web3Forms など）へ、ブラウザから直接 POST する | 実装が最も短い                                                                                    | 第三者の API をブラウザから直接呼ぶ構成を標準にしない方針に反し、endpoint と token が client に出る。外部の SaaS への依存、無料の枠の制限、ベンダーロックインもある |
| mailto: のリンクで代える（フォームの送信をやめる）                                    | バックエンドが要らない                                                                            | 情報設計の「フォームを置く」決定を満たさず、UX も劣る                                                                                                               |
| MailChannels（Workers から無料で送る）                                                | Workers から追加の費用なしで送れた                                                                | 2024 に Cloudflare Workers 向けの無料の提供が終わり、Resend に対する利点がなくなった                                                                                |
| Workers から SMTP で直接送る                                                          | -                                                                                                 | Workers で生の SMTP は扱いにくく、不安定である                                                                                                                      |

## Consequences

### Positive

- secret をサーバー（Workers）の側に隠せ、client の bundle に秘匿する値が漏れない。
- 同じオリジンを経由して第三者の API を直接呼ぶ構成を避け、[codebase.md](../context/codebase.md#edge-api) の境界と合う。
- Turnstile のサーバーでの検証と honeypot を Workers にまとめ、スパムの対策が 1 か所で完結する。
- Cloudflare の中で完結し（Pages Functions と Turnstile）、[判断の優先順位](../design/DesignDoc.md#判断の優先順位)の「一貫性」に合う。

### Negative

- 静的な生成（`output: "static"`）だけの前提から Pages Functions の併用へ一歩出て、基盤の側に Workers への依存が増える。
- Resend（外部のメールの送信のサービス）への依存と、送信のドメインの SPF と DKIM の設定が要る。
- 実際のメールの送信を避けるため、テストの層を分ける必要がある。
  - E2E では、Playwright の route intercept で `/api/contact` をモックする。
  - Workers のロジック（二重の検証、honeypot、Turnstile の分岐、エラーの code の対応）は Vitest の unit で確かめる。
  - Functions との実際の結線は、Cloudflare Pages の preview で手で確かめる。
