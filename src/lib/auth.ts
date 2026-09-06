import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { Business, UserRole } from "@/types/database";
import { adminEmails, supabaseConfigured, useMockAuth } from "@/lib/env";
import { getDb } from "@/lib/db";

export type Session = { userId: string; email: string; role: UserRole };

export const DEV_SESSION_COOKIE = "maprizz_dev_session";

/**
 * Resolve the signed-in user for this request. Supabase in production; in dev/mock mode
 * a plain cookie set by the dev login screen (only when Supabase is not configured).
 */
export const getSession = cache(async (): Promise<Session | null> => {
  if (useMockAuth) {
    const raw = (await cookies()).get(DEV_SESSION_COOKIE)?.value;
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { id: string; email: string; role: UserRole };
      if (!parsed.id || !parsed.email) return null;
      const db = await getDb();
      const role = await db.ensureUser(parsed.id, parsed.email);
      // Dev login lets you pick admin; keep it unless ADMIN_EMAILS says otherwise.
      return { userId: parsed.id, email: parsed.email, role: parsed.role === "admin" ? "admin" : role };
    } catch {
      return null;
    }
  }

  // Production without Supabase: nobody can sign in (rather than a 500 on every auth page).
  if (!supabaseConfigured) return null;

  const { supabaseAuthClient } = await import("@/lib/supabase/server");
  const supabase = await supabaseAuthClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user?.email) return null;
  const db = await getDb();
  const role = await db.ensureUser(user.id, user.email);
  return { userId: user.id, email: user.email, role };
});

export async function requireUser(nextPath = "/dashboard"): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return session;
}

export async function requireAdmin(nextPath = "/admin"): Promise<Session> {
  const session = await requireUser(nextPath);
  if (session.role !== "admin") redirect("/dashboard?denied=admin");
  return session;
}

export function isAdminSession(session: Session | null) {
  return session?.role === "admin";
}

/** Fetch a business only if the caller owns it or is an admin. Returns null otherwise. */
export async function authorizeBusiness(session: Session, businessId: string): Promise<Business | null> {
  const db = await getDb();
  const business = await db.getBusiness(businessId);
  if (!business) return null;
  if (session.role === "admin") return business;
  if (business.owner_user_id === session.userId) return business;
  // Unclaimed business created for this email (checkout / field sales): claim it.
  if (!business.owner_user_id && !business.is_demo && business.email?.toLowerCase() === session.email.toLowerCase()) {
    return db.updateBusiness(business.id, { owner_user_id: session.userId });
  }
  return null;
}

export function bootstrapAdminConfigured() {
  return adminEmails().length > 0;
}
