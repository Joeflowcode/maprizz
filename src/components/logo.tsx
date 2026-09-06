import Link from "next/link";
import { cn } from "@/lib/utils";

/** Pin + tap waves: "get found" meets "tap". */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("h-9 w-9", className)} fill="none">
      <path
        d="M20 3.5c-7.2 0-13 5.6-13 12.6 0 8.9 10.4 18.3 12.2 19.8a1.2 1.2 0 0 0 1.6 0C22.6 34.4 33 25 33 16.1 33 9.1 27.2 3.5 20 3.5Z"
        fill="currentColor"
      />
      <circle cx="20" cy="16" r="2.4" fill="var(--color-ink)" />
      <path d="M14.6 11.2a7.6 7.6 0 0 0 0 9.6" stroke="var(--color-ink)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M25.4 11.2a7.6 7.6 0 0 1 0 9.6" stroke="var(--color-ink)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  tone = "dark",
  className,
  href = "/",
}: {
  tone?: "dark" | "light";
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5 rounded-full", tone === "dark" ? "text-ink" : "text-cream", className)}
      aria-label="Maprizz home"
    >
      <LogoMark className="text-accent" />
      <span className="font-display text-[1.45rem] font-bold tracking-tight">Maprizz</span>
    </Link>
  );
}
