# ADR-0016: CI とローカルのフックの役割を、同じチェックを両方で動かすことを許す形で分ける

## Status

承認

## Context

- リモートでのチェックは少しずつ増えたが、どこまでを CI に載せるかの方針がなかった。
  決定のときの構成は次のとおり。
  - CI に載っていたもの: `lint`、`test`（`.github/workflows/lint.yml`）
  - CI に載っていなかったもの: `typecheck`、`build`、`knip`、`depcruise`、`e2e`
  - ローカルの `lefthook` の pre-commit: `protected-branch`、`format`、`repo-analysis`（`depcruise` と `knip`）、`lint`
- `typecheck` と `build` は pre-commit にも CI にもなく、**どこでも自動では確認できていなかった**。
- `lint.yml` は、自らのコメントで「lint の必須のチェック（pre-commit は `--no-verify` で飛ばせるため）」と述べていた。
  CI を最後の砦にする考え方が、すでにあった。
- 決定のとき、Turbo の remote caching は無効だった。
  develop の branch protection の required status checks は、private のリポジトリのため API から取得できず、未確認だった。

## Decision

- **`typecheck`、`build`、`knip`、`depcruise`、`e2e` を CI に載せる。**
  pre-commit は `--no-verify` で迂回できるので、ローカルの `lefthook` と重なることを、**意図した二重化**として許す。
- **E2E を CI で動かす。**
  E2E がローカルで受けていた `127.0.0.1:4321` への bind の制約は、ローカルの sandbox に固有で、GitHub Actions の runner には当てはまらない。
- **VRT の撮影と判定は、CI の環境だけで行う。**
  ローカルと CI ではフォントの描画が違い、baseline を撮る環境を固定しないと恒常的な差分が出るため。
  - ADR-0015: [VRT を story と route の 2 系統で導入する](0015-visual-regression-testing-policy.md)
- **CI の実行時間の目標値は置かない。**
  ジョブを足した後に実行時間を測り、その値を見て Turbo の remote cache と required status checks の要否を判断する。
- **Turbo の remote cache は入れない。**
  pull request のチェックが揃うまで 2 分 15 秒で、支配しているのは VRT の撮影である。
  cache の対象になる build、typecheck、lint を短くしても、critical path は動かない。
  ジョブの構成が変わったら、測った値から判断し直す。
- **required status checks は設定しない。**
  private のリポジトリで Free plan では、branch protection と ruleset の機能そのものが使えない。
  API が 403 `Upgrade to GitHub Pro or make this repository public` を返す。
  解除に要る public 化と GitHub Pro のどちらも採らない。
  - CI が赤いまま merge できる状態が残るので、merge の前に pull request のチェックの欄を見る運用で補う。
  - 直接のコミットの禁止は、`lefthook.yml` の `pre-push` が担う。
- 次の 2 つは、CI のジョブの構成の対象にしない。
  - `pnpm check:specs` は、`.github/workflows/spec-residue.yml` がすでに CI で実行している。
    この workflow は、意図して pull request のチェックから外している。
    別の pull request で spec を消す運用では、issue は閉じたが spec が残っている間に、関係のない pull request が失敗するため。
    この判断を保つ。
  - Storybook の build は、`.github/workflows/storybook-pages.yml` がすでに担っている。

## Considered Options

| 選択肢                                                                                                    | 強み                                                                                         | 弱み                                                                                   |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **採用:** `typecheck`、`build`、`knip`、`depcruise`、`e2e` を CI に載せ、ローカルのフックとの二重化を許す | `typecheck` と `build` が確認できていない抜けがなくなる。pre-commit を迂回しても CI で止まる | CI の実行時間が伸びる。同じチェックがローカルと CI で 2 回動く                         |
| CI を基準にし、pre-commit を軽くする                                                                      | commit が速くなり、ローカルの待ち時間が減る                                                  | ローカルで知るのが CI の実行まで遅れる。チェックに失敗する状態で push する頻度が上がる |
| `typecheck` と `build` だけを CI に足し、`knip` と `depcruise` は pre-commit に任せる                     | CI の実行時間を抑えられる                                                                    | `--no-verify` で迂回されると、`knip` と `depcruise` のチェックが完全に抜ける           |
| E2E を Cloudflare Pages の preview deployment に対して実行する                                            | 本番に近い環境で確認できる                                                                   | preview の URL の取得と待機が要り、workflow の構成が複雑になる                         |
| Turbo remote cache を先に導入してからジョブを増やす                                                       | CI の実行時間が増えるのを先回りして抑えられる                                                | Vercel のサービスかセルフホストが要り、必要なことを測った値で示す前に依存が増える      |

## Consequences

### Positive

- `typecheck` と `build` が確認できていない抜けがなくなる。
- pre-commit を迂回しても CI で止まるので、品質のチェックが実際に働く。
- テストを増やしても動かす場所が決まっているので、足すときに迷わない。

### Negative

- CI の実行時間が伸びる。
- 同じチェックが、ローカルと CI で 2 回動く。
- required status checks がないので、CI が赤いまま merge できる。
  merge の前にチェックの欄を見る運用に頼る。
