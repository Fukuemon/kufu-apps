import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "#lib/utils";

const definitionRowVariants = cva("grid gap-1 border-border text-sm", {
  variants: {
    layout: {
      default: "border-b py-3 sm:grid-cols-[12rem_1fr] sm:gap-6",
      compact: "gap-3 border-t py-3.5 md:grid-cols-[6.5rem_1fr] md:gap-5",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

const definitionRowTermVariants = cva("", {
  variants: {
    layout: {
      default: "font-medium text-muted-foreground",
      compact:
        "font-mono text-[0.6875rem] font-normal leading-6 tracking-[0.12em] text-muted-foreground",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

const definitionRowValueVariants = cva("text-foreground", {
  variants: {
    layout: {
      default: "",
      compact: "leading-6",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

function DefinitionRow({
  className,
  term,
  children,
  layout = "default",
  ...props
}: React.ComponentProps<"div"> & {
  term: React.ReactNode;
} & VariantProps<typeof definitionRowVariants>) {
  return (
    <div
      data-slot="definition-row"
      className={cn(definitionRowVariants({ layout, className }))}
      {...props}
    >
      <dt className={cn(definitionRowTermVariants({ layout }))}>{term}</dt>
      <dd className={cn(definitionRowValueVariants({ layout }))}>{children}</dd>
    </div>
  );
}

export { DefinitionRow, definitionRowVariants };
