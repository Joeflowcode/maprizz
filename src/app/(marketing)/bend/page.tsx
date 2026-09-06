import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { ServicePlans } from "@/components/service-plans";
import { FinalCta } from "@/components/final-cta";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: `Local marketing in ${siteConfig.location.city}`,
  description: `Google Business Profile help, websites, local SEO, and review tools for businesses in ${siteConfig.location.city} and ${siteConfig.location.area}. Free audit from Maprizz.`,
  path: "/bend",
});

const towns = ["Bend", "Redmond", "Sisters", "Sunriver", "Prineville", "Madras", "La Pine", "Tumalo"];

const localPoints = [
  "Someone local looks at your listing — not a portal overseas.",
  "Plans are scoped for one location, with honest limits on pages, posts, and edits.",
  "Cards and review stands can be set up in person when that helps.",
  "No ranking guarantees. Google decides the map pack; we do the work that makes you easier to choose.",
];

export default function BendPage() {
  return (
    <>
      <section className="grain relative overflow-hidden bg-ink text-cream">
        <div className="surface-glow absolute inset-0" aria-hidden="true" />
        <Container size="wide" className="relative py-16 sm:py-24">
          <p className="label flex items-center gap-3 text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            {siteConfig.location.city} &amp; {siteConfig.location.area}
          </p>
          <h1 className="mt-7 max-w-4xl font-display text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
            Get found in {siteConfig.location.city}. <span className="text-accent">Stay easy to choose.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist text-pretty">
            Maprizz is based here. Google Business Profile management, websites, local SEO, and review tools for contractors, shops, and
            home-service businesses across Central Oregon.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/audit" size="lg">
              Get my free audit
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/about" variant="light" size="lg">
              Meet Joey
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Section tone="cream">
        <SectionHeading
          eyebrow="Service area"
          title="Central Oregon first. Cards nationwide."
          lead="Monthly plans are built for local businesses we can actually support. If you are outside this list, request an audit and we will say whether it is a fit."
        />
        <ul className="mt-12 flex flex-wrap gap-3">
          {towns.map((town) => (
            <li key={town} className="rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold">
              {town}
            </li>
          ))}
        </ul>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          {localPoints.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-white p-5 text-[15px] leading-relaxed">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cream-deep">
        <SectionHeading eyebrow="Plans" title="Same prices. Local delivery." />
        <div className="mt-14">
          <ServicePlans compact />
        </div>
      </Section>

      <FinalCta
        title="If you work here, start with the audit."
        body="Send your business name and city. You'll get a short list of what to fix on Google and the website — no score, no pitch deck."
      />
    </>
  );
}
