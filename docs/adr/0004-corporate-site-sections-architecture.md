# ADR-0004: corporate-site の component を section 単位のフラットな構成にし、公開面を index.ts と独自のチェックで固定する

## Status

承認

## Context

- `apps/corporate-site/src/components/features/` は、7 つの feature をフラットに並べていた。
  feature は business、company、consultation、contact、hero、products、services である。
  どのページの構成要素かを、ディレクトリの構造から読み取れなかった。
  - 特に `products` は 14 ファイルあり、エントリーポイントが分かりにくかった。
- 「feature」の語が、domain の feature とページの section の両方の意味で使われていた。
  静的なサイトの実態（ページは section の集まり）と合っていなかった。
- pages から feature の中の任意のファイルを import できた。
  公開面（どこから使ってよいか）は規約でしか表されず、規約から外れる余地があった。
- app の中の component の間の依存の境界は、[コードベースの構造](../../context/codebase.md#module-boundaries)の app の間と package の境界の規則では決まっていなかった。
- 検討の初めは、route の層でまとめる構成（`sections/<route>/<section>/`）を採ろうとした。
  しかし、実際の import の関係を確認すると、その前提が成り立たなかった。
  - `pages/index.astro`（`/`）が `ProductsCategorySection` を import しており、products の domain の section が home の route の構成要素になっている。
  - `ProductsHero` は `/products` の独立した section ではなく、`ProductsDetailSection` の内部の component だった。
- 公開面を機械でチェックするのに想定した dependency-cruiser は、`.astro` を解析の対象にしていない。
  - cruise の対象の 82 modules に `.astro` は 1 つもなく、`no-orphans` の除外にも `\.astro$` を含む。
  - oxlint も `.astro` に対応しておらず、corporate-site の `lint` は `astro.config.mjs` と `vitest.config.ts` の 2 ファイルしか見ていない。

## Decision

1. **区切りの概念を feature から section に改め、1 階層のフラットな構成にする。**
   `components/features/<feature>/` を `components/sections/<section>/` にする。
   route の層は設けない。
   domain のまとまりは、ディレクトリ名の接頭辞（`products-category`、`products-detail`）で表す。
   ページとの対応は、corporate-site の Design Doc の section の構成の表を基準にする。
   - [corporate-site の Design Doc: section の構成](../../apps/corporate-site/DesignDoc.md#section-の構成)
2. **section の中はフラットにし、公開面を `index.ts` にする。**
   section のディレクトリの直下に、`index.ts`、Section の assembly、presentation、story を並べる。
   `index.ts` は Section component だけを再輸出する。
   `internal/` のサブディレクトリは作らない。
   階層は常に 1 段なので、「section の起点は必ず `sections/<section>/index.ts`」という 1 つの規約で済む。
3. **products は、使われ方に合わせて 2 つの section に分ける。**
   `products-category`（`/` に載る取扱製品のセクション）と `products-detail`（`/products` の詳細）にする。
   `ProductsHero` は `products-detail` の内部の component として扱う。
4. **依存の方向を `pages → sections (index.ts) → common → @kufu/ui` の一方向に固定する。**
   - pages から section の内部を直接 import するのを禁じる。
   - section の間の import は、index を経由しても禁じる。共有するものは common か `packages/ui` へ上げる。
   - 同じ section の中での直接の参照（story を含む）は自由にする。
5. **境界の機械のチェックは、独自のスクリプトで行う。**
   `.astro` を解析できる既存のツールがないため、`apps/corporate-site/scripts/check-token-usage.mjs`（ripgrep で `.astro` を走査するトークンのガード）と同じ方式のチェックのスクリプトを足す。
   - スクリプトは app の `lint` の script につなぐ。
   - あわせて、`lefthook.yml` の `pre-commit` に `pnpm lint` を足し、CI にもルートの `pnpm lint` を実行する workflow を足す。
     - 決定のとき、pre-commit は format、protected-branch、depcruise と knip だけで lint を含まず、CI にも lint の job がなかった。script に足すだけでは自動で実行されない。
     - pre-commit は `--no-verify` やフックを入れていない環境ではチェックを通らずに commit できるため、CI を必須のチェックにする。
   - sdd-template から配っていた `hooks/` は汎用に保つ方針なので、そこにプロジェクト固有のチェックを入れない。
6. **構成を組み替えるのに合わせて、実際のページで使っていない component を削除する。**
   `ServicePillar` と `ContactInfoRow` は Storybook の catalog を整えるときに作られたが、その後の本実装で使われず、story からだけ参照されていた。
   使われない component を新しい構成へ移すと、「catalog にはあるが実際のページにはない」ものが残り続け、section の公開面の規約（どの Section が起点か）もあいまいになる。
   そのため、story ごと削除する。
   作り直す必要が出たら、そのときに corporate-site の Design Doc の section の構成の表へ足す。

## Considered Options

| 選択肢                                                                                              | 強み                                                                                         | 弱み                                                                                                                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** section 単位の 1 階層のフラットな構成にし、公開面を `index.ts` と独自のチェックで固定する | section の起点が 1 つに決まる。構造が route の構成から独立する。公開面を機械でチェックできる | 既存の import の書き換えが要る。ページとの対応を表で保つ手間が残る。チェックは自前で保守する                                                                                                                                                                                     |
| route の層でまとめる（`sections/<route>/<section>/`）                                               | ページとの対応がディレクトリの構造で一意に決まる                                             | `ProductsCategorySection` のように domain と route が一致しない component の置き場が決まらない。IA の変更（5 page から 3 route への組み替えの実績がある。ADR-0003）がディレクトリの移動を強いる。「複数の route で共有したら common へ上げる」規則も、共有した時点で移動を強いる |
| domain の層と section の 2 階層にする（`sections/products/{category,detail}/`）                     | domain のまとまりを保てる                                                                    | 階層が section によって 1 段か 2 段に揃わず、`index.ts` の位置の規約が 2 通りに増える                                                                                                                                                                                            |
| 今の切り方を保ち、名前だけを変える                                                                  | 移す差分が最小で済む                                                                         | `products` に 2 つの Section component が同居したままで、起点が読めないという元の課題が解けない                                                                                                                                                                                  |
| `internal/` のサブディレクトリを常に強制する                                                        | 公開面がディレクトリでも明示される                                                           | 2〜3 ファイルの section には過剰。`index.ts` とチェックで同じことを保証できる                                                                                                                                                                                                    |
| section の間の依存を index 経由で許す                                                               | 柔軟                                                                                         | 依存のグラフが網の目になり、どの section が起点かが再びあいまいになる                                                                                                                                                                                                            |
| 使っていない component を新しい構成へそのまま移す                                                   | catalog の資産として残せる                                                                   | 実際のページにない component が残り続け、どの Section が起点かの判断をにごす。git の履歴から戻せる（`.pen` は ADR-0013 で廃止したので、戻す元にしない）                                                                                                                          |
| eslint と eslint-plugin-astro で境界をチェックする                                                  | 汎用のルールの資産を使える                                                                   | eslint は入っておらず、oxlint との二重の運用と toolchain の方針の見直しが生じる。同じ種類のガードを独自のスクリプトで動かしている前例に合わせる                                                                                                                                  |

## Consequences

### Positive

- section の起点が `sections/<section>/index.ts` の 1 つに決まり、探す手順が単純になる。
- 構造が route の構成から独立するので、IA を変えてもディレクトリを移さずに済む。
  - ADR-0003: [corporate-site の IA を 3 route に統合する](0003-corporate-site-three-route-ia.md)
- 公開面を機械でチェックでき、規約から外れたことをチェックで検出できる。
- Storybook の title の階層（`Sections/<Section>/<Component>`）を、ディレクトリから機械的に決められる。
  - [規約: Storybook の title](../../context/conventions.md#storybook-の-title)

### Negative

- 既存の import（pages、内部の component、story）を書き換える移行の作業が要る。
- ページとの対応をディレクトリの構造から読めないので、corporate-site の Design Doc の section の構成の表を保つ手間が残る。
- チェックが独自のスクリプトになるので、ルールの表現力は汎用の linter に劣り、保守も自前になる。
