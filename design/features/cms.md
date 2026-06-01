# Feature 設計: CMS / React アプリ (apps/cms)

> 最終更新: 2026-05-31 / Status: 標準のみ (Phase 2 以降, 未着手)

コーポレートサイト掲載投稿を管理する将来 app 候補。Phase 1 では実装せず、React app の標準と将来設計の前提だけを置く ([ADR-0003](../../adr/0003-phase1-corporate-site-only-and-cms-deferred.md))。実装着手時は spec / ADR で採否と詳細を確定する。

## メタ

| 項目           | 値                                                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 関連 PRD 要求  | [PRD.md](../../PRD.md) 「CMS / React アプリ要求」「フェーズ展望」                                                                                  |
| 関連 DesignDoc | [DesignDoc.md](../DesignDoc.md) モジュール責務 (`apps/cms`)                                                                                        |
| 関連 context   | [architecture.md](../../context/architecture.md), [toolchain.md](../../context/toolchain.md), [infrastructure.md](../../context/infrastructure.md) |
| 関連 ADR       | [ADR-0003](../../adr/0003-phase1-corporate-site-only-and-cms-deferred.md)                                                                          |
| 関連 spec      | (未起票)                                                                                                                                           |
| 対象モジュール | `cms`                                                                                                                                              |

## 背景・要件解釈

- 将来、コーポレートサイト掲載投稿を管理する CMS アプリや業務アプリが必要になる可能性がある。
- Phase 1 では実装せず、初期から React app 標準を固定してコーポレートサイトの性能・monorepo の一貫性と衝突しないようにする。

## スコープ

### やること (将来)

- `apps/cms` の app shell と責務、公開フロー、データモデルを設計する (Phase 2)。
- React app 標準ライブラリの適用。

### やらないこと (Phase 1)

- CMS/API、認証、管理画面の本実装。
- CMS が必要になる判断基準が固まる前の app 追加。

## 設計

### React app 標準 (実装時の前提)

- ルーティングは TanStack Router を標準とする。
- データフェッチは TanStack Query を標準とし、axios などの追加は spec で必要性を確認する。
- 状態管理は Zustand を必要箇所に限定し、URL に表現できる状態は router 側へ寄せる ([architecture.md](../../context/architecture.md))。
- フォームは React Hook Form を標準とする。
- React Compiler を使う前提で実装する。
- React Compiler 非対応のライブラリ・実装パターンを使う場合は、事前に公式情報・一次情報を確認し、必要なら `'use no memo'` を追加する。

### データ / コンテンツモデル

- コーポレートサイトコンテンツの CMS 化タイミングと、コンテンツ更新の責務・レビュー観点は実装着手時の spec で定義する。
- URL は状態管理の一部として扱い、route state に寄せる。

## 主要シナリオ / フロー

アクター視点の使用シナリオを示す。Phase 2 以降・未着手のため抽象度は高く保ち、app shell やライブラリ適用、CMS/API 採否比較などの具体手順は実装着手時の spec / ADR へ委譲する。採否比較の前提は上記「React app 標準」と [ADR-0003](../../adr/0003-phase1-corporate-site-only-and-cms-deferred.md) を正本とする。

- 運用者は、コーポレートサイト掲載投稿を管理画面で作成・更新し、コーポレートサイトへ公開する (将来)。

## テスト観点

- `apps/cms` 追加時に TanStack Router / TanStack Query / React Hook Form / Zustand / React Compiler 前提が守られること。
- CMS/API を導入する場合は、ADR と spec が先に作成されていること。
- 認証・権限・公開フロー・プレビュー環境のセキュリティ要件は [infrastructure.md](../../context/infrastructure.md) を踏まえ spec で設計する。

## 上位資料からの変更点

| 対象資料  | 変更種別 | 内容                                                              |
| --------- | -------- | ----------------------------------------------------------------- |
| PRD       | 継承     | 「CMS / React アプリ要求」を Phase 2 以降の標準として保持         |
| DesignDoc | 継承     | モジュール責務 (`apps/cms` = 将来 app) を具体化                   |
| ADR       | 継承     | ADR-0003 「Phase 1 はコーポレートサイトのみ」を前提に標準のみ記載 |
