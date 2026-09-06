"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { InputField, SelectField, TextareaField } from "@/components/forms/field";
import { Notice } from "@/components/app/page-header";
import { updateProfileAction, type ActionState } from "@/lib/actions/business";
import type { Profile } from "@/types/database";

export function ProfileForm({ businessId, profile }: { businessId: string; profile: Profile | null }) {
  const action = updateProfileAction.bind(null, businessId);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, { ok: false });
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="grid gap-5">
      <label className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-cream p-4">
        <input type="checkbox" name="enabled" defaultChecked={profile?.enabled ?? true} className="mt-1 h-4 w-4 accent-[#16120e]" />
        <span>
          <span className="block font-semibold">Profile page is live</span>
          <span className="block text-sm text-stone">When off, cards pointing at the profile fall back to your website.</span>
        </span>
      </label>
      <InputField id="headline" label="Headline" optional defaultValue={profile?.headline ?? ""} error={errors.headline} placeholder="Premium mobile detailing in Bend, Oregon." maxLength={120} />
      <TextareaField id="description" label="Short description" optional rows={3} defaultValue={profile?.description ?? ""} error={errors.description} maxLength={400} />
      <SelectField id="theme" label="Theme" defaultValue={profile?.theme ?? "dark"}>
        <option value="dark">Dark (black background)</option>
        <option value="light">Light (off-white background)</option>
      </SelectField>
      {state.message ? <Notice tone={state.ok ? "success" : "error"}>{state.message}</Notice> : null}
      <div>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
