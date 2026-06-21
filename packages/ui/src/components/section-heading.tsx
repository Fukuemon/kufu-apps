import * as React from "react";

import { cn } from "#lib/utils";

function SectionHeading({
  className,
  eyebrow,
  title,
  description,
  level = 2,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & {
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
        "grid gap-3",
        align === "center" &&
          "mx-auto max-w-3xl justify-items-center text-center",
        className,
      )}
      {...props}
    >
      {eyebrow ? (
        <p className="text-sm font-medium tracking-normal text-primary">
          {eyebrow}
        </p>
      ) : null}
      <HeadingTag className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
        {title}
      </HeadingTag>
      {description ? (
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { SectionHeading };
