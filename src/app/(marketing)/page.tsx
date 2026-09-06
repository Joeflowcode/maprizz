import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, Star, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { PresenceStack } from "@/components/visuals/presence-stack";
import { PricingCards } from "@/components/pricing";
import { ServicePlans } from "@/components/service-plans";
import { PlanCompare } from "@/components/plan-compare";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { JoeyNote } from "@/components/joey-note";
import { customerPath, faqs, howItWorks, serviceOffers, whatWeCheck } from "@/lib/content";
import { industries } from "@/lib/industries";
import { audiences, siteConfig } from "@/lib/site-config";
import { pageMetadata, productsJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `${siteConfig.name} | Local Marketing, Websites & Google Business Profiles`,
  description: siteConfig.description,
  path: "/",
});

const pathIcons = [Search, Star, Phone];

export default function HomePage() {
  return (
    <>
      <section className="grain relative overflow-hidden bg-ink text-cream">
        <div className="surface-glow absolute inset-0" aria-hidden="true" />
        <Container size="wide" className="relative pb-20 pt-14 sm:pb-28 sm:pt-20 lg:pb-32 lg:pt-24">
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <p className="label flex items-center gap-3 text-accent">
                <span className="h-px w-8 bg-accent" aria-hidden="true" />
                Based in {siteConfig.location.city}. Built for local business.
              </p>
              <h1 className="mt-7 font-display text-[3rem] font-semibold leading-[0.96] tracking-[-0.04em] text-balance sm:text-6xl lg:text-[5rem]">
                Your next customer is <span className="text-accent">looking for you.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-mist text-pretty sm:text-xl">
                You do great work. We help people find it — with a stronger Google presence, a better website, and an easier way to earn
                reviews.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={siteConfig.cta.primaryHref} size="lg">
                  Get my free business audit
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href={siteConfig.cta.secondaryHref} variant="light" size="lg">
                  {siteConfig.cta.secondary}
                </ButtonLink>
              </div>
              <p className="mt-6 text-sm text-mist">A personal review of your business. No obligation.</p>
            </div>
            <div className="lg:col-span-6">
              <PresenceStack />
            </div>
          </div>
        </Container>

        <div className="relative overflow-hidden border-t border-cream/10 py-4" aria-label="Built for local businesses">
          <div className="ticker gap-10 whitespace-nowrap px-5 text-sm text-mist">
            {[...audiences, ...audiences].map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-10">
                <span>{item}</span>
                <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </section>

      <Section id="path" tone="cream">
        <p className="label text-brand">For the people who do the work</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 className="font-display text-[2.1rem] font-semibold leading-[1.02] tracking-[-0.03em] text-balance sm:text-4xl lg:col-span-7 lg:text-[3.25rem]">
            More than a website. <span className="text-stone">A clearer path from search to customer.</span>
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-stone text-pretty lg:col-span-5">
            Your customers check Google, read reviews, and visit your website. We make those pieces work together.
          </p>
        </div>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 md:grid-cols-3">
          {customerPath.map((step, index) => {
            const Icon = pathIcons[index] ?? Search;
            return (
              <li key={step.title} className="bg-white p-8 sm:p-10">
                <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-stone">{step.body}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section tone="cream-deep" padding="tight">
        <p className="label text-brand">Local work. Real businesses.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {industries.map((industry) => (
            <Link
              key={industry.slug}
              href={`/for/${industry.slug}`}
              className="rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-[transform,background-color,border-color] hover:border-ink hover:bg-ink hover:text-cream active:scale-[0.985]"
            >
              {industry.navLabel}
            </Link>
          ))}
          <Link
            href="/for"
            className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-stone transition-[color,border-color] hover:border-ink hover:text-ink"
          >
            See all industries
          </Link>
        </div>
      </Section>

      <Section id="what-we-do" tone="cream">
        <SectionHeading
          eyebrow="Good work should get noticed"
          index="01"
          title={
            <>
              Give people a reason to choose <span className="text-brand">you.</span>
            </>
          }
          lead="Your customers check Google, read reviews, and visit your website. We make those pieces work together."
        />
        <ol className="mt-14 grid gap-5 lg:grid-cols-3">
          {serviceOffers.map((item) => (
            <li key={item.id} className="flex flex-col rounded-3xl border border-ink/10 bg-white p-7 sm:p-8">
              <p className="label text-brand">
                {item.index} · {item.kicker}
              </p>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.02em] sm:text-[1.75rem]">{item.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-stone">{item.body}</p>
              <p className="mt-6 text-sm font-medium text-ink/80">{item.points}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="how-it-works" tone="cream-deep">
        <SectionHeading
          eyebrow="Start with clarity"
          index="02"
          title={
            <>
              Find the gaps. Make a plan. <span className="text-brand">Get back to work.</span>
            </>
          }
          lead="Before recommending a plan, we look at how your business shows up online. You get a short, useful list of what to improve first."
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 md:grid-cols-3">
          {howItWorks.map((step, index) => (
            <li key={step.title} className="bg-white p-8 sm:p-10">
              <span className="font-display text-6xl font-semibold leading-none tracking-[-0.05em] text-ink/[0.12]">{index + 1}</span>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-stone">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <ButtonLink href="/audit" variant="dark" size="lg">
            Show me what to improve
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading
          eyebrow="What the free audit actually looks at"
          index="03"
          title="No score. Six things that decide whether they call."
          lead="This is the same checklist Joey uses before recommending a plan. You get the notes in plain English, whether or not you buy anything."
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {whatWeCheck.map((item) => (
            <li key={item.title} className="bg-white p-7 sm:p-8">
              <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-stone">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="plans" tone="cream-deep">
        <SectionHeading
          eyebrow="Clear scope. One monthly price."
          index="04"
          title={
            <>
              A plan for your <span className="text-brand">next chapter.</span>
            </>
          }
          lead="Start with the part you need, or bring your Google presence, website, and reviews together. Pricing is per business location."
        />
        <div className="mt-14">
          <ServicePlans compact />
        </div>
        <p className="mt-8 text-sm text-stone">
          Setup included. Website plans have a 6-month initial term. Paid advertising and ad spend are not included.
        </p>
        <div className="mt-12">
          <PlanCompare />
        </div>
        <div className="mt-10">
          <ButtonLink href="/services" variant="secondary" size="md">
            Compare the details
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Section>

      <Section tone="ink">
        <JoeyNote />
      </Section>

      <Section id="cards" tone="cream">
        <SectionHeading
          eyebrow="Small card. Useful connection."
          index="05"
          title={
            <>
              Make a great <span className="text-brand">last impression.</span>
            </>
          }
          lead="Just need a tap card or review stand? Keep it simple with a one-time purchase. No monthly plan required."
        />
        <div className="mt-8">
          <ButtonLink href="/demo" variant="secondary" size="md">
            Try the interactive demo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
        <div className="mt-14">
          <PricingCards />
        </div>
      </Section>

      <Section id="faq" tone="cream-deep" containerSize="narrow">
        <SectionHeading eyebrow="Before we get started" index="06" title="Good questions. Straight answers." />
        <div className="mt-12">
          <Faq items={faqs} />
        </div>
        <p className="mt-8 text-sm text-stone">
          Still wondering?{" "}
          <Link href="/contact" className="font-semibold text-brand underline-offset-4 hover:underline">
            Ask Joey a question
          </Link>
          .
        </p>
      </Section>

      <FinalCta
        eyebrow="Let's make your business easier to choose"
        title="You handle the work. We'll help you get noticed."
        body="Start with a free review of your Google profile and website."
        primary={{ href: "/audit", label: "Get my free business audit" }}
        secondary={{ href: "/services", label: "See monthly plans" }}
        note="No obligation. Just a useful place to start."
      />
      <JsonLd data={productsJsonLd} />
    </>
  );
}
