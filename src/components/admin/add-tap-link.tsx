import { Plus } from "lucide-react";
import { createTapLinkAction } from "@/lib/actions/admin";
import type { TapLink } from "@/types/database";

/** Admin: add another tap link (extra card, review stand, standalone QR). Plain server form. */
export function AddTapLink({ businessId, links }: { businessId: string; links: TapLink[] }) {
  const action = createTapLinkAction.bind(null, businessId);
  const hasReview = links.some((l) => l.type === "review_stand");
  const options = [
    { type: "business_card", label: "Business card" },
    ...(hasReview ? [] : [{ type: "review_stand", label: "Google review stand" }]),
    { type: "qr", label: "Standalone QR" },
  ];
  return (
    <form action={action} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.type}
          type="submit"
          name="type"
          value={option.type}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-ink/20 bg-white/60 px-4 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add {option.label.toLowerCase()}
        </button>
      ))}
    </form>
  );
}
