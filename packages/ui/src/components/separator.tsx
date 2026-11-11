import { clsx } from "clsx";
import type * as React from "react";

type SeparatorProps = Omit<
  React.ComponentProps<"hr">,
  "className" | "children"
> & {
  /** 線の向き。vertical は、横に並べた要素の間に、親の高さの縦の線を引く。 */
  orientation?: "horizontal" | "vertical";
};

/** 内容の区切りの線。 */
function Separator({ orientation = "horizontal", ...props }: SeparatorProps) {
  return (
    <hr
      data-slot="separator"
      aria-orientation={orientation}
      className={clsx(
        "shrink-0 overflow-visible border-0 bg-divider",
        orientation === "horizontal"
          ? "h-px w-full"
          : "h-auto w-px self-stretch",
      )}
      {...props}
    />
  );
}

export { Separator };
export type { SeparatorProps };
