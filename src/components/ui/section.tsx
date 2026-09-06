import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

type Tone = "cream" | "cream-deep" | "ink" | "brand";

const tones: Record<Tone, string> = {
  cream: "bg-cream text-ink",
  "cream-deep": "bg-cream-deep text-ink",
  ink: "bg-ink text-cream grain",
  brand: "bg-brand text-cream grain",
};

export function Section({
  children,
  tone = "cream",
  id,
  className,
  containerSize,
  padding = "default",
}: {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
  containerSize?: "default" | "narrow" | "wide";
  padding?: "default" | "tight" | "loose";
}) {
  const pad = {
    tight: "py-16 sm:py-24",
    default: "py-24 sm:py-32",
    loose: "py-28 sm:py-40",
  }[padding];

  return (
    <section id={id} className={cn(tones[tone], pad, "scroll-mt-20", className)}>
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}

/**
 * Editorial section heading: a mono index/eyebrow on a hairline, then a large
 * display headline. Use `<span className="em">` inside `title` for the serif accent.
 */
export function SectionHeading({
  eyebrow,
  index,
  title,
  lead,
  align = "left",
  tone = "dark",
  as: Tag = "h2",
  className,
  size = "default",
}: {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2" | "h3";
  className?: string;
  size?: "default" | "large";
}) {
  const isLight = tone === "light";
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-4xl", className)}>
      {eyebrow ? (
        <div
          className={cn(
            "label mb-8 flex items-center gap-3 pt-4",
            isLight ? "rule-light text-mist" : "rule text-stone",
            align === "center" && "justify-center",
          )}
        >
          {index ? <span className={isLight ? "text-accent" : "text-brand"}>{index}</span> : null}
          <span>{eyebrow}</span>
        </div>
      ) : null}
      <Tag
        className={cn(
          "font-display font-semibold tracking-[-0.03em] text-balance",
          Tag === "h1"
            ? "text-[2.75rem] leading-[0.98] sm:text-6xl lg:text-7xl"
            : size === "large"
              ? "text-4xl leading-[1] sm:text-5xl lg:text-6xl"
              : "text-[2.1rem] leading-[1.02] sm:text-4xl lg:text-[3.25rem]",
        )}
      >
        {title}
      </Tag>
      {lead ? (
        <p
          className={cn(
            "mt-6 max-w-2xl text-lg leading-relaxed text-pretty",
            align === "center" && "mx-auto",
            isLight ? "text-mist" : "text-stone",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
