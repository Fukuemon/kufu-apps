import { clsx } from "clsx";
import type * as React from "react";

/** 印の大きさ。default は 30px の高さで、sm は入力の項目の横に置く小さな印である。 */
type BadgeSize = "default" | "sm";

/** 印の色の意味。default は主の色の塗りで、required は必須の印、optional は任意の印である。 */
type BadgeTone = "default" | "required" | "optional";

const sizeClassName: Record<BadgeSize, string> = {
  default:
    "h-[30px] rounded-[4px] border border-transparent px-3 py-1.5 text-xs font-medium leading-[18px]",
  sm: "h-auto rounded-[4px] border-0 px-1.5 py-[0.0625rem] text-[0.625rem] font-semibold leading-[1.4]",
};

const toneClassName: Record<BadgeTone, string> = {
  default: "bg-primary text-text-inverse",
  required: "bg-primary-tint font-mono tracking-[0.08em] text-primary",
  optional:
    "bg-text-secondary-tint font-mono tracking-[0.08em] text-text-secondary",
};

type BadgeProps = Omit<React.ComponentProps<"span">, "className"> & {
  size?: BadgeSize;
  tone?: BadgeTone;
};

/** 短い文字の印。 */
function Badge({ size = "default", tone = "default", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={clsx(
        "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap transition-all",
        "focus-visible:border-focus-outline focus-visible:ring-[3px] focus-visible:ring-focus-halo/50",
        toneClassName[tone],
        sizeClassName[size],
      )}
      {...props}
    />
  );
}

export { Badge };
export type { BadgeProps, BadgeSize, BadgeTone };
