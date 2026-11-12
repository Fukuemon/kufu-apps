# ADR-0029: テストの書き方の規則を、ESLint を入れずに oxlint の JS プラグインで流す

## Status

承認

## Context

- lint は oxlint だけで実行している。構成とツールチェーンの要求の ADR-0009 は、整形と lint を Vite+ の `vp check` に替え、設定をルートの `vite.config.ts` に置く。`pnpm check` は、ルートで `vp check` を 1 回実行する。
  - ADR-0009: [整形、lint、unit test を Vite+ で実行し、Turborepo を外す](0009-vite-plus-toolchain.md)
- agent-harness のパッケージ e2e は、テストの書き方の規則を、ESLint の規則のファイル 1 つで配る。スキル setup-e2e-lint は、このファイルを利用者のリポジトリに写し、ESLint で流す。
  - 規則は、scope の解析、型の情報、自動の修正、token の API を使わない。
  - 規則は、lint を流すディレクトリ（`context.cwd`）からの相対パスで、テストのディレクトリを判定する。外のファイルでは何も報告しない。
- oxlint の JS プラグインは、ESLint の規則の API で書いた規則を読む。oxlint の文書は、JS プラグインを alpha とし、型の情報を使う規則に対応しないとしている。ESLint と違う動きは、バグとして扱うとしている。
  - 出典: [oxlint の JS plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins.html)
- Vite+ は、`vp check` を package のディレクトリから流しても、ルートの `vite.config.ts` の `lint` を使う。
  - 出典: [Vite+ の lint](https://viteplus.dev/guide/lint)
- agent-harness は private のリポジトリで、このリポジトリは public である。
- buddy は、同じ規則を E2E の package の `check` の script で、`vp check` に続けて ESLint で流している。
  - 出典: [buddy の packages/e2e/package.json](https://github.com/Fukuemon/buddy/blob/c53390a6e64f4ef39d468dedd529425ae4aca0e5/packages/e2e/package.json)
- E2E のテストのコードは、層に分けて書く。
  - ADR-0028: [E2E のテストのコードを層に分けて書き、ページ単位の Page Object をやめる](0028-e2e-test-code-layers.md)
- E2E は、workspace の package にする。
  - ADR-0030: [E2E をルートの e2e/ に置いたまま、workspace の package にする](0030-e2e-workspace-at-root.md)

## Decision

- ESLint を入れず、テストの書き方の規則を oxlint の JS プラグインとして流す。
- 規則のファイルを `e2e/lint/` に写してコミットする。規則を JS プラグインとして読ませるファイルも、同じディレクトリに置く。
  - 運営者が、private の agent-harness の規則のファイルを、public のこのリポジトリに写すことを認めた。
- 規則に渡す値は、次のとおりにする。
  - テストのディレクトリは `tests`。
  - 固定の待ちを許すファイルは、撮影の字幕の関数（`tests/fixtures/caption.ts`）だけにする。
  - 待つ時間の名前を定めるファイルは、`tests/fixtures/timeouts.ts` にする。
  - 画面 ID の形と、本物の backend につなぐ spec の形は渡さない。画面 ID の体系も backend も持たないためである。

### 1. 構成とツールチェーンの要求の vp check の前は、e2e/.oxlintrc.json で流す

- `e2e/.oxlintrc.json` の `jsPlugins` で規則を読み、options に `e2e/` からの相対パスを渡す。
- 規則は、`@kufu/e2e` の `lint` の script でだけ流す。workspace の script は `e2e/` で流れるので、テストのディレクトリの判定がずれない。ルートの `pnpm lint` と CI の lint の job は、この script を通して流す。
  - JSON の設定では絶対パスを作れないので、流す場所を script で決める。

### 2. vp check の後は、ルートの lint.overrides に移し、options を絶対パスで渡す

- 構成とツールチェーンの要求の `vp check` のタスクで、規則をルートの `vite.config.ts` の `lint.jsPlugins` に登録する。`lint.overrides` で、`e2e/tests/` の下のファイルに options を渡す。`e2e/.oxlintrc.json` と `@kufu/e2e` の `lint` の script は消す。
- options のパスは、`vite.config.ts` で `import.meta.dirname` から絶対パスにして渡す。ルートと `e2e/` のどちらで `vp check` を流しても、同じ報告が出る。

### 3. 規則が違反を見ていることを確認し続ける

- 規則を入れる pull request と、ルートの `lint.overrides` に移す pull request で、わざと書いた違反でチェックが失敗することを、ルートと `e2e/` の両方で確認する。違反の無い状態で通っただけでは、規則がテストのディレクトリを見ているかが分からない。
- 規則の新しいバージョンを取り込むたびに、配布元のテストを oxlint の RuleTester で流す。配布元のテストは ESLint の RuleTester で書かれているので、import の 3 行を替えて流す。

### 4. 確認が通らなければ、E2E にだけ ESLint を入れる

- 上の確認のどれかが通らないときは、JS プラグインをやめ、ESLint と `@typescript-eslint/parser` を E2E の workspace の devDependencies にだけ入れる。規則は `@kufu/e2e` の script で、`e2e/` で流す。

## Verification

2026-11-11 に、macOS の手元で確認した。写しは 2 つある。develop の b6b3fe4 の `e2e/corporate-site` の写しでは、ESLint と oxlint 1.89.0 の報告が同じ 11 件だった。規則の 17 種類の報告を入れた写し（テストの 10 ファイルと、テストのディレクトリの外の 1 ファイル）では、次のとおりだった。

- 規則の配布元のテスト 81 件は、ESLint 10.13.0 の RuleTester で通った。oxlint 1.63.0、1.89.0、1.93.0 と、vite-plus 1.5.1 が同梱する oxlint 1.91.0 の RuleTester でも、どれも通った。違反のコードを valid に置くと、どちらの RuleTester も失敗した。
- 規則の 17 種類の報告を含む写しに CLI で当てると、ESLint と oxlint の報告は 40 件ずつで、ファイル、行、列、文が一致した。oxlint 1.63.0、1.89.0、1.93.0 と `vp lint` で同じだった。テストのディレクトリの外のファイルは、両方とも 0 件だった。
- ルートの `vite.config.ts` にルートからの相対パスを渡し、`e2e/` で `vp lint` を流すと、報告は 0 件で、終了コードは 0 だった。options を `import.meta.dirname` から絶対パスにすると、ルートと `e2e/` のどちらでも 40 件になった。
- options に schema にない key を足すと、oxlint の CLI と `vp lint` の両方が終了コード 1 で止まった。
- `eslint-disable-next-line` と `oxlint-disable-next-line` の無効化のコメントは、oxlint で両方とも報告を止めた。
- 型を使う lint（`lint.options.typeAware`）と同時に流すと、両方の報告が出た。vite-plus 1.5.1 だけで確認した。
- 確認していないこと: 実際の `e2e/` の構成（workspace の package）での結果、CI の Linux での動き、エディタの language server での `context.cwd`。

## Considered Options

| 選択肢                                                                                                                                                                  | 強み                                                                                                                        | 弱み                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **採用:** ESLint を入れず、規則を oxlint の JS プラグインとして流す。`vp check` の前は `e2e/.oxlintrc.json`、後はルートの `lint.overrides` で、options を絶対パスで渡す | lint のツールが 1 つで済む。依存が増えない。ADR-0009 のルートの `vp check` で流れる。規則のすべての報告が ESLint と一致した | JS プラグインは alpha である。スキルの設定の例は ESLint の形なので、このリポジトリの設定に読み替える。配布元のテストを流すときに import を替える |
| E2E の workspace にだけ ESLint を入れ、書き方の規則だけを掛ける                                                                                                         | スキルの手順と buddy と同じ形になる。規則のテストと更新の手順を、そのまま使える。alpha の機能に頼らない                     | lint のツールが 2 つになる。ESLint と parser の 2 つの依存が増える                                                                               |
| JS プラグインで流し、ルートでだけ流すと決め、ルートからの相対パスを渡す                                                                                                 | 報告の文に手元の絶対パスが出ない                                                                                            | `e2e/` で `vp check` を流すと、報告が 0 件のまま成功する。止める仕組みが文書だけになる                                                           |
| ESLint をリポジトリの全体に入れる                                                                                                                                       | 設定が 1 か所になる                                                                                                         | oxlint と役割が重なる。規則は E2E のコードだけを見る                                                                                             |
| 規則を入れず、書き方をレビューで見る                                                                                                                                    | 依存が増えない                                                                                                              | 規則に反する書き方を機械で見つけられない                                                                                                         |

## Consequences

### Positive

- 層の依存、要素の拾い方、固定の待ちを、コミットの前と CI で確認できる。
- lint のツールが oxlint の 1 つのままで、依存が増えない。
- ルートの `lint.overrides` に移した後は、ルートと `e2e/` のどちらで流しても同じ報告が出る。

### Negative

- oxlint の JS プラグインは alpha である。oxlint を上げたときに、規則の動きが変わることがある。配布元の規則が、oxlint の未対応の API（型の情報など）を使うようになると、流せなくなる（推測）。
- 規則のファイルを、このリポジトリに写して持つ。配布元の更新は、手で取り込み、そのたびに oxlint の RuleTester でテストを流す。
- options を絶対パスで渡すので、待つ時間の報告の文に、手元の `timeoutDefinitionFile` の絶対パスが出る。
- `vp check` のタスクで、規則の設定を `e2e/.oxlintrc.json` からルートの `vite.config.ts` に移す作業が 1 回増える。
- 確認が通らないときは、E2E にだけ ESLint を入れる形に戻し、設定を作り直す。
