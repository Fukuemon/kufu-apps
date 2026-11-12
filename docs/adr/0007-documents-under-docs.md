# ADR-0007: PRD、Design Doc、ADR、spec を `docs/` の下に集める

## Status

承認

## Context

- 文書は、ルートの `PRD.md`、`design/`、`adr/`、`specs/` に分かれている。
- 運営者が保守する buddy は、`docs/` の下に `PRD.md`、`design/`、`adr/` を置き、spec の置き場を `docs/specs` にしている。
  - 出典: [buddy の context/project.yml](https://github.com/Fukuemon/buddy/blob/c53390a6e64f4ef39d468dedd529425ae4aca0e5/context/project.yml#L5-L8)
- fukuemon.dev も、文書を `docs/` に移すことを要求の受け入れ条件にしている。
  - 出典: [fukuemon.dev の issue 33](https://github.com/Fukuemon/fukuemon.dev/issues/33)
- スキルとフックは、文書のディレクトリを `context/project.yml` の `docs` から読む。
  - `scripts/check-specs-residue.sh` と `.github/workflows/spec-closeout.yml` も、`docs.spec` を読む。
- buddy のドキュメントサイトは、`docs/` を入力のディレクトリにしている。
  - 出典: [buddy の zensical.toml](https://github.com/Fukuemon/buddy/blob/c53390a6e64f4ef39d468dedd529425ae4aca0e5/zensical.toml#L5)
- spec は issue を閉じるときに削除する。
  - ADR-0011: [spec の closeout を CI で強制する](0011-specs-closeout-enforcement.md)
- `adr/README.md` と `adr/TEMPLATE.md` は、スキル write-design-docs が前提にする名前（`index.md`、`template.md`）と違う。

## Decision

文書を、次のとおり `docs/` の下に移す。

| 今の場所  | 移した後の場所 |
| --------- | -------------- |
| `PRD.md`  | `docs/PRD.md`  |
| `design/` | `docs/design/` |
| `adr/`    | `docs/adr/`    |
| `specs/`  | `docs/specs/`  |

- `context/project.yml` の `docs` を、`design: docs/design`、`adr: docs/adr`、`spec: docs/specs` にする。
  - 3 つのリポジトリで、スキルが同じ場所を読み書きするためである。
- `adr/README.md` を `docs/adr/index.md` に、`adr/TEMPLATE.md` を `docs/adr/template.md` に改める。
- `specs/README.md` は削除する。`docs/specs/` は、作業中の spec がある間だけ存在する。
  - spec の書き方は、スキル write-design-docs が持つ。
  - `specs/README.md` の「必須確認」、命名の規約、closeout の 4 つの手順は、このリポジトリだけの取り決めなので、`CONTRIBUTING.md` に移す。`context/conventions.md` のリンクも、移した先へ張り替える。
- `context/`、`AGENTS.md`、`CONTRIBUTING.md`、`README.md` は、ルートに残す。buddy も同じ場所に置く。
- コードの隣の Design Doc（`apps/corporate-site/DesignDoc.md`）は動かさない。
- 移す pull request で、リポジトリの中の移す前のパスへの参照を、すべて直す。
  - 対象は、リンク、コードスパンのパス、`governs`、ワークフローとスクリプトのコメント、`.gitignore`。
  - `apps/corporate-site/src/content/` のデータ、テスト、story が持つ出典のパスの文字列（`design/features/corporate-site/reference/…`）も対象にする。
- `e2e/` は、ルートに残す。buddy は `packages/e2e` に置く。置き場は、E2E のテストの設計で決める。

## Considered Options

| 選択肢                                                   | 強み                                                                                                            | 弱み                                                                                                            |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **採用:** PRD、Design Doc、ADR、spec を `docs/` に移す   | buddy と同じ場所になり、同じ手順とスキルで読み書きできる。ドキュメントサイトの入力を 1 つのディレクトリにできる | 文書、設定、app のデータにある移す前のパスを直す。開いている pull request（#49、#57）が同じファイルを変えている |
| ルートに置いたままにする                                 | 何も変えない                                                                                                    | 3 つのリポジトリで文書の場所が分かれる。ドキュメントサイトの入力が 4 か所になる                                 |
| PRD、Design Doc、ADR だけを移し、`specs/` はルートに残す | spec の README とワークフローを変えずに済む                                                                     | buddy と spec の場所だけが違う。`docs.spec` を読むスクリプトは、値を変えれば動くので、残す理由が小さい          |
| spec を Git で追跡しない場所（`.ai-out/`）に置く         | closeout のチェックが要らなくなる                                                                               | レビューする人が pull request で spec を読めない。ADR-0011 の判断を変える                                       |

## Consequences

### Positive

- buddy と同じパスで、PRD、Design Doc、ADR を開ける。
- ドキュメントサイトを入れるときに、入力を `docs/` の 1 か所にできる。

### Negative

- issue と pull request に書いた、ブランチ名を ref にしたリンクは切れる。コミットの SHA を ref にしたリンクは残る。
- 移す pull request より前に切ったブランチは、取り込むときに、足した文書を手で `docs/` へ移す。
- ドキュメントサイトが `docs/specs/` を公開するかは、ドキュメントサイトの設計で決める。
