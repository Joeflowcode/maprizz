import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export function AppPageHeader({
  eyebrow,
  title,
  lead,
  back,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  back?: { href: string; label: string };
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back ? (
          <Link href={back.href} className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {back.label}
          </Link>
        ) : null}
        {eyebrow ? <p className="label mt-3 text-brand">{eyebrow}</p> : null}
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">{title}</h1>
        {lead ? <p className="mt-2 max-w-2xl text-[15px] text-stone">{lead}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2 sm:shrink-0">{actions}</div> : null}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-ink/10 bg-white p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function Notice({ tone = "info", children }: { tone?: "info" | "success" | "error" | "warning"; children: ReactNode }) {
  const tones = {
    info: "bg-ink/5 text-ink",
    success: "bg-emerald-50 text-emerald-900",
    error: "bg-red-50 text-red-800",
    warning: "bg-accent/15 text-ink",
  };
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-sm font-medium ${tones[tone]}`}>
      {children}
    </p>
  );
}
