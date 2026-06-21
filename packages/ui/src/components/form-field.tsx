import * as React from "react";

import { Label } from "./label.js";
import { cn } from "#lib/utils";

function FormField({
  className,
  label,
  htmlFor,
  description,
  error,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  label: React.ReactNode;
  htmlFor?: string;
  description?: React.ReactNode;
  error?: React.ReactNode;
}) {
  return (
    <div
      data-slot="form-field"
      className={cn("grid gap-2", className)}
      {...props}
    >
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      {error ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { FormField };
