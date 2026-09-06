import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import type { ProductPackage, ServicePlan } from "@/lib/catalog";
import { products, servicePlans } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="label text-stone">{children}</p>;
}

export function ProductGrid({ highlight }: { highlight?: ProductPackage }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className={cn(
            "relative flex flex-col rounded-3xl border border-ink/10 bg-white/70 p-7 shadow-sm",
            highlight === product.id && "border-accent ring-1 ring-accent/30",
          )}
        >
          {product.badge ? (
            <span className="label absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-ink">
              {product.badge}
            </span>
          ) : null}
          <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">
            {product.name}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-stone">
            {product.description}
          </p>
          <p className="mt-6 font-display text-4xl font-semibold tracking-tight">
            {product.priceLabel}
            <span className="ml-2 text-base font-medium text-stone">
              {product.cadence}
            </span>
          </p>
          <ul className="mt-6 flex-1 space-y-2 text-base text-stone">
            {product.features.map((feature) => (
              <li key={feature} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <ButtonLink href={product.href} className="mt-8 w-full">
            {product.cta}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </article>
      ))}
    </div>
  );
}

export function ServicePlanGrid({ highlight }: { highlight?: ServicePlan }) {
  return (
    <div className="plan-grid">
      {servicePlans.map((plan) => (
        <article key={plan.id} className={cn("plan-card", plan.id === "growth" && "plan-featured", highlight === plan.id && "plan-selected")}>
          <p className="plan-tag">{plan.badge ?? "A focused starting point"}</p>
          <h3>{plan.name}</h3>
          <p className="plan-description">{plan.description}</p>
          <p className="plan-price">{plan.priceLabel}<span>{plan.cadence}</span></p>
          <p className="plan-terms">{plan.note}</p>
          <ButtonLink href={plan.href} variant={plan.id === "growth" ? "primary" : "secondary"} className="w-full">Get my free audit <ArrowRight size={17} aria-hidden="true" /></ButtonLink>
          <p className="plan-included">WHAT’S INCLUDED</p>
          <ul>{plan.features.map((feature) => <li key={feature}><Check size={17} aria-hidden="true" /><span>{feature}</span></li>)}</ul>
        </article>
      ))}
    </div>
  );
}

export function FaqList({
  items,
}: {
  items: ReadonlyArray<{ question: string; answer: string }>;
}) {
  return (
    <div className="divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-white/70">
      {items.map((item, index) => (
        <details key={item.question} className="group p-6 sm:p-7">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-lg font-semibold tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
            <span>
              <span className="label mr-3 text-stone">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.question}
            </span>
            <span className="faq-icon text-2xl leading-none text-accent">+</span>
          </summary>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({
  eyebrow = "Tap. Done.",
  title,
  description,
  primaryHref = "/order",
  primaryLabel = "Build My Tap Card",
  secondaryHref = "/demo",
  secondaryLabel = "Try the Demo",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="label text-mist">{eyebrow}</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/75">
          {description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={primaryHref} size="lg">
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href={secondaryHref} variant="light" size="lg">
            {secondaryLabel}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function LegalDocument({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-cream pb-20 pt-12">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionLabel>Legal</SectionLabel>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.04em]">
          {title}
        </h1>
        <p className="mt-3 text-stone">Last updated {updated}</p>
        <div className="prose-legal mt-10 space-y-8 text-base leading-relaxed text-stone [&_a]:font-semibold [&_a]:text-brand [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:border-t [&_h2]:border-ink/15 [&_h2]:pt-6 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-ink [&_p+p]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </section>
  );
}

export function PageHero({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-ink/10 bg-cream pb-12 pt-10 sm:pb-16 sm:pt-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-stone">
          {description}
        </p>
        {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  );
}

export function Ticker({ items }: { items: readonly string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-cream-deep py-4">
      <div className="ticker gap-10 whitespace-nowrap text-sm font-medium text-stone">
        {doubled.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}

export function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-brand underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}
