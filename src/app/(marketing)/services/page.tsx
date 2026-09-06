import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { ServicePlans } from "@/components/service-plans";
import { PlanCompare } from "@/components/plan-compare";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { planList, retainerFaqs, retainerHowItWorks } from "@/lib/services";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Google Foundations, Website & Local Growth Plans",
  description:
    "Monthly plans from Maprizz: Google Foundations ($299), Website + Local SEO ($599), or Local Growth ($799). Clear scope, setup included, one person to text.",
  path: "/services",
});

const deliverables = [
  {
    title: "Google Business Profile",
    body: "We review the categories, services, hours, description, and contact details on your profile, then maintain it with the updates and real photos you provide.",
    points: ["One business location", "4 posts per month using your photos", "Up to 20 review replies per month", "One review stand and review-link setup"],
  },
  {
    title: "A better website",
    body: "A mobile-friendly website with clear service information and an easy way to call, request a quote, or reach your booking page. Build timing is agreed after we receive your content and access.",
    points: ["Up to 5 pages in the initial website", "Hosting + up to 2 small edits per month", "Call, quote, and booking links included", "You own the domain and content"],
  },
  {
    title: "Local SEO",
    body: "Useful service and service-area content, clear page titles, and technical basics that help customers and search engines understand your business. We prioritize real services and locations, rather than duplicate town pages.",
    points: ["Service-area content within your page allowance", "Page titles, structure, and mobile performance", "Consistent business details", "Reporting on available website and profile activity"],
  },
];

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: planList.map((plan, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: `Maprizz ${plan.name}`,
      description: plan.tagline,
      provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      areaServed: "US",
      offers: {
        "@type": "Offer",
        price: (plan.monthly / 100).toFixed(2),
        priceCurrency: "USD",
        priceSpecification: { "@type": "UnitPriceSpecification", price: (plan.monthly / 100).toFixed(2), priceCurrency: "USD", billingIncrement: 1, unitCode: "MON" },
        url: `${siteConfig.url}/subscribe?plan=${plan.id}`,
      },
    },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <section className="grain relative overflow-hidden bg-ink text-cream">
        <div className="surface-glow absolute inset-0" aria-hidden="true" />
        <Container size="wide" className="relative py-16 sm:py-24">
          <p className="label flex items-center gap-3 text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            Monthly plans
          </p>
          <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h1 className="font-display text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.04em] text-balance sm:text-6xl lg:col-span-8 lg:text-7xl">
            Get found. Get trusted. <span className="text-accent">Get chosen.</span>
          </h1>
          <div className="lg:col-span-4 lg:pb-2">
            <p className="text-lg leading-relaxed text-mist text-pretty">
              Cards make it easy to reach you. These plans make sure that when someone looks you up, they like what they see. We run your Google presence and website every month so you can run the business.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ButtonLink href="/subscribe" size="lg">
                Start monthly billing
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="#plans" variant="light" size="lg">
                See plans
              </ButtonLink>
            </div>
          </div>
          </div>
        </Container>
      </section>

      <Section id="plans" tone="cream">
        <SectionHeading eyebrow="Plans" index="01" title="Pick the piece you're missing, or hand us all of it." lead="Setup is included. Google Foundations is month to month. Website and Local Growth plans have a 6-month initial term, then continue month to month. Prices are per business location. Paid advertising is not included." />
        <div className="mt-14">
          <ServicePlans />
        </div>
        <div className="mt-12">
          <PlanCompare />
        </div>
      </Section>

      <Section tone="cream-deep">
        <SectionHeading eyebrow="What we actually do" index="02" title="Three things that decide whether a customer calls you or the next name down." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 lg:grid-cols-3">
          {deliverables.map((item) => (
            <div key={item.title} className="bg-white p-8 sm:p-10">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-stone">{item.body}</p>
              <ul className="mt-6 grid gap-2 text-sm">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="ink">
        <SectionHeading tone="light" eyebrow="How a plan works" index="03" title="Audit. Setup. Then every month, the work gets done." />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-cream/10 bg-cream/10 md:grid-cols-3">
          {retainerHowItWorks.map((step, index) => (
            <li key={step.title} className="bg-ink p-8 sm:p-10">
              <span className="font-display text-6xl font-semibold leading-none tracking-[-0.05em] text-cream/[0.12]">{index + 1}</span>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.02em] text-cream">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-mist">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl text-sm text-mist">
          We don&apos;t promise rankings or a number of reviews. Rankings depend on relevance, distance, and competition. We commit to the work in your plan and report the metrics available to us. Review-link taps are not the same as completed reviews or booked jobs.
        </p>
      </Section>

      <Section tone="cream" containerSize="narrow">
        <SectionHeading eyebrow="Questions" index="04" title="Plain answers about plans." />
        <div className="mt-12">
          <Faq items={retainerFaqs} />
        </div>
      </Section>

      <FinalCta
        title="Start the monthly plan."
        body="Stripe charges today, then automatically every month. Prefer a look first? Request a free audit — we'll tell you which plan fits."
        primary={{ href: "/subscribe", label: "Start monthly billing" }}
        secondary={{ href: "/audit", label: "Get my free audit" }}
        note="Google Foundations is month to month. Website plans have a 6-month initial term. Cards are one-time and work with or without a plan."
      />
      <JsonLd data={servicesJsonLd} />
    </>
  );
}
