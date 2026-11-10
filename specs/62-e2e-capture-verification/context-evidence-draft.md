# context/testing/evidence.md を埋める案

`context/testing/evidence.md` の本文の案。[index.md](index.md) の論点が推奨のとおりに決まったときの中身である。  
撮影の仕組みを入れるタスクが、1 本撮って pull request に載せるところまで動かしてから書く。コマンドの細部は、動かした結果で直す。

## Evidence Scope

- 画面の振る舞いか見た目を変える pull request には、録画のエビデンスを付ける。
- 文書、スキル、設定だけの pull request には付けない。
  - 画面が変わりうる依存の更新（Astro、Tailwind CSS、フォント）には付ける。
- 見た目だけの変更で、VRT の差分の画像で確認できるものは、録画を省いてよい。
- 不具合の再現と改修前の動きは、issue に付けてよい。

## Storage and Visibility

- エビデンスの動画と静止画は、リポジトリにコミットしない。
- 上げる前の元のファイルと下書きは、`.ai-out/evidence/` に置く。`context/project.yml` の `verification.evidence_dir` は、デフォルトのままにする。
  - pull request の動作確認の下書きは、`.ai-out/evidence/prs/<pull request の番号>/` に置く。
  - pull request の本文に並べ終えたら消す。push の後に撮り直すまでは残す。
- このリポジトリは public である。pull request に上げたファイルは、誰でも開ける。
  - 写すのは、公開のサイトと同じ内容と、ダミーの値だけにする。
  - 問い合わせフォームができた後は、実在の人の名前、メールアドレス、電話番号を入力しない。
  - トークンと、公開の前の環境の URL を、画面と字幕に写さない。

## Capture Tools

- エビデンスは、Playwright の spec で、録画と字幕で撮る。仕組みは、スキル playwright-capture にある。
  - 撮影の設定: `e2e/playwright.capture.config.ts`
  - 字幕の関数（`intro`、`step`、`check`）: `e2e/tests/fixtures/caption.ts`
- 撮るコマンドは、`e2e/` で流す。出力は `e2e/evidence/` にでき、Git で追跡しない。

  ```sh
  pnpm exec playwright test -c playwright.capture.config.ts --project=e2e <spec> --workers=1
  node ../.claude/skills/playwright-capture/scripts/collect.mjs evidence/.playwright/改修後.json
  ```

- 録画を mp4 にまとめるには、ffmpeg が要る。
- viewport は、デスクトップが 1280x800、モバイルが 390x900 である。route の VRT と同じ幅にする。
- 回帰の spec（`e2e/tests/specs/`）は、字幕を持たない。録画が要るときは、書き換えずに撮影の設定で流す。
- 検証のシナリオの spec の見本は、最初の検証のタスクで書いた spec にする。それまでは、スキル write-verification-spec の見本を写す。
- pull request の動作確認の spec は、下書きのディレクトリの `specs/` に置き、コミットしない。
  - 撮影の設定のテストのディレクトリを、下書きのディレクトリに向けて流す。流し方は、撮影の仕組みを入れるタスクで動かして決める。
  - spec は、`e2e/tests/fixtures/caption.ts` と `e2e/tests/selectors/` を import する。
- 通信を差し替える関数は、まだない。

## Capture Environment

- 撮るときは、corporate-site を `build` して `preview` で配信する。Playwright が `e2e:serve` の script で起動するので、先に起動しなくてよい。URL は `http://127.0.0.1:4321` である。
- 改修前と比べるときは、改修前のブランチの worktree で `build` し、成果物を別の port で配信する。その URL を `BASE_URL` で渡す。

  ```sh
  VARIANT=改修前 BASE_URL=http://127.0.0.1:<port> pnpm exec playwright test -c playwright.capture.config.ts --grep @compare --workers=1
  ```

- `BASE_URL` を渡したときは、Playwright は app を起動しない。
- 検証環境はない。配信の基盤が決まった後に、公開の前の環境で撮るかを決める。

## Login and Test Data

- ログインとテストデータは持たない。

## Attachment

- 動画と静止画は、gh の `--attach` で pull request のコメントに上げる。
  - `--attach` があるかは、`gh pr comment --help` で確認する。
  - gh の振る舞いのうちリポジトリによらないものは、スキル capture-pull-request の `references/attach-with-gh.md` にある。
- 上げるには、gh でログインしたアカウントが、pull request にコメントを書け、本文を編集できる権限を持つ。
- 載せる順は、次のとおり。
  1. 観点のまとまりごとに、コメントの下書きを、下書きのディレクトリに書く。動画と静止画は、`![<名前>](./<パス>)` の形で参照する。
  2. 運営者が下書きを確認してから、リポジトリのルートで投稿する。

     ```sh
     gh pr comment <番号> -F <下書き> --attach <動画> --attach <静止画>
     ```

  3. `gh pr comment` が出したコメントの URL と、末尾の ID を控える。
  4. 上げた動画の URL を `<video>` の `src` に書いた本文で、同じコメントを書き換える。

     ```sh
     gh api -X PATCH repos/Fukuemon/kufu-apps/issues/comments/<ID> -F body=@<直した本文>
     ```

  5. 運営者が、投稿したコメントを pull request の画面で確認する。
  6. 今の本文を `gh pr view <番号> --json body -q .body` で取り、「検証とエビデンス」の表の「エビデンス」の列に、コメントの動画の URL を並べる。`gh pr edit <番号> -F <本文>` で書き戻す。`--attach` は渡さない。

- 動画は、表のセルに `<details>` と `<video>` のタグで書く。形は、pull request のテンプレートにある。
- 上げた数は、次で数える。上げたファイルの数と合うことを確認する。

  ```sh
  gh api repos/Fukuemon/kufu-apps/issues/comments/<ID> --jq .body | grep -o 'github.com/user-attachments/assets/' | wc -l
  ```

- ファイルの大きさの上限は、GitHub の文書の [Attaching files](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/attaching-files) で確認する。超えるときは、観点を分けて短く撮り直す。
- 撮り直したときは、撮り直した観点と理由を書いたコメントを足す。本文の書き換えは、レビューする人に通知されないためである。

## Verification Scenarios

- 検証の設計とシナリオのファイルは、`docs/verification/<要求の issue>-<主題>/` に置く。
  - `test-design.md`: 検証の設計
  - `scenarios.md`: 検証のシナリオ。前提、もし、ならばの文で書き、シナリオごとに識別子を付ける
  - `README.md`: エビデンスの一覧。シナリオと spec の対応、spec を置かないシナリオ、撮影のための操作
- spec の置き場の根は `e2e/tests/verification/` で、spec は `<要求の issue>/<アクター>-<観点>.e2e.ts` に置く。
  - アクターは、サイトを訪れる人（`visitor`）の 1 つである。
- エビデンスの格納先は、検証の pull request である。シナリオごとの動画と判定の静止画を、Attachment の手順で載せる。
  - フォルダとファイルの名前は、撮影のスクリプトが付けた名前（`S<番号>_<シナリオ名>`）のまま使う。
- 実施の結果は、検証の pull request の本文に記録する。担当者、実施日、OK か NG かを書くのは、人が行う。
- 撮る URL は `BASE_URL`、撮ったバージョンの名前は `VARIANT` で渡す。
- 改修前と違ってよい差は、`scenarios.md` のシナリオの備考に書く。
- シナリオを直すときは、検証の pull request のブランチで直し、本文に転記した文も同じ文に直す。
