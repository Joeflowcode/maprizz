import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { joeyContact, smsHref, telHref } from "@/lib/tap-cards/joey";
import { siteConfig } from "@/lib/site-config";

export function JoeyNote() {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <p className="label flex items-center gap-3 text-accent">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          A local partner
        </p>
        <h2 className="mt-8 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
          A real person. <span className="text-mist">Invested in your business.</span>
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist text-pretty">
          Hey, I&apos;m {siteConfig.founder.firstName}. I&apos;m based in {siteConfig.location.city}, and I help local business owners make
          their online presence work harder.
        </p>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-mist text-pretty">
          You should know what you&apos;re paying for, who&apos;s doing the work, and what changed this month. That&apos;s how I want to build
          Maprizz.
        </p>
      </div>
      <div className="lg:col-span-5">
        <ul className="grid gap-3 text-[15px]">
          {[
            "Your Google profile stays in your account.",
            "Your domain and content stay yours.",
            "Clear deliverables, without ranking guarantees.",
          ].map((item) => (
            <li key={item} className="rounded-2xl border border-cream/15 bg-white/[0.04] px-5 py-4 text-cream">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
          <ButtonLink href="/about" size="lg">
            Talk to {siteConfig.founder.firstName}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          {joeyContact.phone ? (
            <ButtonLink href={smsHref(joeyContact.phone)} variant="light" size="lg">
              Text {siteConfig.founder.firstName}
            </ButtonLink>
          ) : (
            <ButtonLink href={`mailto:${siteConfig.email}`} variant="light" size="lg">
              Email {siteConfig.email}
            </ButtonLink>
          )}
        </div>
        {joeyContact.phone ? (
          <p className="mt-4 text-sm text-mist">
            Or call{" "}
            <a href={telHref(joeyContact.phone)} className="text-cream underline decoration-accent underline-offset-4 hover:text-accent">
              {joeyContact.phone}
            </a>
          </p>
        ) : null}
      </div>
    </div>
  );
}
