import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light" | "dark" | "danger";
type Size = "sm" | "md" | "lg" | "xl";

/**
 * Rounded, tactile buttons. Arrow icons passed as children slide on hover via the
 * `group` class (see `[&_svg]` rules). `xl` is the one-handed mobile size used on
 * profiles and field-sales screens.
 */
const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-xl text-center font-semibold leading-tight tracking-tight transition-[transform,background-color,color,border-color,box-shadow] duration-200 ease-out select-none disabled:pointer-events-none disabled:opacity-60 active:scale-[0.985] [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:translate-x-0.5";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-ink shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_8px_24px_-12px_rgb(255_139_61/0.8)] hover:bg-accent-deep",
  secondary: "border border-ink/20 bg-white/60 text-ink hover:border-ink hover:bg-ink hover:text-cream",
  ghost: "text-ink underline decoration-ink/30 underline-offset-[6px] hover:decoration-accent-deep",
  light: "border border-cream/25 text-cream hover:border-cream hover:bg-cream hover:text-ink",
  dark: "bg-ink text-cream hover:bg-ink-soft",
  danger: "border border-red-700/30 text-red-800 hover:bg-red-700 hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-4 py-2 text-sm",
  md: "min-h-12 px-6 py-3 text-[15px]",
  lg: "min-h-14 px-7 py-4 text-base",
  xl: "min-h-16 w-full px-6 py-4 text-lg rounded-2xl",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return cn(base, variants[variant], variant === "ghost" ? "min-h-0 px-0 py-0" : sizes[size], className);
}

type StyleProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function ButtonLink({
  variant,
  size,
  className,
  children,
  href,
  ...rest
}: StyleProps & Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children">) {
  const classes = buttonClasses({ variant, size, className });
  if (typeof href === "string" && /^(https?:|mailto:|sms:|tel:)/i.test(href)) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  type = "button",
  ...rest
}: StyleProps & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
    </button>
  );
}
