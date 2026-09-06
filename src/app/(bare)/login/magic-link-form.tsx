"use client";

import { useActionState } from "react";
import { ArrowRight, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/forms/field";
import { sendMagicLink, type LoginState } from "./actions";

export function MagicLinkForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(sendMagicLink, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div className="mt-6 rounded-2xl bg-white p-6 text-center" role="status">
        <MailCheck className="mx-auto h-9 w-9 text-brand" aria-hidden="true" />
        <p className="mt-3 font-semibold">Check your email</p>
        <p className="mt-1 text-sm text-stone">We sent a sign-in link to {state.email}. It expires in about an hour.</p>
      </div>
    );
  }

  return (
    <form action={action} className="mt-6 grid gap-4">
      <input type="hidden" name="next" value={next} />
      <InputField id="email" label="Email" type="email" autoComplete="email" inputMode="email" required error={state.status === "error" ? state.message : undefined} />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : "Email me a sign-in link"}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </form>
  );
}
