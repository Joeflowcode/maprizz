import { MarketingShell } from "@/components/layout/marketing-shell";
import { PageHero } from "@/components/marketing/sections";
import { AuditBullets, AuditForm } from "@/components/forms/audit-form";

export default async function AuditPage({
  searchParams,
}: PageProps<"/audit">) {
  const params = await searchParams;
  const plan = typeof params.plan === "string" ? params.plan : "unsure";
  const defaultInterest =
    plan === "gbp" || plan === "website" || plan === "growth" ? plan : "unsure";

  return (
    <MarketingShell>
      <PageHero
        label="Free business audit"
        title="See how easy your business is to find, contact and review."
        description="Tell us where to look. We'll reply with what's working, what isn't, and what to fix first."
      />
      <section className="bg-cream pb-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
          <AuditBullets />
          <AuditForm defaultInterest={defaultInterest} />
        </div>
      </section>
    </MarketingShell>
  );
}
