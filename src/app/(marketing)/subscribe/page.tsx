import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { pageMetadata } from "@/lib/seo";
import { isPlanId, plans } from "@/lib/services";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Start a monthly plan",
  description:
    "Subscribe to Maprizz Google Foundations, Website + Local SEO, or Local Growth. Billed monthly through Stripe. First charge today.",
  path: "/subscribe",
});

const points = [
  "Your card is charged today, then automatically every month.",
  "Stripe handles the payment. We never see your full card number.",
  "Cancel by email. Google Foundations is month to month; website plans have a 6-month start.",
];

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; canceled?: string }>;
}) {
  const { plan, canceled } = await searchParams;
  const selected = isPlanId(plan) ? plans[plan] : plans.growth;
  return (
    <div className="bg-cream">
      <Container size="wide" className="py-10 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="label flex items-center gap-3 text-brand">
              <span className="h-px w-8 bg-brand" aria-hidden="true" />
              Monthly billing
            </p>
            <h1 className="mt-6 font-display text-[2.5rem] font-semibold leading-[1] tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
              Recurring revenue starts with a recurring charge.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone text-pretty">
              {selected.name} is {selected.priceLabel} every month. Setup is included. You&apos;re billed by Stripe, not by a one-off invoice that can be forgotten.
            </p>
            {canceled === "1" ? (
              <p className="mt-6 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm" role="status">
                Checkout was canceled. Nothing was charged. You can try again below.
              </p>
            ) : null}
            <ul className="mt-10 hidden gap-4 lg:grid">
              {points.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-ink/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 hidden text-sm text-stone lg:block">
              Questions before you pay? Email{" "}
              <a href={`mailto:${siteConfig.email}`} className="font-semibold text-ink underline-offset-4 hover:underline">
                {siteConfig.email}
              </a>{" "}
              or start with a free audit.
            </p>
          </div>
          <div className="lg:col-span-7">
            <SubscribeForm initialPlan={selected.id} />
            <ul className="mt-8 grid gap-3 lg:hidden">
              {points.map((item) => (
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
