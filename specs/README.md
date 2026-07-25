# Specs

`specs/` は issue / 機能単位で要求、仕様、設計、テスト観点を一時的に整理する作業領域である。上位方針の正本は `design/DesignDoc.md` の `## Why / What` と landscape 節に残し、恒久的な意思決定は `adr/` に昇格する。

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

- Design Doc (Why/What/How) 更新要否
- ADR 起票要否
- コーポレートサイト performance への影響
- UI 共通化要否
  - 第一原則は feature / colocation になっているか
  - app / feature 内で閉じる UI を無理に `packages/ui` へ寄せていないか
  - 複数 feature / app をまたぐ再利用が明確なものだけを共通化しているか
- React Compiler 互換性確認要否
- E2E / Storybook / unit test の要否

## 推奨フロー

1. `design/DesignDoc.md` の `## Why / What` 節で What / Why / Who / 成功条件を確認する。
2. 同ドキュメントの Goal 以降で app / package の責務、コーポレートサイト優先方針、React 標準、CMS/API の扱いを確認する。
3. `spec-draft` を使って 1 issue ごとに 1 spec を起こし、対象機能の論点を `index.md` に閉じ込める。
4. `spec-lifecycle` を使って Performance / Routing / Content / UI reuse / React Compiler / Testing 観点を埋める。
5. 実装可能になったら `spec-prompts` を使って `prompts/` 配下へ `corporate-site` / `cms` / `ui` / `config` / `e2e` 単位で分割する。

## Kufu Monorepo での spec 分割指針

1 issue = 1 spec = 1 機能テーマを基本とする。1 spec で複数 package をまたぐ実装が発生してもよいが、論点は 1 つの機能テーマに閉じる。

実績例 (粒度の参考):

- 基盤系: [3-monorepo-foundation](3-monorepo-foundation/), [13-design-system-foundation](13-design-system-foundation/)
- 設計系: [11-corporate-site-ia](11-corporate-site-ia/), [17-corporate-site-ia](17-corporate-site-ia/) (同一テーマの再設計は新 issue で別 spec を起こす)
- 実装系: [10-corporate-site-implementation](10-corporate-site-implementation/), [14-contact-form](14-contact-form/)

テンプレートは [templates/specs/template.md](../templates/specs/template.md) を使う (`spec-draft` が自動でコピーする)。必須節は `hooks/spec/validate_document.sh` が、レビュー観点は `spec-review` が検査する。

## 関連 Skills

- `spec-draft`: spec の初回作成
- `spec-lifecycle`: spec の phase 管理と review gate
- `spec-prompts`: prompt 分割と自己完結化
