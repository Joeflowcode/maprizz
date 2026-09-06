import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { FinalCta } from "@/components/final-cta";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { joeyContact, smsHref, telHref } from "@/lib/tap-cards/joey";
import { trustPoints } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: `About ${siteConfig.founder.firstName}`,
  description: `Maprizz is run by ${siteConfig.founder.name} in ${siteConfig.location.city}, ${siteConfig.location.region}. A local partner for Google profiles, websites, and review tools — not a faceless agency.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <section className="grain relative overflow-hidden bg-ink text-cream">
        <div className="surface-glow absolute inset-0" aria-hidden="true" />
        <Container size="wide" className="relative py-16 sm:py-24">
          <p className="label flex items-center gap-3 text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            Based in {siteConfig.location.city}, {siteConfig.location.region}
          </p>
          <h1 className="mt-7 max-w-4xl font-display text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
            Hey, I&apos;m {siteConfig.founder.firstName}. <span className="text-accent">I do the work myself.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist text-pretty">
            Maprizz is not a call center and it is not a ranking mill. I help local owners get found, trusted, and contacted — then I report
            what actually happened.
          </p>
        </Container>
      </section>

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="How I work"
              title="You should know who you're paying."
              lead={`I'm ${siteConfig.founder.name}. I live in ${siteConfig.location.city}. If we work together, I'm the person looking at your Google listing, writing the pages, and answering the text.`}
            />
            <div className="mt-10 space-y-5 text-[17px] leading-relaxed text-stone">
              <p>
                Most local businesses do not need a 40-page SEO proposal. They need a complete Google profile, a website that makes the next
                step obvious, and an honest way to ask for reviews after good work.
              </p>
              <p>
                That is the offer. Cards and review stands help in person. Monthly plans keep the online pieces from going stale. If a plan
                is not a fit, I will say so on the audit.
              </p>
              <p>
                I will not promise page-one rankings, a number of Google reviews, or results from ads I am not running. I will do the work
                listed in your plan, keep your accounts in your name, and tell you what changed.
              </p>
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="rounded-3xl border border-ink/10 bg-white p-7 sm:p-8">
              <p className="label text-brand">Talk to {siteConfig.founder.firstName}</p>
              <p className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em]">Fastest path: the free audit.</p>
              <p className="mt-3 text-[15px] leading-relaxed text-stone">
                Send the business name and city. I reply within two business days with what to fix first.
              </p>
              <div className="mt-8 grid gap-3">
                <ButtonLink href="/audit" size="lg">
                  Get my free audit
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href={`mailto:${siteConfig.email}`} variant="secondary" size="lg">
                  {siteConfig.email}
                </ButtonLink>
                {joeyContact.phone ? (
                  <>
                    <ButtonLink href={smsHref(joeyContact.phone)} variant="secondary" size="lg">
                      Text {joeyContact.phone}
                    </ButtonLink>
                    <a href={telHref(joeyContact.phone)} className="text-center text-sm text-stone underline-offset-4 hover:text-ink hover:underline">
                      Or call
                    </a>
                  </>
                ) : null}
              </div>
            </div>
            <ul className="mt-5 grid gap-3">
              {trustPoints.map((item) => (
                <li key={item} className="rounded-2xl border border-ink/10 bg-cream-deep px-5 py-4 text-[15px]">
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>

      <FinalCta
        title="Find out what's costing you customers."
        body="Request a free audit. I'll look at your Google listing and website and reply with the fixes that matter most."
        primary={{ href: "/audit", label: "Get my free audit" }}
        secondary={{ href: "/contact", label: "Contact" }}
      />
    </>
  );
}
