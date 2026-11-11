import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "#lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap transition-all focus-visible:border-focus-outline focus-visible:ring-[3px] focus-visible:ring-focus-halo/50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-danger aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-text-inverse [a]:hover:bg-primary/80",
        secondary: "bg-surface-subtle text-text [a]:hover:bg-surface-subtle/80",
        destructive:
          "bg-danger/10 text-danger focus-visible:ring-danger/20 dark:bg-danger/20 dark:focus-visible:ring-danger/40 [a]:hover:bg-danger/20",
        outline:
          "border-divider text-text [a]:hover:bg-surface-subtle [a]:hover:text-text-secondary",
        ghost:
          "hover:bg-surface-subtle hover:text-text-secondary dark:hover:bg-surface-subtle/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-[30px] rounded-[4px] border border-transparent px-3 py-1.5 text-xs font-medium leading-[18px]",
        sm: "h-auto rounded-[4px] border-0 px-1.5 py-[0.0625rem] text-[0.625rem] font-semibold leading-[1.4]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
      size,
    },
  });
}

export { Badge, badgeVariants };
