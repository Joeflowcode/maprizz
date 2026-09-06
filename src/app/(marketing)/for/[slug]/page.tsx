import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { ServicePlans } from "@/components/service-plans";
import { FinalCta } from "@/components/final-cta";
import { pageMetadata } from "@/lib/seo";
import { industries, industryBySlug } from "@/lib/industries";
import { plans } from "@/lib/services";
import { siteConfig } from "@/lib/site-config";

type Params = { slug: string };

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = industryBySlug(slug);
  if (!industry) return {};
  return pageMetadata({
    title: `${industry.name}: Google, websites & reviews`,
    description: `${industry.lead} Maprizz is based in ${siteConfig.location.city}. Start with a free audit.`,
    path: `/for/${industry.slug}`,
  });
}

export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const industry = industryBySlug(slug);
  if (!industry) notFound();
  const recommended = plans[industry.recommended];

  return (
    <>
      <section className="grain relative overflow-hidden bg-ink text-cream">
        <div className="surface-glow absolute inset-0" aria-hidden="true" />
        <Container size="wide" className="relative py-16 sm:py-24">
          <p className="label flex items-center gap-3 text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            For {industry.name.toLowerCase()}
          </p>
          <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="font-display text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.04em] text-balance sm:text-6xl lg:col-span-8">
              {industry.headline}
            </h1>
            <div className="lg:col-span-4">
              <p className="text-lg leading-relaxed text-mist text-pretty">{industry.lead}</p>
              <div className="mt-8 flex flex-col gap-3">
                <ButtonLink href={`/subscribe?plan=${industry.recommended}`} size="lg">
                  Start monthly billing
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/services" variant="light" size="lg">
                  See plans
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="cream">
        <SectionHeading eyebrow="What we usually find" title="The listing, the site, and the ask after the job." />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 lg:grid-cols-3">
          {industry.problems.map((item) => (
            <li key={item.title} className="bg-white p-8 sm:p-10">
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">{item.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-stone">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cream-deep">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="What changes"
              title="A clearer path from search to booked work."
              lead={`Most ${industry.name.toLowerCase()} start with ${recommended.name} at ${recommended.priceLabel}/month, or a smaller piece if that is all they need. The audit decides.`}
            />
          </div>
          <ul className="grid gap-3 lg:col-span-6">
            {industry.outcomes.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-[15px]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-14">
          <ServicePlans compact />
        </div>
      </Section>

      <FinalCta
        title="Send this to an owner who should see it."
        body="Or request the audit yourself. We look at the Google listing and website and reply with what to fix first."
        primary={{ href: `/subscribe?plan=${industry.recommended}`, label: "Start monthly billing" }}
        secondary={{ href: "/for", label: "Other industries" }}
      />
    </>
  );
}
