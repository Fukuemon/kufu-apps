import { clsx } from "clsx";
import type * as React from "react";

/**
 * ボタンの面の種類。default は hover で面を薄くする塗りで、cta は問い合わせへの導線の塗りで、面の色を変えない。
 */
type ButtonVariant = "default" | "cta";

/**
 * ボタンの大きさ。default は 48px の高さの汎用のボタンである。
 * cta- の 4 つは、問い合わせへの導線の大きさで、最小の高さは sm が 40px、md が 48px、lg が 52px、hero が 54px である。
 */
type ButtonSize = "default" | "cta-sm" | "cta-md" | "cta-lg" | "cta-hero";

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClassName: Record<ButtonVariant, string> = {
  default: "bg-primary text-text-inverse hover:bg-primary/80",
  cta: "bg-primary text-text-inverse",
};

// cta- の大きさのうち、リンクで使う 3 つは hover で全体を薄くする。md は送信のボタンで使い、hover で変えない
const sizeClassName: Record<ButtonSize, string> = {
  default:
    "h-12 gap-2.5 rounded-8 border-transparent px-[22px] text-label leading-5 font-medium",
  "cta-sm":
    "h-auto min-h-10 gap-2 rounded-4 border-transparent px-5 text-label font-semibold hover:opacity-90",
  "cta-md":
    "h-auto min-h-12 gap-2 rounded-4 border-transparent px-5 text-label font-semibold",
  "cta-lg":
    "h-auto min-h-13 gap-3 rounded-4 border-transparent px-6 text-label font-semibold hover:opacity-90",
  "cta-hero":
    "h-auto min-h-[3.375rem] gap-0 rounded-4 border-primary px-6 text-label font-medium hover:opacity-90",
};

/** Button と同じ見た目のクラス名を返す。リンクのようにボタンでない要素を、ボタンの見た目にするときに使う。 */
function buttonClassName({
  variant = "default",
  size = "default",
}: ButtonStyleOptions = {}) {
  return clsx(
    "inline-flex shrink-0 items-center justify-center border bg-clip-padding whitespace-nowrap transition-all outline-none select-none",
    "focus-visible:border-focus-outline focus-visible:ring-3 focus-visible:ring-focus-halo/50",
    "active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50",
    variantClassName[variant],
    sizeClassName[size],
  );
}

type ButtonProps = Omit<React.ComponentProps<"button">, "className"> &
  ButtonStyleOptions;

/** 操作のボタン。type のデフォルトは button である。 */
function Button({ variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      type={type}
      className={buttonClassName({ variant, size })}
      {...props}
    />
  );
}

export { Button, buttonClassName };
export type { ButtonProps, ButtonSize, ButtonVariant };
