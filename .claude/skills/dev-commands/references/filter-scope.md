# Filter Scope

pnpm / turbo の `--filter` を使い分けるための短いガイド。

## 基本

- 全体実行 → root script (`pnpm build` 等) をそのまま実行
- 単一 app / package → `pnpm --filter @kufu/<name> <task>`

## よく使う selector

| 目的                    | 書き方                             |
| ----------------------- | ---------------------------------- |
| 単一 package 名         | `--filter @kufu/corporate-site`    |
| 依存 graph (上流含む)   | `--filter ...@kufu/corporate-site` |
| 依存される側 (下流含む) | `--filter @kufu/corporate-site...` |
| 変更分のみ              | `--filter "[origin/develop]"`      |

詳細は pnpm 公式 docs を参照 (selector 構文は pnpm のバージョンによって挙動が異なる)。

## turbo との併用

`turbo run <task> --filter=@kufu/<name>` も同等に使える。`pnpm dev:corporate` がその例。

## アンチパターン

- root に app 専用依存を追加: `pnpm add <pkg>` (`--filter` 不在) → workspace 境界が壊れる
- 全体テストが遅いからと特定 package だけで済ませる → CI が境界違反を取りこぼす可能性がある
