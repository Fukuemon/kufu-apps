# Diagrams

構成図の置き場である。図は `.drawio.svg` 形式で保存する。

## この形式を選んだ理由

`.drawio.svg` は 1 ファイルの中に「表示用の SVG」と「編集用の mxfile XML」の両方を持つ。GitHub は SVG として描画し、draw.io はそのまま開いて編集できる。

生成元と生成物が同一ファイルであるため、**両者がずれる余地がない**。図の生成スクリプト、生成コマンドの CI 実行、生成物との差分検査のいずれも不要である。

`.drawio` (XML のみ) を別に置かない。置くと正本が 2 つになり、この利点を失う。

## 図の一覧

| ファイル                           | 内容                                                | 参照元   |
| ---------------------------------- | --------------------------------------------------- | -------- |
| `infra-tool-boundary.drawio.svg`   | Cloudflare リソースの Terraform / Wrangler 管轄境界 | ADR-0020 |
| `infra-permission-flow.drawio.svg` | credential と実行経路の権限分離                     | ADR-0020 |

## 編集手順

1. draw.io Desktop で `.drawio.svg` を直接開く (`brew install --cask drawio` で導入する)。
2. 編集して保存する。
3. 次のコマンドで書き出す。出力先は入力と同じファイルにする。

```sh
drawio --export --format svg --embed-diagram --uncompressed --theme light \
  --output design/diagrams/<name>.drawio.svg design/diagrams/<name>.drawio.svg
```

オプションの意味は次のとおりである。省略すると壊れるものを含む。

| オプション        | 理由                                                                        |
| ----------------- | --------------------------------------------------------------------------- |
| `--embed-diagram` | 編集用 XML を SVG へ埋め込む。**省略すると次回から編集できなくなる**        |
| `--uncompressed`  | 埋め込む XML を平文にする。省略すると deflate + base64 になり grep できない |
| `--theme light`   | 配色を固定する。既定の `auto` は閲覧環境に追従して色が変わる                |

読み込みと書き出しを往復してもファイルはバイト単位で一致する。再保存だけで差分が出ることはない。

## 制約: ラベルは `html=0` で作る

draw.io の既定はラベルを HTML (`foreignObject`) で出力する。GitHub の SVG サニタイズは `foreignObject` を除去するため、**文字が消えて「Text is not SVG - cannot display」の警告画像に置き換わる**。エラーにはならず、図の枠だけが表示される。

図形のスタイルに `html=0` を指定すると、文字は SVG のテキストとして出力される。太字の見出しとグレーの説明文のように書式を分ける場合は、1 つの図形に詰め込まず、テキスト要素を分けて配置する。

書き出した SVG を検査するときは次を使う。

```sh
grep -c 'svg-export-text-problems' design/diagrams/<name>.drawio.svg   # 0 以外なら文字が失われている
grep -o '<foreignObject' design/diagrams/<name>.drawio.svg | wc -l     # 0 でなければ html=0 の指定漏れ
```

## Cloudflare アイコン

`cloudflare-icons.xml` は draw.io のシェイプライブラリである。Cloudflare の製品アイコン 251 個を収録する。draw.io の `File > Open Library from > Device` で読み込むと、左のパネルからドラッグして使える。

draw.io の公式 stencil に Cloudflare は含まれない (AWS / Azure / GCP / IBM Cloud などはある)。iconify にも R2 や DNS の製品アイコンは存在しない。このため公式 npm パッケージから独自に生成した。

アイコンは `data:image/svg+xml,` の data URI として図に埋め込まれる。外部への参照は発生しないため、GitHub 上でも欠けない。

### 由来とライセンス

- 出典: [`@cloudflare/component-icon`](https://www.npmjs.com/package/@cloudflare/component-icon) v13.15.3 (author: Cloudflare Frontend Team)
- ライセンス: BSD-3-Clause。パッケージの `package.json` の `license` フィールドに基づく
- 加工内容: React コンポーネントとして配布されているものを静的 SVG へ描画し、draw.io のライブラリ形式へ変換した。図形そのものは改変していない。

**未確認**: 当該パッケージは `LICENSE` ファイルと著作権表示を同梱していない。BSD-3-Clause は再配布時に著作権表示の保持を求めるが、保持すべき原文が上流に存在しない。厳密な遵守を要する場合は Cloudflare へ確認する。

## 新しい図を追加するとき

1. draw.io で新規作成し、`design/diagrams/<name>.drawio.svg` として上記コマンドで書き出す。
2. 本 README の一覧へ行を足す。
3. 参照元の文書から `![説明](../design/diagrams/<name>.drawio.svg)` の形で埋め込む。
