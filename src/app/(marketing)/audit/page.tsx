import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AuditForm } from "@/components/forms/audit-form";
import { pageMetadata } from "@/lib/seo";
import { isPlanId, plans, type LeadInterest } from "@/lib/services";
import { whatWeCheck } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Free Business Audit",
  description:
    "A short, honest review of your Google Business Profile and website from Maprizz. No automated score, no obligation. Based in Bend, Oregon.",
  path: "/audit",
});

const promises = [
  "A real person looks at your Google Business Profile and website.",
  "You get a short list of the fixes that matter most, in plain language.",
  "Reply within two business days. No automated score. No obligation to buy.",
];

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ plan?: string; ref?: string }> }) {
  const { plan, ref } = await searchParams;
  const interest: LeadInterest = isPlanId(plan) ? plan : plan === "cards" ? "cards" : "not_sure";
  const selected = isPlanId(plan) ? plans[plan] : null;
  const referralSlug = ref?.trim() ?? "";
  return (
    <div className="bg-cream">
      <Container size="wide" className="py-10 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="label flex items-center gap-3 text-brand">
              <span className="h-px w-8 bg-brand" aria-hidden="true" />
              Free business audit
            </p>
            <h1 className="mt-6 font-display text-[2.5rem] font-semibold leading-[1] tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
              Show me what to improve.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone text-pretty">
              {selected ? (
                <>
                  Interested in <strong className="text-ink">{selected.name}</strong> at {selected.priceLabel}/month? Every plan starts
                  here. {siteConfig.founder.firstName} will audit your Google listing and website, then tell you exactly what the first month
                  would cover.
                </>
              ) : (
                <>
                  Tell us where to look. You&apos;ll get what&apos;s working, what isn&apos;t, and what to fix first — from {siteConfig.location.city},
                  not a template.
                </>
              )}
            </p>
            <ul className="mt-10 hidden gap-4 lg:grid">
              {promises.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-ink/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 hidden lg:block">
              <p className="label text-stone">What we look at</p>
              <ul className="mt-4 grid gap-3">
                {whatWeCheck.slice(0, 4).map((item) => (
                  <li key={item.title} className="text-[15px]">
                    <span className="font-semibold">{item.title}.</span>{" "}
                    <span className="text-stone">{item.body}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-7">
            <AuditForm initialInterest={interest} referralSlug={referralSlug} />
            <ul className="mt-8 grid gap-3 lg:hidden">
              {promises.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-ink/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}
