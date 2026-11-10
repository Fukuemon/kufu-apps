# ADR

`docs/adr/` は Kufu Monorepo の恒久的な意思決定ログを保存する場所である。仕様検討の途中メモや一時的な比較は `docs/specs/` に置き、長期参照価値のある判断だけを ADR に昇格する。

## 命名規約

- ファイル名: `docs/adr/NNNN-<title>.md`
- 例 (実在 ADR):
  - [`docs/adr/0001-terraform-infra-repository-boundary.md`](0001-terraform-infra-repository-boundary.md)
  - [`docs/adr/0007-design-token-architecture.md`](0007-design-token-architecture.md)
  - [`docs/adr/0009-corporate-site-contact-form-backend.md`](0009-corporate-site-contact-form-backend.md)

## ADR にする判断

- コーポレートサイトの技術選定や rendering 方針を固定した。
- app / package の責務境界を固定した。
- UI 共有方針や shadcn/ui の扱いを固定した。
- React Compiler 対応方針を固定した。
- CMS/API、認証、管理画面など将来拡張の採否を決めた。
- 代替案比較を経て、採用方針を明示的に残す必要がある。

テンプレートは [template.md](template.md) を使う。
