import type { ReactNode } from "react";
import { CalendarDays, Globe, MapPin, MessageSquare, Phone, Star, UserPlus } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { cn } from "@/lib/utils";

/** The subset of business + profile data the profile page renders. Plain values only. */
export type ProfileData = {
  businessId: string;
  name: string;
  logoUrl: string | null;
  headline: string | null;
  description: string | null;
  theme: "dark" | "light";
  phone: string | null;
  email: string | null;
  websiteUrl: string | null;
  address: string | null;
  bookingUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  /** Where "Leave a Google Review" goes: the tracked /r/CODE link when one exists. */
  reviewHref: string | null;
  /** vCard endpoint. */
  vcardHref: string;
};

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

type Action = {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
  emphasis?: "primary" | "review";
  external?: boolean;
  download?: boolean;
};

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function smsHref(phone: string) {
  return `sms:${phone.replace(/[^\d+]/g, "")}`;
}

function directionsHref(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function buildActions(data: ProfileData): Action[] {
  const actions: Action[] = [];
  if (data.phone) actions.push({ key: "call", label: "Call", href: telHref(data.phone), icon: <Phone />, emphasis: "primary" });
  if (data.phone) actions.push({ key: "text", label: "Text", href: smsHref(data.phone), icon: <MessageSquare />, emphasis: "primary" });
  if (data.websiteUrl) actions.push({ key: "web", label: "Website", href: data.websiteUrl, icon: <Globe />, external: true });
  if (data.address) actions.push({ key: "dir", label: "Directions", href: directionsHref(data.address), icon: <MapPin />, external: true });
  if (data.bookingUrl) actions.push({ key: "book", label: "Book Now", href: data.bookingUrl, icon: <CalendarDays />, external: true });
  if (data.instagramUrl) actions.push({ key: "ig", label: "Instagram", href: data.instagramUrl, icon: <InstagramIcon />, external: true });
  if (data.facebookUrl) actions.push({ key: "fb", label: "Facebook", href: data.facebookUrl, icon: <FacebookIcon />, external: true });
  if (data.reviewHref) actions.push({ key: "review", label: "Leave a Google Review", href: data.reviewHref, icon: <Star />, emphasis: "review", external: true });
  actions.push({ key: "vcard", label: "Save Contact", href: data.vcardHref, icon: <UserPlus />, download: true });
  return actions;
}

/**
 * The digital business profile. Rendered full-screen at /p/[slug] and inside the phone
 * mockup for demos. `interactive={false}` turns links into inert buttons for mockups.
 */
export function ProfileCard({
  data,
  interactive = true,
  compact = false,
  className,
}: {
  data: ProfileData;
  interactive?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const dark = data.theme === "dark";
  const actions = buildActions(data);
  const initials = data.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const btn = cn(
    "flex w-full items-center gap-3 rounded-2xl px-4 font-semibold tracking-tight transition-[transform,background-color] active:scale-[0.98]",
    compact ? "min-h-12 text-[14px]" : "min-h-14 text-[16px]",
  );
  const tone = {
    base: dark ? "bg-white/[0.08] text-white hover:bg-white/[0.14]" : "bg-ink/[0.05] text-ink hover:bg-ink/[0.1]",
    primary: dark ? "bg-white text-ink hover:bg-cream" : "bg-ink text-cream hover:bg-ink-soft",
    review: "bg-accent text-ink hover:bg-accent-deep",
  };

  return (
    <div
      className={cn(
        "flex min-h-full w-full flex-col",
        dark ? "bg-ink text-cream" : "bg-cream text-ink",
        compact ? "px-4 pb-5 pt-8" : "px-5 pb-8 pt-12 sm:px-6",
        className,
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={cn(
            "flex items-center justify-center overflow-hidden rounded-2xl",
            dark ? "bg-white/10" : "bg-white shadow-sm",
            compact ? "h-16 w-16" : "h-24 w-24",
          )}
        >
          {data.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- user-uploaded logos from arbitrary hosts
            <img src={data.logoUrl} alt={`${data.name} logo`} className="h-full w-full object-contain p-1.5" />
          ) : (
            <span className={cn("font-display font-bold", compact ? "text-xl" : "text-3xl")}>{initials}</span>
          )}
        </div>
        <h1 className={cn("mt-4 font-display font-semibold tracking-[-0.03em] text-balance", compact ? "text-xl" : "text-[1.75rem] leading-tight")}>
          {data.name}
        </h1>
        {data.headline ? (
          <p className={cn("mt-1.5 text-balance", dark ? "text-mist" : "text-stone", compact ? "text-[13px]" : "text-[15px]")}>{data.headline}</p>
        ) : null}
        {data.description && !compact ? (
          <p className={cn("mt-3 max-w-sm text-[15px] leading-relaxed text-pretty", dark ? "text-cream/75" : "text-stone")}>{data.description}</p>
        ) : null}
      </div>

      <div className={cn("mt-6 grid grid-cols-2 gap-2.5", compact && "mt-5 gap-2")}>
        {actions.map((action, index) => {
          const paired = action.emphasis === "primary" && actions[index === 0 ? 1 : 0]?.emphasis === "primary";
          const classes = cn(btn, tone[action.emphasis ?? "base"], paired && "justify-center");
          const icon = <span className={cn("[&_svg]:h-5 [&_svg]:w-5", compact && "[&_svg]:h-4 [&_svg]:w-4")}>{action.icon}</span>;
          const content = (
            <>
              {icon}
              <span className={cn(!paired && "flex-1 text-left")}>{action.label}</span>
            </>
          );
          const wrapper = paired ? "col-span-1" : "col-span-2";
          if (!interactive) {
            return (
              <div key={action.key} className={cn(wrapper, classes)} aria-hidden="true">
                {content}
              </div>
            );
          }
          return (
            <a
              key={action.key}
              href={action.href}
              className={cn(wrapper, classes)}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noopener noreferrer" : undefined}
              download={action.download ? true : undefined}
            >
              {content}
            </a>
          );
        })}
      </div>

      <div className={cn("mt-auto flex items-center justify-center gap-1.5 pt-8 text-xs", dark ? "text-mist" : "text-stone")}>
        <LogoMark className="h-3.5 w-3.5 text-accent" />
        Powered by Maprizz
      </div>
    </div>
  );
}
