import type * as React from "react";

import { useFormFieldControl } from "./form-field-context.js";

type TextareaProps = Omit<React.ComponentProps<"textarea">, "className">;

/** 複数行の文字の入力欄。高さは内容に合わせて伸びる。誤りの状態は `aria-invalid` で表す。`FormField` の中では、`id` と関連付けの属性を `FormField` から受ける。 */
function Textarea(props: TextareaProps) {
  const control = useFormFieldControl(props);
  return (
    <textarea
      data-slot="textarea"
      className="flex field-sizing-content min-h-36 w-full rounded-lg border border-field bg-transparent px-3.5 py-3.5 text-body-dense leading-[25px] transition-colors placeholder:text-text-secondary focus-ring disabled:cursor-not-allowed disabled:bg-field/50 disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20"
      {...props}
      {...control}
    />
  );
}

export { Textarea };
export type { TextareaProps };
