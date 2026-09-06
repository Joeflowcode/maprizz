"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/forms/field";
import { LogoUpload } from "@/components/order/logo-upload";
import { Notice } from "@/components/app/page-header";
import { updateBusinessAction, type ActionState } from "@/lib/actions/business";
import type { Business } from "@/types/database";

export function BusinessForm({ business }: { business: Business }) {
  const action = updateBusinessAction.bind(null, business.id);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, { ok: false });
  const [logoUrl, setLogoUrl] = useState<string | null>(business.logo_url);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="grid gap-6">
      <section className="grid gap-5">
        <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">Logo</h2>
        <LogoUpload value={logoUrl} onChange={setLogoUrl} />
        <input type="hidden" name="logo_url" value={logoUrl ?? ""} />
      </section>

      <section className="grid gap-5">
        <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">Business</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField id="name" label="Business name" defaultValue={business.name} error={errors.name} required />
          <InputField id="contact_name" label="Contact name" defaultValue={business.contact_name ?? ""} error={errors.contact_name} required />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField id="phone" label="Phone" type="tel" optional defaultValue={business.phone ?? ""} error={errors.phone} inputMode="tel" hint="Call and Text buttons." />
          <InputField id="email" label="Email" type="email" defaultValue={business.email ?? ""} error={errors.email} inputMode="email" required hint="Used for login and receipts." />
        </div>
        <InputField id="website_url" label="Website" optional defaultValue={business.website_url ?? ""} error={errors.website_url} inputMode="url" />
        <InputField id="address" label="Address" optional defaultValue={business.address ?? ""} error={errors.address} hint="Directions button." />
      </section>

      <section className="grid gap-5">
        <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">Social and booking</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField id="instagram_url" label="Instagram" optional defaultValue={business.instagram_url ?? ""} error={errors.instagram_url} inputMode="url" />
          <InputField id="facebook_url" label="Facebook" optional defaultValue={business.facebook_url ?? ""} error={errors.facebook_url} inputMode="url" />
        </div>
        <InputField id="booking_url" label="Booking URL" optional defaultValue={business.booking_url ?? ""} error={errors.booking_url} inputMode="url" />
      </section>

      <section className="grid gap-5">
        <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">Google</h2>
        <InputField id="google_business_url" label="Google Business Profile URL" optional defaultValue={business.google_business_url ?? ""} error={errors.google_business_url} inputMode="url" />
        <InputField
          id="google_review_url"
          label="Google review URL"
          optional
          defaultValue={business.google_review_url ?? ""}
          error={errors.google_review_url}
          inputMode="url"
          hint="Where the review stand and the Leave a Google Review button send people."
        />
      </section>

      {state.message ? <Notice tone={state.ok ? "success" : "error"}>{state.message}</Notice> : null}
      <div>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
