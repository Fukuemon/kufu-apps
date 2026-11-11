import type * as React from "react";

type LabelProps = Omit<React.ComponentProps<"label">, "className">;

/** 入力欄の見出し。`htmlFor` で欄と結び付ける。 */
function Label(props: LabelProps) {
  return (
    <label
      data-slot="label"
      className="flex items-center gap-2 text-label font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
      {...props}
    />
  );
}

export { Label };
export type { LabelProps };
