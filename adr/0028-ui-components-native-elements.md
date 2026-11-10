# ADR-0028: packages/ui のコンポーネントを、ネイティブの要素と clsx で書いた Base と Case にし、shadcn と Base UI を外す

## Status

提案

## Context

`packages/ui` のコンポーネントの書き方と置き場を決める必要がある。

- `packages/ui` は、shadcn の CLI で取り込んだ source を編集して持ち、primitive の基盤に Base UI を使う。
  - ADR-0010: [shadcn の primitive の基盤に Base UI を採る](0010-shadcn-base-ui-primitive-policy.md)
- corporate-site は island を持たない。`apps/corporate-site/src` に `client:` は 0 件で、React のコンポーネントは、ビルドのときに静的な HTML になる。Base UI のフォーカスの管理とキーボードの操作は、ブラウザで JavaScript が動くときにだけ働く。
- 表示だけの UI は、React のコンポーネントを `client:*` なしで静的に描く。
  - ADR-0008: [corporate-site は shadcn を静的に描画して使い、client:\* の island は操作が要るものに限る](0008-astro-react-island-policy.md)
- Base UI を import するのは、`packages/ui` の 5 つ（button、input、select、separator、badge）である。corporate-site が使うのは、`Button`、`Tag`、`LinkButton`、`DefinitionRow` の 4 つである。入力のコンポーネントは、問い合わせフォームの要求が使う予定である。
- `class-variance-authority` は、`packages/ui` の 3 つと、corporate-site の Astro のコンポーネントの 3 つが使う。`tailwind-merge` は、`cn` だけが使う。
- 呼び出す側から `@kufu/ui` のコンポーネントに class を渡しているのは、`ContactSection.astro` の `Tag` の 9 か所である。
- 運営者は、shadcn、Base UI、`class-variance-authority`、`tailwind-merge` を外し、class の組み立てを `clsx` だけにすると決めた。見た目の変え方は `variant` のような props で決め、呼び出す側から class で上書きしない。
- 手本の 2 つは、shadcn と Base UI を使わない。buddy の `packages/ui` の依存は `clsx` だけで、コンポーネントを BCD Design で Base と Case に分ける。
  - 出典: [buddy の ADR-0014](https://github.com/Fukuemon/buddy/blob/83472b52b3e4e7ecb7c450b4c5bc21fa2025098b/docs/adr/0014-ui-components.md)
  - 出典: [fukuemon.dev の ADR-0021](https://github.com/Fukuemon/fukuemon.dev/blob/c3c29d6a00b6db29074c5375b91c61e40167fcc4/adr/0021-ui-components-and-catalog.md)
- DADS のボタンは、塗り、アウトライン、テキストの 3 つの種類を持ち、押せる領域を 44 CSS px 以上に保つとしている。
  - 出典: [DADS のボタン](https://design.digital.go.jp/dads/components/button/)
- `packages/ui` の `exports` には、ワイルドカードのエントリが 3 つある。ワイルドカードを消すことと、エントリの分け方は、この要求の設計に委ねられている。
  - 出典: [ADR-0026](https://github.com/Fukuemon/kufu-apps/blob/48380362a729fe2d5090af0fa25649d6a95adf75/adr/0026-workspace-package-contract.md)

## Decision

### 1. コンポーネントを、ネイティブの要素と clsx で書く

- `packages/ui` のコンポーネントは、React と、ネイティブの HTML の要素（`button`、`a`、`input`、`select`、`textarea`、`hr`、`dl`）で書く。
- 依存から、`shadcn`、`@base-ui/react`、`class-variance-authority`、`tailwind-merge`、`tw-animate-css` を外す。`components.json` を消す。
- class の組み立ては `clsx` だけにする。変種ごとの class は、変種の名前から class への対応を持つオブジェクトに書く。
- 見た目の変え方は、`variant`、`size`、`tone` のような props で決める。コンポーネントは `className` を受け取らない。
  - 置く位置と余白は、呼び出す側が、コンポーネントを包む要素で決める。
  - 今の props で表せない見た目が要るときは、コンポーネントに変種を足す。

### 2. コンポーネントを、Base と Case に分けて置く

コンポーネントは BCD Design で分類し、名前はドメイン、場面、基本の語の順に並べる。

- 出典: [BCD Design によるコンポーネントの分類](https://qiita.com/misuken/items/19f9f603ab165e228fe1)

| 分類   | 置くもの                                                 | 配置先                                |
| ------ | -------------------------------------------------------- | ------------------------------------- |
| Base   | ドメインも場面も持たないコンポーネント                   | `packages/ui/src/base/<名前>/`        |
| Case   | 場面を持ち、ドメインを持たないコンポーネント             | `packages/ui/src/case/<名前>/`        |
| Domain | corporate-site の section と、app の共通のコンポーネント | `apps/corporate-site/src/components/` |

- `packages/ui` には、Base と Case だけを置く。Domain のコンポーネントは、今と同じく app に置く。
- 最初に置くコンポーネントは、次のとおり。

| コンポーネント                                 | 分類 | DADS の対応するコンポーネント                        | 今のコンポーネント                                  |
| ---------------------------------------------- | ---- | ---------------------------------------------------- | --------------------------------------------------- |
| `Button`、`LinkButton`                         | Base | ボタン                                               | `Button`、`LinkButton`                              |
| `Tag`                                          | Base | チップラベル                                         | `Tag`、`Badge`                                      |
| `DefinitionRow`                                | Base | 説明リスト                                           | `DefinitionRow`                                     |
| `Divider`                                      | Base | ディバイダー                                         | `Separator`                                         |
| `FormField`、`TextInput`、`Select`、`Textarea` | Base | インプットテキスト、セレクトボックス、テキストエリア | `FormField`、`Label`、`Input`、`Select`、`Textarea` |

- `Badge` は `Tag` にまとめる。今の `Tag` は `Badge` を包むだけで、見た目が同じである。
- `Label` は `FormField` にまとめる。見出し、補足の文、誤りの文を、欄と結び付けて出すためである。
- 入力のコンポーネントは、今の画面では使っていない。問い合わせフォームの要求が使うので、書き直して残す。

### 3. Astro のコンポーネントも、clsx で class を組み立てる

- corporate-site の Astro のコンポーネントは、`class-variance-authority` を使わず、Astro の `class:list` で class を条件つきで組み立てる。`class:list` は、中で `clsx` を使う。
  - 出典: [Astro の class:list](https://docs.astro.build/en/reference/directives-reference/#classlist)
- 変種ごとの class は、frontmatter の中のオブジェクトに書く。

### 4. 表示だけのコンポーネントと island の境界は変えない

- 表示だけのコンポーネントは、Astro の中で `client:*` なしで静的に描く。
- ネイティブの要素で足りない操作の UI が要るときは、そのコンポーネントだけ、ライブラリを比べて決める。入れたコンポーネントは island にする。

### 5. `packages/ui` の exports は、名前で書いた 3 つにする

| エントリ      | 指すファイル           | 使う側                            |
| ------------- | ---------------------- | --------------------------------- |
| `.`           | `src/index.ts`         | コンポーネントを import する app  |
| `./theme.css` | `src/tokens/theme.css` | Tailwind CSS の entry を持つ app  |
| `./fonts.css` | `src/tokens/fonts.css` | document の head で書体を読む app |

- ワイルドカードのエントリ（`./components/*`、`./hooks/*`、`./lib/*`）と、`./components`、`./hooks`、`./lib`、`./lib/utils` を消す。
- `package.json` の `imports`（`#components/*` など）を消し、相対パスで import する。

この決定は、ADR-0010 を置き換える。承認したときに、ADR-0010 の Status を「ADR-0028 に置換」にする。

## Considered Options

| 選択肢                                                                            | 強み                                                                                           | 弱み                                                                                                                 |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **採用:** ネイティブの要素と `clsx` で書き、Base と Case に分ける                 | buddy、fukuemon.dev と同じ形になる。依存が `clsx` だけになる。静的に描いた HTML がそのまま働く | 複雑な操作の UI（コンボボックスなど）が要るときに、自分で書くかライブラリを比べることになる                          |
| shadcn と Base UI を使い続ける（ADR-0010 のまま）                                 | 複雑な操作の UI を、生成した source から始められる                                             | island が無く、Base UI の振る舞いが働いていない。運営者の決定と合わない                                              |
| ネイティブの要素で書き、`class-variance-authority` と `tailwind-merge` だけを残す | 変種の定義を、今の書き方のまま残せる                                                           | 呼び出す側の class を混ぜる前提の仕組みが残る。buddy と依存が分かれる                                                |
| コンポーネントが `className` を受け取り、呼び出す側で上書きできるようにする       | 画面ごとの小さな違いを、コンポーネントを直さずに書ける                                         | 見た目の違いが画面のコードに散る。トークンとコンポーネントの規則で、見た目を確認できなくなる                         |
| 共有のコンポーネントを Astro で書く                                               | React に依存しない                                                                             | React の app（CMS の候補）から使えない。`packages/ui` の Storybook で開く仕組みが、コミュニティ製の framework になる |

## Consequences

### Positive

- 配る JavaScript を増やさずに、コンポーネントの振る舞いが HTML だけで働く。
- 見た目の違いが、コンポーネントの props に集まる。
- `exports` が 3 つになり、app が import できるものが `package.json` だけで分かる。

### Negative

- `packages/ui` の 11 個のコンポーネントと story を書き直す。
- `ContactSection.astro` の `Tag` の 9 か所は、class の上書きを `Tag` の変種に置き換える。
- shadcn と Base UI を前提にした文書の語を直す。ADR-0008 は、決定を変えずに、語だけを直す。
  - 対象は、ADR-0008、`context/` の 4 つの文書（codebase、conventions、domain、tech-stack）、corporate-site の Design Doc である。
- ネイティブの `select` の見た目は、ブラウザごとに違う部分が残る。
