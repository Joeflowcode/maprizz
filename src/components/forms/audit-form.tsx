"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField, SelectField, TextareaField } from "@/components/forms/field";
import { useFormSubmit } from "@/components/forms/use-form-submit";
import { leadInterests, type LeadInterest } from "@/lib/services";

export function AuditForm({
  initialInterest = "not_sure",
  referralSlug = "",
}: {
  initialInterest?: LeadInterest;
  referralSlug?: string;
}) {
  const { state, errors, message, submit } = useFormSubmit("/api/lead");
  const [values, setValues] = useState({
    business_name: "",
    city: "",
    website: "",
    google_business_url: "",
    contact_name: "",
    phone: "",
    email: "",
    interest: initialInterest as string,
    notes: "",
    company: "",
    referral_slug: referralSlug,
  });

  function update(key: keyof typeof values) {
    return (event: { target: { value: string } }) => setValues((v) => ({ ...v, [key]: event.target.value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await submit(values);
  }

  if (state === "success") {
    return (
      <div className="rounded-3xl border border-ink/10 bg-white p-8 text-center sm:p-10" role="status">
        <CheckCircle2 className="mx-auto h-10 w-10 text-brand" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em]">Got it. We&apos;re on it.</h2>
        <p className="mt-3 text-stone">
          We&apos;ll look at {values.business_name || "your business"} and reply to {values.email} within two business days.
        </p>
        <ol className="mt-8 grid gap-3 text-left text-[15px] text-ink/90">
          <li className="rounded-2xl bg-cream px-4 py-3">
            <span className="font-semibold">1. We look.</span> Google listing, website, and how people contact you.
          </li>
          <li className="rounded-2xl bg-cream px-4 py-3">
            <span className="font-semibold">2. You get notes.</span> A short list of what to fix first — not a score.
          </li>
          <li className="rounded-2xl bg-cream px-4 py-3">
            <span className="font-semibold">3. You decide.</span> If a plan fits, we recommend one. If it doesn&apos;t, we say so.
          </li>
        </ol>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5 rounded-3xl border border-ink/10 bg-white p-5 sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <InputField id="business_name" label="Business name" value={values.business_name} onChange={update("business_name")} error={errors.business_name} autoComplete="organization" required />
        <InputField id="city" label="City or service area" placeholder="Bend, Oregon" value={values.city} onChange={update("city")} error={errors.city} autoComplete="address-level2" required />
        <InputField id="contact_name" label="Your name" value={values.contact_name} onChange={update("contact_name")} error={errors.contact_name} autoComplete="name" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <InputField id="email" label="Email" type="email" value={values.email} onChange={update("email")} error={errors.email} autoComplete="email" inputMode="email" required />
        <InputField id="phone" label="Phone" type="tel" optional value={values.phone} onChange={update("phone")} error={errors.phone} autoComplete="tel" inputMode="tel" />
      </div>
      <InputField id="website" label="Website" optional placeholder="yourbusiness.com" value={values.website} onChange={update("website")} error={errors.website} inputMode="url" />
      <InputField
        id="google_business_url"
        label="Google Business Profile URL"
        optional
        hint="Search your business on Google Maps and paste the link."
        placeholder="https://maps.app.goo.gl/…"
        value={values.google_business_url}
        onChange={update("google_business_url")}
        error={errors.google_business_url}
        inputMode="url"
      />
      <SelectField id="interest" label="What are you looking for?" value={values.interest} onChange={update("interest")} error={errors.interest} hint="Helps us focus the audit. You can change your mind.">
        {leadInterests.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </SelectField>
      <TextareaField id="notes" label="Anything we should know?" optional rows={3} value={values.notes} onChange={update("notes")} error={errors.notes} />

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
          value={values.company}
          onChange={update("company")}
        />
      </div>

      {state === "error" && message ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {message}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={state === "submitting"} className="sm:shrink-0">
          {state === "submitting" ? "Sending…" : "Get My Free Audit"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        <p className="text-xs text-stone">
          We only use this to reply to you.{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            Privacy
          </Link>
        </p>
      </div>
    </form>
  );
}
