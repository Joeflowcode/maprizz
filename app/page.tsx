import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MarketingShell } from "@/components/layout/marketing-shell";
import {
  CtaBand,
  FaqList,
  ProductGrid,
  SectionLabel,
  ServicePlanGrid,
  Ticker,
} from "@/components/marketing/sections";
import { TapDemo } from "@/components/profile/tap-demo-inner";
import { NfcCard, PhoneFrame, ProfileScreen } from "@/components/profile/profile-parts";
import { ButtonLink } from "@/components/ui/button";
import { homeFaqs } from "@/lib/catalog";
import { cascadeAutoDetail } from "@/lib/demo-profile";
import { industries, site } from "@/lib/site";

export default function HomePage() {
  return (
    <MarketingShell>
      <section className="grain surface-glow overflow-hidden bg-ink text-cream">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:items-center lg:py-24">
          <div className="rise lg:col-span-6">
            <p className="label text-mist">{site.tagline}</p>
            <p className="mt-3 text-sm text-cream/80">
              NFC cards + review stands for local business
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,8vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
              Your business. One tap away.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/75">
              Smart NFC cards and review stands that make it ridiculously easy for
              customers to find, contact, and review your business.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/order" size="lg">
                {site.cta.primary}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/demo" variant="light" size="lg">
                {site.cta.secondary}
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm text-mist">{site.compatibility}</p>
          </div>

          <div className="rise-2 lg:col-span-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <NfcCard
                businessName={cascadeAutoDetail.name}
                code={cascadeAutoDetail.tapCode}
              />
              <PhoneFrame className="mx-auto lg:mx-0">
                <ProfileScreen data={cascadeAutoDetail} compact interactive={false} />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </section>

      <Ticker items={industries} />

      <section id="how-it-works" className="scroll-mt-20 bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionLabel>01 How it works</SectionLabel>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Three steps. Then it just works.
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                step: "1",
                title: "We build it.",
                copy: "Add your logo, business information, website and links. We program the card and set up your permanent Maprizz URL.",
              },
              {
                step: "2",
                title: "They tap it.",
                copy: "A customer taps the card or scans the QR code. No app to download, nothing to type.",
              },
              {
                step: "3",
                title: "They connect.",
                copy: "Your website, contact info, directions, booking page or review link opens instantly.",
              },
            ].map((item) => (
              <article
                key={item.step}
                className="rounded-3xl border border-ink/10 bg-white/70 p-7 shadow-sm"
              >
                <p className="label text-stone">{item.step}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-stone">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-cream-deep py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionLabel>02 Interactive demo</SectionLabel>
          <div className="mt-3 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Tap to call. Tap to book. Tap to review.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-stone">
                Press the button and watch a Smart Business Card open a Maprizz
                profile. Every button on that screen is one the customer can use with
                one thumb.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/demo">Open the full demo</ButtonLink>
                <ButtonLink href="/p/cascade-auto-detail" variant="secondary">
                  View the live sample profile
                </ButtonLink>
              </div>
            </div>
            <TapDemo data={cascadeAutoDetail} code={cascadeAutoDetail.tapCode} compact />
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionLabel>03 Products</SectionLabel>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            One card. One price. No subscription.
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-stone">
            Every product includes a permanent Maprizz URL, a QR backup and the
            ability to change where it points later.
          </p>
          <div className="mt-10">
            <ProductGrid />
          </div>
        </div>
      </section>

      <section className="bg-ink text-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionLabel>04 Need help with your Google presence?</SectionLabel>
          <h2 className="mt-3 max-w-4xl font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            The card gets them to your door. We make sure they pick you.
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-cream/75">
            Most local businesses lose customers before the first call: an incomplete
            Google listing, a slow website, no reviews in months. Maprizz runs that for
            you, month to month.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["GBP", "Google Business Profile", "Complete, active and answered."],
              ["WEB", "A better website", "Fast, mobile-first, built to convert."],
              ["SEO", "Local SEO", "Show up for the services and towns you serve."],
            ].map(([tag, title, copy]) => (
              <li key={tag} className="rounded-3xl border border-cream/10 bg-white/[0.04] p-6">
                <p className="label text-accent">{tag}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">{copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <ServicePlanGrid />
          <p className="mt-8 text-center text-[15px] text-stone">
            Every plan starts with a free audit of your Google Business Profile and
            website. Cards are still one-time; plans are optional.{" "}
            <Link href="/services#plans" className="font-semibold text-brand hover:underline">
              Compare plans in detail
            </Link>
          </p>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-cream-deep py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionLabel>05 What you get after the tap</SectionLabel>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">
            Turn real-world conversations into customers.
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              [
                "Taps, not guesses",
                "See total taps, the last 7 days and the last 30 days for your card and your review stand.",
              ],
              [
                "Change anything, anytime",
                "Destination, phone number, links, logo. The URL on the card never changes.",
              ],
              [
                "Honest by design",
                "We show review-link taps. We never claim to count reviews Google doesn't report.",
              ],
            ].map(([title, copy]) => (
              <article key={title} className="rounded-3xl border border-ink/10 bg-white/70 p-7">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">
                  {title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-stone">{copy}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-stone">
            Every card points to a permanent short URL such as{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-sm">
              maprizz.com/t/A91XKD
            </code>
            . Change your website, phone number or review link from your{" "}
            <Link href="/dashboard" className="font-semibold text-brand hover:underline">
              dashboard
            </Link>{" "}
            and the card keeps working. No reprogramming.
          </p>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <SectionLabel>06 Questions</SectionLabel>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">
            Straight answers.
          </h2>
          <div className="mt-8">
            <FaqList items={homeFaqs} />
          </div>
        </div>
      </section>

      <CtaBand
        title="Stop making customers search for you."
        description="Order a card, send us your logo and links, and start handing people something their phone understands."
      />
    </MarketingShell>
  );
}
