import * as React from "react";

import { cn } from "#lib/utils";

function SectionHeading({
  className,
  number,
  eyebrow,
  title,
  description,
  level = 2,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & {
  number?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  level?: 1 | 2 | 3;
  align?: "start" | "center";
}) {
  const HeadingTag = `h${level}` as const;

  return (
    <div
      data-slot="section-heading"
      data-align={align}
      className={cn(
        "grid w-full max-w-[760px] gap-[18px]",
        align === "center" &&
          "mx-auto max-w-3xl justify-items-center text-center",
        className,
      )}
      {...props}
    >
      {number || eyebrow ? (
        <div className="flex items-end gap-[18px]">
          {number ? (
            <p className="font-mono text-[34px] leading-[44px] font-medium text-foreground">
              {number}
            </p>
          ) : null}
          {eyebrow ? (
            <p className="pb-1 font-mono text-[11px] leading-4 font-medium tracking-[2.2px] text-primary uppercase">
              {eyebrow}
            </p>
          ) : null}
        </div>
      ) : null}
      <HeadingTag className="font-heading text-[42px] leading-[60px] font-semibold text-foreground">
        {title}
      </HeadingTag>
      {description ? (
        <p className="max-w-[620px] text-[15px] leading-[1.75] text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { SectionHeading };
