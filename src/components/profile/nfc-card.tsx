import { LogoMark } from "@/components/logo";
import { cn } from "@/lib/utils";

function NfcWaves({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M6 8.5a6 6 0 0 0 0 7" />
      <path d="M9.5 10a3 3 0 0 0 0 4" />
      <path d="M18 8.5a6 6 0 0 1 0 7" />
      <path d="M14.5 10a3 3 0 0 1 0 4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * A realistic-looking black NFC card. Credit-card aspect ratio. `size` picks a type
 * scale: "sm" for thumbnails and mockups, "md" for hero/demo, "lg" for full-width.
 */
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
  const scale = {
    sm: { pad: "p-3", logo: "h-4", word: "text-[11px]", waves: "h-4", name: "text-[13px]", mono: "text-[7px]" },
    md: { pad: "p-4 sm:p-5", logo: "h-5 sm:h-6", word: "text-sm sm:text-base", waves: "h-5 sm:h-6", name: "text-lg sm:text-2xl", mono: "text-[9px] sm:text-[11px]" },
    lg: { pad: "p-6", logo: "h-7", word: "text-lg", waves: "h-7", name: "text-3xl", mono: "text-xs" },
  }[size];

  return (
    <div
      className={cn(
        "relative aspect-[1.586] w-full max-w-[420px] overflow-hidden rounded-[1.15rem] shadow-[0_30px_60px_-25px_rgb(0_0_0/0.65)]",
        scale.pad,
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
            <LogoMark className={cn("w-auto text-accent", scale.logo)} />
            <span className={cn("font-display font-bold tracking-tight", scale.word)}>Maprizz</span>
          </div>
          <NfcWaves className={cn("w-auto", scale.waves, dark ? "text-cream/70" : "text-ink/60")} />
        </div>
        <div className="min-w-0">
          <p className={cn("font-display font-semibold leading-tight tracking-[-0.02em] text-balance", scale.name)}>{businessName}</p>
          <p className={cn("mt-1 truncate font-mono uppercase tracking-[0.14em]", scale.mono, dark ? "text-mist" : "text-stone")}>
            Tap or scan · maprizz.com/t/{code}
          </p>
        </div>
      </div>
    </div>
  );
}
