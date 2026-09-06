import { Search, Star, Phone } from "lucide-react";

/** Hero visual: search → trust → call, matching the service offer instead of leading with NFC. */
export function PresenceStack() {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="absolute -right-6 -top-8 h-40 w-40 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-10 -left-8 h-36 w-36 rounded-full bg-brand/40 blur-3xl" aria-hidden="true" />

      <article className="rise relative rounded-[1.75rem] border border-cream/15 bg-ink-soft p-5 shadow-[0_30px_80px_-24px_rgb(0_0_0/0.55)]">
        <p className="label text-mist">Nearby search</p>
        <p className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-cream">roof repair near me</p>
        <div className="mt-5 rounded-2xl border border-cream/10 bg-cream p-4 text-ink">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg font-semibold tracking-tight">Your business</p>
              <p className="mt-1 text-sm text-stone">Bend, Oregon · Open now</p>
            </div>
            <span className="label rounded-full bg-accent px-2.5 py-1 text-ink">Maps</span>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-sm font-medium">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
            Reviews people can actually find
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <span className="rounded-xl bg-ink px-2 py-2.5 text-cream">Call</span>
            <span className="rounded-xl bg-ink/5 px-2 py-2.5">Website</span>
            <span className="rounded-xl bg-ink/5 px-2 py-2.5">Directions</span>
          </div>
        </div>
      </article>

      <ul className="rise-2 mt-4 grid gap-2">
        {[
          { icon: Search, label: "They find you on Google" },
          { icon: Star, label: "They trust the listing and site" },
          { icon: Phone, label: "They call, text, or request a quote" },
        ].map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 rounded-2xl border border-cream/12 bg-white/[0.04] px-4 py-3 text-sm text-cream"
          >
            <item.icon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
