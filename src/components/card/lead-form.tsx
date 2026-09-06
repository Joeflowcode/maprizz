"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { leadHelpOptions } from "@/lib/tap-cards/seed";

type LeadFormProps = {
  referralSlug: string;
};

export function LeadForm({ referralSlug }: LeadFormProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (submitted) {
    return (
      <div
        id="audit-form"
        className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950"
      >
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Request received
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed">
          Thanks — Joey will look at your Google listing and website and reply
          with the fixes that matter most.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div id="audit-form">
        <Button
          type="button"
          size="xl"
          className="w-full"
          onClick={() => setOpen(true)}
        >
          Get a Free Business Audit
        </Button>
        <p className="mt-3 text-center text-sm text-stone">
          60 seconds. No pitch. A real look at what to fix first.
        </p>
      </div>
    );
  }

  return (
    <form
      id="audit-form"
      className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm sm:p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setPending(true);
        const form = event.currentTarget;
        const data = new FormData(form);
        const payload = {
          name: String(data.get("name") ?? ""),
          business_name: String(data.get("business_name") ?? ""),
          phone: String(data.get("phone") ?? ""),
          email: String(data.get("email") ?? ""),
          website: String(data.get("website") ?? ""),
          city: String(data.get("city") ?? ""),
          message: String(data.get("message") ?? ""),
          company: String(data.get("bot-field") ?? ""),
          referral_slug: referralSlug,
        };

        try {
          const response = await fetch("/api/card-lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const result = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          if (!response.ok) {
            throw new Error(result.error || "Could not send that. Try again.");
          }

          const formFields = new URLSearchParams();
          formFields.set("form-name", "tap-card-lead");
          formFields.set("name", payload.name);
          formFields.set("business_name", payload.business_name);
          formFields.set("phone", payload.phone);
          formFields.set("email", payload.email);
          formFields.set("website", payload.website);
          formFields.set("city", payload.city);
          formFields.set("message", payload.message);
          formFields.set("referral_slug", payload.referral_slug);
          void fetch("/__forms.html", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formFields.toString(),
          }).catch(() => undefined);

          setSubmitted(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not send that.");
        } finally {
          setPending(false);
        }
      }}
    >
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        Get a free business audit
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-stone">
        Tell Joey where to look. He&apos;ll reply with what&apos;s working and
        what to fix first.
      </p>

      <div className="mt-5 grid gap-4">
        <Field id="name" label="Your name" autoComplete="name" required />
        <Field id="business_name" label="Business name" required />
        <Field id="city" label="City or service area" autoComplete="address-level2" required />
        <Field id="phone" label="Phone" type="tel" autoComplete="tel" required />
        <Field id="email" label="Email" type="email" autoComplete="email" required />
        <Field id="website" label="Website (optional)" />
        <div>
          <label htmlFor="message" className="field-label">
            What do you want help with?
          </label>
          <select id="message" name="message" className="field-input" defaultValue="not-sure">
            {leadHelpOptions.map((option) => (
              <option key={option.value} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <input
          id="bot-field"
          name="bot-field"
          tabIndex={-1}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
          className="-left-[9999px] absolute h-px w-px opacity-0"
          aria-hidden="true"
        />
        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Request my free audit"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required = false,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="field-input"
      />
    </div>
  );
}
