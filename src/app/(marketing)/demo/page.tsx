import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { TapDemo } from "@/components/demo/tap-demo";
import { PricingCards } from "@/components/pricing";
import { demoProfileData } from "@/lib/profile-data";
import { DEMO_CARD_CODE, DEMO_REVIEW_CODE, DEMO_SLUG } from "@/lib/db/seed";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Interactive Demo",
  description:
    "Tap a simulated Maprizz NFC card and watch a phone open a digital business profile with Call, Text, Website, Directions, Instagram, Save Contact and Leave a Google Review.",
  path: "/demo",
});

export default function DemoPage() {
  return (
    <>
      <section className="grain relative overflow-hidden bg-ink text-cream">
        <div className="surface-glow absolute inset-0" aria-hidden="true" />
        <Container size="wide" className="relative pb-16 pt-14 sm:pb-24 sm:pt-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="label flex items-center gap-3 text-accent">
                <span className="h-px w-8 bg-accent" aria-hidden="true" />
                Interactive demo
              </p>
              <h1 className="mt-7 font-display text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.04em] text-balance sm:text-6xl">
                Hand them your card. <span className="text-accent">Let their phone do the rest.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-mist text-pretty">
                This is a simulation of a Smart Business Card. Press <strong className="text-cream">Tap the card</strong> and the phone opens a Maprizz profile for a fictional business, Cascade Auto Detail.
              </p>
              <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
                <div className="rounded-2xl border border-cream/15 p-4">
                  <dt className="label text-mist">Card URL</dt>
                  <dd className="mt-1.5 font-mono text-cream">maprizz.com/t/{DEMO_CARD_CODE}</dd>
                </div>
                <div className="rounded-2xl border border-cream/15 p-4">
                  <dt className="label text-mist">Review stand URL</dt>
                  <dd className="mt-1.5 font-mono text-cream">maprizz.com/r/{DEMO_REVIEW_CODE}</dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/p/${DEMO_SLUG}`} variant="light" size="lg">
                  Open the real sample profile
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
              <p className="mt-6 text-xs text-mist">
                Cascade Auto Detail is fictional and is not a Maprizz customer. Its phone number, links and address are placeholders.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-[2rem] bg-cream p-4 text-ink sm:p-8">
                <TapDemo data={demoProfileData} code={DEMO_CARD_CODE} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="cream">
        <SectionHeading eyebrow="What you just saw" title="Every button, one thumb." lead="The profile only shows buttons for information the business actually has. No dead ends." />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Call and Text", "Open the phone's dialer or Messages with the number already filled in."],
            ["Website and Book Now", "Send people to your site or straight to your booking page."],
            ["Directions", "Opens Google Maps with your address as the destination."],
            ["Leave a Google Review", "Goes through your tracked Maprizz review link to your Google review form."],
            ["Instagram and Facebook", "Only shown when you add them."],
            ["Save Contact", "Downloads a vCard with your name, phone, email, website and address."],
            ["Your logo", "Upload PNG, JPG, WEBP or SVG when you order."],
            ["Powered by Maprizz", "A small footer. The page is about your business, not ours."],
          ].map(([title, body]) => (
            <li key={title} className="bg-white p-6 sm:p-7">
              <h3 className="font-display text-lg font-semibold tracking-[-0.02em]">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-stone">{body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="pricing" tone="cream-deep">
        <SectionHeading eyebrow="Get yours" title="Pick a card." />
        <div className="mt-12">
          <PricingCards compact />
        </div>
      </Section>
    </>
  );
}
