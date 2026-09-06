import { MarketingShell } from "@/components/layout/marketing-shell";
import {
  CtaBand,
  FaqList,
  PageHero,
  SectionLabel,
  ServicePlanGrid,
} from "@/components/marketing/sections";
import { ButtonLink } from "@/components/ui/button";
import { servicesFaqs } from "@/lib/catalog";

export default function ServicesPage() {
  return (
    <MarketingShell>
      <PageHero
        label="Monthly plans"
        title="Get found. Get trusted. Get chosen."
        description="Your Google profile, website, and reviews should make it easier to choose your business. Get a clear monthly scope and one person to call when something needs attention."
      >
        <ButtonLink href="/audit">Get My Free Audit</ButtonLink>
        <ButtonLink href="#plans" variant="secondary">
          See plans
        </ButtonLink>
      </PageHero>

      <section id="plans" className="scroll-mt-20 bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionLabel>01 Plans</SectionLabel>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">
            Pick the piece you&apos;re missing, or hand us all of it.
          </h2>
          <p className="mt-4 text-lg text-stone">
            Setup is included. Google Foundations is month to month. Website and Local Growth plans have a 6-month initial term, then continue month to month. Prices are per business location.
          </p>
          <div className="mt-10">
            <ServicePlanGrid />
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-cream-deep py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionLabel>02 What we actually do</SectionLabel>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">
            Three things that decide whether a customer calls you or the next name down.
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Google Business Profile",
                copy: "We review the categories, services, hours, description, and contact details on your profile, then maintain it with the updates and real photos you provide.",
                bullets: [
                  "One business location",
                  "4 posts per month using your photos",
                  "Up to 20 review replies per month",
                  "One review stand and review-link setup",
                ],
              },
              {
                title: "A better website",
                copy: "A mobile-friendly website with clear service information and an easy way to call, request a quote, or reach your booking page. Build timing is agreed after we receive your content and access.",
                bullets: [
                  "Up to 5 pages in the initial website",
                  "Hosting + up to 2 small edits per month",
                  "Call, quote, and booking links included",
                  "You own the domain and content",
                ],
              },
              {
                title: "Local SEO",
                copy: "Useful service and service-area content, clear page titles, and technical basics that help customers and search engines understand your business. We prioritize real services and locations, rather than duplicate town pages.",
                bullets: [
                  "Service-area content within your page allowance",
                  "Page titles, structure, and mobile performance",
                  "Consistent business details",
                  "Reporting on available website and profile activity",
                ],
              },
            ].map((item) => (
              <article key={item.title} className="rounded-3xl border border-ink/10 bg-white/70 p-7">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-stone">{item.copy}</p>
                <ul className="mt-4 space-y-2 text-[15px] text-stone">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <SectionLabel>04 Questions</SectionLabel>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">
            Plain answers about plans.
          </h2>
          <div className="mt-8">
            <FaqList items={servicesFaqs} />
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Start with a free audit"
        title="Find out what's costing you customers."
        description="Request a free audit. We'll look at your Google listing and website and reply with the fixes that matter most, whether or not you buy a plan."
        primaryHref="/audit"
        primaryLabel="Get My Free Audit"
      />
    </MarketingShell>
  );
}
