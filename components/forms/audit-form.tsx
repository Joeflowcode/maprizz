"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auditInterests } from "@/lib/catalog";
import { site } from "@/lib/site";

export function AuditForm({ defaultInterest = "unsure" }: { defaultInterest?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const statusRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const selectedInterest = auditInterests.some((item) => item.value === defaultInterest) ? defaultInterest : "unsure";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const data = new FormData(event.currentTarget);
    if (data.get("company")) return;
    inFlight.current = true;
    setStatus("sending");
    const body = new URLSearchParams();
    data.forEach((value, key) => { if (typeof value === "string") body.set(key, value); });
    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        signal: AbortSignal.timeout(15000),
      });
      // Netlify returns its success page after processing. A static/preview host
      // may incorrectly return our form skeleton with HTTP 200; that is not a lead.
      const responseBody = await response.text();
      if (!response.ok || responseBody.includes("maprizz-form-skeleton")) throw new Error("Request not accepted");
      setStatus("success");
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch {
      setStatus("error");
      requestAnimationFrame(() => statusRef.current?.focus());
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <form name="business-audit" method="POST" action="/__forms.html" data-netlify="true" data-netlify-honeypot="company" className="rounded-xl border border-ink/10 bg-white p-6 sm:p-8" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value="business-audit" />
      {status === "success" ? (
        <div ref={statusRef} tabIndex={-1} role="status" className="rounded-lg bg-cream-deep p-6">
          <Check className="mb-4 h-7 w-7" aria-hidden="true" />
          <h2 className="text-2xl font-semibold tracking-tight">Your audit request is in.</h2>
          <p className="mt-3 text-base leading-relaxed text-stone">Thanks for sharing your business. Joey will review your Google presence and website, then follow up at the email you provided.</p>
          <Link href="/services" className="text-link mt-5">Explore monthly plans <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      ) : (
        <div className="grid gap-5">
          <div><p className="growth-eyebrow">YOUR FREE BUSINESS AUDIT</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Tell us where to look.</h2><p className="mt-2 text-base text-stone">A few details are all we need to get started.</p></div>
          <Field id="business_name" label="Business name" required autoComplete="organization" maxLength={160} />
          <Field id="city" label="City or service area" placeholder="Bend, Oregon" required maxLength={160} />
          <div className="grid gap-5 sm:grid-cols-2"><Field id="contact_name" label="Your name" required autoComplete="name" maxLength={120} /><Field id="email" label="Email" type="email" required autoComplete="email" maxLength={254} /></div>
          <Field id="website" label="Website or Google Maps link (optional)" placeholder="Your website or business listing" maxLength={2000} />
          <div><label htmlFor="interest" className="field-label">What would you like help with?</label><select id="interest" name="interest" defaultValue={selectedInterest} className="field-input">{auditInterests.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
          <details className="rounded-lg border border-ink/10 p-4"><summary className="cursor-pointer font-medium">Add a phone number or more details <span aria-hidden="true">+</span></summary><div className="mt-4 grid gap-5"><Field id="phone" label="Phone (optional)" type="tel" autoComplete="tel" maxLength={40} /><div><label htmlFor="notes" className="field-label">Anything else we should know? (optional)</label><textarea id="notes" name="notes" rows={3} maxLength={3000} className="field-input resize-y" /></div></div></details>
          <p hidden><label>Leave this empty<input name="company" tabIndex={-1} autoComplete="off" /></label></p>
          {status === "error" && <div ref={statusRef} tabIndex={-1} role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-base text-red-900">We couldn’t confirm your request. Your details are still here—please try again, or email <a href={`mailto:${site.email}?subject=Free%20business%20audit`} className="font-semibold underline">{site.email}</a>.</div>}
          <Button type="submit" size="lg" disabled={status === "sending"} aria-busy={status === "sending"} className="w-full">{status === "sending" ? <><LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> Sending your request…</> : <>Get my free audit <ArrowRight size={18} aria-hidden="true" /></>}</Button>
          <p className="text-sm leading-relaxed text-stone">We use your details to respond to this request. No obligation to buy. <Link href="/privacy" className="font-semibold text-brand underline">Privacy policy</Link></p>
        </div>
      )}
    </form>
  );
}

function Field({ id, label, type = "text", required = false, autoComplete, placeholder, maxLength }: { id: string; label: string; type?: string; required?: boolean; autoComplete?: string; placeholder?: string; maxLength?: number }) {
  return <div><label htmlFor={id} className="field-label">{label}</label><input id={id} name={id} type={type} required={required} autoComplete={autoComplete} placeholder={placeholder} maxLength={maxLength} className="field-input" /></div>;
}

export function AuditBullets() {
  return <div className="pt-2"><p className="growth-eyebrow mb-5">WHAT WE’LL LOOK AT</p><ul className="space-y-6 text-base leading-relaxed text-stone">{[
    ["Your Google presence", "Your business details, services, photos, and how easy you are to contact."],
    ["Your website", "Your mobile experience, service information, and the steps to request a quote."],
    ["Your review process", "How customers find your review link and whether your recent reviews get a response."],
  ].map(([title, copy]) => <li key={title} className="flex gap-3"><Check size={18} className="mt-1 shrink-0" aria-hidden="true" /><div><strong className="font-semibold text-ink">{title}</strong><p className="mt-1">{copy}</p></div></li>)}</ul><p className="mt-8 text-base leading-relaxed text-stone">Joey personally reviews your business and sends back the priorities. No Google login or payment details needed.</p><a href={`mailto:${site.email}`} className="text-link mt-6">{site.email}</a></div>;
}
