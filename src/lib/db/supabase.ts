import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Business, Order, Profile, Subscription, TapEvent, TapLink, TapLinkType, UserRole } from "@/types/database";
import { adminEmails } from "@/lib/env";
import type { Db } from "./types";
import { buildStats, thirtyDaysAgoIso } from "./stats";

/**
 * Supabase implementation. Uses the service-role key on the server only; every caller
 * (route handler, server action, page) performs its own authorization first via
 * lib/auth. RLS policies in supabase/migrations protect the tables from any other client.
 */

let client: SupabaseClient | null = null;

export function serviceClient(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

function must<T>(result: { data: T | null; error: { message: string } | null }, what: string): T {
  if (result.error) throw new Error(`${what}: ${result.error.message}`);
  if (result.data === null) throw new Error(`${what}: no data`);
  return result.data;
}

function maybe<T>(result: { data: T | null; error: { message: string; code?: string } | null }, what: string): T | null {
  if (result.error) {
    if (result.error.code === "PGRST116") return null; // no rows
    throw new Error(`${what}: ${result.error.message}`);
  }
  return result.data;
}

export const supabaseDb: Db = {
  kind: "supabase",

  async getBusiness(id) {
    return maybe(await serviceClient().from("businesses").select("*").eq("id", id).maybeSingle<Business>(), "getBusiness");
  },
  async getBusinessBySlug(slug) {
    return maybe(await serviceClient().from("businesses").select("*").eq("slug", slug).maybeSingle<Business>(), "getBusinessBySlug");
  },
  async listBusinesses() {
    return must(await serviceClient().from("businesses").select("*").order("created_at", { ascending: false }).returns<Business[]>(), "listBusinesses");
  },
  async listBusinessesForUser(userId, email) {
    const sb = serviceClient();
    // Claim unowned businesses created for this email (field sales / checkout before login).
    await sb
      .from("businesses")
      .update({ owner_user_id: userId })
      .is("owner_user_id", null)
      .eq("is_demo", false)
      .ilike("email", email);
    return must(
      await sb.from("businesses").select("*").eq("owner_user_id", userId).order("created_at", { ascending: false }).returns<Business[]>(),
      "listBusinessesForUser",
    );
  },
  async slugExists(slug) {
    const { count, error } = await serviceClient().from("businesses").select("id", { count: "exact", head: true }).eq("slug", slug);
    if (error) throw new Error(error.message);
    return (count ?? 0) > 0;
  },
  async createBusiness(input) {
    return must(await serviceClient().from("businesses").insert(input).select("*").single<Business>(), "createBusiness");
  },
  async updateBusiness(id, patch) {
    return must(await serviceClient().from("businesses").update(patch).eq("id", id).select("*").single<Business>(), "updateBusiness");
  },

  async getProfile(businessId) {
    return maybe(await serviceClient().from("profiles").select("*").eq("business_id", businessId).maybeSingle<Profile>(), "getProfile");
  },
  async createProfile(input) {
    return must(await serviceClient().from("profiles").insert(input).select("*").single<Profile>(), "createProfile");
  },
  async updateProfile(businessId, patch) {
    return must(
      await serviceClient().from("profiles").update(patch).eq("business_id", businessId).select("*").single<Profile>(),
      "updateProfile",
    );
  },

  async getTapLink(id) {
    return maybe(await serviceClient().from("tap_links").select("*").eq("id", id).maybeSingle<TapLink>(), "getTapLink");
  },
  async getTapLinkByCode(code) {
    return maybe(
      await serviceClient().from("tap_links").select("*").eq("code", code.toUpperCase()).maybeSingle<TapLink>(),
      "getTapLinkByCode",
    );
  },
  async listTapLinks(businessId) {
    return must(
      await serviceClient().from("tap_links").select("*").eq("business_id", businessId).order("created_at").returns<TapLink[]>(),
      "listTapLinks",
    );
  },
  async codeExists(code) {
    const { count, error } = await serviceClient().from("tap_links").select("id", { count: "exact", head: true }).eq("code", code.toUpperCase());
    if (error) throw new Error(error.message);
    return (count ?? 0) > 0;
  },
  async createTapLink(input) {
    return must(
      await serviceClient().from("tap_links").insert({ ...input, code: input.code.toUpperCase() }).select("*").single<TapLink>(),
      "createTapLink",
    );
  },
  async updateTapLink(id, patch) {
    return must(await serviceClient().from("tap_links").update(patch).eq("id", id).select("*").single<TapLink>(), "updateTapLink");
  },

  async recordTap(tapLinkId, meta) {
    const { error } = await serviceClient()
      .from("tap_events")
      .insert({ tap_link_id: tapLinkId, referrer: meta.referrer, user_agent: meta.userAgent });
    if (error) console.error("[tap_events] insert failed", error.message);
  },
  async getTapStats(businessId, scope) {
    const sb = serviceClient();
    let linkQuery = sb.from("tap_links").select("id").eq("business_id", businessId);
    if (scope !== "all") linkQuery = linkQuery.eq("type", scope);
    const ids = must(await linkQuery.returns<Array<{ id: string }>>(), "getTapStats.links").map((l) => l.id);
    if (ids.length === 0) return buildStats(0, []);

    const [{ count, error }, recent] = await Promise.all([
      sb.from("tap_events").select("id", { count: "exact", head: true }).in("tap_link_id", ids),
      sb
        .from("tap_events")
        .select("created_at")
        .in("tap_link_id", ids)
        .gte("created_at", thirtyDaysAgoIso())
        .returns<Array<{ created_at: string }>>(),
    ]);
    if (error) throw new Error(error.message);
    return buildStats(count ?? 0, must(recent, "getTapStats.recent").map((e) => e.created_at));
  },
  async listRecentTaps(businessId, limit) {
    const sb = serviceClient();
    const links = must(
      await sb.from("tap_links").select("id,type").eq("business_id", businessId).returns<Array<{ id: string; type: TapLinkType }>>(),
      "listRecentTaps.links",
    );
    if (links.length === 0) return [];
    const types = new Map(links.map((l) => [l.id, l.type]));
    const events = must(
      await sb
        .from("tap_events")
        .select("*")
        .in("tap_link_id", [...types.keys()])
        .order("created_at", { ascending: false })
        .limit(limit)
        .returns<TapEvent[]>(),
      "listRecentTaps.events",
    );
    return events.map((e) => ({ ...e, type: types.get(e.tap_link_id)! }));
  },

  async getOrder(id) {
    return maybe(await serviceClient().from("orders").select("*").eq("id", id).maybeSingle<Order>(), "getOrder");
  },
  async getOrderByCheckoutSession(sessionId) {
    return maybe(
      await serviceClient().from("orders").select("*").eq("stripe_checkout_session_id", sessionId).maybeSingle<Order>(),
      "getOrderByCheckoutSession",
    );
  },
  async listOrders() {
    return must(await serviceClient().from("orders").select("*").order("created_at", { ascending: false }).returns<Order[]>(), "listOrders");
  },
  async listOrdersForBusiness(businessId) {
    return must(
      await serviceClient().from("orders").select("*").eq("business_id", businessId).order("created_at", { ascending: false }).returns<Order[]>(),
      "listOrdersForBusiness",
    );
  },
  async createOrder(input) {
    return must(await serviceClient().from("orders").insert(input).select("*").single<Order>(), "createOrder");
  },
  async updateOrder(id, patch) {
    return must(await serviceClient().from("orders").update(patch).eq("id", id).select("*").single<Order>(), "updateOrder");
  },

  async getSubscription(id) {
    return maybe(await serviceClient().from("subscriptions").select("*").eq("id", id).maybeSingle<Subscription>(), "getSubscription");
  },
  async getSubscriptionByCheckoutSession(sessionId) {
    return maybe(
      await serviceClient().from("subscriptions").select("*").eq("stripe_checkout_session_id", sessionId).maybeSingle<Subscription>(),
      "getSubscriptionByCheckoutSession",
    );
  },
  async getSubscriptionByStripeId(stripeSubscriptionId) {
    return maybe(
      await serviceClient().from("subscriptions").select("*").eq("stripe_subscription_id", stripeSubscriptionId).maybeSingle<Subscription>(),
      "getSubscriptionByStripeId",
    );
  },
  async listSubscriptions() {
    return must(
      await serviceClient().from("subscriptions").select("*").order("created_at", { ascending: false }).returns<Subscription[]>(),
      "listSubscriptions",
    );
  },
  async listSubscriptionsForBusiness(businessId) {
    return must(
      await serviceClient()
        .from("subscriptions")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false })
        .returns<Subscription[]>(),
      "listSubscriptionsForBusiness",
    );
  },
  async createSubscription(input) {
    return must(await serviceClient().from("subscriptions").insert(input).select("*").single<Subscription>(), "createSubscription");
  },
  async updateSubscription(id, patch) {
    return must(await serviceClient().from("subscriptions").update(patch).eq("id", id).select("*").single<Subscription>(), "updateSubscription");
  },

  async createLead(input) {
    return must(await serviceClient().from("lead_requests").insert(input).select("*").single(), "createLead");
  },
  async listLeads() {
    return must(await serviceClient().from("lead_requests").select("*").order("created_at", { ascending: false }), "listLeads");
  },

  async getUserRole(userId) {
    const row = maybe(
      await serviceClient().from("user_roles").select("role").eq("user_id", userId).maybeSingle<{ role: UserRole }>(),
      "getUserRole",
    );
    return row?.role ?? null;
  },
  async ensureUser(userId, email) {
    const sb = serviceClient();
    const existing = await this.getUserRole(userId);
    const bootstrapAdmin = adminEmails().includes(email.toLowerCase());
    const role: UserRole = bootstrapAdmin ? "admin" : existing ?? "customer";
    if (existing !== role) {
      const { error } = await sb.from("user_roles").upsert({ user_id: userId, email, role }, { onConflict: "user_id" });
      if (error) throw new Error(`ensureUser: ${error.message}`);
    }
    return role;
  },
};
