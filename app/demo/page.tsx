import Link from "next/link";
import { MarketingShell } from "@/components/layout/marketing-shell";
import {
  CtaBand,
  PageHero,
  ProductGrid,
  SectionLabel,
} from "@/components/marketing/sections";
import { TapDemo } from "@/components/profile/tap-demo-inner";
import { ButtonLink } from "@/components/ui/button";
import { cascadeAutoDetail } from "@/lib/demo-profile";

export default function DemoPage() {
  return (
    <MarketingShell>
      <PageHero
        label="Interactive demo"
        title="Hand them your card. Let their phone do the rest."
        description="This is a simulation of a Smart Business Card. Press Tap the card and the phone opens a Maprizz profile for a fictional business, Cascade Auto Detail."
      >
        <ButtonLink href="/p/cascade-auto-detail" variant="secondary">
          Open the real sample profile
        </ButtonLink>
      </PageHero>

      <section className="bg-cream pb-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-3 rounded-3xl border border-ink/10 bg-white/70 p-6 text-sm text-stone sm:grid-cols-2">
            <p>
              Card URL{" "}
              <code className="font-mono text-ink">
                maprizz.com/t/{cascadeAutoDetail.tapCode}
              </code>
            </p>
            <p>
              Review stand URL{" "}
              <code className="font-mono text-ink">
                maprizz.com/r/{cascadeAutoDetail.reviewCode}
              </code>
            </p>
          </div>
          <p className="mt-4 text-sm text-stone">
            Cascade Auto Detail is fictional and is not a Maprizz customer. Its phone
            number, links and address are placeholders.
          </p>
          <div className="mt-10 flex justify-center">
            <TapDemo data={cascadeAutoDetail} code={cascadeAutoDetail.tapCode} />
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-cream-deep py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionLabel>What you just saw</SectionLabel>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">
            Every button, one thumb.
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-stone">
            The profile only shows buttons for information the business actually has.
            No dead ends.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Call and Text", "Open the phone's dialer or Messages with the number already filled in."],
              ["Website and Book Now", "Send people to your site or straight to your booking page."],
              ["Directions", "Opens Google Maps with your address as the destination."],
              ["Leave a Google Review", "Goes through your tracked Maprizz review link to your Google review form."],
              ["Instagram and Facebook", "Only shown when you add them."],
              ["Save Contact", "Downloads a vCard with your name, phone, email, website and address."],
              ["Your logo", "Upload PNG, JPG, WEBP or SVG when you order."],
              ["Powered by Maprizz", "A small footer. The page is about your business, not ours."],
            ].map(([title, copy]) => (
              <li key={title} className="rounded-3xl border border-ink/10 bg-white/70 p-6">
                <h3 className="font-display text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-stone">{copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionLabel>Get yours</SectionLabel>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">
            Pick a card.
          </h2>
          <div className="mt-10">
            <ProductGrid />
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
