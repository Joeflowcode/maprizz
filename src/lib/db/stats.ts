import type { DailyCount, TapStats } from "@/types/database";

export const DAY_MS = 86_400_000;

export function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Build the 30-day daily series + 7/30 day totals from a list of event timestamps
 * (already filtered to the last 30 days). `total` is the all-time count.
 */
export function buildStats(total: number, recentTimestamps: string[], now = new Date()): TapStats {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const daily: DailyCount[] = [];
  const index = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const day = dayKey(new Date(today.getTime() - i * DAY_MS));
    index.set(day, daily.length);
    daily.push({ day, count: 0 });
  }

  const cutoff7 = now.getTime() - 7 * DAY_MS;
  const cutoff30 = now.getTime() - 30 * DAY_MS;
  let last7 = 0;
  let last30 = 0;
  for (const ts of recentTimestamps) {
    const t = new Date(ts).getTime();
    if (Number.isNaN(t) || t < cutoff30) continue;
    last30++;
    if (t >= cutoff7) last7++;
    const slot = index.get(dayKey(new Date(t)));
    if (slot !== undefined) daily[slot].count++;
  }

  return { total, last7, last30, daily };
}

export function thirtyDaysAgoIso(now = new Date()) {
  return new Date(now.getTime() - 30 * DAY_MS).toISOString();
}
