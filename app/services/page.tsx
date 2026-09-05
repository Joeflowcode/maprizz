import { MarketingShell } from "@/components/layout/marketing-shell";
import {
  CtaBand,
  FaqList,
  PageHero,
  SectionLabel,
  ServicePlanGrid,
} from "@/components/marketing/sections";
import { ButtonLink } from "@/components/ui/button";
import { servicesFaqs } from "@/lib/catalog";

export default function ServicesPage() {
  return (
    <MarketingShell>
      <PageHero
        label="Monthly plans"
        title="Get found. Get trusted. Get chosen."
        description="Cards make it easy to reach you. These plans make sure that when someone looks you up, they like what they see. We run your Google presence and website every month so you can run the business."
      >
        <ButtonLink href="/audit">Get My Free Audit</ButtonLink>
        <ButtonLink href="#plans" variant="secondary">
          See plans
        </ButtonLink>
      </PageHero>

      <section id="plans" className="scroll-mt-20 bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionLabel>01 Plans</SectionLabel>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">
            Pick the piece you&apos;re missing, or hand us all of it.
          </h2>
          <p className="mt-4 text-lg text-stone">
            No setup fees. No long contracts. Prices are per business location.
          </p>
          <div className="mt-10">
            <ServicePlanGrid />
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-cream-deep py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionLabel>02 What we actually do</SectionLabel>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">
            Three things that decide whether a customer calls you or the next name down.
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Google Business Profile",
                copy: "The listing is usually the first thing a customer sees, and most are half-finished. We fill in every field, add real photos every week, answer every review and keep hours, services and categories current so Google keeps showing you.",
                bullets: [
                  "Complete profile in week one",
                  "Weekly posts + photos",
                  "Every review answered within 48 hours",
                  "Review stand + tap tracking included",
                ],
              },
              {
                title: "A better website",
                copy: "One job: turn a visit into a call, a text or a booking. Loads instantly on a phone, says what you do and where in the first screen, and puts the phone number where a thumb lands.",
                bullets: [
                  "Designed and built in 30 days",
                  "Hosting, updates and edits handled",
                  "Wired to your Maprizz card and profile",
                  "You own the domain and content",
                ],
              },
              {
                title: "Local SEO",
                copy: "Not tricks. A page for each service and each town you serve, written so Google and a real person both understand it, plus the technical basics most local sites skip.",
                bullets: [
                  "Service + service-area pages",
                  "Schema, speed and mobile fixes",
                  "Citations and profile consistency",
                  "Monthly ranking and call report",
                ],
              },
            ].map((item) => (
              <article key={item.title} className="rounded-3xl border border-ink/10 bg-white/70 p-7">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-stone">{item.copy}</p>
                <ul className="mt-4 space-y-2 text-[15px] text-stone">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <SectionLabel>04 Questions</SectionLabel>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">
            Plain answers about plans.
          </h2>
          <div className="mt-8">
            <FaqList items={servicesFaqs} />
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Tap. Done."
        title="Find out what's costing you customers."
        description="Request a free audit. We'll look at your Google listing and website and reply with the fixes that matter most, whether or not you buy a plan."
        primaryHref="/audit"
        primaryLabel="Get My Free Audit"
      />
    </MarketingShell>
  );
}
