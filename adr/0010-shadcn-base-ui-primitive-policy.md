# ADR-0010: shadcn の primitive 基盤は Base UI を採用する

## 状態

提案

## 決定日

2026-06-20

## 背景

- `packages/ui` は shadcn/ui を component source の配布手段として使い、`components.json` は当初 `radix-nova` を指定していた。
- shadcn/ui は CLI で component source を workspace に取り込み、各 project が自分の component library として編集する前提である。したがって primitive 基盤の選択は、依存 package だけでなく、生成される component API / markup / state attribute / story / Astro 消費方針へ影響する。
- 2026 年時点の shadcn/ui docs は、Radix UI と Base UI の両方を component library foundation として扱い、Base UI 用 component docs と Radix / Base UI の比較 UI を提供している。新規 project では `shadcn create` で Radix / Base UI を選べる。
- Base UI は Radix / Floating UI / Material UI の team が提供する unstyled React component library で、ARIA Authoring Practices Guide と WCAG 2.2 を前提にした accessibility、Tailwind / CSS Modules / CSS-in-JS 等の styling 自由度、Combobox / Autocomplete 等の複雑 component を特徴にする。
- Radix UI Primitives は実績のある unstyled accessible React primitives であり、WAI-ARIA / keyboard navigation / focus management の成熟度が高い。一方で、新規に shadcn catalog を育てる段階では、shadcn が Base UI 対応を公式導線として持ち始めていることを優先できる。
- [ADR-0008](0008-astro-react-island-policy.md) は corporate-site の表示専用 React component を Astro で静的描画し、interactive primitive だけ `client:*` island 化する方針を定めている。Base UI へ移行してもこの方針は維持する必要がある。

## 決定

1. **shadcn primitive 基盤は Base UI を採用する**。今後 `packages/ui` に shadcn component を追加・再生成する場合は、Base UI 版を第一候補にする。
2. **#6 の初期 catalog 対象は Base UI 版へ移行する**。`components.json` を Base UI 前提の shadcn 設定に変更し、`Button`, `Badge/Tag`, `Input`, `Select`, `Separator` は Base UI 版 shadcn source を土台にする。`Card`, `Textarea`, `Label` のように primitive 依存がない component も、同じ shadcn source ownership の下で catalog に置く。
3. **shadcn source ownership は維持する**。Base UI を採用しても、`@base-ui/react` を直接 app から散在 import しない。shadcn CLI で `packages/ui/src/components/` に取り込んだ source を `@kufu/ui` の component 正本として編集し、token へ合わせる。
4. **表示専用と interactive の境界は ADR-0008 を継承する**。Base UI component も React component であるため、表示専用 component は Astro static rendering で consume し、Dialog / Select / Popover / Tooltip 等の client interaction を必要とする component は `client:*` island 化する。
5. **Base UI 移行の完了条件を明示する**。#6 では少なくとも次を確認する:
   - `components.json` が Base UI 前提の shadcn 設定になっている。
   - `Button`, `Badge/Tag`, `Card`, `Label/FormField`, `Input`, `Select`, `Textarea`, `Separator` が Base UI 版または Base UI 版 shadcn source を土台にしている。
   - `pnpm --filter @kufu/ui lint` / `typecheck` / `build` / `storybook:build` が通る。
   - corporate-site で静的描画する component と island 化する component の境界が PR / spec に残っている。

## 代替案

- **Radix UI を継続採用する**: Radix は成熟しており、現在の `radix-nova` 設定とも整合する。短期の差分は最小だが、shadcn の新規 project 導線が Base UI も同等に扱う状況で、今から作る shared catalog の基盤を旧前提に固定する理由が弱い。不採用。
- **Radix UI から Base UI へ段階移行する**: #6 の Storybook catalog では Radix のまま始め、後続 issue で Base UI に寄せる。移行リスクを分離できるが、catalog 初期段階で primitive 方針が固まらず、後から story / API 差分を再調整する手戻りが大きい。不採用。
- **component ごとに Radix / Base UI を混在させる**: 個別最適はしやすいが、生成 source の API / data attribute / story pattern が分裂し、`packages/ui` の保守性が落ちる。不採用。
- **Base UI を直接 import して独自 wrapper を作る**: CLI 生成 source を持つ shadcn の利点を捨てる。token に合わせて編集可能な component 正本を repo 内に持つ方針と合わないため、不採用。

## 影響

### 良い影響

- 新規 shared UI catalog を、shadcn が現在サポートする Base UI 導線に揃えられる。
- Base UI の複雑 component と edge case support を、将来の form / navigation / overlay 実装で利用しやすい。
- shadcn の「同じ抽象 API、異なる primitive」という方向に合わせることで、将来の component 追加時に docs / examples を参照しやすい。

### 悪い影響 / トレードオフ

- 既存 `radix-nova` component を再生成・差分調整する移行作業が発生する。
- Base UI は Radix と API が近いが完全互換ではないため、Select / Dialog / Popover など interactive component の story と island 境界を再確認する必要がある。
- Base UI 採用後も React component であることは変わらない。Astro corporate-site では ADR-0008 の `client:*` ガードを継続しないと、interactive component が静的 HTML だけで表示される footgun が残る。

### 影響範囲

- `packages/ui` への影響: `components.json`、shadcn 生成 component、Storybook story、公開入口の再調整
- `apps/corporate-site` への影響: `@kufu/ui` consume 時の静的描画 / island 境界の確認
- `context` への影響: shadcn primitive 基盤を Base UI 優先にする運用契約の追記候補
- `e2e` への影響: interactive component を導入する issue で必要に応じて追加検証

## 実装・運用への反映

- spec 更新要否: 要。#6 の実装差分と PR 説明で `packages/ui` の Base UI 移行を明示する。
- context / AI 向け設定更新要否: 要。`context/component-design.md` または `context/engineering.md` に「shadcn component は Base UI 版を優先し、直接 app に primitive import を散在させない」旨を追記する。

## 関連ドキュメント / チケット

- [ADR-0007](0007-design-token-architecture.md): shadcn semantic token を維持する方針
- [ADR-0008](0008-astro-react-island-policy.md): React component の Astro static rendering / island 境界
- [context/component-design.md](../context/component-design.md): shared primitive / shared pattern の配置
- [context/engineering.md](../context/engineering.md): Storybook review / quality gate
- [issue #6](https://github.com/Fukuemon/kufu-apps/issues/6): Storybook / component catalog の決定経緯
