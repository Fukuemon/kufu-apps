# ADR-0032: E2E の workspace にだけ ESLint を入れ、テストの書き方の規則を掛ける

## Status

提案

## Context

- lint は oxlint だけで実行している。構成とツールチェーンの要求の ADR-0025 は、整形と lint を Vite+ の `vp check` に替える。
  - ADR-0025: [整形、lint、unit test を Vite+ で実行し、Turborepo を外す](0025-vite-plus-toolchain.md)
- agent-harness のパッケージ e2e は、テストの書き方の規則を、ESLint の規則のファイル 1 つで配る。スキル setup-e2e-lint は、このファイルを利用者のリポジトリに写して使う。
  - 規則が使う依存は、ESLint と、TypeScript を読む parser だけである。
  - 規則は、ESLint を流すディレクトリから見たテストのディレクトリの下だけを見る。ほかのディレクトリから流すと、違反があっても報告しない。
- agent-harness は private のリポジトリで、このリポジトリは public である。
- buddy は、同じ規則を E2E の package の `check` の script で、`vp check` に続けて ESLint で流している。
  - 出典: [buddy の packages/e2e/package.json](https://github.com/Fukuemon/buddy/blob/c53390a6e64f4ef39d468dedd529425ae4aca0e5/packages/e2e/package.json)
- E2E のテストのコードは、層に分けて書く。
  - ADR-0031: [E2E のテストのコードを層に分けて書き、ページ単位の Page Object をやめる](0031-e2e-test-code-layers.md)
- E2E は、workspace の package にする。
  - ADR-0033: [E2E をルートの e2e/ に置いたまま、workspace の package にする](0033-e2e-workspace-at-root.md)

## Decision

- ESLint と `@typescript-eslint/parser` を、E2E の workspace の devDependencies にだけ入れる。
- ESLint で掛ける規則は、テストの書き方の規則の 1 つだけにする。整形とほかの lint は、リポジトリの全体と同じツールで実行する。
- 規則のファイルは `e2e/eslint/` に写し、設定は `e2e/eslint.config.mjs` に置く。
- 規則に渡す値は、次のとおりにする。
  - テストのディレクトリは `tests`。
  - 固定の待ちを許すファイルは、撮影の字幕の関数（`tests/fixtures/caption.ts`）だけにする。
  - 待つ時間の名前を定めるファイルは、`tests/fixtures/timeouts.ts` にする。
  - 画面 ID の形と、本物の backend につなぐ spec の形は渡さない。画面 ID の体系も backend も持たないためである。
- E2E の workspace の `check` の script で ESLint を流す。ルートの `pnpm check` と CI の lint の job は、workspace の `check` を通して実行する。
  - workspace の script は、その workspace のディレクトリで流れる。規則が違うディレクトリから流れて、違反を見逃すことがない。
- 規則を入れる pull request で、わざと書いた違反で `pnpm check` が失敗することを確認する。

## 承認の条件

- private の agent-harness の規則のファイルを、public のこのリポジトリに写してコミットすることを、運営者が認める。
  - 認めないときは、apm が配置したスキルのディレクトリのファイルを、設定から直接読む形にする。CI の job に、apm の配置と GitHub App のトークンが要る。

## Verification

2026-11-11 に、develop の b6b3fe4 の `e2e/corporate-site` の写しで確認した。macOS の手元の結果である。

- ESLint 10.13.0 と `@typescript-eslint/parser` 8.72.0 で規則を流すと、11 件を報告した。
- oxlint 1.89.0 の JS プラグインとして規則を読ませても、同じ 11 件を報告した。
  - 確認したのは、要素の拾い方の報告だけである。層の依存、固定の待ち、待つ時間の報告は確認していない。
  - `vp lint` の設定から JS プラグインを渡せるかは、確認していない。

## Considered Options

| 選択肢                                                                    | 強み                                                                                   | 弱み                                                                                                                             |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** E2E の workspace にだけ ESLint を入れ、書き方の規則だけを掛ける | スキルの手順と buddy と同じ形になる。規則のテストと更新の手順を、そのまま使える        | lint のツールが 2 つになる。E2E のコードは、Vite+ と ESLint の両方で確認する                                                     |
| ESLint を入れず、規則を oxlint の JS プラグインとして `vp lint` で流す    | lint のツールが 1 つで済む。依存が増えない。ルートの設定でテストのディレクトリを渡せる | 要素の拾い方のほかの報告を確認していない。規則の配布元は ESLint だけでテストしている。構成とツールチェーンの要求の実装の後になる |
| ESLint をリポジトリの全体に入れる                                         | 設定が 1 か所になる                                                                    | oxlint と役割が重なる。規則は E2E のコードだけを見る                                                                             |
| 規則を入れず、書き方をレビューで見る                                      | 依存が増えない                                                                         | 規則に反する書き方を機械で見つけられない                                                                                         |

## Consequences

### Positive

- 層の依存、要素の拾い方、固定の待ちを、コミットの前と CI で確認できる。
- 規則の新しいバージョンを、スキルの手順で取り込める。

### Negative

- ESLint と parser の 2 つの依存が、E2E の workspace に増える。
- 規則のファイルを、このリポジトリに写して持つ。配布元の更新は、手で取り込む。
- lint のツールが、oxlint と ESLint の 2 つになる。
