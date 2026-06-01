# ADR

`adr/` は Kufu Monorepo の恒久的な意思決定ログを保存する場所である。仕様検討の途中メモや一時的な比較は `specs/` に置き、長期参照価値のある判断だけを ADR に昇格する。

## 命名規約

- ファイル名: `adr/NNNN-<title>.md`
- 例:
  - `adr/0001-lp-framework-astro.md`
  - `adr/0002-package-boundary.md`
  - `adr/0003-cms-api-adoption.md`

## ADR にする判断

- コーポレートサイトの技術選定や rendering 方針を固定した。
- app / package の責務境界を固定した。
- UI 共有方針や shadcn/ui の扱いを固定した。
- React Compiler 対応方針を固定した。
- CMS/API、認証、管理画面など将来拡張の採否を決めた。
- 代替案比較を経て、採用方針を明示的に残す必要がある。

テンプレートは [TEMPLATE.md](TEMPLATE.md) を使う。
