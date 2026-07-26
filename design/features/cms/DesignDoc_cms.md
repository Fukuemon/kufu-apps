# Feature 設計: CMS / React アプリ候補 (apps/cms)

> 最終更新: 2026-07-26 / Status: 暫定標準候補 (Phase 2 以降, 未着手)

コーポレートサイト掲載投稿を管理する Phase 2 以降の app 候補。Phase 1 では実装せず、React app の暫定標準候補と採用判断の条件だけを置く ([ADR-0003](../../../adr/0003-phase1-corporate-site-only-and-cms-deferred.md))。実装着手時は spec / ADR で採否、バージョン、互換性、運用責務を再確認して確定する。

## メタ

| 項目           | 値                                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 関連 DesignDoc | [DesignDoc.md](../../DesignDoc.md) Open Questions / Future Work (`apps/cms` は未実装の計画。立ち上げ判断は未決事項 #4)                                      |
| 関連 context   | [architecture.md](../../../context/architecture.md), [toolchain.md](../../../context/toolchain.md), [infrastructure.md](../../../context/infrastructure.md) |
| 関連 ADR       | [ADR-0003](../../../adr/0003-phase1-corporate-site-only-and-cms-deferred.md)                                                                                |
| 関連 spec      | (未起票)                                                                                                                                                    |
| 対象モジュール | `cms`                                                                                                                                                       |

## 背景・要件解釈

- Phase 2 以降、コーポレートサイト掲載投稿を管理する CMS アプリや業務アプリが必要になる可能性がある。
- Phase 1 では実装せず、コーポレートサイトの性能・公開スコープと衝突しないようにする。
- 現時点では「候補技術と採用条件」を残し、Phase 2 spec 開始時に公式情報・互換性・運用要求を確認して確定する。

## スコープ

### やること (Phase 2 以降)

- `apps/cms` の app shell と責務、公開フロー、データモデルを設計する (Phase 2)。
- React app 暫定標準候補の採否を spec / ADR で確定する。
- 認証、権限、preview / production 公開フロー、監査要件を定義する。

### やらないこと (Phase 1)

- CMS/API、認証、管理画面の本実装。
- CMS が必要になる判断基準が固まる前の app 追加。
- Phase 1 時点で特定 React ライブラリの採用を不可逆に固定すること。

## 設計

### React app 暫定標準候補

| 領域               | 暫定候補        | 採用条件 / 再確認事項                                                                                                   |
| ------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Routing            | TanStack Router | URL で表現できる状態を route state に寄せられること。Phase 2 spec 開始時に最新版 API と SSR / deployment 前提を確認する |
| Server state       | TanStack Query  | CMS/API の cache、mutation、invalidations の要求があること。単純な静的 content 管理で不要なら導入しない                 |
| Form               | React Hook Form | 投稿編集、問い合わせ管理、認証など複数フォームが具体化した場合に採用する                                                |
| Client state       | Zustand         | URL / server state / local component state で表現できない横断状態が具体化した場合に限定する                             |
| React optimization | React Compiler  | 採用時点の公式互換性を確認する。非対応ライブラリ・実装パターンがある場合は spec / ADR で回避策を決める                  |

- 暫定候補は Phase 2 spec の入力であり、現時点の実装指示ではない。
- 追加ライブラリ (axios など) は、標準 Web API / framework 機能 / TanStack Query で足りない理由を spec に書いた場合のみ採用する。
- URL に表現できる状態は router 側へ寄せる ([architecture.md](../../../context/architecture.md))。

### データ / コンテンツモデル

- コーポレートサイトコンテンツの CMS 化タイミングと、コンテンツ更新の責務・レビュー観点は実装着手時の spec で定義する。
- URL は状態管理の一部として扱い、route state に寄せる。
- CMS が必要になる判断基準は未確定であり、[DesignDoc.md の未決事項](../../DesignDoc.md#未決事項) #4 として Phase 2 着手前に確定する。確定後はその決定 (requirements / ADR) を正本とする。

### 採用判断ゲート

`apps/cms` の実装 issue を起票する前に、以下を満たす。

| #   | 条件                                                             | 確認先                                 |
| --- | ---------------------------------------------------------------- | -------------------------------------- |
| 1   | CMS が必要な業務理由が具体化している                             | DesignDoc 未決事項 / 新規 requirements |
| 2   | 管理対象コンテンツ、更新頻度、運用者、承認フローが定義されている | requirements / spec                    |
| 3   | 認証・権限・監査・preview 公開要件が定義されている               | context/infrastructure.md / spec       |
| 4   | 暫定標準候補の最新版 API と React Compiler 互換性を確認している  | 公式 docs / ADR / spec                 |

## 主要シナリオ / フロー

アクター視点の使用シナリオを示す。Phase 2 以降・未着手のため抽象度は高く保ち、app shell やライブラリ適用、CMS/API 採否比較などの具体手順は実装着手時の spec / ADR へ委譲する。採否比較の前提は上記「React app 暫定標準候補」と [ADR-0003](../../../adr/0003-phase1-corporate-site-only-and-cms-deferred.md) を正本とする。

- 運用者は、コーポレートサイト掲載投稿を管理画面で作成・更新し、コーポレートサイトへ公開する (Phase 2 以降)。

## テスト観点

- `apps/cms` 追加時に暫定標準候補の採否理由、バージョン、互換性確認結果が spec / ADR に残っていること。
- CMS/API を導入する場合は、ADR と spec が先に作成されていること。
- 認証・権限・公開フロー・プレビュー環境のセキュリティ要件は [infrastructure.md](../../../context/infrastructure.md) を踏まえ spec で設計する。

## 上位資料からの変更点

| 対象資料  | 変更種別 | 内容                                                                                  |
| --------- | -------- | ------------------------------------------------------------------------------------- |
| DesignDoc | 継承     | `apps/cms` を Future Work の「未実装の計画」として保持 (モジュール責務表には載せない) |
| ADR       | 継承     | ADR-0003 「app 実装対象は corporate-site のみ」を前提に候補のみ記載                   |
