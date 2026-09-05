"use client";

import {
  CalendarDays,
  Globe,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  UserPlus,
} from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import type { ProfileData } from "@/lib/demo-profile";
import { cn } from "@/lib/utils";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function smsHref(phone: string) {
  return `sms:${phone.replace(/[^\d+]/g, "")}`;
}

function directionsHref(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

type Action = {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  emphasis?: "primary" | "review" | "base";
  external?: boolean;
  download?: boolean;
};

function buildActions(data: ProfileData): Action[] {
  const actions: Action[] = [];

  if (data.phone) {
    actions.push({
      key: "call",
      label: "Call",
      href: telHref(data.phone),
      icon: <Phone className="h-5 w-5" />,
      emphasis: "primary",
    });
    actions.push({
      key: "text",
      label: "Text",
      href: smsHref(data.phone),
      icon: <MessageSquare className="h-5 w-5" />,
      emphasis: "primary",
    });
  }

  if (data.websiteUrl) {
    actions.push({
      key: "web",
      label: "Website",
      href: data.websiteUrl,
      icon: <Globe className="h-5 w-5" />,
      external: true,
    });
  }

  if (data.address) {
    actions.push({
      key: "dir",
      label: "Directions",
      href: directionsHref(data.address),
      icon: <MapPin className="h-5 w-5" />,
      external: true,
    });
  }

  if (data.bookingUrl) {
    actions.push({
      key: "book",
      label: "Book Now",
      href: data.bookingUrl,
      icon: <CalendarDays className="h-5 w-5" />,
      external: true,
    });
  }

  if (data.instagramUrl) {
    actions.push({
      key: "ig",
      label: "Instagram",
      href: data.instagramUrl,
      icon: <InstagramIcon />,
      external: true,
    });
  }

  if (data.facebookUrl) {
    actions.push({
      key: "fb",
      label: "Facebook",
      href: data.facebookUrl,
      icon: <FacebookIcon />,
      external: true,
    });
  }

  if (data.reviewHref) {
    actions.push({
      key: "review",
      label: "Leave a Google Review",
      href: data.reviewHref,
      icon: <Star className="h-5 w-5" />,
      emphasis: "review",
      external: true,
    });
  }

  actions.push({
    key: "vcard",
    label: "Save Contact",
    href: data.vcardHref,
    icon: <UserPlus className="h-5 w-5" />,
    download: true,
  });

  return actions;
}

export function ProfileScreen({
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
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const buttonStyles = {
    base: dark
      ? "bg-white/[0.08] text-white hover:bg-white/[0.14]"
      : "bg-ink/[0.05] text-ink hover:bg-ink/[0.1]",
    primary: dark
      ? "bg-white text-ink hover:bg-cream"
      : "bg-ink text-cream hover:bg-ink-soft",
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
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.logoUrl}
              alt={`${data.name} logo`}
              className="h-full w-full object-contain p-1.5"
            />
          ) : (
            <span
              className={cn(
                "font-display font-bold",
                compact ? "text-xl" : "text-3xl",
              )}
            >
              {initials}
            </span>
          )}
        </div>
        <h1
          className={cn(
            "mt-4 font-display font-semibold tracking-[-0.03em] text-balance",
            compact ? "text-xl" : "text-[1.75rem] leading-tight",
          )}
        >
          {data.name}
        </h1>
        {data.headline ? (
          <p
            className={cn(
              "mt-1.5 text-balance",
              dark ? "text-mist" : "text-stone",
              compact ? "text-[13px]" : "text-[15px]",
            )}
          >
            {data.headline}
          </p>
        ) : null}
        {data.description && !compact ? (
          <p
            className={cn(
              "mt-3 max-w-sm text-[15px] leading-relaxed text-pretty",
              dark ? "text-cream/75" : "text-stone",
            )}
          >
            {data.description}
          </p>
        ) : null}
      </div>

      <div
        className={cn(
          "mt-6 grid grid-cols-2 gap-2.5",
          compact && "mt-5 gap-2",
        )}
      >
        {actions.map((action, index) => {
          const pairedPrimary =
            action.emphasis === "primary" &&
            actions[index - 1]?.emphasis === "primary";
          const span = pairedPrimary ? "col-span-1" : "col-span-2";
          const classNames = cn(
            "flex w-full items-center gap-3 rounded-2xl px-4 font-semibold tracking-tight transition-[transform,background-color] active:scale-[0.98]",
            compact ? "min-h-12 text-[14px]" : "min-h-14 text-[16px]",
            buttonStyles[action.emphasis ?? "base"],
            pairedPrimary && "justify-center",
          );
          const content = (
            <>
              <span className={cn(compact && "[&_svg]:h-4 [&_svg]:w-4")}>
                {action.icon}
              </span>
              <span className={cn(!pairedPrimary && "flex-1 text-left")}>
                {action.label}
              </span>
            </>
          );

          if (!interactive) {
            return (
              <div key={action.key} className={cn(span, classNames)} aria-hidden>
                {content}
              </div>
            );
          }

          return (
            <a
              key={action.key}
              href={action.href}
              className={cn(span, classNames)}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noopener noreferrer" : undefined}
              download={action.download || undefined}
            >
              {content}
            </a>
          );
        })}
      </div>

      <div
        className={cn(
          "mt-auto flex items-center justify-center gap-1.5 pt-8 text-xs",
          dark ? "text-mist" : "text-stone",
        )}
      >
        <LogoMark className="h-3.5 w-3.5 text-accent" />
        Powered by Maprizz
      </div>
    </div>
  );
}

function NfcWaves({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 8.5a6 6 0 0 0 0 7" />
      <path d="M9.5 10a3 3 0 0 0 0 4" />
      <path d="M18 8.5a6 6 0 0 1 0 7" />
      <path d="M14.5 10a3 3 0 0 1 0 4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function NfcCard({
  businessName,
  code,
  className,
  variant = "dark",
  size = "md",
}: {
  businessName: string;
  code: string;
  className?: string;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}) {
  const dark = variant === "dark";
  const sizes = {
    sm: {
      pad: "p-3",
      logo: "h-4",
      word: "text-[11px]",
      waves: "h-4",
      name: "text-[13px]",
      mono: "text-[7px]",
    },
    md: {
      pad: "p-4 sm:p-5",
      logo: "h-5 sm:h-6",
      word: "text-sm sm:text-base",
      waves: "h-5 sm:h-6",
      name: "text-lg sm:text-2xl",
      mono: "text-[9px] sm:text-[11px]",
    },
    lg: {
      pad: "p-6",
      logo: "h-7",
      word: "text-lg",
      waves: "h-7",
      name: "text-3xl",
      mono: "text-xs",
    },
  }[size];

  return (
    <div
      className={cn(
        "relative aspect-[1.586] w-full max-w-[420px] overflow-hidden rounded-[1.15rem] shadow-[0_30px_60px_-25px_rgb(0_0_0/0.65)]",
        sizes.pad,
        dark ? "bg-[#111] text-cream" : "bg-cream text-ink",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          dark
            ? "bg-[radial-gradient(120%_90%_at_100%_0%,rgb(255_139_61/0.22),transparent_55%),linear-gradient(160deg,rgb(255_255_255/0.08),transparent_45%)]"
            : "bg-[radial-gradient(120%_90%_at_100%_0%,rgb(255_139_61/0.18),transparent_55%)]",
        )}
      />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5">
            <LogoMark className={cn("w-auto text-accent", sizes.logo)} />
            <span
              className={cn("font-display font-bold tracking-tight", sizes.word)}
            >
              Maprizz
            </span>
          </div>
          <NfcWaves
            className={cn(
              "w-auto",
              sizes.waves,
              dark ? "text-cream/70" : "text-ink/60",
            )}
          />
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "font-display font-semibold leading-tight tracking-[-0.02em] text-balance",
              sizes.name,
            )}
          >
            {businessName}
          </p>
          <p
            className={cn(
              "mt-1 truncate font-mono uppercase tracking-[0.14em]",
              sizes.mono,
              dark ? "text-mist" : "text-stone",
            )}
          >
            Tap or scan · maprizz.com/t/{code}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PhoneFrame({
  children,
  className,
  screenClassName,
  urlLabel,
}: {
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
  urlLabel?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19] w-full max-w-[300px] rounded-[2.6rem] bg-[#0b0908] p-[9px] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.7),0_0_0_1px_rgb(255_255_255/0.08)_inset]",
        className,
      )}
    >
      <div
        className="absolute left-1/2 top-[18px] z-20 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-[#0b0908]"
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-[2.1rem] bg-ink",
          screenClassName,
        )}
      >
        {urlLabel ? (
          <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-[48px]">
            <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[10px] text-cream/80 backdrop-blur">
              {urlLabel}
            </span>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
