# ADR-0011: specs は存続させ closeout (issue close 時削除) を徹底する

## 状態

承認

## 決定日

2026-07-25

## 背景

- SDD 契約 (Spec Workflow Contract) では spec は issue 単位の作業文書であり、issue close 時に削除する (closeout)。durable な設計成果は sync phase で design / context / ADR へハンドオフ済みであることが削除の前提。
- しかし実際には closeout が実行されておらず、close 済み issue の spec 9 ディレクトリ (#3, #6, #10, #11, #13, #14, #16, #17, #21) が `specs/` に残存し、契約と実態が乖離していた。
- issue #31 の検討当初は「spec という中間文書自体を廃止し、issue 本文 + design / ADR に集約する」案も検討した。

## 決定

- **spec 運用 (作成 → 設計 → sync → close 時削除) は現行契約のまま存続させる。** 廃止はしない。
- 残存 9 ディレクトリは issue #31 で全件清算する。清算は「dir ごとの sync 済み確認 → 未 sync 分の sync → 清算手順の文書化 → 削除」の順で行い、**清算手順が文書化される前の削除は禁止** する。
- 今後の close 時削除は **検査スクリプト** (spec ディレクトリの issue-id × tracker の issue state を照合し、CLOSED issue の spec 残存を検出して失敗させる) で担保する。
  - 実行は手動 (コマンド登録) とし、CI への常設化は CI パイプライン方針 (issue #12) に委譲する。
  - lefthook (pre-commit / pre-push) には組み込まない (gh 呼び出しによるオフライン時・速度への影響を避ける)。
- 検査の仕組みは **本 repo ローカルに閉じる** (スクリプト + コマンド登録 + `context/engineering.md` への記載)。closeout 手順の正本 (sdd-template の `spec-lifecycle` / `references/closeout.md`) へ検査実行ステップを足す改修は、sdd-template 側の派生 issue として起票する (他の消費 repo にも展開されるため)。

## 代替案

### 1. specs を廃止し issue 本文 + design / ADR に集約する

- 利点: 中間文書がなくなり、正本の種類が減る。issue 本文が作業記録を担い、design 直接編集 + PR 差分でレビューできる。
- 欠点: 論点管理・受け入れ基準・実装分割の置き場が issue コメントに分散する。spec-review (fresh-context evaluator) の評価対象を差し替える再設計が必要になり、sdd-template 共有プロセスとの差分が大きい。
- 不採用理由: 問題の本質は「spec の存在」ではなく「closeout の不徹底」であり、契約どおり削除が回れば運用負荷の課題は解消するため。

### 2. 検査を lefthook / CI に即時組み込む

- 利点: 強制力が最も高い。
- 欠点: lefthook は gh 呼び出しでオフライン時・commit 速度に影響する。CI は方針自体が未決 (issue #12)。
- 不採用理由: 手動実行可能なスクリプトを先に用意し、常設化は #12 で判断する方が段階的で安全なため。

## 影響

### 良い影響

- 「どこを読めば今の事実が分かるか」が design / context / ADR に一意化され、乖離した spec が残らない。
- 契約と実態の乖離が検査で検出可能になり、closeout 漏れが構造的に再発しにくくなる。

### 悪い影響 / トレードオフ

- 検査スクリプトの実行が手動である間は、実行忘れのリスクが残る (CI 常設化 [#12] までの暫定)。
- 清算時、未 sync の spec は先に sync 作業が必要になり、一括清算の作業量が読みにくい。

## 実装・運用への反映

- 対象 app / package: なし (`domain:core` — リポジトリ横断の文書運用)
- spec 更新要否: 要 (issue #31 の spec に決定経緯を記録済み。spec は close 時に削除されるため本 ADR が長期正本)
- AI 向け設定更新要否: 本 repo は不要 (closeout 手順の改修は sdd-template 派生 issue で実施)

## 関連ドキュメント

- `design/DesignDoc.md`: モジュール責務 `specs` 行 (変更なし・継承)
- [issue #31](https://github.com/Fukuemon/kufu-apps/issues/31): 決定経緯
- `CLAUDE.md` Spec Workflow Contract: 正本境界 / closeout (現行契約のまま)
- issue #12: CI パイプライン方針 (検査の常設化の委譲先)

## 更新

### 2026-07-27: closeout を「削除 PR の自動起票 + 人の判断」で運用する

- **背景**: `pnpm check:specs` は残存を**検出**するだけで、削除そのものは手作業だった。一方で自動削除は採れない — 削除の前提である「durable な設計成果が sync 済みか」は機械判定できず、実際 issue #31 の清算では未転記の設計情報が 6 件見つかっている (うち 1 件は ADR と実装が矛盾していた)。自動で消していれば失われていた。
- **決定**: issue の close をトリガに、GitHub Actions ([`.github/workflows/spec-closeout.yml`](../.github/workflows/spec-closeout.yml)) が **spec を削除する PR を起票する**。bot は候補を提示するだけで、**削除の可否はその PR をマージするかどうかで人が決める**。PR 本文に sync 済み確認のチェックリストを載せ、本 ADR の IF 基準を人のレビューとして残す。
  - 対象 spec が無ければ何もしない。同じ branch の PR が既に open なら再起票しない。
  - `workflow_dispatch` で issue 番号を指定した手動実行もできる (workflow 障害時の退避路)。
  - PR を close すれば spec は残る。その場合 `pnpm check:specs` は残存として検出し続ける。
- **順序**: `Closes #N` で issue を閉じる PR に spec 削除を含めた場合、close 時点で spec が無いため起票されない。どちらでもよいが、**同じ PR に含める方が develop 上に残存状態の窓が生じない**。
- **影響**: 削除の toil が消え、判断だけが残る。GitHub Actions のリポジトリ設定で Workflow permissions = write と「Allow GitHub Actions to create and approve pull requests」が有効である必要がある (2026-07-27 に有効化済み)。
