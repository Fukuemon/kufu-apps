# Specs

`specs/` は issue / 機能単位で要求、仕様、設計、テスト観点を一時的に整理する作業領域である。上位方針の正本は `design/DesignDoc.md` の `## Why / What` と landscape 節に残し、恒久的な意思決定は `adr/` に昇格する。

## 命名規約

- ディレクトリ名: `specs/<issue-number>-<short-slug>/`
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
3. `spec-requirement` で要求を整理し、必要なら issue を起票する。
4. `spec-lifecycle` を使って 1 issue ごとに 1 spec を起こし、scaffold から prompts まで phase を進める。
5. 実装可能になったら同 skill の prompts phase で `prompts/` 配下へ対象ドメイン単位に分割する。

## Kufu Monorepo での spec 分割指針

1 issue = 1 spec = 1 機能テーマを基本とする。1 spec で複数 package をまたぐ実装が発生してもよいが、論点は 1 つの機能テーマに閉じる。

同一テーマを再設計する場合も、新しい issue で別 spec を起こす。

テンプレートは [templates/specs/template.md](../templates/specs/template.md) を使う (`spec-lifecycle` の scaffold phase が自動でコピーする)。必須節は `hooks/spec/validate_document.sh` が、レビュー観点は `spec-review` が検査する。

## closeout (issue close 時の清算)

spec は issue 単位の作業文書であり、**issue close 時に削除する**。durable な設計成果は削除前に design / context / ADR へ反映しておく (判断根拠: [ADR-0011](../adr/0011-specs-closeout-enforcement.md))。

1. **sync 済み確認**: 対象 spec の durable な設計成果 (IA / データモデル / フロー / アーキ判断) が design / context / ADR に反映済みかを確認する。
2. **未 sync 分の反映**: 未反映があれば反映先を確定して反映する。選択肢を比較して決めた判断は ADR へ昇格する。
3. **参照元の是正**: 削除する spec を指すリンクを issue リンク等に置き換える。削除済み spec を「正本」と呼ばない。
4. **削除と検証**: spec ディレクトリを削除し、`pnpm check:specs` で残存ゼロを確認する。

手順 1〜3 を終えるまで削除しない。

issue を close すると、手順 4 の削除 PR は [`.github/workflows/spec-closeout.yml`](../.github/workflows/spec-closeout.yml) が自動で起票する。**その PR をマージするかどうかが削除の判断**であり、手順 1〜3 の確認は PR 本文のチェックリストで行う。close する PR に spec 削除を含めた場合は起票されない。

## 関連 Skills

- `spec-requirement`: 要求の整理と issue 起票
- `spec-lifecycle`: scaffold 〜 prompts の phase 管理と review gate
- `spec-review`: gate での独立評価
