import { useId } from "react";
import type * as React from "react";

import { FormFieldContext } from "./form-field-context.js";
import { Label } from "./label.js";
import { Tag } from "./tag.js";

type FormFieldProps = Omit<React.ComponentProps<"div">, "className"> & {
  label: React.ReactNode;
  /** 見出しを結び付ける欄の `id`。省略すると、`FormField` が決めた `id` を欄に付ける。 */
  htmlFor?: string;
  /** 欄の下に出す補足の文。`aria-describedby` で欄に結び付ける。 */
  description?: React.ReactNode;
  /** 欄の下に出す誤りの文。あるとき、欄に `aria-invalid` を付け、`aria-describedby` で結び付ける。 */
  error?: React.ReactNode;
  /** 必須の欄にする。見出しの横に「必須」の印を出し、欄に `required` を付ける。 */
  required?: boolean;
  /** 任意の欄にする。見出しの横に「任意」の印を出す。`required` と同時に渡したときは、`required` を使う。 */
  optional?: boolean;
};

/**
 * 入力欄に、見出し、補足の文、誤りの文、必須と任意の印を添える枠。
 * 欄（`Input`、`Select`、`Textarea`）は `children` に渡す。属性は React の context で渡すので、欄は同じ React の木の中に置く。
 */
function FormField({
  label,
  htmlFor,
  description,
  error,
  required = false,
  optional = false,
  children,
  ...props
}: FormFieldProps) {
  const generatedId = useId();
  const controlId = htmlFor ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <FormFieldContext.Provider
      value={{ controlId, describedBy, invalid: Boolean(error), required }}
    >
      <div data-slot="form-field" className="grid gap-2" {...props}>
        <Label htmlFor={controlId}>
          {label}
          {required ? (
            <Tag size="sm" tone="required">
              必須
            </Tag>
          ) : optional ? (
            <Tag size="sm" tone="optional">
              任意
            </Tag>
          ) : null}
        </Label>
        {children}
        {description ? (
          <p id={descriptionId} className="text-caption text-text-secondary">
            {description}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-caption font-medium text-danger">
            {error}
          </p>
        ) : null}
      </div>
    </FormFieldContext.Provider>
  );
}

export { FormField };
export type { FormFieldProps };
