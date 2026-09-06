import Link from "next/link";
import type { TapStats } from "@/types/database";
import type { StatsScope } from "@/lib/db";
import { cn } from "@/lib/utils";

export function StatCards({ title, stats, hint }: { title: string; stats: TapStats; hint?: string }) {
  const items = [
    { label: "Total", value: stats.total },
    { label: "Last 7 days", value: stats.last7 },
    { label: "Last 30 days", value: stats.last30 },
  ];
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">{title}</h2>
        {hint ? <span className="text-xs text-stone">{hint}</span> : null}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-ink/10 bg-white p-4 sm:p-5">
            <p className="label text-stone">{item.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{item.value.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const scopes: Array<{ id: StatsScope; label: string }> = [
  { id: "all", label: "All" },
  { id: "business_card", label: "Business card" },
  { id: "review_stand", label: "Review stand" },
];

/** 30-day bar chart. Pure HTML/CSS so it prints and needs no JS. */
export function TapChart({ stats, scope, basePath }: { stats: TapStats; scope: StatsScope; basePath: string }) {
  const max = Math.max(1, ...stats.daily.map((d) => d.count));
  return (
    <section className="rounded-3xl border border-ink/10 bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">Taps, last 30 days</h2>
          <p className="text-sm text-stone">{stats.last30.toLocaleString()} taps in this period</p>
        </div>
        <div className="flex gap-1 rounded-xl bg-ink/5 p-1" role="tablist" aria-label="Filter taps">
          {scopes.map((s) => (
            <Link
              key={s.id}
              href={s.id === "all" ? basePath : `${basePath}?scope=${s.id}`}
              role="tab"
              aria-selected={scope === s.id}
              className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", scope === s.id ? "bg-white shadow-sm" : "text-stone hover:text-ink")}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-6 flex h-40 items-end gap-[3px] sm:gap-1" aria-hidden="true">
        {stats.daily.map((day) => (
          <div key={day.day} className="group relative flex h-full flex-1 items-end">
            <div
              className={cn("w-full rounded-t-sm transition-colors", day.count > 0 ? "bg-ink group-hover:bg-accent" : "bg-ink/10")}
              style={{ height: `${Math.max(4, (day.count / max) * 100)}%` }}
            />
            <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 font-mono text-[10px] text-cream group-hover:block">
              {day.day.slice(5)} · {day.count}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-stone">
        <span>{stats.daily[0]?.day}</span>
        <span>Today</span>
      </div>
      <table className="sr-only">
        <caption>Daily taps</caption>
        <tbody>
          {stats.daily.map((d) => (
            <tr key={d.day}>
              <th scope="row">{d.day}</th>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
