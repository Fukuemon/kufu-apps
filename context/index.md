# context の目次

作業の中で参照する、このリポジトリの規約と事実。変更を取り込むまでの手順は [CONTRIBUTING.md](../CONTRIBUTING.md) にある。

- [コードベースの構造](codebase.md) — app と package の境界、app の中の層と依存の向き、island の規約、状態の置き場、共有へ移す条件、Edge API の共通の契約。コードから読み取れる構造は書かない
- [コードと文書の規約](conventions.md) — 命名、Storybook の title、デザインの制作物の置き場、共有の設定とルートのタスク、チェックの実行点、スタイリングの書き方、チェックの除外。lint で検出できる規則は書かない（draft）
- [業務の知識](domain.md) — コーポレートサイト、app、package、island、セマンティックトークンの用語と、コードの識別子との対応。状態と不変条件を持つ概念は未定（draft）
- [基盤と運用](operations.md) — 環境ごとの用途、Cloudflare に任せること、kufu-infra へ渡す取り決め、問い合わせフォームが基盤に求めるもの、公開の条件、観測点、秘密情報の置き場（draft）
- [技術スタック](tech-stack.md) — 採用しているツールの役割とバージョンの所在、先に決めておく採用の候補、ルートのコマンド、vite と Node.js のバージョンの制約、新しい app の作り始め。バージョンそのものと選んだ理由は書かない（draft）
- [テスト](testing.md) — unit test、play、E2E、VRT の責務と置き場、VRT の撮影の環境、E2E の環境変数、API の置き換え方、story と Page Object の規約、変更ごとに足すテスト（draft）

## PRD

- [Kufu Monorepo PRD](../PRD.md) — 工業製品と機械工具の取引先と見込み顧客が、Kufu の取扱領域と連絡先を短時間で確かめて連絡できるコーポレートサイトを公開する（draft）

## Design Doc

- [Kufu Monorepo Design Doc](../design/DesignDoc.md) — コーポレートサイトと共有の UI、設定、E2E の monorepo の全体像。C4 の L2、構成要素の責務と依存、設計の方針と判断の優先順位、ディレクトリの構成
- [コーポレートサイト](../apps/corporate-site/DesignDoc.md) — Astro のコーポレートサイトの設計。ページの構成と情報の置き場、section の構成、掲載する内容の一次情報、デザイントークンの参照先、ブランドの指針、E2E と VRT の対象
- [問い合わせフォーム](../design/features/contact-form/DesignDoc.md) — corporate-site の /contact の問い合わせフォームの設計。入力の項目と検証、送信の流れ、/api/contact の契約とエラーのコード、セキュリティの規則、テストの範囲（draft）
- [CMS の app の候補](../design/features/cms/DesignDoc.md) — コーポレートサイトに掲載する投稿を管理する app（apps/cms）の候補。React の app の暫定の標準の候補と、採るときの条件（draft）
