---
type: context
title: 基盤と運用
description: 環境ごとの用途、Cloudflare に任せること、kufu-infra へ渡す取り決め、問い合わせフォームが基盤に求めるもの、公開の条件、観測点、シークレットの置き場
status: draft
governs:
  - .github/workflows/
  - apps/corporate-site/astro.config.mjs
verified_commit: 81f85da2744f320f44040307f1ec854f705f7c79
---

# 基盤と運用

公開の基盤は Cloudflare で、Pages を第一の候補にする。  
Workers は、API か BFF が要るときだけ使う。  
Terraform の実体は別のリポジトリ `kufu-infra` が持ち、このリポジトリには置かない。  
ADR-0006: [Terraform を基盤のリポジトリに分ける](../docs/adr/0006-terraform-infra-repository-boundary.md)

- `apps/corporate-site` は Astro で静的に生成し、build の artifact を Cloudflare Pages から配信する。
- API か BFF を入れない限り、Node.js の常駐するサーバーと専用の VM を前提にしない。
- 静的なアセット（画像、動画、フォント）は、Cloudflare の CDN から配信する前提で最適化する。
- DNS、TLS、キャッシュ、圧縮は Cloudflare の標準の機能に任せ、app の側で重ねて実装しない。
- Cloudflare 固有の設定が app の実装に漏れないよう、framework の設定と deploy の設定の責務を分ける。
- Terraform の plan と apply の手順と、state backend の詳細は、基盤のリポジトリが持つ。このリポジトリに写さない。

## Environments

環境と用途は次のとおり。

- local: 開発者が手元で確認する。`pnpm dev` で app を起動し、Cloudflare への依存を持ち込まない。
- preview: pull request とブランチごとに確認する。Cloudflare Pages の preview deployment で、実際のページを確認する。
- production: 公開するサイト。Cloudflare Pages の production deployment を正とする。

preview と production は、Cloudflare Pages の上で同じ build の流れを通る。  
preview の URL で、layout の崩れ、リンク、フォームの導線、SEO の metadata をレビューする。  
ブランチの単位で安全に確認できることを、コーポレートサイトの改修の標準の流れに含める。

### kufu-infra へ渡す取り決め

app の側から基盤のリポジトリへ、次のものを渡す。  
基盤の側（Pages の project、domain、secret）を変えるときは、この取り決めを通して `kufu-infra` へ依頼する。

- Pages の project の名前（preview と production）
- preview と production の domain
- 必要な secret の名前。実際の値はリポジトリに保存しない。
- Workers に依存するか
- app の変更が基盤の差分を要するときの参照のリンク（spec か ADR から、基盤のリポジトリの pull request へ）

### 問い合わせフォームが基盤に求めるもの

問い合わせフォームの送信は、Cloudflare Pages Functions（Workers）を中継する。  
静的な生成（`output: "static"`）を保ち、送信の endpoint だけに Functions を使う。  
ADR-0005: [corporate-site の問い合わせフォームの backend](../docs/adr/0005-corporate-site-contact-form-backend.md)

- Workers に依存する。送信の endpoint は `/api/contact` である。
- 必要な secret の名前は、Resend の API key、メールの宛先、Cloudflare Turnstile の secret key の 3 つである。
- client に置く公開の値は、Turnstile の site key である。
- メールが届くよう、送信のドメインで SPF と DKIM を検証できる状態にする。
- `/api/contact` に、Cloudflare Rate Limiting のルールを設定する。
  - Resend の無料の枠を使い切って送信できなくなるのを防ぐ。
  - 最初の値は、同じ IP から 1 分に 5 リクエストで、超えたら 429 を返す。運用で観測して調整する。

## Deployment Conditions

- preview でのレビュー（layout、リンク、フォーム、SEO）を通らない pull request は merge しない。
- 公開の判断には、deploy の成功だけでなく、preview での導線の確認を含める。
- production への deploy は、`develop` から `main` への merge を起点にする。手で deploy する流れを標準にしない。
- コーポレートサイトのアセットは、ライセンスと利用の許諾を確認してから使う。

## Health and Monitoring

- Cloudflare Analytics か Web Analytics を使えるときは、コーポレートサイトの性能と導線の計測の一次の観測点にする。
- 監視、ログ、分析の詳細は、フォームの導線か API の連携を採るときに、feature の Design Doc か ADR で決める。
- 正常と判断する観測点は未定。

## Rollback

戻すときの手順と、戻せない変更の扱いは未定。

## Secrets

- Cloudflare の上で扱う secret、token、API key は、client の側に出さず、環境ごとの secret の管理に分ける。
- Cloudflare の secret の管理に置く値を、リポジトリに保存しない。
- Terraform の variable や provider の credential のような基盤用の秘匿する情報を、app のリポジトリに持ち込まない。
- フォームの保護と bot の対策が要るときは、Cloudflare Turnstile のような edge 側のサービスを候補に含める。
  - 問い合わせフォームのセキュリティの規則は [問い合わせフォームの Design Doc](../docs/design/features/contact-form/DesignDoc.md#セキュリティの規則) にある。
- 問い合わせフォームのように個人情報を扱うときは、扱いを feature の Design Doc に明記する。
  - 問い合わせフォームの内容の扱いは [codebase.md](codebase.md#state-ownership) にある。
- CMS か API を入れるときは、認証、権限、公開の流れ、プレビューの環境を設計する。設計は [CMS の Design Doc](../docs/design/features/cms/DesignDoc.md) が持つ。
