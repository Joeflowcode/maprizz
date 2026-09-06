import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AuditForm } from "@/components/forms/audit-form";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { joeyContact, smsHref } from "@/lib/tap-cards/joey";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Email, text, or request a free Maprizz audit. ${siteConfig.founder.firstName} replies from ${siteConfig.location.city}, ${siteConfig.location.region}.`,
  path: "/contact",
});

const channels = [
  { label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  ...(joeyContact.phone
    ? [
        { label: "Text", value: joeyContact.phone, href: smsHref(joeyContact.phone) },
        { label: "Call", value: joeyContact.phone, href: `tel:${joeyContact.phone.replace(/[^\d+]/g, "")}` },
      ]
    : []),
];

export default function ContactPage() {
  return (
    <div className="bg-cream">
      <Container size="wide" className="py-10 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="label flex items-center gap-3 text-brand">
              <span className="h-px w-8 bg-brand" aria-hidden="true" />
              Contact
            </p>
            <h1 className="mt-6 font-display text-[2.5rem] font-semibold leading-[1] tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
              Ask {siteConfig.founder.firstName}. Get a useful answer.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone text-pretty">
              The fastest way to get a real look at your business is the audit form. If you already know what you need, email or text
              works too.
            </p>
            <ul className="mt-10 grid gap-4">
              {channels.map((item) => (
                <li key={item.label}>
                  <p className="label text-stone">{item.label}</p>
                  <a href={item.href} className="mt-1 block text-lg font-semibold text-ink underline-offset-4 hover:text-brand hover:underline">
                    {item.value}
                  </a>
                </li>
              ))}
              <li>
                <p className="label text-stone">Based</p>
                <p className="mt-1 text-lg font-semibold">
                  {siteConfig.location.city}, {siteConfig.location.region}
                </p>
                <p className="mt-1 text-sm text-stone">
                  Focused on {siteConfig.location.area}. Cards ship nationwide.
                </p>
              </li>
            </ul>
            <ul className="mt-10 hidden gap-3 lg:grid">
              {["Two-business-day reply on audits", "No automated score", "No obligation to buy"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <AuditForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
