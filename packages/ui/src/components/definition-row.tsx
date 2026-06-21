import * as React from "react";

import { cn } from "#lib/utils";

function DefinitionRow({
  className,
  term,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  term: React.ReactNode;
}) {
  return (
    <div
      data-slot="definition-row"
      className={cn(
        "grid gap-1 border-b border-border py-3 text-sm sm:grid-cols-[12rem_1fr] sm:gap-6",
        className,
      )}
      {...props}
    >
      <dt className="font-medium text-muted-foreground">{term}</dt>
      <dd className="text-foreground">{children}</dd>
    </div>
  );
}

export { DefinitionRow };
