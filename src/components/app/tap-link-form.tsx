"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/forms/field";
import { Notice } from "@/components/app/page-header";
import { updateTapLinkAction, type ActionState } from "@/lib/actions/business";
import type { Business, DestinationType, Profile, TapLink } from "@/types/database";
import { cn } from "@/lib/utils";

export function TapLinkForm({ business, profile, link }: { business: Business; profile: Profile | null; link: TapLink }) {
  const action = updateTapLinkAction.bind(null, business.id, link.id);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, { ok: false });
  const [type, setType] = useState<DestinationType>(link.destination_type);
  const errors = state.errors ?? {};
  const isReview = link.type === "review_stand";

  const options: Array<{ id: DestinationType; title: string; body: string; disabled?: boolean }> = isReview
    ? [{ id: "google_review", title: "Open my Google review form", body: business.google_review_url ?? "Add your Google review URL below." }]
    : [
        { id: "profile", title: "Open my Maprizz profile", body: profile ? `/p/${business.slug}` : "No profile on this business yet.", disabled: !profile },
        { id: "website", title: "Open my website", body: business.website_url ?? "Add a website to the business first.", disabled: !business.website_url },
        { id: "custom_url", title: "Open another URL", body: "Booking page, menu, Linktree, form…" },
        { id: "google_review", title: "Open my Google review form", body: business.google_review_url ?? "Add your Google review URL below." },
      ];

  return (
    <form action={formAction} className="grid gap-5">
      <fieldset className="grid gap-3">
        <legend className="mb-2 font-display text-lg font-semibold tracking-[-0.02em]">When someone taps, open…</legend>
        {options.map((option) => (
          <label
            key={option.id}
            className={cn(
              "flex items-start gap-4 rounded-2xl border p-4 transition-colors",
              option.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
              type === option.id ? "border-ink bg-cream" : "border-ink/15 hover:border-ink/40",
            )}
          >
            <input
              type="radio"
              name="destination_type"
              value={option.id}
              checked={type === option.id}
              disabled={option.disabled}
              onChange={() => setType(option.id)}
              className="mt-1.5 h-4 w-4 accent-[#16120e]"
            />
            <span className="min-w-0">
              <span className="block font-semibold">{option.title}</span>
              <span className="mt-0.5 block break-all text-sm text-stone">{option.body}</span>
            </span>
          </label>
        ))}
        {errors.destination_type ? (
          <p role="alert" className="text-sm font-medium text-red-700">
            {errors.destination_type}
          </p>
        ) : null}
      </fieldset>

      {type === "custom_url" ? (
        <InputField id="destination_url" label="URL to open" defaultValue={link.destination_url ?? ""} error={errors.destination_url} placeholder="https://…" inputMode="url" required />
      ) : null}
      {type === "google_review" ? (
        <InputField
          id="google_review_url"
          label="Google review URL"
          defaultValue={business.google_review_url ?? ""}
          error={errors.google_review_url}
          placeholder="https://g.page/r/…/review"
          hint="In Google Business Profile: Ask for reviews → copy link. Saved to the business."
          inputMode="url"
        />
      ) : null}

      <label className="flex items-start gap-3 rounded-2xl border border-ink/10 p-4">
        <input type="checkbox" name="enabled" defaultChecked={link.enabled} className="mt-1 h-4 w-4 accent-[#16120e]" />
        <span>
          <span className="block font-semibold">Link is active</span>
          <span className="block text-sm text-stone">Turn off to pause the card. Visitors see a polite unavailable page.</span>
        </span>
      </label>

      {state.message ? <Notice tone={state.ok ? "success" : "error"}>{state.message}</Notice> : null}
      <div>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving…" : "Save destination"}
        </Button>
      </div>
    </form>
  );
}
