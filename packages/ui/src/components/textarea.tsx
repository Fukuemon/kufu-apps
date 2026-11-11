import * as React from "react";

import { cn } from "#lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-36 w-full rounded-lg border border-field bg-transparent px-3.5 py-3.5 text-base leading-[25px] transition-colors outline-none placeholder:text-text-secondary focus-visible:border-focus-outline focus-visible:ring-3 focus-visible:ring-focus-halo/50 disabled:cursor-not-allowed disabled:bg-field/50 disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 md:text-sm dark:bg-field/30 dark:disabled:bg-field/80 dark:aria-invalid:border-danger/50 dark:aria-invalid:ring-danger/40",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
