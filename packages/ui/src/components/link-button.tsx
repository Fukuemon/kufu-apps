import * as React from "react";

import { buttonVariants } from "#components/button";
import { cn } from "#lib/utils";

function LinkButton({
  className,
  variant = "default",
  size = "default",
  disabled = false,
  ...props
}: React.ComponentProps<"a"> &
  Parameters<typeof buttonVariants>[0] & {
    disabled?: boolean;
  }) {
  return (
    <a
      data-slot="link-button"
      data-disabled={disabled ? "" : undefined}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : props.tabIndex}
      className={cn(
        buttonVariants({ variant, size }),
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { LinkButton };
