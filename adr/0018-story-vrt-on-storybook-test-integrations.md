# ADR-0018: story 側 VRT を Storybook 公式のテスト基盤へ載せ、baseline をリポジトリで管理する

## 状態

承認

## 決定日

2026-08-19

## 背景

[ADR-0015](0015-visual-regression-testing-policy.md) は story 側 VRT を storycap + reg-suit で構成し、baseline を S3 互換ストレージに置くと決めた。実装 (#33) の過程で、その前提が 2 つとも実測で崩れた。

- **storycap は Storybook 10 に追いついていない。** peer dependency は `^7 || ^8`、最終公開は 2024-09、内部は puppeteer-core 9 (2021)。addon を登録できず simple mode に固定されるため、**story ごとの設定 (`parameters.screenshot`) が使えない**。Storybook の内部 API (`__STORYBOOK_PREVIEW__.storyStoreValue`) に依存しており、Storybook を上げると黙って壊れる。
- **baseline の量は外部ストレージを要さない。** 81 枚で 2.94MB。既にリポジトリで Git 管理している route 側の baseline は 6 枚で 5.60MB であり、story 側の方が小さい。
- **reg-suit の baseline 解決が不安定。** `reg-keygen-git-hash-plugin` はコミットグラフのヒューリスティックで分岐点を決める。使い捨てブランチを作って消しただけで解決先が `718bdd93` から `12cdee1` へ変わり、比較が成立しないまま**全 81 枚が `new` 扱いで緑になった**。差分 0 と区別できない。
- storycap には後継 `storycap-testrun` があり、Storybook 9/10 の公式テスト基盤 (`@storybook/test-runner` / `@storybook/addon-vitest`) に載る形で維持されている。

## 決定

- **story 側の撮影を `storycap-testrun` へ移す。** Storybook ごとに載せ方を変える。
  - `packages/ui` (React Vite): `@storybook/addon-vitest` + `@storycap-testrun/browser`
  - `apps/corporate-site` (Astro): `@storybook/test-runner` + `@storycap-testrun/node`
  - Astro の Storybook framework はコミュニティ製で、addon-vitest が要求する Vite 公式 renderer に含まれないため統一できない。
- **baseline をリポジトリで Git 管理し、比較を `reg-cli` で行う。** 外部ストレージと reg-suit のキー解決を使わない。route 側と保管モデルが揃う。
- **story 側の撮影と判定を CI に一本化する。** baseline の正は CI (ubuntu-latest / amd64) で撮った画像とし、撮り直しは `workflow_dispatch` から行う。
- 許容 diff は 0 (完全一致) を初期値とする方針は ADR-0015 から変えない。

## 代替案

### 1. storycap のまま維持する

#### Pros

- 変更が不要。

#### Cons

- Storybook 10 で simple mode に固定され、story ごとの設定が使えない。回避のため撮影スクリプトに story 名を直書きする必要があり、story を改名すると無言で外れる。
- Storybook を上げると内部 API 依存で壊れる。打つ手がない。

### 2. baseline を Cloudflare R2 に置く (ADR-0015 の構成を #47 完了後に実行する)

#### Pros

- リポジトリが太らない。差分レポートを URL で共有できる。

#### Cons

- reg-suit のキー解決の不安定さは保管先を変えても残る。別途 `reg-simple-keygen-plugin` 等での対処が要る。
- story 側 VRT の CI 稼働が #47 の完了を待つ。

### 3. story 側も Playwright の `toHaveScreenshot` へ寄せて 1 系統にする

#### Pros

- 撮影が要素の bounding box に一致し、余白が出ない。撮影が最速 (81 枚で 49 秒)。

#### Cons

- Storybook の `index.json` を読んで story を列挙する独自コードを抱える。Storybook 公式の基盤から外れる。
- 高さ 0 の story (空カルーセル) が撮れない。

### 4. `reg-actions` (GitHub Actions の artifact) を使う

#### Pros

- 外部ストレージもリポジトリの肥大も避けられる。PR コメントに差分画像が出る。

#### Cons

- CI 専用でローカル比較ができない。artifact の保持期間を過ぎると baseline が消える。

## 影響

### 良い影響

- Storybook 公式のテスト基盤に載るため、Storybook の更新に追従できる。
- story ごとの設定が story ファイル側に置ける。撮影スクリプトが story 名を知らなくてよい。
- 外部ストレージと資格情報が不要になり、**story 側 VRT から #47 依存が外れる**。
- 撮影が速くなった (storycap 171 秒 → 25 秒。実測)。

### 悪い影響 / トレードオフ

- リポジトリが約 3MB 増える。story を足すたびに増え、PNG は差分圧縮が効かない。**追記 (2026-08-22)**: 撮り直すたびに旧 baseline が履歴へ残る。実測で PNG blob は 212 個 / 17.8MB (`.git` は 54MB) に達した。保管方式の再検討を #47 へ引き継ぐ (実測と論点は #47 のコメントに転記した)。
- 撮影基盤が Storybook ごとに 2 つになる。Astro が addon-vitest に対応するまで解消しない。
- `@storybook/test-runner` は Jest を持ち込む。本リポジトリの単体テストは Vitest であり、テストランナーが 2 種類になる。
- ローカルでは CI と描画が違うため差分が出る。差分の確認は CI 待ちになる。

## 実装・運用への反映

- 対象 app / package: `packages/ui`、`apps/corporate-site`、リポジトリ横断の CI 設定
- spec 更新要否: 実施済み。#33 の spec へ実測値を記録した (spec は closeout で削除。経緯は #48)
- AI 向け設定更新要否: 実施済み。`context/testing.md` / `context/toolchain.md` の VRT 節を更新した

### 撮影の安定化 (実測に基づく)

| 対処                                            | 理由                                                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 幅は固定し、高さは最小にする (1280x10)          | `fullPage` が内容の高さまで伸ばす。幅を内容に合わせると `w-full` のコンポーネントが潰れる |
| `parameters.vrt.viewport` で story 単位に上書き | `calc(100vh - ...)` で高さを決めるコンポーネントは最小の高さだと潰れる                    |
| 撮影時だけスクロールバーとキャレットを隠す      | どちらも画像の端で揺れる                                                                  |
| `reg-cli --matchingThreshold 0.02`              | 角丸のアンチエイリアスが 1 チャンネルあたり ±1 で揺れる。差分ピクセル数は 0 のまま        |

## 関連ドキュメント

- [ADR-0015](0015-visual-regression-testing-policy.md): 本 ADR が story 側の構成を supersede する。route 側の方針と許容 diff の考え方は ADR-0015 が引き続き正本
- [ADR-0016](0016-ci-local-hook-responsibility.md): CI とローカル hook の責務分担
- `context/testing.md`: テスト責務の分担
- `README.md`: 実行手順
- issue: #33 (決定経緯)
