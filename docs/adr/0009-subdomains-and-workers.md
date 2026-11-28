# ADR-0009: サブドメインに分ける規則を決め、1 つの app を 1 つの Worker とホスト名に割り当てる

## Status

提案

## Context

ドメインの下に、corporate-site のほかに、カタログと将来の app を置く。  
どれを corporate-site と同じホスト名に置き、どれをサブドメインに分けるかを決める必要がある。

- 配信は Cloudflare Workers static assets で行う。Worker の箱と custom domain は Terraform が、deploy は Wrangler が管理する。
  - ADR-0008: [infra code を Kufu Monorepo に置き、Workers static assets で配信し、基盤を Terraform、deploy と runtime の設定を Wrangler で管理する](0008-infra-monorepo-workers-terraform-wrangler.md)
- カタログは、基盤が決まったら、サイトとは別の Worker に静的なアセットとして出し、ドメインを `design.<ドメイン>` にすると決めている。それまでは GitHub Pages に出している。
  - ADR-0026: [packages/ui の Storybook をカタログの本体にし、corporate-site の Storybook を画面のカタログとして並べて公開する](0026-storybook-catalog.md)
- Phase 1 は corporate-site だけを実装し、`apps/cms` の設計は後に送っている。
  - ADR-0001: [Phase 1 は `apps/corporate-site` だけを実装し、`apps/cms` の設計を後続へ送る](0001-phase1-corporate-site-only-and-cms-deferred.md)
- Workers の custom domain は、1 つのホスト名を 1 つの Worker に紐付ける。
- 手本にした fukuemon.dev は、サブドメインに分ける規則と、1 つの app を 1 つの Worker とホスト名に割り当てる形を承認し、カタログを `design.fukuemon.dev` の Worker に出している。
  - 出典: [fukuemon.dev の ADR-0031](https://github.com/Fukuemon/fukuemon.dev/blob/bb59afc0353a92d0137b3aa014f644176bf027a4/docs/adr/0031-subdomains-and-workers.md)

## Decision

### 1. サブドメインに分ける規則

次のどちらかに当たるものを、サブドメインに分ける。当たらないものは、corporate-site と同じホスト名に置く。

1. corporate-site と違うレスポンスヘッダか、アクセスの認証が要る。
2. corporate-site と別に build して別に deploy する、独立した app である。

### 2. 1 つの app を、1 つの Worker と 1 つのホスト名に割り当てる

1 つの Worker に、パスで複数の app を置かない。  
app ごとに、deploy のタイミングとレスポンスヘッダを分けるためである。

### 3. 割り当て

| ホスト名            | 置くもの       | 当たる規則 |
| ------------------- | -------------- | ---------- |
| `<ドメイン>`        | corporate-site | 無い       |
| `design.<ドメイン>` | カタログ       | 2          |

- `apps/cms` のような新しい app は、足すときに、この規則でホスト名を割り当てる。
- Worker の箱と custom domain は、ADR-0008 の管轄のとおり Terraform で管理する。

## Considered Options

| 選択肢                                                                                             | 強み                                                                                                                                          | 弱み                                                                                                                                         |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** 規則に当たるものをサブドメインに分け、1 つの app を 1 つの Worker とホスト名に割り当てる | app ごとに deploy とレスポンスヘッダを分けられる。custom domain の 1 つのホスト名に 1 つの Worker という形と合う。fukuemon.dev と同じ形になる | Worker とホスト名が app の数だけ増え、Terraform の custom domain の定義も増える                                                              |
| 1 つの Worker に、パスで複数の app を置く（`/design/` など）                                       | Worker とホスト名が 1 つで済む                                                                                                                | app ごとに deploy のタイミングを分けられない。1 つの app を直すと、ほかの app も deploy し直す。パスごとにレスポンスヘッダを分ける設定が要る |
| カタログを GitHub Pages に置き続ける                                                               | 今の公開と pull request ごとのプレビューを変えずに済む                                                                                        | 配信の基盤が Cloudflare と GitHub Pages の 2 つに分かれる。ADR-0026 が決めた `design.<ドメイン>` に移らない                                  |

## Consequences

### Positive

- 新しい app を足すときに、ホスト名と Worker の割り当てを規則で決められる。
- カタログを `design.<ドメイン>` の Worker に移す作業の前提が決まる。

### Negative

- app を足すたびに、Worker の箱と custom domain を Terraform に足し、apply する。
- カタログの pull request ごとのプレビューを、GitHub Pages から Worker の preview URL へ移すかは、カタログを移す作業で決める。
