# packages/ui Storybook 導線と Pencil component 粒度整理 要求定義

## 要求フェーズ状況

| #   | フェーズ           | 状態   | 最終更新   | 備考                                  |
| --- | ------------------ | ------ | ---------- | ------------------------------------- |
| 1   | 受付               | 完了   | 2026-06-17 | issue #6 / ユーザー依頼               |
| 2   | 下書き             | 完了   | 2026-06-17 |                                       |
| 3   | スコープ/成功条件  | 完了   | 2026-06-17 |                                       |
| 4   | 業務仕様           | 完了   | 2026-06-17 | Storybook review 運用として記述       |
| 5   | バリデーション方針 | 完了   | 2026-06-17 |                                       |
| 6   | 権限要件           | 完了   | 2026-06-17 | 該当なし                              |
| 7   | 監査/非機能        | 完了   | 2026-06-17 |                                       |
| 8   | 未決事項解消       | 完了   | 2026-06-17 | 未決事項なし                          |
| 9   | 最終レビュー       | 未着手 |            | spec-review 未実施                    |
| 10  | 公開/同期          | 未着手 |            | 実装後に context / feature doc へ同期 |

## チケット情報

- 起点: チケット + ユーザー依頼
- チケットID: #6
- トラッカー: GitHub
- URL: https://github.com/Fukuemon/kufu-apps/issues/6

## 背景・目的

issue #6 は `packages/ui` の Storybook 導線を整備し、shared UI review の入口を定義する実装タスクである。現状 `packages/ui` には skeleton と `Button` があり、`design/features/corporate-site/index.pen` には基礎 component と画面 design がある。LP / products / contact の各 page では section を page 内に保持しつつ、section 内の見出し、CTA、タグ、情報行などを実装しやすい部品粒度に区切る必要がある。

Storybook は UI component と page をアプリ本体から切り離して確認でき、到達しにくい状態を story として保存できる。SmartHR Design System も SmartHR UI の component catalog を Storybook で公開している。この運用を参考に、Kufu では Pencil の component 粒度を実装時の `.astro` / React component 粒度へ寄せ、実装フェーズで AI Agent が Pencil component 単位で作業できる状態にする。

## 想定ユーザー/ステークホルダー

- 実装担当者 / AI Agent: Pencil component と実装 component の対応を見て、追加質問なしに実装へ入る。
- デザインシステム保守者: `packages/ui` へ昇格すべき shared UI と、corporate-site 内に閉じる UI を切り分ける。
- レビュー担当者: Storybook で shared UI の見た目・状態・利用例を確認する。

## 提供価値(成功条件)

- WHEN 開発者が `packages/ui` を確認するとき、システムは Storybook の起動導線を提供する。
- WHEN shared UI を追加・変更するとき、システムは Storybook story で主要 variant / state を確認できる。
- WHEN corporate-site を実装するとき、Pencil 上の section / subcomponent 名は実装 component 名と対応し、page 内の section 単位で作業できる。
- IF UI が corporate-site 内でしか使われない場合、実装者は `apps/corporate-site` に colocation し、`packages/ui` へ昇格しない。
- IF UI が複数 app / feature で再利用される場合、実装者は `packages/ui` へ昇格し、Storybook story を追加する。

## スコープ

### やること

- `packages/ui` に Storybook の起動・build・必要なら preview 導線を追加する。
- root / workspace から Storybook に辿れる script contract を必要最小限で追加する。
- shared UI review の運用ルールを `context/` または `packages/ui` README に文書化する。
- `design/features/corporate-site/index.pen` の各 page section 内を実装 component 粒度へ細分化する。
- Pencil の `Components` フレームは `GenericComponents` と `CorporateSiteComponents` に分ける。
- `GenericComponents` には shadcn/ui に写像しやすい `Button`, `LinkButton`, `Tag`, `SectionHeading`, `Card`, `Separator`, `FormField`, `Input`, `Select`, `Textarea`, `DefinitionRow` などの汎用パーツを置く。
- `CorporateSiteComponents` には `ServicePillar`, `BusinessFeatureRowMediaRight`, `BusinessFeatureRowMediaLeft`, `ContactInfoRow` など、この page / feature 内で再利用する固有 component を置く。
- page 固有 section (`Hero`, `BusinessSection`, `ProductsCategorySection`, `ContactSection` など) は page 内に保持する。
- Storybook の catalog 粒度は SmartHR UI を参考に、基礎 component、layout/section component、page-level sample を分けて扱う。

### やらないこと

- corporate-site 本体の実装。
- CMS など Phase 2 以降の consumer を前提にした過剰な `packages/ui` 拡張。
- `.pen` を `packages/ui` の生きた component 正本にすること。`.pen` はデザイン意図であり、実装正本は `packages/ui` と Storybook。

## 業務ルール

| #   | ルール                                                                                       | 理由                                                 | 備考                                                     |
| --- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| 1   | Storybook story は `packages/ui` に公開される shared component に必須とする                  | shared UI review の入口を一意にする                  | Button など基礎 component から開始                       |
| 2   | corporate-site 内に閉じる section component は `apps/corporate-site` に colocation する      | context/architecture.md の複数 consumer ルールに従う | Storybook へは昇格前に載せない                           |
| 3   | Pencil の section / subcomponent 名は実装 component 名へ写像できる PascalCase 相当にする     | 実装 prompt / import 名の揺れを減らす                | 例: `Hero`, `BusinessSection`, `ProductsCategorySection` |
| 4   | Pencil の `GenericComponents` には shadcn/ui に写像できる汎用パーツを置く                    | `packages/ui` / Storybook の単位と揃える             | 例: Button, FormField, Input, Card                       |
| 5   | Pencil の `CorporateSiteComponents` には corporate-site 内で再利用する固有パーツを置く       | page 固有 section の文脈を失わず重複も避ける         | 例: ServicePillar, BusinessFeatureRow                    |
| 6   | Storybook は component の通常状態だけでなく、必要な variant / edge state を story として残す | レビューと回帰確認を再現可能にする                   | form error などは実装時に追加                            |
| 7   | `.pen` の component はデザイン意図、Storybook は生きた実装 catalog として扱う                | 二重正本を避ける                                     | context/design-workflow.md §8 と整合                     |

## 入出力要件

### 入力

| #   | 項目                                       | 必須/任意 | 形式         | 制約/備考                                |
| --- | ------------------------------------------ | --------- | ------------ | ---------------------------------------- |
| 1   | issue #6                                   | 必須      | GitHub issue | Storybook 導線と review 運用の起点       |
| 2   | `design/features/corporate-site/index.pen` | 必須      | Pencil JSON  | component 粒度整理の対象                 |
| 3   | `context/design-workflow.md`               | 必須      | Markdown     | `.pen` と Storybook の正本境界           |
| 4   | `context/architecture.md`                  | 必須      | Markdown     | colocation / shared UI 昇格条件          |
| 5   | SmartHR Design System / Storybook          | 任意      | 参考資料     | catalog 構成の参考。仕様の正本にはしない |

### 出力

| #   | 出力                         | 条件                    | 備考                                                 |
| --- | ---------------------------- | ----------------------- | ---------------------------------------------------- |
| 1   | Storybook scripts            | 実装時                  | `packages/ui` 起点、必要なら root から委譲           |
| 2   | shared UI review doc         | 実装時                  | story 追加基準 / レビュー観点                        |
| 3   | 細分化済み `index.pen`       | 本要求の初期整理        | page 内 section は保持し、section 内を実装粒度に整理 |
| 4   | component catalog 初期 story | shared component 追加時 | Button から開始                                      |

## 例外シナリオ

| #   | シナリオ                                                          | ユーザーへの見せ方                  | 代替手段                                       |
| --- | ----------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------- |
| 1   | Storybook build が monorepo / Vite 設定で失敗する                 | エラーと必要設定を明示する          | 起動導線だけ先に入れ、build は未実施理由を残す |
| 2   | corporate-site 専用 component を `packages/ui` に入れるべきか迷う | 複数 consumer の有無で判定する      | 専用なら app colocation、再利用確定後に昇格    |
| 3   | Pencil component と実装 component が 1:1 にならない               | 対応表を requirements / spec に残す | 実装時に統合・分割理由を記録する               |

## バリデーション方針（業務観点）

| #   | 対象                      | ルール                                                                           | エラー時の扱い                                    |
| --- | ------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------- |
| 1   | Storybook scripts         | `pnpm --filter @kufu/ui` で起動できる                                            | script contract を修正                            |
| 2   | Storybook stories         | shared component に default /主要 variant /必要 state がある                     | story を追加してから完了                          |
| 3   | `.pen` component 粒度     | page 内 section が保持され、section 内の subcomponent が実装粒度で区切られている | section 内の命名・階層を整理                      |
| 4   | `GenericComponents`       | shadcn/ui に写像できる汎用パーツだけが定義されている                             | 汎用でないものは `CorporateSiteComponents` へ移す |
| 5   | `CorporateSiteComponents` | corporate-site 内で再利用する固有 component だけが定義されている                 | page 固有 section は page 側へ戻す                |
| 6   | shared UI 昇格            | 複数 consumer が明確である                                                       | app colocation へ戻す                             |

## 権限要件

- 該当なし。開発者向け Storybook / デザイン成果物整理であり、アプリ利用者の権限制御は扱わない。

## 監査/非機能要件

### 監査・運用

- shared UI の Storybook story は review 対象とし、追加・削除の理由が PR 上で追跡できること。
- `.pen` の component 粒度変更は、実装 component 名と対応するよう commit diff で確認できること。

### 非機能(性能/可用性/セキュリティ/保守)

- 性能: corporate-site 実装では Astro 静的生成と最小 island 方針を維持する。
- 保守: `packages/ui` は shared UI のみを持ち、corporate-site 専用 section を安易に公開 API にしない。
- 開発体験: Storybook は shared UI の孤立確認、状態確認、レビュー導線として使えること。

## 未決事項（論点）

| #   | 論点 | 決定者 | 期限 | 状態 | メモ                                                                   |
| --- | ---- | ------ | ---- | ---- | ---------------------------------------------------------------------- |
| -   | なし | -      | -    | 決定 | issue #6 の範囲では Storybook 導線 + review 運用 + Pencil 粒度整理まで |

## 設計着手条件チェック

- [x] 業務ルールが確定している
- [x] 入出力要件が確定している
- [x] 例外シナリオが確定している
- [x] バリデーション方針が確定している
- [x] 権限要件が確定している（該当なし）
- [x] 監査/非機能要件が確定している
- [x] 未決事項がゼロ、または担当者・期限付きで管理されている

## 既存資料からの変更点

| 対象                                          | 変更内容                                                                                                              | 理由                                                                     |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `design/features/corporate-site/index.pen`    | page 内 section を保持し、section 内の階層を実装 component 粒度として扱う。汎用パーツのみ `Components` フレームに置く | 実装フェーズで page 文脈を保ったまま Pencil component 単位に作業するため |
| `context/design-workflow.md`                  | 既存方針と整合。生きた component 正本は `packages/ui` + Storybook                                                     | 二重正本を避けるため                                                     |
| `context/testing.md` / `context/toolchain.md` | 既存方針と整合。Storybook は `packages/ui` の UI catalog                                                              | issue #6 の実装で script / 運用を具体化するため                          |

## 変更履歴

| 日付       | 変更者 | 変更内容                                                  |
| ---------- | ------ | --------------------------------------------------------- |
| 2026-06-17 | Codex  | 初版（issue #6 と Pencil component 粒度整理の要求を統合） |

## 備考

### 参考にした外部資料

- SmartHR Design System: SmartHR UI は GitHub / Storybook / Figma Community をリソースとして公開している。
- Storybook: component と page を isolation して実装でき、到達しにくい状態を story として保存できる。

### 非対象（開発設計で扱う）

- Storybook の具体設定ファイル構成
- Vite / Storybook addon の選定
- Visual regression service の採否
