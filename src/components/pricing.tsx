import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { packageList } from "@/lib/packages";
import { cn } from "@/lib/utils";

export function PricingCards({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
      {packageList.map((pkg) => {
        const featured = Boolean(pkg.popular);
        return (
          <article
            key={pkg.id}
            className={cn(
              "relative flex flex-col rounded-3xl p-7 sm:p-8",
              featured
                ? "grain bg-ink text-cream shadow-[0_40px_80px_-40px_rgb(22_18_14/0.6)] lg:-my-3 lg:py-11"
                : "border border-ink/10 bg-white text-ink",
            )}
          >
            {featured ? (
              <span className="label absolute right-6 top-6 rounded-full bg-accent px-3 py-1.5 text-ink">Most popular</span>
            ) : null}
            <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">{pkg.name}</h3>
            <p className={cn("mt-2 text-[15px]", featured ? "text-mist" : "text-stone")}>{pkg.tagline}</p>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-5xl font-semibold tracking-[-0.04em]">{pkg.priceLabel}</span>
              <span className={cn("text-sm", featured ? "text-mist" : "text-stone")}>one time</span>
            </p>
            <ul className={cn("mt-7 grid gap-2.5 text-[15px]", compact && "gap-2")}>
              {pkg.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className={cn("mt-0.5 h-4 w-4 shrink-0", featured ? "text-accent" : "text-brand")} aria-hidden="true" />
                  <span className={featured ? "text-cream/90" : "text-ink/90"}>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-2 lg:mt-auto">
              <ButtonLink href={`/order?package=${pkg.id}`} variant={featured ? "primary" : "dark"} size="lg" className="w-full">
                {pkg.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </article>
        );
      })}
    </div>
  );
}
