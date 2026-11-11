import type * as React from "react";

type InputProps = Omit<React.ComponentProps<"input">, "className">;

/** 1 行の文字の入力欄。誤りの状態は `aria-invalid` で表す。 */
function Input(props: InputProps) {
  return (
    <input
      data-slot="input"
      className="h-12 w-full min-w-0 rounded-lg border border-field bg-transparent px-3.5 py-3.5 text-base leading-5 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text placeholder:text-text-secondary focus-visible:border-focus-outline focus-visible:ring-3 focus-visible:ring-focus-halo/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-field/50 disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 md:text-sm"
      {...props}
    />
  );
}

export { Input };
export type { InputProps };
