# ADR-0019: shadcn の primitive の基盤に Base UI を採る

## Status

[ADR-0020](0020-ui-components-native-elements.md) に置換

## Context

- `packages/ui` は shadcn/ui を component の source を配る手段として使い、`components.json` は当初 `radix-nova` を指定していた。
- shadcn/ui は、CLI で component の source を workspace に取り込み、各 project が自分の component library として編集する前提である。
  - そのため、primitive の基盤の選択は、依存の package だけでなく、生成される component の API、markup、state の attribute、story、Astro での使い方に影響する。
- shadcn/ui の docs は、Radix UI と Base UI の両方を component library の基盤として扱う。
  - Base UI 用の component の docs と、Radix と Base UI の比較の UI を提供している。
  - 新しい project では、`shadcn create` で Radix と Base UI を選べる。
- Base UI は、Radix、Floating UI、Material UI の team が提供する unstyled な React の component library である。
  - ARIA Authoring Practices Guide と WCAG 2.2 を前提にした accessibility を特徴にする。
  - Tailwind、CSS Modules、CSS-in-JS などで自由にスタイルを当てられることを特徴にする。
  - Combobox、Autocomplete などの複雑な component を特徴にする。
- Radix UI Primitives は、実績のある unstyled で accessible な React の primitive である。WAI-ARIA、キーボードの操作、focus の管理が成熟している。
  - 一方で、新しく shadcn の catalog を育てる段階では、shadcn が Base UI への対応を公式の導線として持ち始めていることを優先できる。
- corporate-site は、表示だけの React の component を Astro で静的に描画し、インタラクティブな primitive だけを `client:*` の island にする。Base UI へ移っても、この方針は保つ必要がある。
  ADR-0021: [Astro と React island の方針](0021-astro-react-island-policy.md)

## Decision

1. **shadcn の primitive の基盤に Base UI を採る。**
   - 今後 `packages/ui` に shadcn の component を足すときと生成し直すときは、Base UI 版を第一の候補にする。
2. **Storybook の最初の catalog の対象を Base UI 版へ移す。**
   - `components.json` を、Base UI を前提にした shadcn の設定に変える。
   - `Button`、`Badge/Tag`、`Input`、`Select`、`Separator` は、Base UI 版の shadcn の source から作る。
   - `Card`、`Textarea`、`Label` のように primitive に依存しない component も、同じ shadcn の source の持ち方で catalog に置く。
3. **shadcn の source を自分で持つ方式を保つ。**
   - Base UI を採っても、`@base-ui/react` を app から直接あちこちで import しない。
   - shadcn の CLI で `packages/ui/src/components/` に取り込んだ source を `@kufu/ui` の component の基準として編集し、token に合わせる。
4. **表示だけの component とインタラクティブな component の境界は、ADR-0021 を引き継ぐ。**
   - Base UI の component も React の component なので、表示だけの component は Astro の静的な描画で使う。
   - Dialog、Select、Popover、Tooltip のように client での操作が要る component は、`client:*` の island にする。
5. **Base UI への移行の完了条件をはっきりさせる。** 少なくとも次を確認する。
   - `components.json` が、Base UI を前提にした shadcn の設定になっている。
   - `Button`、`Badge/Tag`、`Card`、`Label/FormField`、`Input`、`Select`、`Textarea`、`Separator` が、Base UI 版か、Base UI 版の shadcn の source から作られている。
   - `pnpm --filter @kufu/ui` の `lint`、`typecheck`、`build`、`storybook:build` が通る。
   - corporate-site で静的に描画する component と island にする component の境界が、pull request に残っている。

## Considered Options

| 選択肢                                                                                      | 強み                                                                                                   | 弱み                                                                                                                            |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** shadcn の primitive の基盤に Base UI を採り、最初の catalog から Base UI 版にする | shadcn が今サポートする Base UI の導線に揃う。Base UI の複雑な component を将来の実装で使いやすい      | 既存の `radix-nova` の component を生成し直し、差分を調整する作業が要る。Radix と完全には互換でない                             |
| Radix UI を使い続ける                                                                       | 成熟しており、今の `radix-nova` の設定とも合う。短期の差分が最小                                       | shadcn の新しい project の導線が Base UI も同等に扱う中で、これから作る共有の catalog の基盤を古い前提に固定する理由が弱い      |
| Radix UI から Base UI へ段階的に移る                                                        | Storybook の catalog を Radix のまま始め、後の issue で Base UI に寄せるので、移行のリスクを分けられる | catalog の初期の段階で primitive の方針が固まらず、後で story と API の差分を調整し直す手戻りが大きい                           |
| component ごとに Radix と Base UI を混ぜる                                                  | 個別に最適にしやすい                                                                                   | 生成される source の API、data attribute、story の書き方が分かれ、`packages/ui` の保守性が落ちる                                |
| Base UI を直接 import して独自の wrapper を作る                                             | -                                                                                                      | CLI が生成する source を持つ shadcn の利点を捨てる。token に合わせて編集できる component の基準を repo の中に持つ方針と合わない |

## Consequences

### Positive

- 新しい共有の UI の catalog を、shadcn が今サポートする Base UI の導線に揃えられる。
- Base UI の複雑な component と edge case への対応を、将来の form、navigation、overlay の実装で使いやすい。
- shadcn の「同じ抽象の API で、primitive だけが違う」という方向に合わせるので、component を足すときに docs と例を参照しやすい。

### Negative

- 既存の `radix-nova` の component を生成し直し、差分を調整する移行の作業が生じる。
- Base UI は Radix と API が近いが、完全には互換でない。Select、Dialog、Popover のようなインタラクティブな component の story と island の境界を確認し直す必要がある。
- Base UI を採った後も、React の component であることは変わらない。
  - corporate-site で ADR-0021 の `client:*` の規則を続けないと、インタラクティブな component が静的な HTML だけで表示される誤りが残る。
