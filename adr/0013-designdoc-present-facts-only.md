# ADR-0013: DesignDoc は現状事実のみを記載し将来計画は Future Work 節へ一元化する

## 状態

承認

## 決定日

2026-07-25

## 背景

- `design/DesignDoc.md` には Phase 1/2/3 という時系列の記述が、フェーズ展望・想定ユーザー表 (Phase 1 優先度列)・成功条件 (Phase 1 target)・スコープ・Lower-Priority Goals・設計上の前提・モジュール責務 (`apps/cms` 行) などほぼ全節に分散していた。
- 設計文書に「今の事実」と「将来の構想」が混在すると、読者 (開発者 / AI エージェント) はどれが現状かを都度判別する必要があり、実装との突合精度が下がる。
- C4 図 (System Context L1 / Container L2) も、利用者と開発プロセス (開発者 / GitHub / docs) の同居や未実装要素 (点線の `apps/cms`) の混在で要点が掴みにくかった。

## 決定

- **DesignDoc の各節は「今の事実」のみを記載する。** Phase 1/2/3 等の時系列語彙と将来記述を全節から排除する。
- **将来計画 (cms 構想、UI 本格共有への移行など) は `## Open Questions / Future Work` 節に一元化する。** 判断の根拠は [ADR-0003](0003-phase1-corporate-site-only-and-cms-deferred.md) 等の ADR へリンクし、Future Work 節以外に将来構想を書かない。
- **C4 図は L1 / L2 の階層分けを維持し、内容を次の基準で再設計する** (1 枚への統合はしない):
  - L1 (System Context): 利用者視点に絞る。訪問者・内容更新者 → コーポレートサイト → 外部サービス (Cloudflare / Resend) のみ。開発者・GitHub・docs workflow は載せない。記法は `C4Context` をやめ素直な flowchart にする。
  - L2 (Container): 実在の実行単位とデータの流れのみ。`apps/corporate-site` / Pages Functions / `packages/ui` / `packages/config` / `e2e` / 外部サービス。未実装の `apps/cms` (点線) と正本ドキュメント群のノードは載せない (cms は Future Work 節、docs は「詳細の所在」節へ)。
- DesignDoc 本体の書き換えは本判断を根拠に **issue #31 で実施済み** (2026-07-26)。

## 代替案

### 1. C4 L1/L2 を廃止し 1 枚の図に統合する

- 利点: 図が 1 枚で完結し、メンテナンス対象が減る。
- 欠点: 「誰が何のために使うか」(文脈) と「どう構成されているか」(構造) が 1 枚に混在し、それぞれの読者に余計な情報が乗る。
- 不採用理由: 掴みにくさの原因は 2 枚あることではなく、各図に開発プロセスや未実装要素が混在していることのため。階層は保ち中身を絞る方が効果的。

### 2. Phase 記述を残し「現在 Phase」を明示する

- 利点: 書き換え作業が小さい。
- 欠点: 全節に散在した Phase 語彙の判別コストは残り、Phase が進むたびに全節の更新が必要になる。
- 不採用理由: 「今の事実」と「将来」を節で分離する方が、更新箇所が Future Work 節に局所化されるため。

## 影響

### 良い影響

- DesignDoc のどの節を読んでも現状が分かり、実装との突合・AI の読解精度が上がる。
- 将来計画の更新が Future Work 節 + ADR に局所化される。

### 悪い影響 / トレードオフ

- 書き換え時に節構成の調整 (スコープ / Lower-Priority Goals / 完成条件の再配置) が必要で、一時的な編集コストがかかる。

## 実装・運用への反映

- 対象 app / package: なし (`domain:core` — 文書運用)
- spec 更新要否: 要 (issue #31 の spec に決定経緯と再設計図案を記録済み)
- AI 向け設定更新要否: 不要 (DesignDoc の記述方針であり skill / rule は変更しない)

## 関連ドキュメント

- `design/DesignDoc.md`: 書き換え済み (issue #31 / 2026-07-26)
- [ADR-0003](0003-phase1-corporate-site-only-and-cms-deferred.md): 将来計画 (cms 後続化) の根拠リンク先
- [issue #31](https://github.com/Fukuemon/kufu-apps/issues/31): 決定経緯・C4 再設計の判断 (図の確定版は `design/DesignDoc.md`)
- [context/infrastructure.md](../context/infrastructure.md): Cloudflare Pages への配信前提

## 更新

### 2026-08-23: サービス構成図に限り、確定済みの未実装構成を破線で載せる (issue #47)

- **背景**: #47 が infra の集約とツール分担を決めた結果、`infra/` / Rate Limiting / R2 / Pages Functions は「決定済みだが未実装」の状態で並んだ。本 ADR の基準どおりに描くと、図は Astro と Pages だけになり、読み手が全体像を掴めない。一方で Future Work 節は表であり、要素間の関係を示せない。
- **決定**: `design/DesignDoc.md` の **サービス構成図に限り**、確定済みの未実装構成を載せてよい。ただし **破線で実装済みと区別し、図の要点にどれが未実装かを明記する**。実装が進んだら実線へ変える。
- **適用範囲**: この例外はサービス構成図 1 枚に限る。本文、モジュール責務、Related ADRs、その他の節は従来どおり現状事実のみを記載する。仕様が決まっていても未実装のものは Future Work 節が正本である。
- **理由**: 図の価値は要素間の関係にあり、関係は片方が欠けると描けない。破線という区別手段があれば、現状と計画を混同させずに関係を示せる。文章に同じ手段が無いため、例外は図に限る。

### 2026-07-26: L1 / L2 の掲載基準を「実装済みの実行単位」に明確化 (issue #31)

- **背景**: 決定時の L1 / L2 の構成要素の列挙は、問い合わせ backend (Cloudflare Pages Functions + Resend) を含んでいた。しかし書き換え時点でこれは未実装 (repo に `functions/` が無く、issue #26 が open) であり、「実在の実行単位のみ」という基準と矛盾した。
- **決定**: 図に載せるのは **repo に実装コードが存在する実行単位と、確定済みの配信先** とする。仕様が決まっていても未実装のものは Future Work 節で扱う。この基準により、問い合わせ backend は L1 / L2 から外し Future Work へ移した。Cloudflare Pages / CDN は確定済みの配信先として残す。配信先として決まっており、仕様だけが決まっている状態ではないためである。
  - [context/infrastructure.md](../context/infrastructure.md) の Infrastructure / Deployment — corporate-site を Cloudflare Pages へ配信する前提を定める
- **影響**: 実装が進んだ時点で図に追加する。図と実装の対応が一意になり、「決まっているが無い」ものを図から読み取れなくなる代わりに、Future Work を見れば分かる。
