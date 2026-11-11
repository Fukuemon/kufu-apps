import type * as React from "react";

import { Label } from "./label.js";

type FormFieldProps = Omit<React.ComponentProps<"div">, "className"> & {
  label: React.ReactNode;
  /** 見出しを結び付ける欄の `id`。 */
  htmlFor?: string;
  /** 欄の下に出す補足の文。 */
  description?: React.ReactNode;
  /** 欄の下に出す誤りの文。`role="alert"` で読み上げる。 */
  error?: React.ReactNode;
};

/** 入力欄に、見出し、補足の文、誤りの文を添える枠。欄は `children` に渡す。 */
function FormField({
  label,
  htmlFor,
  description,
  error,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div data-slot="form-field" className="grid gap-2" {...props}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {description ? (
        <p className="text-sm text-text-secondary">{description}</p>
      ) : null}
      {error ? (
        <p className="text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { FormField };
export type { FormFieldProps };
