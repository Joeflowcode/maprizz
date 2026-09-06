"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { DEV_SESSION_COOKIE } from "@/lib/auth";
import { siteOrigin, useMockAuth } from "@/lib/env";
import { email as emailSchema } from "@/lib/validation";

export type LoginState = { status: "idle" | "sent" | "error"; message?: string; email?: string };

function safeNext(value: unknown) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

/** Supabase magic link. */
export async function sendMagicLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { status: "error", message: "Enter a valid email address." };
  const next = safeNext(formData.get("next"));

  if (useMockAuth) return { status: "error", message: "Supabase is not configured. Use the development login below." };

  const { supabaseAuthClient } = await import("@/lib/supabase/server");
  const supabase = await supabaseAuthClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: { emailRedirectTo: `${siteOrigin()}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error) return { status: "error", message: error.message };
  return { status: "sent", email: parsed.data };
}

const devSchema = z.object({ email: emailSchema, role: z.enum(["customer", "admin"]) });

/** Development-only login: sets a plain cookie. Only available when Supabase is absent and dev mode is allowed. */
export async function devLogin(formData: FormData) {
  if (!useMockAuth) redirect("/login?error=dev-disabled");
  const parsed = devSchema.safeParse({ email: formData.get("email"), role: formData.get("role") });
  if (!parsed.success) redirect("/login?error=invalid");
  const next = safeNext(formData.get("next"));
  // Stable id per email so businesses stay attached across logins.
  const id = `dev-${Buffer.from(parsed.data.email.toLowerCase()).toString("base64url").slice(0, 24)}`;
  (await cookies()).set(DEV_SESSION_COOKIE, JSON.stringify({ id, email: parsed.data.email.toLowerCase(), role: parsed.data.role }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(next);
}

export async function signOut() {
  const store = await cookies();
  if (useMockAuth) {
    store.delete(DEV_SESSION_COOKIE);
  } else {
    const { supabaseAuthClient } = await import("@/lib/supabase/server");
    const supabase = await supabaseAuthClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
