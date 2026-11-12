# ADR-0001: Phase 1 は `apps/corporate-site` だけを実装し、`apps/cms` の設計を後続へ送る

## Status

承認

## Context

- monorepo の foundation は当初、`apps/corporate-site` と `apps/base` の 2 つの app を Phase 1 で scaffold する案を前提にしていた。
- `apps/base` は名前と用途が曖昧で、React app の骨組み以上の意味を持たず、長期的な責務の境界として弱かった。
- 現時点で明確になっている将来の要件は、「コーポレートサイトに掲載する投稿内容を管理する app が必要になりうる」という点である。
  - 汎用的な `base` よりも、`cms` のほうが検討の対象に近い。
- `apps/cms` も未確定の事項が多く、Phase 1 の scaffold の対象として固定するには早い。
  - 未確定の事項は、公開のフロー、権限、データモデル、運用者、Cloudflare 上での runtime の境界、Hono + Inertia + React の採否など。
- Phase 1 の最優先事項は、コーポレートサイトの foundation を最小の構成で成立させることである。
  - 未確定な第 2 の app を追加すると、論点が増える。

## Decision

- Phase 1 では、`apps/corporate-site` だけを app の実装対象とする。
- `apps/base` は作成しない。
- 将来の投稿管理の app は、`apps/cms` を候補名として文書にだけ記載し、実装は行わない。
- `apps/cms` の責務は、「コーポレートサイトに掲載する投稿を管理する app の候補」として扱う。
- `apps/cms` の技術選定は、別の spec / ADR で行う。
  - 初期の候補として Hono + Inertia + React を比較の対象に含めるが、この ADR では採用を確定しない。
- root script、E2E contract、shared config は、`apps/corporate-site` をデフォルトの対象として成立させ、将来 `apps/cms` を追加できる拡張の余地だけを残す。

## Considered Options

| 選択肢                                                                                           | 強み                                                                                                                                                                                                 | 弱み                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** Phase 1 は `apps/corporate-site` だけを実装し、`apps/cms` は候補名として文書にだけ残す | Phase 1 の app の実装対象が `apps/corporate-site` に絞られ、foundation の目的が明確になる。`apps/base` という曖昧な名前を残さずに済む。将来の app の議論を `apps/cms` という具体的な論点に寄せられる | React app の実体が Phase 1 に存在せず、`packages/ui` や React Compiler の実運用での確認は後続へ持ち越される。Hono + Inertia + React の採否は未確定のまま残る                                                                 |
| `apps/base` を当初の案どおり Phase 1 で作る                                                      | React app の骨組みを早期に配置できる。`packages/ui` や React Compiler の方針の接続先を具体化しやすい。将来 app を追加するときに、scaffold の再調整が減る可能性がある                                 | `base` という名前では用途が曖昧で、長期的な責務の境界として弱い。何の app なのかが文書から伝わりにくく、AI や開発者の判断を曖昧にする。Phase 1 の主目的であるコーポレートサイトの foundation から論点が逸れる                |
| `apps/cms` を Phase 1 で先に scaffold する                                                       | 将来の投稿管理の app の配置先を早期に固定できる。CMS 向けの shared UI や config の検討を前倒ししやすい                                                                                               | app shell を置く前に、責務、公開のフロー、権限、データ設計を決める必要がある。Hono + Inertia + React を含む技術選定が未確定で、scaffold の前提が揺れやすい。Phase 1 の完了条件がコーポレートサイトの foundation 以外に広がる |
| app の候補を明記せず `future-app` 扱いにする                                                     | 将来の選択肢を狭めない。命名を再び変えるコストを避けられる                                                                                                                                           | 現時点で見えている「コーポレートサイトの投稿管理」の要件が文書に残らず、設計の起点が弱くなる。後続の spec の対象が曖昧になりやすい                                                                                           |

## Consequences

### Positive

- Phase 1 の app の実装対象が `apps/corporate-site` に絞られ、foundation の目的が明確になる。
- `apps/base` という曖昧な名前を残さずに済む。
- 将来の app の議論を、`apps/cms` という具体的な論点に寄せられる。
- CMS の app の技術選定と責務の設計を、専用の spec / ADR で落ち着いて進められる。

### Negative

- React app の実体が Phase 1 に存在しないため、`packages/ui` や React Compiler の実運用での確認は後続へ持ち越される。
- 将来 `apps/cms` を作る時点で、scaffold と command contract の追加の調整が必要になる。
- Hono + Inertia + React の採否は未確定のまま残る。
