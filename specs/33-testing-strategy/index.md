# テスト戦略と CI パイプライン整備 (play / Page Object / VRT / GitHub Actions)

## メタ情報

- Issue: `#33`
- ステータス: `In Progress`
- 作成日: 2026-08-14
- 更新日: 2026-08-14
- Branch: `feature/33`
- Owner: Fukuemon

## 設計フェーズ状況

状態は `未着手 / 進行中 / 完了 / レビュー済 / 保留` のいずれか。保留の場合は理由を備考に残す。

| #   | フェーズ                    | 状態   | 最終更新   | 備考                                               |
| --- | --------------------------- | ------ | ---------- | -------------------------------------------------- |
| 1   | 起票                        | 完了   | 2026-08-14 | #28 / #12 を統合済み。実装突合: 対象               |
| 2   | 下書き                      | 完了   | 2026-08-14 | template の必須節を充足                            |
| 3   | 上位文書突合                | 完了   | 2026-08-14 | 矛盾なし。context への追記は本 spec の計画的な更新 |
| 4   | 論点整理                    | 完了   | 2026-08-14 | D1〜D9 を起票。clarify で 1 件ずつ確定             |
| 5   | 論点解決                    | 未着手 |            |                                                    |
| 6   | Interface / Routing 設計    | 未着手 |            |                                                    |
| 7   | Content / Data 設計         | 未着手 |            |                                                    |
| 8   | Performance / Security 設計 | 未着手 |            |                                                    |
| 9   | Test / Metrics 設計         | 未着手 |            |                                                    |
| 10  | 実装分割                    | 未着手 |            |                                                    |
| 11  | レビュー済                  | 未着手 |            |                                                    |

## 上位文書整合

- PRD 更新要否: 不要 (統合モード。`design/DesignDoc.md` の Why / What と衝突しない)
- Design Doc 更新要否: 不要 (モジュール責務の `e2e` = root 管理を継承する)
- ADR 起票要否: 要 (VRT の手段選択と、CI とローカル hook の責務分担は選択肢を比較して決める判断のため)

| 上位文書                     | 節 / 該当箇所                                       | 整合方針 (継承 / 補足 / 変更提案)                                 |
| ---------------------------- | --------------------------------------------------- | ----------------------------------------------------------------- |
| PRD (統合)                   | Non Goals (CMS / 認証 / 過剰な抽象化)               | 継承。本 spec はいずれにも触れない                                |
| Design Doc                   | モジュール責務 → `e2e` は root 管理の公開前検証     | 継承                                                              |
| Design Doc                   | 成功条件 #2 (3 route と問い合わせ導線を E2E で通す) | 補足。ジャーニー網羅と VRT を上乗せする                           |
| feature doc (corporate-site) | テスト観点 / 問い合わせ導線の route intercept 方針  | 継承。E2E fixture の分岐定義をジャーニー定義の入力に使う          |
| context/testing.md           | テスト責務の分担 (Unit test / E2E の 2 種別)        | 補足。VRT の位置づけを追加する (本 spec のスコープに含む計画更新) |
| context/engineering.md       | Repository Quality Gate (pre-commit)                | 補足。CI との責務分担を追加する (同上)                            |
| context/infrastructure.md    | Cloudflare Pages preview deployment                 | 継承。preview と CI E2E の分担判断に使う                          |
| ADR-0008                     | Astro / React island ポリシー                       | 継承。play 対象を React に限る根拠                                |
| ADR-0012                     | デザイン正本 = 実装 + Storybook                     | 継承。VRT の対象セットを Storybook に置く根拠                     |

矛盾は検出していない。`context/testing.md` / `context/engineering.md` への追記は上位文書との衝突ではなく、
本 spec がスコープとして計画している更新であり、sync phase で反映する。

## 関連資料

- `design/DesignDoc.md`: モジュール責務 (`e2e`) / 成功条件 #2
- `design/features/corporate-site/DesignDoc_corporate-site.md`: テスト観点 / 問い合わせ導線の検証境界
- `context/testing.md` / `context/engineering.md` / `context/infrastructure.md`
- 要求定義: [requirements.md](requirements.md)
- 関連 issue: #33 (本体) / 統合済み #28 (VRT) / #12 (CI) / 参照 #26 (問い合わせフォーム) / #32 (styles 受け皿)

## 背景

UI を変える作業の安全網が、現状は「要素の存在と文言を見る E2E」しかない。
`components.css` を utility / cva へ colocation 移行する作業 (#32 の積み残し) は出力 CSS の形が変わるため、
#32 で使った「出力 CSS のバイト比較」が使えない。視覚崩れを検出する手段がないまま移行するのは危険であり、
**VRT の導入がその移行の前提 gate** になる。

同時に、テストを増やしても回す場所が決まっていなければ意味がない。CI は段階的に増えたが
どこまで載せるかの方針がなく、ローカル `lefthook` との分担も未整理である。
そのため本 spec はテストの中身 (play / Page Object / ジャーニー / VRT) と
実行場所 (CI / ローカル) を 1 つの設計として扱う。

影響範囲は `packages/ui` (play テスト対象) / `apps/corporate-site` (VRT 対象) / `e2e` (Page Object) /
リポジトリ横断の CI 設定である。

## スコープ

### やること

- play テストの導入方針 (対象基準と Astro 側の制約) の確定
- E2E の Page Object 構成規約と locator 規約の確定
- E2E がカバーするユーザージャーニーの定義と play との責務境界の確定
- VRT の手段選択・対象セット・許容 diff・snapshot 運用の確定と、**実行可能な状態までの実装**
- CI のジョブ構成、ローカル `lefthook` との責務分担、Turbo キャッシュ方針、required status checks の確定と `.github/workflows/` の実装
- 決定の `context/testing.md` / `context/engineering.md` / ADR への反映

### やらないこと

- play テスト / E2E ジャーニーの**テストコード実装** (方針確定後に別 issue。VRT と CI は例外で本 spec で実装する)
- `components.css` の colocation 移行そのもの (本 spec が gate を用意し、移行は差分ゼロを完了条件とする派生 issue が行う)
- 問い合わせフォーム (#26) の実装。island が増えた後の play 対象追加は #26 側で行う
- Cloudflare Pages のデプロイ設定変更
- 既存 workflow (`spec-residue` / `spec-closeout` / `storybook-pages`) の作り替え

## 要件の解釈

### 実現したいユーザー価値

- 開発者と AI エージェントが、UI を変えたときに壊れたことへ**気づける**状態になる
- テストの置き場と実行場所が決まっており、追加時に迷わない

### 成功条件

- VRT が実行でき、UI 無変更なら差分ゼロ、意図した変更なら baseline 更新手順で解消できる
- CI とローカル hook の責務が重複なく分担され、`context/` に文書化されている
- play / Page Object / ジャーニーの規約が、実装 issue がそのまま従える粒度で決まっている

### 対象ユーザー / 操作主体

- 開発者 (本人): テストを追加・保守する
- AI エージェント: 規約に従ってテストを実装する
- CI (GitHub Actions): 決められたジョブを実行する

EARS 風の振る舞いは [requirements.md](requirements.md) の受け入れ基準を正本とする。本 spec では重複させない。

## 現状の実測 (2026-08-14)

要求定義の業務ルール #1 (判断は現規模の実測に基づく) に対応する棚卸し。論点の判断材料とする。

| 対象                    | 実測値                                                           |
| ----------------------- | ---------------------------------------------------------------- |
| E2E ファイル数          | 1 (`e2e/corporate-site/smoke.spec.ts`)                           |
| E2E テスト数            | 5                                                                |
| E2E のセレクタ内訳      | `getByTestId` 24 / `getByText` 6 / `locator()` 5 / `getByRole` 3 |
| `data-testid` 定義箇所  | 20                                                               |
| stories 数              | 29 (`packages/ui` 11 / `apps/corporate-site` 17 / fixture 1)     |
| `play` 関数を持つ story | 0                                                                |
| React island            | **0** (`client:*` ディレクティブの使用箇所なし)                  |
| CI に載っているもの     | `lint` / `test`                                                  |
| CI に載っていないもの   | `typecheck` / `build` / `knip` / `depcruise` / `e2e`             |
| lefthook pre-commit     | `protected-branch` / `format` / `repo-analysis` / `lint`         |

この実測から、要求定義の決定事項に**前提のずれ**が 2 件ある。D1 / D2 で扱う。

## 実装対象

| モジュール       | 実装有無 | 主な責務                                                         |
| ---------------- | :------: | ---------------------------------------------------------------- |
| `e2e`            |    ◯     | Page Object 構成、locator 規約、ジャーニー定義。VRT の実装先候補 |
| `ui`             |    ◯     | play テストの対象。VRT の Storybook 側対象セット                 |
| `corporate-site` |    ◯     | VRT の route 対象 (3 route × 2 viewport)                         |
| `core`           |    ◯     | `.github/workflows/` と `lefthook.yml` の責務分担                |
| `config`         |    -     | 変更しない                                                       |
| `cms`            |    -     | 対象外 (未着手モジュール)                                        |

## 機能仕様

### User Flow

開発者 / CI が本 spec の成果物を使う流れ。

1. 開発者が UI を変更する
2. ローカルで `lefthook` の pre-commit gate が走る (責務は D6 で確定)
3. 開発者が VRT を実行し、baseline との差分を確認する
4. 意図した差分なら baseline を更新し、意図しない差分なら実装を直す
5. PR を作成すると CI が決定したジョブ構成を実行し、結果を PR に返す

### Reuse Policy

- Page Object と VRT のヘルパは `e2e/` 配下に colocation する。`packages/*` へ昇格させない
- play テストのユーティリティは `packages/ui` 内に置き、app からは参照させない

### Performance

- CI 実行時間の目標を D8 で決める。VRT の撮影枚数は目標時間から逆算する
- VRT のためにプロダクションコードへ待機用の実装を入れない (テスト都合で島を増やさない)

### Routing / URL State

該当なし。本 spec はテストと CI の仕組みを対象とし、アプリの routing / URL state を変更しない。

### Content / Assets

VRT の baseline は D4 の決定により **2 系統** を持つ。

| 系統                | 撮影対象                                 | 保管先                       |
| ------------------- | ---------------------------------------- | ---------------------------- |
| reg-suit + storycap | story (`packages/ui` 11 + セクション 17) | Cloudflare R2 (S3 互換)      |
| Playwright          | 3 route × 2 viewport                     | リポジトリ (Playwright 既定) |

- R2 の資格情報は secret として扱い、置き場は `context/infrastructure.md` に従う
- Playwright 側の baseline は Git 管理されるため、差分が PR レビューに乗る

### UI Reuse

該当なし。本 spec は共有 UI の構成を変更しない。play テストは既存の `packages/ui` コンポーネントを対象にする。

### Testing

- 種別ごとの責務境界は D3 で確定し、`context/testing.md` の責務分担テーブルへ反映する

## Interface 設計

### UI / API / Event Interface

アプリの UI / API は変更しない。本 spec が定義するのは**開発者と CI に対する実行インターフェース**である。

- VRT の実行コマンド (名称と引数は D4 の手段選択後に確定)
- VRT の baseline 更新コマンド
- CI の workflow トリガと job 名 (required status checks を設定する場合、job 名が契約になる)

### Props / Request / Response

該当なし。コンポーネントの props や API の request / response を変更しない。

## Content / Data 設計

### 保存・管理するデータ

| データ            | 内容                              | 置き場                                       |
| ----------------- | --------------------------------- | -------------------------------------------- |
| VRT baseline 画像 | 3 route × 2 viewport と対象 story | D4 の手段選択後に確定                        |
| VRT 差分レポート  | 実行ごとの差分画像と判定結果      | 成果物として保持しない候補も含めて D4 で確定 |

### コンテンツ配置 / package / route

- Page Object と VRT のヘルパは `e2e/` 配下に置く
- play テストは対象コンポーネントと同じ story ファイルに colocation する
- CI 設定は `.github/workflows/` に置き、ローカル gate は `lefthook.yml` に置く

## Performance / Security 設計

### Performance

- CI 実行時間の目標値を D8 で決め、VRT の撮影枚数と E2E の CI 実行可否をその目標から逆算する
- Turbo キャッシュの remote 化 (D9) は CI 実行時間に直接効くため、目標値とセットで判断する
- テスト都合でプロダクションコードに待機処理や不要な island を追加しない (`decision_priority` 1 位を損なわない)

### Security / Privacy

- VRT の baseline 画像に非公開情報を含めない。撮影対象は公開サイトの 3 route と Storybook に限る
- **Cloudflare R2 の資格情報という新しい secret が増える** (D4 の帰結)。置き場と権限の絞り方は `context/infrastructure.md` に従い、書き込み権限を VRT 用のバケットに限定する
- R2 バケットを公開設定にしない。差分レポートの閲覧経路は実装フェーズで決める
- Turbo の remote cache を採用する場合、キャッシュに含まれる成果物の公開範囲を D9 で確認する

## Error / Fallback 設計

### エラーケース

| #   | ケース                                     | ユーザー (開発者) への見せ方             | リカバリ                                       |
| --- | ------------------------------------------ | ---------------------------------------- | ---------------------------------------------- |
| 1   | VRT が意図した UI 変更で差分を出す         | 差分画像付きで失敗を報告                 | baseline 更新コマンドを実行する                |
| 2   | VRT が環境差で恒常的に差分を出す           | flake として原因を報告し CI は赤にしない | 撮影環境を固定するか対象を安定領域へ絞る       |
| 3   | 地図 iframe / 外部画像で撮影が不安定になる | flake 要因として記録                     | 該当要素をマスクして撮影する                   |
| 4   | CI の E2E が sandbox の bind 制約で落ちる  | 失敗ジョブのログに原因を出す             | D7 の判断に応じて CI から外し preview へ寄せる |

### Fallback

- VRT が安定しない場合、CI 必須から外してローカル運用に落とす (D8 の選択肢 b / c)
- CI 実行時間が目標を超える場合、対象セットを縮小するか opt-in 実行にする

## テスト / 評価方針

### テスト観点

本 spec の成果物自体をどう検証するか。

- VRT: UI 無変更で連続実行して差分ゼロになること (flake しないこと) を実測で確認する
- VRT: 意図的に 1 箇所スタイルを変えて差分が検出されることを確認する (検出力の確認)
- CI: develop 向けの PR を実際に作り、決定したジョブが実行され結果が PR に返ることを確認する
- 規約類 (play / Page Object / locator): 実装 issue がそのまま従える粒度になっているかを `spec-review` で確認する

### 計測指標

| 指標                     | 目的                           |
| ------------------------ | ------------------------------ |
| CI の総実行時間          | D8 の目標値との対比            |
| VRT の撮影枚数           | 実行時間と保守コストの見積もり |
| VRT の連続実行での差分数 | flake の有無 (目標: 0)         |
| E2E のセレクタ内訳       | locator 規約 (D5) 適用後の変化 |

## フロー / シーケンス

(diagram phase で作成する。現時点では未作成)

### Flowchart (ユーザー操作起点)

```mermaid
flowchart TD
```

### Sequence

```mermaid
sequenceDiagram
```

## 実装分割

### 実装タスク案

(論点確定後に track / prompts phase で確定する。現時点は暫定)

| Phase | 対象                     | 概要                                                 | 依存    |
| ----- | ------------------------ | ---------------------------------------------------- | ------- |
| P1    | `e2e` / `corporate-site` | VRT の導入 (手段実装・対象セット撮影・baseline 確立) | D3 / D4 |
| P2    | `core`                   | CI のジョブ構成整理と `.github/workflows/` 実装      | D6〜D9  |
| P3    | `e2e`                    | Page Object と locator 規約の骨組み                  | D2 / D5 |
| P4    | `ui` / `e2e` / `context` | 規約の `context/` 反映と ADR 起票                    | P1〜P3  |

### prompts 生成方針

- VRT (P1) と CI (P2) は対象ファイルが重ならないため並列実装できる
- 規約の文書化 (P4) は実装の実測値を使うため、P1〜P3 の後に置く

## 設計時の論点

| #   | 論点                                                                            | 決定候補                                                                                      | 決定              |
| --- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------- |
| D1  | play テストの対象が現時点で `packages/ui` のみである事実をどう扱うか            | (a) `packages/ui` 限定で確定し island は #26 で追加 / (b) island 前提の基準だけ先に決めておく | **(a) 確定**      |
| D2  | E2E 5 テストの規模で page 単位 Page Object を導入するか (要求では導入決定済み)  | (a) 決定どおり導入 / (b) locator 規約のみ先行し POM はジャーニー実装時 / (c) 粒度を下げる     | **(a) 確定**      |
| D3  | VRT を `context/testing.md` の責務分担でどの種別に位置づけるか                  | (a) E2E の一部 / (b) 独立した第 3 種別 / (c) Storybook 側の gate                              | 未決              |
| D4  | VRT の手段                                                                      | (a) Playwright `toHaveScreenshot` / (b) reg-suit + storycap / (c) 併用                        | **(c) 併用 確定** |
| D5  | locator 規約 (`getByRole` 優先か `data-testid` 優先か)。現状は testid が 24/38  | (a) `getByRole` 優先へ寄せる / (b) `data-testid` を正式規約にする / (c) 用途で使い分ける      | 未決              |
| D6  | `typecheck` / `build` / `knip` / `depcruise` をどこまで CI に載せるか (C-1)     | (a) 全部載せる / (b) pre-commit と重複させず CI のみ / (c) 現状維持                           | 未決              |
| D7  | E2E を CI で回すか (C-2)                                                        | (a) CI で回す / (b) Pages preview で手動 / (c) 主要導線のみ CI                                | 未決              |
| D8  | VRT を CI で回すか、ローカル運用に留めるか (C-3) と CI 実行時間の目標           | (a) CI / (b) ローカル / (c) PR ラベル等での opt-in                                            | 未決              |
| D9  | Turbo キャッシュを remote 化するか (C-4) と required status checks の要否 (C-5) | 現状 remote 無効。required checks は private repo のため設定状況が未確認                      | 未決              |

## 解決済みの論点

- **D1: play テストの対象は `packages/ui` に限定し、React island 向けの基準は #26 で決める。**
  - 根拠: `client:*` の使用箇所が 0 件で、corporate-site に island が存在しない。対象が無いものへ基準を先に書くと机上になり、#26 の実装時に作り直しになる
  - 対象は `packages/ui` の 11 コンポーネント (button / input / select / textarea / form-field / label / tag / badge / separator / definition-row / link-button)
  - トレードオフ / 却下した代替案: island 向け基準も今決める案は、#26 で対象が具体化してからの方が精度が出るため却下した。play の導入自体を #26 まで保留する案は、既存 11 コンポーネントの interaction が無検証のまま残るため却下した

- **D4: story は reg-suit + storycap、3 route は Playwright `toHaveScreenshot` で撮る併用構成とする。**
  - 根拠: ADR-0012 が「デザイン正本 = 実装 + Storybook」と定めており、story (`packages/ui` 11 + corporate-site セクション 17) が VRT の主対象として最も自然
  - storycap は story しか撮れず、要求の受け入れ基準にある 3 route × 2 viewport を満たせないため、route 側は既存 Playwright 基盤で補う
  - baseline の保管先は **Cloudflare R2 (S3 互換)**。既に Cloudflare を利用しており、アカウントを流用できる
  - トレードオフ: 実行系と baseline が 2 系統になり保守コストが増える。route を story 化して 1 系統に寄せる案は、ページを story 化する実装コストと二重管理が発生するため却下した
  - **未検証**: reg-suit の R2 向け publish plugin の対応状況は実装フェーズで検証する。S3 互換 API で動く前提だが確認していない

- **D2: page 単位の Page Object を、要求の決定どおり導入する。**
  - 根拠: E2E は現在 1 ファイル 5 テストだが、本 spec でジャーニー網羅へ広げる方針 (要求の決定事項 #3) が確定しており、テストが増える前に型を用意する方が移行コストが小さい
  - 規模は 3 route に対応する 3 クラス程度に収まる
  - トレードオフ / 却下した代替案: 現規模では過剰になり得る (要求の業務ルール #1) が、規約だけ先行させる案は、ジャーニー実装 issue が型のない状態で書き始めることになり、後から一括で書き換える手戻りが大きいため却下した

## 未確定事項

- D1〜D9 が未決。clarify phase で 1 件ずつ確定する
- develop の branch protection の現在の設定 (required status checks の有無) が未確認。
  private repo のため `gh api` が 403 を返す。D9 の判断前に Web UI 等で確認が必要

## 上位資料からの変更点

### PRD への影響

変更なし。本 spec は Non Goals にも Why / What にも触れない。

### Design Doc への影響

| 対象節         | 変更内容        | 理由                                |
| -------------- | --------------- | ----------------------------------- |
| モジュール責務 | 変更なし (継承) | `e2e` = root 管理の枠内に収まるため |

### feature doc への影響

変更なし。corporate-site のテスト観点は継承し、本 spec 側で詳細化する。

### context への影響

| 対象 doc / 節                                    | 変更内容                                 | 理由                                       |
| ------------------------------------------------ | ---------------------------------------- | ------------------------------------------ |
| `context/testing.md` テスト責務の分担            | VRT の種別と責務を追加 (D3 の決定を反映) | 現在 Unit test / E2E の 2 種別しかない     |
| `context/testing.md`                             | locator 規約と Page Object 規約を追加    | D2 / D5 の決定先                           |
| `context/engineering.md` Repository Quality Gate | CI とローカル hook の責務分担を追加      | D6 / D7 の決定先。現在 pre-commit のみ記述 |

### ADR の新規 / 更新

| ADR ID | 変更内容                                     | 理由                                       |
| ------ | -------------------------------------------- | ------------------------------------------ |
| 新規   | VRT の手段選択 (D4) と対象セットの決定       | 候補を比較して決める判断のため             |
| 新規   | CI とローカル hook の責務分担 (D6 / D7 / D9) | 二重実行を許すかを含む運用方針の判断のため |

## レビュー

| 日付 | 結果 (PASS / NEEDS_WORK) | 指摘要点 | 対応 |
| ---- | ------------------------ | -------- | ---- |
| —    | 未実施                   | —        | —    |

## 変更履歴

| 日付       | 変更者         | 変更内容                                                  |
| ---------- | -------------- | --------------------------------------------------------- |
| 2026-08-14 | spec-lifecycle | scaffold: index.md を作成。実測棚卸しと論点 D1〜D9 を起票 |
