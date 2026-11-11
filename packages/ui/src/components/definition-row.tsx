import { clsx } from "clsx";
import type * as React from "react";

/** 行の並べ方。default は見出しを 12rem の列に置き、compact は 6.5rem の列に等幅の小さな見出しを置く。 */
type DefinitionRowLayout = "default" | "compact";

const rowClassName: Record<DefinitionRowLayout, string> = {
  default: "gap-1 border-b py-3 sm:grid-cols-[12rem_1fr] sm:gap-6",
  compact: "gap-3 border-t py-3.5 md:grid-cols-[6.5rem_1fr] md:gap-5",
};

const termClassName: Record<DefinitionRowLayout, string> = {
  default: "font-medium text-text-secondary",
  compact:
    "font-mono text-caption font-normal leading-6 tracking-[0.12em] text-text-secondary",
};

const valueClassName: Record<DefinitionRowLayout, string> = {
  default: "text-text",
  compact: "text-text leading-6",
};

type DefinitionRowProps = Omit<React.ComponentProps<"div">, "className"> & {
  term: React.ReactNode;
  layout?: DefinitionRowLayout;
};

/** 説明リストの 1 行。`dl` の中に置き、見出しを `dt`、値を `dd` で出す。 */
function DefinitionRow({
  term,
  children,
  layout = "default",
  ...props
}: DefinitionRowProps) {
  return (
    <div
      data-slot="definition-row"
      className={clsx("grid border-divider text-body", rowClassName[layout])}
      {...props}
    >
      <dt className={termClassName[layout]}>{term}</dt>
      <dd className={valueClassName[layout]}>{children}</dd>
    </div>
  );
}

export { DefinitionRow };
export type { DefinitionRowLayout, DefinitionRowProps };
