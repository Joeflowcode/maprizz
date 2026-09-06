import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { FinalCta } from "@/components/final-cta";
import { pageMetadata } from "@/lib/seo";
import { industries } from "@/lib/industries";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Industries we help",
  description: `Google profiles, websites, and review tools for contractors, home services, detailers, barbers, and local shops. Based in ${siteConfig.location.city}.`,
  path: "/for",
});

export default function IndustriesPage() {
  return (
    <>
      <section className="grain relative overflow-hidden bg-ink text-cream">
        <div className="surface-glow absolute inset-0" aria-hidden="true" />
        <Container size="wide" className="relative py-16 sm:py-24">
          <p className="label flex items-center gap-3 text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            Built for people who do the work
          </p>
          <h1 className="mt-7 max-w-4xl font-display text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.04em] text-balance sm:text-6xl">
            Same offer. Different job site.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist text-pretty">
            Send this page to an owner in your trade. The audit is still the first step — these pages just speak the language of the work.
          </p>
        </Container>
      </section>

      <Section tone="cream">
        <SectionHeading eyebrow="Pick your trade" title="Leave-behinds for real conversations." />
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {industries.map((industry) => (
            <li key={industry.slug}>
              <Link
                href={`/for/${industry.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-7 transition-[transform,border-color,box-shadow] hover:border-ink hover:shadow-[0_24px_50px_-28px_rgb(22_18_14/0.35)] active:scale-[0.99] sm:p-8"
              >
                <p className="label text-brand">{industry.navLabel}</p>
                <h2 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em]">{industry.headline}</h2>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-stone">{industry.lead}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                  Open this page
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <ButtonLink href="/audit" variant="dark" size="lg">
            Or skip ahead to the audit
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
