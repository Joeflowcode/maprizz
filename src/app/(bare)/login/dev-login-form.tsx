import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField, SelectField } from "@/components/forms/field";
import { devLogin } from "./actions";

/** Shown only when Supabase is not configured. */
export function DevLoginForm({ next }: { next: string }) {
  return (
    <form action={devLogin} className="mt-6 grid gap-4">
      <div className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
        <p className="font-semibold">Development login</p>
        <p className="mt-0.5 text-stone">Supabase isn&apos;t configured, so this signs you in locally with the role you pick. Not available in production.</p>
      </div>
      <input type="hidden" name="next" value={next} />
      <InputField id="email" label="Email" type="email" autoComplete="email" defaultValue="owner@example.com" required />
      <SelectField id="role" label="Role" defaultValue="admin">
        <option value="admin">Admin (field sales, fulfillment, all businesses)</option>
        <option value="customer">Customer (own businesses only)</option>
      </SelectField>
      <Button type="submit" size="lg">
        Continue
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </form>
  );
}
