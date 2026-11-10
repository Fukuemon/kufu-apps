# ADR-0035: 検証のシナリオを文書として置き、エビデンスを pull request に載せる

## Status

提案

## Context

- agent-harness のパッケージ verification は、要求の受け入れ条件を、検証の設計、検証のシナリオ、エビデンスで確認する。置き場は、利用者のリポジトリが決める。
  - 検証の設計とシナリオのファイルの置き場
  - エビデンスを撮る spec の置き場
  - 撮ったエビデンスの格納先
- エビデンスの元のファイルのデフォルトの置き場は、Git で追跡しない `.ai-out/evidence` である。
- このリポジトリは public である。pull request に上げたファイルは、誰でも開ける。
- corporate-site は静的なサイトで、ログインと利用者のデータを持たない。画面に出るのは、公開のサイトと同じ内容である。
- 検証環境はない。配信は Cloudflare Pages で、基盤の要求が配信の形を変える。
- story の VRT の baseline を Git で管理したとき、PNG の履歴でリポジトリが大きくなった。
  - ADR-0018: [story の側の VRT を Storybook の公式のテストの基盤に載せ、baseline をリポジトリで管理する](0018-story-vrt-on-storybook-test-integrations.md)
- 構成とツールチェーンの要求の ADR-0024 は、文書を `docs/` の下に集める。
  - 出典: [ADR-0024](https://github.com/Fukuemon/kufu-apps/blob/48380362a729fe2d5090af0fa25649d6a95adf75/adr/0024-documents-under-docs.md)
- buddy は、検証の設計とシナリオを `docs/verification/<要求の番号>-<主題>/` に置く。
  - 出典: [buddy の docs/verification](https://github.com/Fukuemon/buddy/tree/c53390a6e64f4ef39d468dedd529425ae4aca0e5/docs/verification)
- エビデンスは、Playwright の録画と字幕で撮る。
  - ADR-0034: [Playwright を 1.64.1 に上げ、録画と字幕でエビデンスを撮る](0034-playwright-upgrade-and-capture.md)

## Decision

### 1. エビデンスを付ける変更

- 画面の振る舞いか見た目を変える pull request には、録画のエビデンスを付ける。
- 文書、スキル、設定だけの pull request には付けない。画面が変わりうる依存の更新には付ける。

### 2. 検証の設計とシナリオは、docs/verification に置く

- 置き場は `docs/verification/<要求の issue>-<主題>/` にする。
  - `test-design.md`: 検証の設計
  - `scenarios.md`: 検証のシナリオ。前提、もし、ならばの文で書く
  - `README.md`: シナリオと spec の対応、spec を置かないシナリオ、撮影のための操作
- 要求を閉じた後も残す。次の改修で、同じシナリオを撮り直すためである。

### 3. エビデンスを撮る spec は、E2E の workspace に置いてコミットする

- 置き場は `e2e/tests/verification/<要求の issue>/<アクター>-<観点>.e2e.ts` にする。
- CI の E2E は、この spec も字幕なしで流す。markup が変わったときに、撮る前に気づけるようにするためである。
- pull request の動作確認の spec は、Git で追跡しない下書きのディレクトリ（`.ai-out/evidence/prs/<pull request の番号>/`）に置く。

### 4. エビデンスの動画と静止画は、Git に入れず、pull request に載せる

- 元のファイルは `.ai-out/evidence/` に置く。pull request に載せ終えたら消す。
- 検証のシナリオのエビデンスは、検証の pull request に載せる。実施の結果も、検証の pull request に記録する。
- 機能の pull request の動作確認は、先にコメントに載せ、運営者が確認してから本文の「検証とエビデンス」の表に並べる。
- 画面に写すのは、公開のサイトと同じ内容だけにする。

### 5. 撮る環境は、ローカルの build と preview にする

- `build` した成果物を `preview` で配信して撮る。CI の E2E と同じ起動の方法である。
- 改修前と比べるときは、改修前のブランチの成果物を別の port で配信し、`BASE_URL` で渡す。
- 配信の基盤が決まった後に、公開の前の環境で撮るかを決め直す。

## Considered Options

| 選択肢                                                                               | 強み                                                                                                   | 弱み                                                                                             |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| **採用:** シナリオを `docs/verification/` に置き、エビデンスを pull request に載せる | buddy と同じ置き場になる。リポジトリが大きくならない。レビューする人が、変更と同じ場所で動画を見られる | 動画は GitHub に上げたファイルで、リポジトリの外にある。要求をまたいだエビデンスの一覧を持たない |
| エビデンスの動画を `docs/verification/` にコミットする                               | シナリオとエビデンスが同じ場所にある                                                                   | 撮り直すたびに、古い動画が履歴に残る。リポジトリが大きくなる                                     |
| エビデンスを外部のストレージに置く                                                   | 一覧と保存の期間を自分で決められる                                                                     | 置き場がまだない。配信の基盤が決まるのを待つ                                                     |
| シナリオを issue の本文に書き、ファイルにしない                                      | 文書が増えない                                                                                         | spec との対応と、シナリオの変更を、レビューできない                                              |
| エビデンスを撮る spec を、CI の E2E で流さない                                       | CI の時間が増えない                                                                                    | markup の変更で spec が動かなくなっても、撮るときまで気づかない                                  |

## Consequences

### Positive

- 受け入れ条件を、シナリオの文と録画で確認できる。
- エビデンスを、リポジトリを大きくせずに残せる。
- 撮る spec が CI で動き続けるので、次の改修で同じシナリオを撮り直せる。

### Negative

- 文書の種類が 1 つ増える（`docs/verification/`）。
- 検証の spec と回帰の spec が、同じ操作を書くことがある。指し方は `selectors/` で共有する。
- ローカルで撮るので、配信の基盤に固有の動きは、エビデンスに写らない。
