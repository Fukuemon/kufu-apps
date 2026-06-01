# Specs

`specs/` は issue / 機能単位で要求、仕様、設計、テスト観点を一時的に整理する作業領域である。上位方針の正本は `PRD.md` と `design/DesignDoc.md` に残し、恒久的な意思決定は `adr/` に昇格する。

## 命名規約

- ディレクトリ名: `specs/<issue-number>-<short-slug>/`
- 例:
  - `specs/1-corporate-site-foundation/`
  - `specs/2-design-system-foundation/`
- `short-slug` は英小文字、数字、ハイフンを使う。
- issue 未採番の一時ドラフトだけ `specs/draft-<yyyymmdd>-<short-slug>/` を許容する。
- 一時ドラフトは issue 採番後に正式なディレクトリ名へ寄せる。

## 配置ルール

- 1 issue につき 1 ディレクトリを基本とする。
- 各 spec の入口は `index.md` とする。
- 実装タスクへ分割する場合は `prompts/` を同ディレクトリ配下に置く。
- 追加資料が必要な場合だけ図や補助文書を同ディレクトリ配下へ置く。

## 必須確認

新しい spec を作る時は、少なくとも次を確認する。

- PRD 更新要否
- Design Docs 更新要否
- ADR 起票要否
- コーポレートサイト performance への影響
- UI 共通化要否
  - 第一原則は feature / colocation になっているか
  - app / feature 内で閉じる UI を無理に `packages/ui` へ寄せていないか
  - 複数 feature / app をまたぐ再利用が明確なものだけを共通化しているか
- React Compiler 互換性確認要否
- E2E / Storybook / unit test の要否

## 推奨フロー

1. `PRD.md` で What / Why / Who / 成功条件を確認する。
2. `design/DesignDoc.md` で app / package の責務、コーポレートサイト優先方針、React 標準、CMS/API の扱いを確認する。
3. `spec-draft` を使って 1 issue ごとに 1 spec を起こし、対象機能の論点を `index.md` に閉じ込める。
4. `spec-lifecycle` を使って Performance / Routing / Content / UI reuse / React Compiler / Testing 観点を埋める。
5. 実装可能になったら `spec-prompts` を使って `prompts/` 配下へ `corporate-site` / `cms` / `ui` / `config` / `e2e` 単位で分割する。

## Kufu Monorepo での spec 分割指針

Phase 1 では、次の粒度で spec を切るのを基本とする。

- `corporate-site-foundation`
- `lp-content-structure`
- `design-system-foundation`
- `shared-config-foundation`
- `e2e-critical-flows`
- `cms-app-architecture`
- `cms-content-delivery`

1 spec で複数 package をまたぐ実装が発生してもよいが、論点は 1 つの機能テーマに閉じる。

テンプレートは [TEMPLATE.md](TEMPLATE.md) を使う。

## 関連 Skills

- `spec-draft`: spec の初回作成
- `spec-lifecycle`: spec の phase 管理と review gate
- `spec-prompts`: prompt 分割と自己完結化
