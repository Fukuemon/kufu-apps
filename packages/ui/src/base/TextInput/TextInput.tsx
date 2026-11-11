import type * as React from "react";

import { useFormFieldControl } from "../FormField/FormFieldContext.js";

type TextInputProps = Omit<React.ComponentProps<"input">, "className">;

/** 1 行の文字の入力欄。誤りの状態は `aria-invalid` で表す。`FormField` の中では、`id` と関連付けの属性を `FormField` から受ける。 */
function TextInput(props: TextInputProps) {
  const control = useFormFieldControl(props);
  return (
    <input
      data-slot="text-input"
      className="h-12 w-full min-w-0 rounded-lg border border-field bg-transparent px-3.5 py-3.5 text-body-dense leading-5 transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-label file:font-medium file:text-text placeholder:text-text-secondary enabled:not-aria-invalid:hover:border-text focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-50 aria-invalid:border-danger"
      {...props}
      {...control}
    />
  );
}

export { TextInput };
export type { TextInputProps };
