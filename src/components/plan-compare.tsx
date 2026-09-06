import { plans } from "@/lib/services";
import { cn } from "@/lib/utils";

const rows: Array<{ label: string; gbp: string; website: string; growth: string }> = [
  { label: "Google Business Profile", gbp: "Yes", website: "—", growth: "Yes" },
  { label: "Website (up to 5 pages)", gbp: "—", website: "Yes", growth: "Yes" },
  { label: "Review stand", gbp: "Yes", website: "—", growth: "Yes" },
  { label: "Smart business card", gbp: "—", website: "—", growth: "Yes" },
  { label: "Monthly progress call", gbp: "—", website: "—", growth: "30 min" },
  { label: "Starting term", gbp: "Month to month", website: "6 months", growth: "6 months" },
  { label: "Monthly price", gbp: plans.gbp.priceLabel, website: plans.website.priceLabel, growth: plans.growth.priceLabel },
];

export function PlanCompare() {
  return (
    <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
      <div className="hidden grid-cols-4 gap-px bg-ink/10 md:grid">
        <div className="bg-cream-deep p-5">
          <p className="label text-stone">Compare</p>
        </div>
        {([plans.gbp, plans.website, plans.growth] as const).map((plan) => (
          <div key={plan.id} className={cn("bg-white p-5", plan.popular && "bg-ink text-cream")}>
            <p className={cn("label", plan.popular ? "text-accent" : "text-brand")}>{plan.name}</p>
            <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em]">{plan.priceLabel}</p>
          </div>
        ))}
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <div className="bg-cream-deep px-5 py-4 text-sm font-medium">{row.label}</div>
            <div className="bg-white px-5 py-4 text-sm text-stone">{row.gbp}</div>
            <div className="bg-white px-5 py-4 text-sm text-stone">{row.website}</div>
            <div className="bg-ink px-5 py-4 text-sm text-cream">{row.growth}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 p-5 md:hidden">
        {([plans.gbp, plans.website, plans.growth] as const).map((plan) => (
          <article key={plan.id} className={cn("rounded-2xl border border-ink/10 p-5", plan.popular && "border-ink bg-ink text-cream")}>
            <p className={cn("label", plan.popular ? "text-accent" : "text-brand")}>{plan.name}</p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">{plan.priceLabel}/mo</p>
            <ul className="mt-4 grid gap-2 text-sm">
              {rows.slice(0, -1).map((row) => {
                const value = plan.id === "gbp" ? row.gbp : plan.id === "website" ? row.website : row.growth;
                if (value === "—") return null;
                return (
                  <li key={row.label} className={plan.popular ? "text-mist" : "text-stone"}>
                    <span className={plan.popular ? "text-cream" : "text-ink"}>{row.label}:</span> {value}
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
