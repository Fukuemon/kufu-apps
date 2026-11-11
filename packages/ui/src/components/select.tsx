import type * as React from "react";

import { useFormFieldControl } from "./form-field-context.js";

type SelectProps = Omit<
  React.ComponentProps<"select">,
  "className" | "multiple"
>;

/**
 * 決まった選択肢から 1 つを選ぶ欄。ブラウザの `select` を使い、標準の矢印を消して、右に矢印の印を置く。
 * 選択肢は `option` を `children` に渡す。値が空の `option` を選んでいる間は、文字を補足の色で出す。
 * 幅は親の幅いっぱいに広がる。誤りの状態は `aria-invalid` で表す。`FormField` の中では、`id` と関連付けの属性を `FormField` から受ける。
 */
function Select({ children, ...props }: SelectProps) {
  const control = useFormFieldControl(props);
  return (
    <span data-slot="select" className="relative inline-grid w-full">
      <select
        className="peer h-12 w-full min-w-0 appearance-none rounded-lg border border-field bg-transparent py-3.5 pr-10 pl-3.5 text-base leading-5 text-text transition-colors outline-none focus-visible:border-focus-outline focus-visible:ring-3 focus-visible:ring-focus-halo/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 [&:has(option[value='']:checked)]:text-text-secondary"
        {...props}
        {...control}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-text-secondary peer-disabled:opacity-50"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}

export { Select };
export type { SelectProps };
