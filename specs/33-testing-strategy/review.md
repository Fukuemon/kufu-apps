# レビュー記録

`spec-review` (fresh-context evaluator `spec-reviewer`) の結果を追記する。

## 2026-08-15 — scaffold〜clarify 累積レビュー

**Verdict: NEEDS_WORK** (指摘 10 件)

### 観点別評価

| 観点               | 結果       | 要点                                                                         |
| ------------------ | ---------- | ---------------------------------------------------------------------------- |
| 上位文書整合       | NEEDS_WORK | 上位側から本 spec へ明示委譲された記述 3 件を取りこぼし (指摘 1-4)           |
| 未解決論点         | NEEDS_WORK | D9 が実質先送り、D4 が未検証の前提の上に立つ。「未確定ゼロ」宣言と矛盾 (5-7) |
| 実装対象明示       | NEEDS_WORK | domains とは完全一致。新設コマンドと `commands` 契約の関係が未説明 (指摘 4)  |
| template 必須節    | NEEDS_WORK | 22 節と機能仕様 5 サブ節は充足。`## 備考` 欠落と変更履歴の未同期 (8-9)       |
| EARS acceptance    | NEEDS_WORK | `## 要件の解釈` に EARS 記述が 0 件 (指摘 10)                                |
| prompts 自己完結性 | N/A        | prompts phase 未実施                                                         |
| 正本境界           | N/A        | sync phase 未実行。現段階は spec が作業正本でよい                            |

### 指摘

1. **`pnpm check:specs` の CI 常設化が未判断** — `context/engineering.md` の Docs Closeout Gate が「CI への常設化は CI パイプライン方針へ委譲する」と明記しており、その方針が本 spec (#12 統合)。しかし spec 全体に `check:specs` の語が 0 件で、D6 の CI 対象にも「やらないこと」にも無い。上位文書が本 spec へ明示委譲した論点の取りこぼし。
2. **Design Doc の Future Work 行が古くなる** — 「Design Doc 更新要否: 不要」としているが、Future Work 表の「CI パイプライン」行は「build / lint / test と docs closeout 検査の CI 常設化が未対応」という現状事実を保持している。D6 / D7 実装後にこの行は事実として古くなるため、`## 上位資料からの変更点` の Design Doc 表に立てるべき。
3. **R2 バケットの作成主体が未判断** — `context/infrastructure.md` は「infra 側 (Pages project / domain / secret) の変更は Infrastructure Contract 経由で `kufu-infra` repo へ依頼する」と定め、ADR-0001 は Cloudflare リソースの Terraform 管理を別 repo に置く。R2 という新規 Cloudflare リソースを app repo で手動作成するのか infra repo へ依頼するのかが未判断のまま、P1a に「R2 連携」が置かれている。
4. **新設コマンドが `context/project.yml` の `commands` に未反映** — VRT 実行 / baseline 更新コマンドを新設する設計だが、コマンド契約の正本への追加が `## 上位資料からの変更点` の context 表に無い。`meta.updated` の同期も必要。
5. **D9 が先送りを「確定」と表記** — 内容は「Turbo remote cache の要否」「required status checks の要否」の判断そのものの先送り。決定者 / 期限付きで `## 未確定事項` に置くか、判断を下すこと。
6. **D8 の論点の一部が未解決** — 論点定義は「VRT を CI で回すか **と CI 実行時間の目標**」だが、目標値は決めていない。にもかかわらず計測指標表が「D8 の目標値との対比」と存在しない値を参照しており、指標が観測不能。
7. **D4 の未検証前提の分類が誤り** — reg-suit の R2 向け publish plugin 未検証は、D4 の決定内容そのものを支える前提であり、崩れれば D4 の再決定になる。「論点ではなく作業手順」として置くのは不適切。期限 / 決定者、または崩れた場合の代替保管先を付けて管理すること。
8. **変更履歴が未同期** — clarify による D1〜D9 の確定と解決済み論点の追記が履歴に残っていない。
9. **`## 備考` 節が欠落** — テンプレの節構成に合わせるか「なし」と明記すること。
10. **`## 要件の解釈` に EARS 記述が 0 件** — `requirements.md` へ委譲しているが、テンプレは本節に EARS 風記述を求めている。あわせて「文書群は…を保持している」型の基準と成功条件「実装 issue がそのまま従える粒度」は観測手段が未定義でテスト可能になっていない。

### 推奨対応

- 指摘 1-4: sync phase で上位文書への back-propagation を先に行う
- 指摘 5-7: clarify phase へ差し戻し (D4 の未検証前提 / D8 の目標値 / D9 の扱い)
- 指摘 8-10: 本 spec 内で修正可能
