import { clsx } from "clsx";
import type * as React from "react";

import {
  buttonClassName,
  type ButtonSize,
  type ButtonVariant,
} from "../Button/Button.js";

type LinkButtonProps = Omit<React.ComponentProps<"a">, "className"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** true なら、押せない見た目にし、`aria-disabled` を付けてタブの順から外す。 */
  disabled?: boolean;
};

/** ボタンの見た目のリンク。見た目の種類と大きさは Button と同じである。 */
function LinkButton({
  variant,
  size,
  disabled = false,
  ...props
}: LinkButtonProps) {
  return (
    <a
      data-slot="link-button"
      data-disabled={disabled ? "" : undefined}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : props.tabIndex}
      className={clsx(
        buttonClassName({ variant, size }),
        disabled && "pointer-events-none opacity-50",
      )}
      {...props}
    />
  );
}

export { LinkButton };
export type { LinkButtonProps };
