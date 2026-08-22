# テスト戦略と CI パイプライン整備 (play / Page Object / VRT / GitHub Actions) 要求定義

## チケット情報

- 起点: 自由文 (ユーザーヒアリング 2026-07-25)
- チケットID: #33
- トラッカー: GitHub (Fukuemon/kufu-apps)
- URL: https://github.com/Fukuemon/kufu-apps/issues/33
- 統合した issue:
  - #28 (research: visual regression testing を検討する) を 2026-08-13 に統合。
    VRT を独立した検討 issue として持つと、play / E2E との責務境界を二重に決めることになるため
  - #12 (research: CI (GitHub Actions) パイプライン方針を設計する) を 2026-08-14 に統合。
    VRT と E2E を CI に乗せるかの判断が #12 の論点と同一で、分けると二重に決めることになるため

## 背景・目的

UI の自動テスト体制に次の課題感がある:

1. **interaction テストの不在**: Storybook stories に `play` 関数が現状 1 つもなく、UI の見た目確認に留まっている。play による interaction テストを充実させたい。
2. **Page Object Pattern (POM) の要否**: root 管理の Playwright E2E (`e2e/corporate-site`) はセレクタや操作手順がテストに直書きされる素朴な構成であり、ページ数・テスト数が増えたときの保守性を今のうちに判断したい。
3. **責務境界の不在**: interaction テストを Storybook play と E2E のどちらに寄せるか、E2E がカバーすべき範囲 (スモーク / クリティカルパス) の基準がない。
4. **視覚回帰の検出手段の不在 (2026-08-08 追加)**: 既存 E2E は smoke (要素の存在・文言) 中心で、opacity / カスケード起因の視覚崩れを検出できない。#32 の styles 再編では出力 CSS のバイト比較と目視で代替したが、`components.css` 受け皿の colocation 移行 (utility / cva 化) は出力 CSS の形が必ず変わるためバイト比較が使えず、**VRT (visual regression testing) の導入がその移行の前提 gate** になる。
5. **CI の責務分担が未確定 (2026-08-14 追加、#12 統合)**: リモート検証は段階的に増えたが、どこまでを CI に載せるかの方針が決まっていない。テストを増やす本 issue では、増やしたテストをどこで回すかまで決めないと片手落ちになる。

### CI の現状 (2026-08-14 実測。#12 の背景「`.github/workflows` 未整備」は既に古い)

| workflow              | 実行内容                                  | トリガ                                   |
| --------------------- | ----------------------------------------- | ---------------------------------------- |
| `lint.yml`            | `pnpm lint` + `pnpm test`                 | PR / default branch への push / 手動     |
| `spec-residue.yml`    | closed issue の spec 残存検査             | push / 毎週月曜 00:00 UTC の cron / 手動 |
| `spec-closeout.yml`   | issue close 時に spec 削除 PR を自動起票  | issue close                              |
| `storybook-pages.yml` | Storybook の公開と PR プレビュー / 後始末 | push / PR / 手動                         |

CI に**載っていない**もの: `typecheck` / `build` / `knip` / `depcruise` / `e2e`。
Turbo は remote caching 無効。required status checks の設定状況は private repo のため API から確認できていない (未確認)。

## 想定ユーザー/ステークホルダー

| 区分            | 対象                 | 関心事                                                                            |
| --------------- | -------------------- | --------------------------------------------------------------------------------- |
| 開発者 (本人)   | テスト保守者         | UI 変更時のテスト修正コストを最小にし、壊れたら意味のある失敗をするテストにしたい |
| AI エージェント | テスト実装の実行主体 | 対象基準・セレクタ規約・抽象化方針が決まっているほど壊れないテストを書ける        |

## 提供価値(成功条件)

- play テストの導入方針 (対象コンポーネントの基準) と、E2E との責務境界が明文化される
- 現在の E2E 規模・成長見込みに対して POM を導入するか (するなら粒度)、しないなら代替の保守戦略 (locator 規約等) が明文化される
- VRT が実際に動き、UI を変える作業 (`components.css` の colocation 移行、コンテンツ改修) の前後で意図しない視覚崩れを検出できる
- 増やしたテスト (play / E2E ジャーニー / VRT) をどこで回すかが決まり、CI とローカル `lefthook` の責務が重複なく分担される

## スコープ

### やること (方針の詳細化・正本反映と、VRT / CI の実装まで)

- play テスト導入の詳細設計 (packages/ui + corporate-site の React island を対象とした網羅基準、Astro 静的コンポーネントを対象外とする制約の明文化)
- 現 E2E の棚卸し (テスト数 / セレクタの重複度) と、page 単位 Page Object の構成規約の設計 (配置場所 / 命名 / fixture との関係)
- locator 規約の決定 (`getByRole` 優先・`data-testid` 方針等。Page Object 内部にも適用)
- E2E がカバーするユーザージャーニーの定義 (回遊・ナビゲーション・問い合わせフォーム・JS 無効時) と play との責務境界の明文化
- VRT の導入設計 (2026-08-08 追加): 手段の比較決定 (候補: reg-suit + storycap — story 単位。#32 で整備した variant / edge story がそのまま対象セットになる / Playwright `toHaveScreenshot` — route × viewport 単位で既存 E2E 基盤に乗る / 両者の併用)、差分レポートの置き場、CI 連携、許容 diff 閾値
- **VRT の実装まで行い、実行可能な状態にする** (#28 統合により追加)
  - 対象セットの確定: 3 route (`/` / `/products` / `/contact`) の page screenshot、Storybook の presentation component、desktop / mobile の 2 viewport
  - snapshot の更新運用 (更新コマンド、baseline の置き場、レビュー時の差分の見せ方) の確立
  - flake 要因 (フォント読み込み、画像、アニメーション、iframe 埋め込み地図) の洗い出しと抑止
  - CI 実行時間の実測と、CI に乗せるかローカル運用に留めるかの判断
- CI パイプラインの整備 (#12 統合により追加)
  - ジョブ構成の決定: `typecheck` / `build` / `knip` / `depcruise` / `e2e` / VRT をどこまで CI に載せるか
  - ローカル `lefthook` hook と CI の責務分担 (二重実行の整理)
  - Turbo キャッシュ方針 (remote / local) と CI 実行時間の目標
  - E2E を CI で回すかの判断 (sandbox の `127.0.0.1:4321` bind 制約、Cloudflare Pages preview deployment との連携)
  - develop の branch protection に required status checks を設定するかの判断
  - 上記に沿った `.github/workflows/` の実装と、develop 向け PR での動作確認
- 決定の context / ADR への反映 (`context/testing.md` に VRT 節、CI とローカル hook の責務分担を追加する)

### やらないこと

- play テスト・E2E テストコードの実装 (方針決定後に別 issue)。**VRT は例外で本 issue で実装する**
- Storybook のカタログ構成・コンポーネント設計の方針決定 (draft-component-architecture 側)
- `components.css` の colocation 移行そのもの (本 issue で VRT を gate として整えたうえで、派生 issue が差分ゼロを完了条件に行う)
- Cloudflare Pages のデプロイ設定そのものの変更 (`context/infrastructure.md` の範囲)
- 既存 workflow (`spec-residue` / `spec-closeout` / `storybook-pages`) の作り替え。ジョブ構成の整理で触れる場合を除く

## 業務ルール

| #   | ルール                                                                       | 理由                                | 備考                                           |
| --- | ---------------------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------- |
| 1   | 判断は現規模の実測 (テスト数・重複) に基づき、一般論だけで決めない           | 小規模で POM は過剰になり得る       | 棚卸し結果を検討結果に添付                     |
| 2   | decision_priority 1 位 (パフォーマンス / 最小 island) を損なう方針を採らない | テスト都合で不要な React 化をしない | play 対象は React (packages/ui) 中心になる想定 |

## 受け入れ基準 (EARS 風)

- WHEN 本 issue が完了したとき、システム (文書群) は play テストの導入方針 (packages/ui + corporate-site island を対象とする基準と Astro 側の制約整理) を保持している。
- WHEN 本 issue が完了したとき、システムは page 単位 Page Object の構成規約と根拠 (現規模の棚卸し結果) を ADR または context に保持している。
- WHEN 本 issue が完了したとき、システムは locator / セレクタ規約と、E2E が担うユーザージャーニーの定義 (play との責務境界を含む) を保持している。
- WHEN 本 issue が完了したとき、システムは VRT の手段・対象セット・許容 diff・CI 連携の決定を保持し、VRT が実行可能な状態になっている。
- WHEN 開発者が VRT の実行コマンドを叩いたとき、システムは 3 route × 2 viewport と対象 story のスクリーンショットを撮影し、baseline との差分を判定する。
- WHERE story 側 VRT の永続ストレージ (Cloudflare R2) への結線と CI 稼働は #47 の完了後に行う。本 issue ではローカルの S3 互換ストレージ (Docker) に対して差分判定が成立することの検証までを完了条件とする。
- WHILE UI に変更がない間、システムは VRT を連続実行しても差分ゼロを返す (flake しない)。
- WHEN 意図した UI 変更で差分が出たとき、システムは baseline を更新する手順を文書として提供する。
- WHEN 本 issue が完了したとき、システムは CI とローカル `lefthook` の責務分担を `context/` に保持している。
- WHEN develop 向けの PR を作成したとき、システムは決定したジョブ構成を CI で実行し、結果を PR 上に返す。
- IF 検討中に E2E の欠落 (クリティカルパス未カバー) を発見した場合、THEN 本 issue で実装せず派生 issue として起票する。

## 例外シナリオ

| #   | シナリオ                                                             | 見せ方                            | 代替手段                                                                     |
| --- | -------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| 1   | play テストが Astro コンポーネント (非 React) に適用しにくい         | 検討結果に制約として明記          | 対象を packages/ui (React) に限定し、Astro 側は E2E でカバー                 |
| 2   | コンポーネント設計 (別 draft) が未確定で play 対象基準を決めきれない | 未決事項に依存関係を明記          | locator 規約と POM 是非のみ先行確定する                                      |
| 3   | VRT が環境差 (フォント / レンダリング) で恒常的に差分を出す          | CI を失敗させ差分画像で原因を示す | 原因要素をマスクし撮影環境を固定する。閾値緩和と非ブロッキング化は後段の手段 |
| 4   | 地図 iframe / 外部画像で撮影が不安定になる                           | flake 要因として記録              | 該当要素をマスクして撮影する                                                 |

## 決定事項(解決済み論点)

要求レベル (何を / なぜ) の論点は解決済みで、要求レベルの未決事項はゼロ。
How の判断は「設計フェーズで確定する論点」(C-1〜C-5) として clarify phase で確定する。

| #   | 論点                  | 決定                                                                                                                                                                                                                                                                                                        |
| --- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | play テストの対象範囲 | **packages/ui + corporate-site の React island** (問い合わせフォーム等)。Astro 静的コンポーネントは E2E でカバー                                                                                                                                                                                            |
| 2   | POM 導入是非          | **導入する (page 単位)**。セレクタと操作を Page Object に集約し、テスト本体はシナリオのみを書く                                                                                                                                                                                                             |
| 3   | E2E のカバー範囲      | **ユーザージャーニー網羅** (回遊・ナビ・フォーム・JS 無効時)。play は補助と位置づける                                                                                                                                                                                                                       |
| 4   | VRT の導入            | **導入する** (2026-08-08, ユーザー)。#32 の styles 受け皿 (`components.css`) を utility / cva へ colocation 移行する際の前提 gate とし、移行はスナップショット差分ゼロを完了条件にする派生 issue で行う。手段 (reg-suit + storycap / Playwright `toHaveScreenshot` / 併用) は設計フェーズで比較して決定する |
| 5   | CI の整備             | **本 issue で行う** (2026-08-14, ユーザー)。#12 を統合し、増やしたテストをどこで回すかまで本 issue で決めて実装する                                                                                                                                                                                         |

## 設計フェーズで確定する論点 (#12 統合により持ち込み)

要求レベルでは「CI を整備する」ことが決定済みで、以下は **How の判断** として clarify phase で 1 件ずつ確定する。

| #   | 論点                                                                  | 備考                                                              |
| --- | --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| C-1 | `typecheck` / `build` / `knip` / `depcruise` をどこまで CI に載せるか | `lefthook` の pre-commit と重複する。二重実行を許すかの判断も含む |
| C-2 | E2E を CI で回すか                                                    | sandbox の bind 制約と実行時間。Cloudflare Pages preview との分担 |
| C-3 | VRT を CI で回すか、ローカル運用に留めるか                            | 手段選択 (Playwright / reg-suit) と連動する                       |
| C-4 | Turbo キャッシュを remote 化するか                                    | 現状 remote caching 無効。CI 実行時間の目標値とセット             |
| C-5 | develop の branch protection に required status checks を設定するか   | private repo のため現状設定は未確認。確認から始める               |

## 関連 Design Doc 節

- `design/DesignDoc.md` ## モジュール責務 (e2e は root 管理)
- `context/engineering.md` (lefthook による品質ゲート)
- `context/infrastructure.md` (Cloudflare Pages preview deployment)
- `context/project.yml` commands.e2e / commands.storybook / domains.e2e
- `adr/0008-astro-react-island-policy.md`

## 権限要件 / バリデーション方針 / 監査・非機能

- 対象外 (テスト戦略の検討 issue のため)

## 変更履歴

| 日付       | 変更者           | 変更内容                                                                                                                                                                     |
| ---------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-15 | spec-lifecycle   | 例外シナリオ #3 を改訂。VRT の差分は CI を失敗させる (spec の D12 で確定)                                                                                                    |
| 2026-08-15 | user 指示        | VRT の story 側をローカル S3 互換ストレージでの仕組み検証までに絞り、R2 結線と CI 稼働を #47 後へ分離                                                                        |
| 2026-08-14 | user 指示        | #12 (CI パイプライン方針) を本 issue へ統合。CI のジョブ構成・lefthook との分担・Turbo cache・required checks を論点 C-1〜C-5 として持ち込み、現状 4 workflow を実測して記録 |
| 2026-08-13 | user 指示        | #28 (VRT 検討) を本 issue へ統合。VRT を検討だけでなく**実装まで**スコープに入れ、対象セット・snapshot 運用・flake 抑止を追加                                                |
| 2026-08-08 | user 指示        | VRT の導入を決定事項 #4 として追加。#32 の受け皿 colocation 移行の前提 gate と位置づけ、手段比較・CI 連携をスコープへ追加                                                    |
| 2026-07-25 | spec-requirement | draft-e2e-pom を改稿し、play テスト論点を draft-component-style-design から移管して統合                                                                                      |
| 2026-07-25 | spec-requirement | 要求論点 3 件をユーザー対話で解決し決定事項に反映                                                                                                                            |
