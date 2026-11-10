---
type: spec
title: agent-harness の e2e、capture、verification で、画面の動きを確認してエビデンスを残せる
description: パッケージ e2e、capture、verification をリポジトリに組み込む要求の、論点、目指す形、context を埋める案、実装のタスクの分け方
status: draft
---

# agent-harness の e2e、capture、verification で、画面の動きを確認してエビデンスを残せる

## Requirements

要求は [issue 62](https://github.com/Fukuemon/kufu-apps/issues/62) にある。  
子の issue は、corporate-site の 3 ジャーニーを E2E に実装する [issue 7](https://github.com/Fukuemon/kufu-apps/issues/7) である。

## Non-Goals

- 問い合わせフォームの送信のジャーニー。フォームを実装したときに足す。
- VRT の仕組みの変更。Playwright を上げたときの baseline の確認と撮り直しだけを行う。
- route の VRT のファイルと baseline の置き場の変更。
- 構成とツールチェーンの要求が決める、文書の置き場、整形と lint のツール、ルートのコマンドの名前。
- デザインシステムの要求が決める、Storybook と story の VRT の載せ方。

## Acceptance Criteria

issue 62 の受け入れ条件を使う。

## Open Points

運営者が決める論点。ADR は、推奨の案を「提案」の状態で書いた。

### 論点 0: private の agent-harness のファイルを、このリポジトリに写してよいか

- スキル setup-e2e-lint と playwright-capture は、3 つのファイルを利用者のリポジトリに写して使う。書き方の規則、撮影の設定、字幕の関数である。
- agent-harness は private で、このリポジトリは public である。
- 案 A（推奨）: 運営者が認めたうえで、3 つのファイルを写してコミットする。CI と、fork からの pull request が、apm と GitHub App のトークンなしで動く。
- 案 B: 写さず、apm が配置したスキルのディレクトリのファイルを、設定から直接読む。lint と E2E の CI の job に、apm の配置とトークンが要る。fork からの pull request では動かない。
- 案 C: buddy と同じ npm の `@fukuemon/e2e-kit` 0.2.1 を使う。パッケージ e2e の今のバージョンは kit を持たず、スキルの手順と合わない。
- 決まらないと進めない作業: T1 の規則の組み込みと、T4。

### 論点 1: Playwright を上げるか

- 案 A（推奨）: 1.64.1 に上げる。ほかの変更を含まない pull request で上げ、CI の VRT を今の baseline と比べる。差分が出たら、運営者が差分を見て撮り直すかを決める。
- 案 A の別のバージョン: 最新の 1.65.0 にする。手元で確認していない。
- 案 B: E2E だけ 1.64.1 にし、VRT は 1.59.1 のままにする。
- 案 C: 上げない。受け入れ条件 2 を満たせない。
- 比較と試行の結果は、[ADR-0034](../../adr/0034-playwright-upgrade-and-capture.md) にある。
- 決まらないと進めない作業: T3、T4、T5。T1 と T2 は進められる。

### 論点 2: ページ単位の Page Object を、パッケージ e2e の層に置き換えるか

- 案 A（推奨）: 置き換える。クラスをやめ、`specs/`、`selectors/`、`fixtures/` に分ける。操作の対象は role と名前で拾い、拾う関数を `selectors/` に置く。production の markup は変えない。
- 案 A の別の形: 操作の対象にも testid を足し、testid だけで拾う。production の markup に testid を足す。
- 案 B: Page Object のクラスを残し、規則が止める拾い方だけを `selectors/` に移す。
- 案 C: Page Object を残し、規則を掛けない。受け入れ条件 1 を満たせない。
- 比較は、[ADR-0031](../../adr/0031-e2e-test-code-layers.md) にある。ADR-0031 は、ADR-0017 の全体を置き換える。play の対象、locator の使い分け、ジャーニーの定義は、変えずに引き継ぐ。
- 決まらないと進めない作業: T1、T2。

### 論点 3: E2E にだけ ESLint を入れるか

- 案 A（推奨）: E2E の workspace にだけ ESLint と parser を入れ、書き方の規則だけを掛ける。
- 案 B: ESLint を入れず、規則を oxlint の JS プラグインとして `vp lint` で流す。手元で、要素の拾い方の 11 件は同じに報告した。ほかの報告と、`vp lint` の設定で渡せるかは、確認していない。
- 案 C: 規則を入れない。受け入れ条件 1 を満たせない。
- 比較は、[ADR-0032](../../adr/0032-eslint-for-e2e-authoring-rule.md) にある。
- 決まらないと進めない作業: T1。

### 論点 4: E2E の置き場

- 案 A（推奨）: ルートの `e2e/` のまま、workspace の package（`@kufu/e2e`）にする。route の VRT のファイルと baseline は動かさない。
- 案 B: buddy と同じ `packages/e2e` に移す。
- 案 C: ルートの `e2e/` のまま、workspace にしない。
- 比較は、[ADR-0033](../../adr/0033-e2e-workspace-at-root.md) にある。
- 決まらないと進めない作業: T1。

### 論点 5: 検証のシナリオとエビデンスの置き場

- 案 A（推奨）: 検証の設計とシナリオを `docs/verification/<要求の issue>-<主題>/` に置く。撮る spec を `e2e/tests/verification/` に置き、CI の E2E でも字幕なしで流す。動画と静止画は Git に入れず、pull request に載せる。撮る環境は、ローカルの build と preview にする。
- 案 B: 動画と静止画を `docs/verification/` にコミットする。
- 案 C: 動画と静止画を外部のストレージに置く。
- 比較は、[ADR-0035](../../adr/0035-verification-scenarios-and-evidence.md) にある。
- 決まらないと進めない作業: T4 の `context/testing/evidence.md` と、T5。

### 論点 6: 3 ジャーニーをどの形で書くか

- 案 A（推奨）: 回帰の E2E として `e2e/tests/specs/` に書く。字幕は付けない。今の smoke の 5 件を、3 ジャーニーと表示の確認に組み替える。受け入れ条件 3 の検証のシナリオは、T5 で別に書き、同じ `selectors/` を使う。
- 案 B: 3 ジャーニーを字幕つきの検証の spec として書き、E2E と兼ねる。コードは 1 組で済む。テストの名前と置き場が、閉じる要求の番号に結び付く。
- 案 C: 字幕つきと字幕なしの両方を、同じ 3 本ずつ書く。
- 案 A の理由: 回帰のテストは振る舞いの名前で残り、検証の spec は要求に結び付く。字幕は、人が録画を見て判定する spec だけに要る。
- 決まらないと進めない作業: T2。

### 論点 7: section のアクセシビリティと、レイアウトの規則を E2E で確認するか

- デザインシステムの要求の ADR-0029（提案）は、section のアクセシビリティを E2E のテストの設計で扱うとしている。同じ要求の spec は、`LAYOUT-OVERFLOW` と `MOTION-REDUCE` を E2E で確認するかも、E2E のテストの設計で決めるとしている。
  - 出典: [ADR-0029](https://github.com/Fukuemon/kufu-apps/blob/0fdeb7b62f8f4cf98d667156492603c6bc456b2b/adr/0029-storybook-catalog.md)
- 案 A（推奨）: この要求の範囲に入れない。デザインシステムの要求の論点が決まった後に、別の issue にする。issue 62 の受け入れ条件にない。入れるときの置き場は、`e2e/tests/specs/` の下の機能のディレクトリになる。
- 案 B: この要求に含め、3 つの route にアクセシビリティの自動の確認を足すタスクを作る。確認に使うライブラリの依存が増える。
- 決まらないと進めない作業: なし。

### 論点 8: 環境変数の名前

- 撮影のスキルは、改修前のアプリの URL を `BASE_URL` で渡す。今の取り決めは `E2E_BASE_URL` である。
- 案 A（推奨）: `BASE_URL` に改める。渡したときは app を起動しない。
- 案 B: `E2E_BASE_URL` を残し、`BASE_URL` も読む。向ける先を渡す名前が 2 つになる。
- 決まらないと進めない作業: T4。

## Decisions

論点は、どれも決まっていない。  
次のものは、内部の名前なので、推奨の案で書いた。変えてよい。

- workspace の package の名前: `@kufu/e2e`
- Playwright の project の名前: `e2e`、`route-vrt`
- spec のディレクトリとファイルの名前（Design の「spec の分け方」）
- アクターの名前: `visitor`

## Design

### 今の振る舞いを固定するもの

- E2E の smoke の 5 件。T1 で層に移した後も、同じ 5 件が通ることを確認する。
- route の VRT の 6 枚と、story の VRT。T1 では baseline を変えない。

### 目指す形

```text
e2e/
├── package.json                  # @kufu/e2e。@playwright/test、eslint、parser を持つ
├── playwright.config.ts          # project は e2e と route-vrt
├── playwright.capture.config.ts  # エビデンスを撮るときの設定（T4）
├── eslint.config.mjs
├── eslint/e2e-authoring-rule.mjs # テストの書き方の規則
├── tsconfig.json
├── tests/
│   ├── specs/<機能>/<振る舞い>.e2e.ts
│   ├── verification/<要求の issue>/visitor-<観点>.e2e.ts   # T5
│   ├── selectors/
│   └── fixtures/                 # env.ts、timeouts.ts、caption.ts（T4）
├── corporate-site/               # route の VRT と baseline。動かさない
└── evidence/                     # 撮影の出力。Git で追跡しない（T4）
```

- `context/project.yml` に、`e2e.dir: e2e` を足す。
- `pnpm-workspace.yaml` に、`e2e` を足す。

### workspace にするときに直す箇所

T1 で、次の箇所を直す。

- ルートの `playwright.config.ts` を `e2e/` に移す。`testDir` を project ごとに持たせ、`e2e` の project の `testMatch` に `.e2e.ts` を渡す。
- ルートの `tsconfig.json` を `e2e/tsconfig.json` に移す。ルートの `typecheck` の script から、ルートの `tsc` を外す。
- ルートの `package.json` の `@playwright/test` を、`e2e/package.json` に移す。
- ルートの script
  - `e2e`: `playwright test smoke` を、`@kufu/e2e` の `test`（`playwright test --project=e2e`）を呼ぶ形に替える。
  - `vrt:route:run`: `playwright test route-vrt` を、`@kufu/e2e` の script（`playwright test --project=route-vrt`）を呼ぶ形に替える。
- `scripts/vrt-container.mjs`
  - Playwright のバージョンを読むパスを、`e2e/node_modules/@playwright/test` に替える。
  - container の中で隠す `node_modules` の一覧に、`e2e/node_modules` を足す。
- `knip.json`: ルートの workspace の `e2e/**/*.ts` を、`e2e` の workspace の設定に移す。
- `.dependency-cruiser.cjs`: `playwright.config.ts` と `e2e/` を指す正規表現を直す。
- `.github/workflows/ci.yml`
  - `e2e` と `vrt-route` の job の artifact のパス（`test-results/`）を、`e2e/test-results/` に替える。
  - baseline の artifact のパス（`e2e/corporate-site/route-vrt.spec.ts-snapshots/`）は変えない。
- `.gitignore`: `e2e/evidence/` を足す（T4）。
- 今の `e2e/corporate-site/smoke.spec.ts` と `pages/` は、`e2e/tests/` の層に移して削除する。`route-vrt.spec.ts` は、`smoke.spec.ts` の幅を参照するコメントだけを直す。

route の VRT の project は、`testDir` を `corporate-site` にする。テストのファイルの場所が変わらないので、baseline のパスも変わらない。変わらないことは、T1 の CI の `vrt-route` の job が、baseline を撮り直さずに通ることで確認する。

### spec の分け方

今の smoke の 5 件と、3 本のジャーニーを、次の spec に分ける案。観点とケースは、[3 ジャーニーのテスト設計](journeys-test-design.md) にある。

| spec（`e2e/tests/specs/` の下）     | 持つもの                                                  | タスク |
| ----------------------------------- | --------------------------------------------------------- | ------ |
| `routes/render.e2e.ts`              | 3 つの route の題と主な領域の表示（今の smoke の 1 件目） | T1     |
| `browsing/home-to-contact.e2e.ts`   | 回遊。`/` から `/products`、検索と URL、`/contact` まで   | T2     |
| `navigation/site-navigation.e2e.ts` | ヘッダー、フッター、モバイルのナビからの到達              | T2     |
| `no-javascript/core-content.e2e.ts` | JavaScript が無効のときの、主な領域と問い合わせ先         | T2     |

- T1 は、今の 5 件を、中身を変えずに層に移す。5 件を 4 つのファイルに分けて置き、足りないケースは T2 で足す。
- `selectors/` は、今の 3 つの Page Object の、role、文言、CSS のセレクタでの指し方を、route ごとのファイルに移す。testid での指し方は、spec に書く。

### context を埋める案

- `context/testing/e2e.md`: [埋める案](context-e2e-draft.md)。T1 で書き、T2 と T4 で足す。
- `context/testing/evidence.md`: [埋める案](context-evidence-draft.md)。T4 で書き、T5 で Verification Scenarios を確認する。
- 2 つの `status` は、T5 で `stable` にする。

`context/testing.md` は、次の箇所を替える。

- Test Types and Guarantees の表: E2E の置き場を、`e2e/tests/`（workspace の `@kufu/e2e`）にする（T1）。
- Runtime Requirements: 正とする設定を `e2e/playwright.config.ts` に、読む場所を `e2e/tests/` の下の spec に替える（T1）。環境変数の `E2E_BASE_URL` を `BASE_URL` に替える（T4）。
- Required Tests の「Page Object と locator」: 見出しを locator の規約に替え、Page Object の 2 行を、層と `selectors/` の規約に替える。詳細は `context/testing/e2e.md` へリンクする（T1）。
- frontmatter の `governs`: `playwright.config.ts` を `e2e/` の下のパスに替える（T1）。

### ほかの文書の変更の案

- 全体の Design Doc の e2e のセクション: 「ルートで管理する Playwright」を、workspace の package に替える。エビデンスの撮影と、検証のシナリオの spec を持つことを足す（T1、T4）。
- corporate-site の Design Doc の「E2E が担うジャーニー」: ADR-0017 へのリンクを、ADR-0031 に替える（T1）。
- `e2e/README.md`: 構成と Page Object のセクションを、層の説明に替える。ジャーニーの定義は、corporate-site の Design Doc と重なるので、リンクにする（T1）。
- `README.md` と `CONTRIBUTING.md`: E2E のコマンド、ffmpeg、エビデンスの撮り方へのリンクを足す（T1、T4）。
- `adr/0017-ui-test-structure-policy.md`: ADR-0031 を承認したときに、Status を「ADR-0031 に置換」にする。
- 文書のパスは、構成とツールチェーンの要求の T1 で `docs/` の下に移る。この spec と ADR は、移す前のパスで書いた。`docs/verification/` は、移した後にできる。

### 実装のタスクの分け方

種別 feature のプリセットの `tasks` は、design、impl、verify、docs である。

- design は、この spec の pull request が担う。issue は起票しない。
- docs は、起票しない。context と文書の更新は、実装のタスクの pull request に含める。
- どのタスクも、CI の全ての job が通ることを、完了の条件に含める。

| #   | 種類   | タスク                                                             | タスクごとの完了の条件                                                                                                                                                                                                                                                               | 前提                                             |
| --- | ------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| T1  | impl   | E2E を workspace にし、層と書き方の規則を入れる                    | 今の smoke の 5 件が、`e2e/tests/` の層で通る。Page Object のクラスがない。`pnpm check` が書き方の規則を流し、わざと書いた違反で失敗する。route の VRT が、baseline を変えずに通る。`context/testing/e2e.md` の Test Tool、Test IDs、Lint Rule Options、Running Tests が埋まっている | 構成とツールチェーンの要求の T6。論点 0、2、3、4 |
| T2  | impl   | corporate-site の 3 ジャーニーを E2E に実装する（issue 7）         | テスト設計の必須のケース（C1 から C10）が `e2e/tests/specs/` にあり、`pnpm e2e` と CI の `e2e` の job で通る。それぞれの spec で、期待を逆にすると落ちることを確認している                                                                                                           | T1。論点 6                                       |
| T3  | impl   | Playwright を 1.64.1 に上げる                                      | `@playwright/test` と CI の 4 つの image が 1.64.1 である。E2E が通る。route と story の VRT に差分がないか、運営者が差分を見て決めている                                                                                                                                            | 構成とツールチェーンの要求の T4。論点 1          |
| T4  | impl   | 撮影の設定と字幕の関数を入れ、エビデンスを撮って載せる手順を決める | 撮影の設定で既にある spec を 1 本撮り、mp4 ができる。字幕つきの spec を 1 本撮り、この pull request のコメントに載せて再生できる。`BASE_URL` で向ける先を変えられる。`context/testing/evidence.md` の Verification Scenarios のほかが埋まっている                                    | T1、T3。論点 0、5、8                             |
| T5  | verify | 受け入れ条件を検証し、3 つの route のシナリオのエビデンスを残す    | `docs/verification/62-…/` に検証の設計とシナリオがある。シナリオの spec が `e2e/tests/verification/62/` にあり、CI で通る。エビデンスが検証の pull request にある。2 つの context の `status` が `stable` である。issue 62 の受け入れ条件を確認している                              | T2、T4。構成とツールチェーンの要求の T1。論点 5  |

- T1 を、構成とツールチェーンの要求の T6 の後にするのは、同じファイルを変えるためである。その要求の T2 から T6 が、`package.json`、`pnpm-lock.yaml`、CI のワークフロー、ルートの script を順に変える。
  - T6 の後は、ルートのコマンドが `pnpm check` と `pnpm -r` になっている。`@kufu/e2e` の `check` と `typecheck` は、そのまま束ねられる。
  - 先に進めたいときは、T1 を今のコマンド（`pnpm lint`、`pnpm typecheck`）で書き、その要求の T3 と T5 で直すことになる。
- T3 は、T1 に依存しない。T1 より前に行うときは、ルートの `package.json` の `@playwright/test` を上げる。
- T3 を、デザインシステムの要求の、見た目を変えないタスク（色のトークンとコンポーネントの書き直し）と同時に進めない。どちらも「VRT に差分がない」を確認に使う。
- T2 は、Playwright を上げなくても進められる。T1 が終われば始められる。
- 子の数は、issue 7 を含めて 5 件である。
- issue 62 は、T5 の検証の pull request で閉じる。その pull request で、この spec を削除する。

### issue 7 の本文の変更の案

論点 2 と 6 が推奨のとおりに決まったときに、issue 7 の本文を次のように直す。

- 実施内容: 置き場を `e2e/corporate-site/` から `e2e/tests/specs/` に替える。観点とケースは、テスト設計の表を写す。
- 制約
  - 「セレクタは Page Object に集約する」を、「role、文言、CSS のセレクタでの指し方は `e2e/tests/selectors/` に置く。確認と手順は spec に書く」に替える。
  - locator の使い分けの基準の文書を、ADR-0031 と `context/testing/e2e.md` に替える。
  - 「Page Object と E2E のヘルパを `packages/*` へ昇格させない」を、「E2E のコードを `packages/*` に置かない」に替える。
- 完了条件
  - 「テスト本体に生の locator が無い（Page Object 経由）」を、「書き方の規則の指摘がない」に替える。
  - 「`pnpm lint` / `pnpm typecheck` が通る」を、「`pnpm check` と `pnpm typecheck` が通る」に替える。
- 依存関係: T1 の issue の番号を足す。

## Verification

| 受け入れ条件                                                         | タスク | 確認の方法                                                                                               |
| -------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------- |
| 1. 書き方の規則が、E2E のコードに lint として掛かり、CI で動く       | T1     | CI の lint の job のログに、規則の実行がある。わざと書いた違反で `pnpm check` が失敗する                 |
| 2. 撮影の設定があり、E2E から録画と字幕のエビデンスを作れる          | T4     | 字幕つきの spec を撮り、mp4 と判定の静止画ができる。T4 の pull request のコメントで再生できる            |
| 3. 検証のシナリオがあり、corporate-site の 3 つの route を確認できる | T5     | シナリオの文と spec の対応を、エビデンスの一覧で読む。検証の pull request の動画を、運営者が見て判定する |
| 4. 2 つの context が埋まり、`status` が `stable` になっている        | T5     | 案内のコメントが残っていない。書いたコマンドを、T1、T4、T5 で実行している                                |
| 5. 3 ジャーニーが E2E にあり、CI の `e2e` の job で通る              | T2     | テスト設計の必須のケースと spec の対応を読む。CI の `e2e` の job                                         |
| 6. route と story の VRT が、Playwright を上げた後も CI で通る       | T3     | T3 の pull request の CI の `vrt-route`、`vrt-story-ui`、`vrt-story-corporate` の job                    |

- 受け入れ条件 6 の「通る」は、baseline を撮り直したときは、運営者が差分を見て撮り直した baseline で通ることとする。構成とツールチェーンの要求の、同じ論点の決定に合わせる。

## Carry Over

- ADR-0031 から ADR-0035: 「提案」の状態で `adr/` にある。運営者が承認したら、Status を替える。ADR-0031 を承認したら、ADR-0017 の Status を「ADR-0031 に置換」にする。
- `context/testing/e2e.md` と `context/testing/evidence.md`: 埋める案のとおりに、T1、T4、T5 で書く。
- `context/testing.md`、全体の Design Doc、corporate-site の Design Doc、`e2e/README.md`: 「ほかの文書の変更の案」のとおりに、タスクごとに変える。
- 3 ジャーニーのテスト設計: T2 で spec にした後は、spec のテストの名前が観点を持つ。文書としては残さない。
