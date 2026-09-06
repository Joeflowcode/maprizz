import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-accent text-ink shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_8px_24px_-12px_rgb(255_139_61/0.8)] hover:bg-accent-deep",
  secondary:
    "border border-ink/20 bg-white/60 text-ink hover:border-ink hover:bg-ink hover:text-cream",
  ghost:
    "text-ink underline decoration-ink/30 underline-offset-[6px] hover:decoration-accent-deep",
  light:
    "border border-cream/25 text-cream hover:border-cream hover:bg-cream hover:text-ink",
  dark: "bg-ink text-cream hover:bg-ink-soft",
  danger:
    "border border-red-700/30 text-red-800 hover:bg-red-700 hover:text-white",
} as const;

const sizes = {
  sm: "min-h-10 px-4 py-2 text-sm",
  md: "min-h-12 px-6 py-3 text-base",
  lg: "min-h-14 px-7 py-4 text-base",
  xl: "min-h-16 w-full px-6 py-4 text-lg rounded-2xl",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return cn(
    "group inline-flex items-center justify-center gap-2.5 rounded-lg text-center font-semibold leading-tight tracking-tight transition-[transform,background-color,color,border-color,box-shadow] duration-200 ease-out select-none disabled:pointer-events-none disabled:opacity-60 active:scale-[0.985] [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:translate-x-0.5",
    variants[variant],
    variant === "ghost" ? "min-h-0 px-0 py-0" : sizes[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  href,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return (
    <Link
      href={href}
      className={buttonClass({ variant, size, className })}
      {...props}
    >
      {children}
    </Link>
  );
}
