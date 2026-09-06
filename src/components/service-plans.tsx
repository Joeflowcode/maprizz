import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { planList } from "@/lib/services";
import { cn } from "@/lib/utils";

/** Monthly retainer cards. Mirrors PricingCards so the two grids read as one system. */
export function ServicePlans({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
      {planList.map((plan) => {
        const featured = Boolean(plan.popular);
        return (
          <article
            key={plan.id}
            id={plan.id === "gbp" ? "google" : plan.id}
            className={cn(
              "relative flex scroll-mt-28 flex-col rounded-3xl p-7 sm:p-8",
              featured ? "grain bg-ink text-cream shadow-[0_40px_80px_-40px_rgb(22_18_14/0.6)] lg:-my-3 lg:py-11" : "border border-ink/10 bg-white text-ink",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <p className={cn("label", featured ? "text-accent" : "text-brand")}>Monthly plan</p>
              {featured ? <span className="label rounded-full bg-accent px-3 py-1.5 text-ink">Best value</span> : null}
            </div>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.02em]">{plan.name}</h3>
            <p className={cn("mt-2 text-[15px] leading-relaxed", featured ? "text-mist" : "text-stone")}>{plan.tagline}</p>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-5xl font-semibold tracking-[-0.04em]">{plan.priceLabel}</span>
              <span className={cn("text-sm", featured ? "text-mist" : "text-stone")}>/ month</span>
            </p>
            <p className={cn("mt-2 text-xs leading-relaxed", featured ? "text-mist" : "text-stone")}>{plan.terms}</p>
            <ul className={cn("mt-7 grid gap-2.5 text-[15px]", compact && "gap-2")}>
              {plan.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className={cn("mt-0.5 h-4 w-4 shrink-0", featured ? "text-accent" : "text-brand")} aria-hidden="true" />
                  <span className={featured ? "text-cream/90" : "text-ink/90"}>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-2 lg:mt-auto">
              <ButtonLink href={`/subscribe?plan=${plan.id}`} variant={featured ? "primary" : "dark"} size="lg" className="w-full">
                {plan.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <p className={cn("mt-3 text-center text-xs", featured ? "text-mist" : "text-stone")}>
                First charge today, then every month.{" "}
                <a href={`/audit?plan=${plan.id}`} className="underline underline-offset-4 hover:text-ink">
                  Or start with a free audit
                </a>
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
