import { createContext, useContext } from "react";

/** `FormField` が、中の入力欄に渡す値。 */
type FormFieldControl = {
  /** 入力欄の `id`。見出しの `htmlFor` と同じ値である。 */
  controlId: string;
  /** 補足の文と誤りの文の `id` を空白で並べた値。どちらも無いときは `undefined`。 */
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
};

const FormFieldContext = createContext<FormFieldControl | null>(null);

type ControlProps = {
  id?: string | undefined;
  "aria-describedby"?: string | undefined;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
  required?: boolean | undefined;
};

/**
 * 入力欄の `id`、`aria-describedby`、`aria-invalid`、`required` を決める。
 * `FormField` の中にあるときは、`FormField` の値を足す。呼び出す側が渡した値があれば、それを先にする。
 * `FormField` の外では、渡された値をそのまま返す。
 */
function useFormFieldControl(props: ControlProps): ControlProps {
  const field = useContext(FormFieldContext);
  if (!field) {
    return {
      id: props.id,
      "aria-describedby": props["aria-describedby"],
      "aria-invalid": props["aria-invalid"],
      required: props.required,
    };
  }
  const describedBy = [props["aria-describedby"], field.describedBy]
    .filter(Boolean)
    .join(" ");
  return {
    id: props.id ?? field.controlId,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": props["aria-invalid"] ?? (field.invalid ? true : undefined),
    required: props.required ?? (field.required ? true : undefined),
  };
}

export { FormFieldContext, useFormFieldControl };
