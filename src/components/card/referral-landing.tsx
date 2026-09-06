import { Globe, Mail, MessageSquare, Phone, UserPlus } from "lucide-react";
import Link from "next/link";
import { Logo, LogoMark } from "@/components/logo";
import { cn } from "@/lib/utils";
import { instagramHref, joeyContact, smsHref, telHref } from "@/lib/tap-cards/joey";
import { cardServices, joeyCopy } from "@/lib/tap-cards/seed";
import type { ReferralCard } from "@/lib/tap-cards/types";
import { LeadForm } from "./lead-form";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

type Action = {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  emphasis?: "primary" | "base";
  external?: boolean;
  download?: boolean;
};

function buildActions(): Action[] {
  const actions: Action[] = [];

  if (joeyContact.phone) {
    actions.push({
      key: "text",
      label: "Text Joey",
      href: smsHref(joeyContact.phone),
      icon: <MessageSquare className="h-5 w-5" />,
      emphasis: "primary",
    });
    actions.push({
      key: "call",
      label: "Call Joey",
      href: telHref(joeyContact.phone),
      icon: <Phone className="h-5 w-5" />,
      emphasis: "primary",
    });
  } else {
    actions.push({
      key: "email",
      label: "Email Joey",
      href: `mailto:${joeyContact.email}`,
      icon: <Mail className="h-5 w-5" />,
      emphasis: "primary",
    });
  }

  actions.push({
    key: "vcard",
    label: "Save Contact",
    href: "/api/vcard/joey",
    icon: <UserPlus className="h-5 w-5" />,
    download: true,
  });

  actions.push({
    key: "site",
    label: "Visit Maprizz.com",
    href: "/",
    icon: <Globe className="h-5 w-5" />,
  });

  if (joeyContact.instagram) {
    actions.push({
      key: "ig",
      label: "Instagram",
      href: instagramHref(joeyContact.instagram),
      icon: <InstagramIcon className="h-5 w-5" />,
      external: true,
    });
  }

  return actions;
}

export function ReferralLanding({ card }: { card: ReferralCard }) {
  const actions = buildActions();

  return (
    <div className="min-h-svh bg-cream text-ink">
      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col px-5 pb-10 pt-6">
        <header className="flex items-center justify-between">
          <Logo href="/" className="origin-left scale-90" />
        </header>

        <div className="mt-10 text-center">
          <p className="font-display text-4xl font-semibold tracking-[-0.04em]">
            {joeyCopy.firstName}
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-brand">
            {joeyCopy.brand}
          </p>
          <h1 className="mt-5 font-display text-[1.65rem] font-semibold leading-[1.15] tracking-[-0.03em] text-balance">
            {joeyCopy.headline}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-pretty text-stone">
            {joeyCopy.support}
          </p>
        </div>

        <div className="mt-7">
          <LeadForm referralSlug={card.slug} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {actions.map((action, index) => {
            const pairedPrimary =
              action.emphasis === "primary" &&
              (actions[index - 1]?.emphasis === "primary" ||
                actions[index + 1]?.emphasis === "primary");
            const span = pairedPrimary ? "col-span-1" : "col-span-2";
            const className = cn(
              "flex min-h-14 w-full items-center gap-3 rounded-2xl px-4 text-[16px] font-semibold tracking-tight transition-[transform,background-color] active:scale-[0.98]",
              action.emphasis === "primary"
                ? "bg-ink text-cream hover:bg-ink-soft"
                : "border border-ink/10 bg-white text-ink hover:border-ink/30",
              pairedPrimary && "justify-center",
            );
            const content = (
              <>
                {action.icon}
                <span className={cn(!pairedPrimary && "flex-1 text-left")}>
                  {action.label}
                </span>
              </>
            );

            if (action.href.startsWith("/") && !action.download) {
              return (
                <Link key={action.key} href={action.href} className={cn(span, className)}>
                  {content}
                </Link>
              );
            }

            return (
              <a
                key={action.key}
                href={action.href}
                className={cn(span, className)}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noopener noreferrer" : undefined}
                download={action.download || undefined}
              >
                {content}
              </a>
            );
          })}
        </div>

        <section className="mt-10">
          <p className="label text-stone">What I help with</p>
          <ul className="mt-4 space-y-3">
            {cardServices.map((service) => (
              <li
                key={service.title}
                className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-4"
              >
                <p className="font-display text-[17px] font-semibold tracking-tight">
                  {service.title}
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-stone">
                  {service.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-auto flex flex-col items-center gap-2 pt-10 text-center text-xs text-stone">
          <span className="inline-flex items-center gap-1.5">
            <LogoMark className="h-3.5 w-3.5 text-accent" />
            Maprizz · Bend, Oregon
          </span>
          <p>No app. No download. Just tap and connect.</p>
        </footer>
      </div>
    </div>
  );
}

export function CardUnavailable({ reason }: { reason: "missing" | "inactive" }) {
  return (
    <div className="min-h-svh bg-cream px-5 py-10">
      <div className="mx-auto max-w-md">
        <Logo />
        <h1 className="mt-14 font-display text-4xl font-semibold tracking-[-0.04em]">
          {reason === "inactive" ? "This card is no longer active." : "This card isn't set up yet."}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-stone">
          You can still reach Maprizz on the main site, or request a free
          business audit.
        </p>
        <div className="mt-8 grid gap-3">
          <Link
            href="/"
            className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-ink px-6 text-base font-semibold text-cream"
          >
            Visit Maprizz.com
          </Link>
          <Link
            href="/audit"
            className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-ink/15 bg-white px-6 text-base font-semibold text-ink"
          >
            Get a Free Business Audit
          </Link>
        </div>
      </div>
    </div>
  );
}
