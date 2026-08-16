---
phase: 3
seq: 1
target: e2e
issue: 33
depends_on: []
---

# Page Object と locator 規約の骨組みを作り、3 ジャーニーの定義を規約へ落とす

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- **完了条件のタスク化**: 作業開始前に「完了条件」セクションの各項目を todo として登録し、各ステップ完了時に状態を更新すること。タスク化せずに作業を開始することは禁止

### 実装アンチパターンの回避 (必守)

- スコープ厳守: spec / 本 prompt に明記された機能のみ実装する。未要求の機能追加・
  先回りの抽象化・無関係なリファクタ・暗黙の互換維持をしない。
- 既存規約への整合: 命名・エラー処理・ログ・テスト・API 連携方式は、対象コードベースの
  既存パターンに合わせる。新方式を持ち込む場合は理由を述べて確認を取る。
- 観測可能な契約の保持: UI 文言・イベント名・戻り値・エラーメッセージ・ログ形式・API を
  要求なく変更しない。変更が必要なら理由と影響を明記する。
- 推測の排除: 要件・業務ルール・API 仕様が不明なら停止して確認する。それらしいが
  誤った実装 (存在しない API 呼び出し / 非互換な引数) を避け、import と API の実在を確認する。
- fallback の最小化: `??` / `||` / 既定引数 / 多段 fallback / 暗黙のエラー握り潰しは
  「任意データ」に限定する。必須データの欠落は隠さず明示的に失敗させる。
- 過剰実装の排除: 単純な条件分岐を strategy / handler map に置換しない。
  要求も計測もない caching / memoization を入れない。
- dead code を残さない: 到達不能コード・未使用の変数 / 関数 / import / export・
  変更後に不要化した型定義を削除する。
- 判断の記録: 非自明な設計判断は理由 (or spec / ADR へのリンク) を残す。

## 作業ステップ (この順序で実行する)

### ステップ 0: ブランチ準備と着手記録

ブランチ命名と base branch は `context/project.yml` の `naming.branch` (`feature/<issue-number>`) および `workflow-git` に従う。

1. issue #33 の `status:*` が `status:implementing` でなければ付け替え、状態遷移コメントを残す
2. 最新の base branch (`develop`) を取得
3. 作業ブランチ `feature/33` を使う (既存。無ければ作成する)
4. PR テンプレートを確認し、完了条件を description に転記する
5. Draft PR を作成して push する

### ステップ 1: 3 route の Page Object を作る

1. `/` / `/products` / `/contact` に対応する 3 クラスを `e2e/` 配下に置く
2. セレクタを Page Object 内へ隠蔽する。locator 規約 (領域は `data-testid`、操作対象は `getByRole`) を **Page Object 内部にも適用する**
3. **3 クラス程度に収める。** ページ数を超える抽象化を先回りで作らない
4. `## 検証コマンド` を実行する
5. diff レビュー (`spec-review` または repo の標準レビュー手段) を回す
6. 指摘を対応してから次へ

### ステップ 2: 既存の smoke テストを Page Object 経由へ移す

1. `e2e/corporate-site/smoke.spec.ts` の 5 テストを Page Object 経由に書き換える
2. **テストの検証内容を変えない。** 移し替えだけを行い、アサーションの意味を変更しない
3. locator 規約に反する箇所 (現状 `locator()` 5 / `getByText` 6) を規約へ寄せる。寄せられない箇所は理由をコメントで残す
4. `## 検証コマンド` を実行する
5. diff レビューを回し、指摘を対応してから次へ

### ステップ 3: 3 ジャーニーの定義を規約として書く

1. D11 の 3 ジャーニー (回遊 / ナビゲーション / JS 無効時) の定義を、実装 issue がそのまま従える粒度で書く
2. play との責務境界 (route をまたぐ到達性は E2E、単一コンポーネント内で閉じる操作は play) を明記する
3. 置き場は `e2e/` 配下の規約ドキュメント。**`context/testing.md` と ADR-0017 が正本であり、そこと矛盾する記述を書かない**
4. diff レビューを回し、指摘を対応してから次へ

### ステップ最終: 最終確認

1. 全テスト / lint / typecheck がパスすることを確認
2. spec の `## 上位資料からの変更点` に必要な追記がないかを phase: track に渡す
3. E2E のセレクタ内訳 (規約適用後) を実測し、spec の計測指標へ記録する
4. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/33-testing-strategy/index.md`
- 参照する appendix:
  - `specs/33-testing-strategy/index.md` の `## 解決済みの論点` の D2 / D5 / D11
  - `specs/33-testing-strategy/index.md` の `## 機能仕様 → Reuse Policy`
- 正本: `adr/0017-ui-test-structure-policy.md` / `context/testing.md`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `e2e/corporate-site/smoke.spec.ts`
  - `playwright.config.ts`
  - `apps/corporate-site/src/pages/`
  - `apps/corporate-site/src/components/sections/`

## 前提条件

- 完了しているべき phase / 依存 prompt: なし (`P1_01` / `P1_02` / `P2` とは対象ファイルが重ならない。ただし `P1_02_e2e_route_vrt.md` が `e2e/` に新規 spec を足すため、同時編集を避けて着手する)
- 完了後に着手可能になる後続 prompt: なし (ジャーニーのテストコード実装は別 issue)
- 並列可否: `P1_01` / `P2` とは並列実行できる。`P1_02` とは `e2e/` を同時に触るため直列にする (frontmatter の `depends_on` は実依存が無いため空のままとする)
- 必要な repo 状態: `pnpm install` 済み

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 実装する範囲

- 3 route に対応する Page Object クラス
- 既存 smoke テスト 5 件の Page Object 経由への移し替え
- locator 規約の適用
- 3 ジャーニーの定義を規約として書くこと

### 実装しない範囲

- **3 ジャーニーのテストコード実装** (本 spec の「やらないこと」。方針確定後に別 issue)
- play テストの実装 (同上)
- 問い合わせフォーム送信のジャーニー (#26 の実装後に追加する)
- VRT (`P1_01` / `P1_02` が行う)
- `packages/*` への Page Object の昇格

## 設計仕様

spec からの抜粋。

**D2: page 単位の Page Object を導入する**

- 根拠: E2E は現在 1 ファイル 5 テストだが、ジャーニー網羅へ広げる方針が確定しており、テストが増える前に型を用意する方が移行コストが小さい
- **規模は 3 route に対応する 3 クラス程度に収まる**
- 規約だけ先行させる案は、ジャーニー実装 issue が型のない状態で書き始めることになるため却下した

**D5: locator は用途で使い分ける**

| 用途           | 優先する locator |
| -------------- | ---------------- |
| 領域の特定     | `data-testid`    |
| 内部の操作対象 | `getByRole`      |

- 根拠: セクションやページ領域は role では一意に決まりにくく、既に `home-section-hero` 等 **20 箇所の testid 資産**がある。ボタン・リンク・入力欄は role が最も安定する
- **Page Object 内部にも同じ規約を適用する**
- `getByRole` へ全面的に寄せる案は既存 24 箇所の書き換えが発生し、領域特定では逆に不安定になるため却下した
- `data-testid` を正式規約にする案は、アクセシビリティ属性の崩れを検出できないため却下した

**D11: E2E が担う 3 ジャーニー**

| ジャーニー     | 内容                                                                                  |
| -------------- | ------------------------------------------------------------------------------------- |
| 回遊           | `/` → `/products` → カテゴリ検索 (URL に検索条件が保持される) → `/contact` までの到達 |
| ナビゲーション | ヘッダー / フッターのリンクとモバイルナビの開閉から各 route へ到達できる              |
| JS 無効時      | JS を無効にしても 3 route の主要コンテンツが表示され、電話 / メールに到達できる       |

- **問い合わせフォーム送信は含めない。** `ContactSection.astro` に `<form>` 要素は存在せず、`<section data-testid="contact-form-slot" aria-label="問い合わせフォーム">` の中に入力欄と `type="button"` の「送信する」があり、「※ こちらはデザイン確認用のフォーム枠です」と明記されている。送信ジャーニーを通せる実体が無いため、#26 の実装後に追加する
- play との責務境界: 上記はいずれも **route をまたぐ到達性**を見る。単一コンポーネント内で閉じる操作 (入力検証の表示切り替え等) は play が担う

**Reuse Policy**

- Page Object と VRT のヘルパは `e2e/` 配下に colocation する。**`packages/*` へ昇格させない**

**現状の実測 (規約適用前)**

| 項目                 | 値                                                               |
| -------------------- | ---------------------------------------------------------------- |
| E2E ファイル         | 1 (`e2e/corporate-site/smoke.spec.ts`)                           |
| テスト数             | 5                                                                |
| locator の内訳       | `getByTestId` 24 / `getByText` 6 / `locator()` 5 / `getByRole` 3 |
| `data-testid` の定義 | 20 箇所 (`.astro` のリテラル定義)                                |

### 受け入れ基準 (EARS)

spec の `## 要件の解釈` の EARS 7 件は VRT と CI の振る舞いを対象としており、本 prompt の成果物 (Page Object / locator 規約 / ジャーニー定義) に直接対応する項目は無い。
本 prompt の受け入れは `## 完了条件` と `## テスト観点` で判定する。

## テスト観点

spec の `## テスト / 評価方針 → テスト観点` から該当分。

- 規約類 (Page Object / locator / ジャーニー定義) が、実装 issue がそのまま従える粒度になっているかを `spec-review` で確認する
- 既存 5 テストの検証内容が移し替えの前後で変わっていないことを確認する

## 検証コマンド

- `pnpm lint`
- `pnpm typecheck`
- `pnpm e2e`
- `pnpm knip && pnpm depcruise`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] 全ステップを順序通りに実行した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] 3 route に対応する Page Object が `e2e/` 配下に存在する
- [ ] 既存 5 テストが Page Object 経由になり、検証内容が変わっていない
- [ ] locator 規約が Page Object 内部にも適用されている
- [ ] 3 ジャーニーの定義が規約として書かれ、`context/testing.md` / ADR-0017 と矛盾しない
- [ ] Page Object を `packages/*` へ昇格させていない
- [ ] `## 検証コマンド` がすべてパスする
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] セレクタ内訳の実測値を spec の計測指標へ記録した
- [ ] PR を Ready に変更しレビュアーを指名した
- [ ] 未解決の仕様質問が残っていない
