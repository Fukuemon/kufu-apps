# ADR-0016: CI とローカル hook の責務を、二重実行を許す形で分担する

## 状態

承認

## 決定日

2026-08-16

## 背景

- リモート検証は段階的に増えたが、どこまでを CI に載せるかの方針が無かった。2026-08-16 時点の実測は次のとおり。
  - CI に載っているもの: `lint` / `test` (`.github/workflows/lint.yml`)
  - CI に載っていないもの: `typecheck` / `build` / `knip` / `depcruise` / `e2e`
  - ローカル `lefthook` の pre-commit: `protected-branch` / `format` / `repo-analysis` (= `depcruise` + `knip`) / `lint`
- `typecheck` と `build` は pre-commit にも CI にも無く、**どこでも自動検証されていない**状態だった。
- `lint.yml` は「lint の必須 gate (pre-commit は `--no-verify` で素通しできるため)」と自らコメントしており、CI を最後の砦とする設計思想が既にあった。
- Turbo の remote caching は無効。develop の branch protection の required status checks は、private repository のため API から取得できず未確認。

## 決定

- **`typecheck` / `build` / `knip` / `depcruise` / `e2e` を CI に載せる。** ローカル `lefthook` との重複は、pre-commit が `--no-verify` で迂回できる以上、**意図的な二重化**として許容する。
- **E2E を CI で回す。** `context/testing.md` に記録された `127.0.0.1:4321` の bind 制約はローカル sandbox 固有であり、GitHub Actions の runner には当てはまらない。
- **VRT の撮影と判定は CI 環境に一本化する。** ローカルと CI ではフォントのレンダリングが異なり、baseline を撮る環境を固定しなければ恒常的な差分が発生するためである。
  - [ADR-0015](0015-visual-regression-testing-policy.md) — VRT の方針と baseline の扱いを定めた決定
- **CI 実行時間の目標値は置かない。** ジョブ追加後の実測値を記録し、その値を見て Turbo remote cache の要否と required status checks の設定を判断する。
- 次の 2 つは CI ジョブ構成の対象外とする。
  - `pnpm check:specs`: `.github/workflows/spec-residue.yml` が既に CI で実行しており常設化は完了済み。同 workflow は「別 PR で spec を清算する運用では、issue は閉じたが spec は残っている窓の間に無関係な PR が落ちる」ため、意図的に PR ゲートから外している。この判断を維持する。
  - Storybook build: `.github/workflows/storybook-pages.yml` が既に担っている。

## 代替案

### 1. CI を正とし pre-commit を軽くする

#### Pros

- commit が速くなり、ローカルの待ち時間が減る。

#### Cons

- ローカルのフィードバックが CI 実行まで遅れる。壊れた状態で push する頻度が上がる。

### 2. `typecheck` / `build` だけを CI に追加し、`knip` / `depcruise` は pre-commit に任せる

#### Pros

- CI 実行時間を抑えられる。

#### Cons

- `--no-verify` で迂回された場合に `knip` / `depcruise` の検査が完全に抜ける。

### 3. E2E を Cloudflare Pages の preview deployment に対して実行する

#### Pros

- 本番に近い環境で検証できる。

#### Cons

- preview URL の取得と待機が必要になり、workflow の構成が複雑になる。

### 4. Turbo remote cache を先に導入してからジョブを増やす

#### Pros

- CI 実行時間の増加を先回りして抑えられる。

#### Cons

- Vercel のサービスかセルフホストが必要で、必要性を実測で示す前に依存が増える。

## 影響

### 良い影響

- `typecheck` と `build` の検証されていない穴が塞がる。
- pre-commit を迂回しても CI で止まるため、品質ゲートが実効的になる。
- テストを増やしても回す場所が決まっているため、追加時に迷わない。

### 悪い影響 / トレードオフ

- CI の実行時間が伸びる。remote cache を入れるかは実測後の判断に委ねる。
- 同じ検査がローカルと CI で二重に走る。

## 実装・運用への反映

- 対象 app / package: リポジトリ横断 (`.github/workflows/`、`lefthook.yml`)
- spec 更新要否: 不要
- AI 向け設定更新要否: 不要 (規約は `context/engineering.md` に反映済み)

## 関連ドキュメント

- `context/engineering.md`: Repository Quality Gate / Docs Closeout Gate
- `context/testing.md`: テスト責務の分担
- [ADR-0015](0015-visual-regression-testing-policy.md): VRT の導入方針
- issue: #33 (決定経緯。#12 を統合)
