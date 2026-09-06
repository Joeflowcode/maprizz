import "server-only";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type {
  Business,
  LeadRequest,
  Order,
  Profile,
  TapEvent,
  TapLink,
  TapLinkType,
  Subscription,
  UserRole,
  UserRoleRow,
} from "@/types/database";
import { adminEmails, isProduction } from "@/lib/env";
import type { Db } from "./types";
import { demoBusiness, demoProfile, demoTapLinks } from "./seed";
import { buildStats, thirtyDaysAgoIso } from "./stats";

/**
 * Development database. Lives in memory and, when a filesystem is available, is mirrored
 * to .dev-data/db.json so restarts don't lose your test orders. Never used when Supabase
 * is configured.
 */

type Store = {
  businesses: Business[];
  profiles: Profile[];
  tap_links: TapLink[];
  tap_events: TapEvent[];
  orders: Order[];
  subscriptions: Subscription[];
  lead_requests: LeadRequest[];
  user_roles: UserRoleRow[];
};

const FILE = path.join(process.cwd(), ".dev-data", "db.json");

function emptyStore(): Store {
  return {
    businesses: [demoBusiness],
    profiles: [demoProfile],
    tap_links: [...demoTapLinks],
    tap_events: [],
    orders: [],
    subscriptions: [],
    lead_requests: [],
    user_roles: [],
  };
}

function load(): Store {
  if (isProduction) return emptyStore();
  try {
    if (existsSync(FILE)) {
      const parsed = JSON.parse(readFileSync(FILE, "utf8")) as Store;
      // Make sure the demo business is always present even if someone edited the file.
      if (!parsed.businesses.some((b) => b.id === demoBusiness.id)) parsed.businesses.unshift(demoBusiness);
      if (!parsed.profiles.some((p) => p.id === demoProfile.id)) parsed.profiles.unshift(demoProfile);
      for (const link of demoTapLinks) {
        if (!parsed.tap_links.some((l) => l.id === link.id)) parsed.tap_links.unshift(link);
      }
      parsed.user_roles ??= [];
      parsed.lead_requests ??= [];
      parsed.subscriptions ??= [];
      return parsed;
    }
  } catch (error) {
    console.warn("[mock-db] could not read .dev-data/db.json, starting fresh", error);
  }
  return emptyStore();
}

const g = globalThis as unknown as { __maprizzStore?: Store; __maprizzFlush?: NodeJS.Timeout };
const store: Store = g.__maprizzStore ?? (g.__maprizzStore = load());

function persist() {
  if (isProduction) return;
  clearTimeout(g.__maprizzFlush);
  g.__maprizzFlush = setTimeout(() => {
    try {
      mkdirSync(path.dirname(FILE), { recursive: true });
      writeFileSync(FILE, JSON.stringify(store, null, 2));
    } catch (error) {
      console.warn("[mock-db] could not persist", error);
    }
  }, 150);
}

const nowIso = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();

function touch<T extends { updated_at: string }>(row: T, patch: object): T {
  Object.assign(row, patch, { updated_at: nowIso() });
  persist();
  return row;
}

function byNewest<T extends { created_at: string }>(a: T, b: T) {
  return b.created_at.localeCompare(a.created_at);
}

export const mockDb: Db = {
  kind: "mock",

  async getBusiness(id) {
    return store.businesses.find((b) => b.id === id) ?? null;
  },
  async getBusinessBySlug(slug) {
    return store.businesses.find((b) => b.slug === slug) ?? null;
  },
  async listBusinesses() {
    return [...store.businesses].sort(byNewest);
  },
  async listBusinessesForUser(userId, email) {
    const lower = email.toLowerCase();
    for (const b of store.businesses) {
      if (!b.owner_user_id && !b.is_demo && b.email?.toLowerCase() === lower) {
        touch(b, { owner_user_id: userId });
      }
    }
    return store.businesses.filter((b) => b.owner_user_id === userId).sort(byNewest);
  },
  async slugExists(slug) {
    return store.businesses.some((b) => b.slug === slug);
  },
  async createBusiness(input) {
    const row: Business = { ...input, is_demo: input.is_demo ?? false, id: uuid(), created_at: nowIso(), updated_at: nowIso() };
    store.businesses.push(row);
    persist();
    return row;
  },
  async updateBusiness(id, patch) {
    const row = store.businesses.find((b) => b.id === id);
    if (!row) throw new Error("Business not found");
    return touch(row, patch);
  },

  async getProfile(businessId) {
    return store.profiles.find((p) => p.business_id === businessId) ?? null;
  },
  async createProfile(input) {
    const row: Profile = { ...input, id: uuid(), created_at: nowIso(), updated_at: nowIso() };
    store.profiles.push(row);
    persist();
    return row;
  },
  async updateProfile(businessId, patch) {
    const row = store.profiles.find((p) => p.business_id === businessId);
    if (!row) throw new Error("Profile not found");
    return touch(row, patch);
  },

  async getTapLink(id) {
    return store.tap_links.find((l) => l.id === id) ?? null;
  },
  async getTapLinkByCode(code) {
    const upper = code.toUpperCase();
    return store.tap_links.find((l) => l.code === upper) ?? null;
  },
  async listTapLinks(businessId) {
    return store.tap_links.filter((l) => l.business_id === businessId).sort((a, b) => a.created_at.localeCompare(b.created_at));
  },
  async codeExists(code) {
    return store.tap_links.some((l) => l.code === code.toUpperCase());
  },
  async createTapLink(input) {
    const row: TapLink = { ...input, code: input.code.toUpperCase(), id: uuid(), created_at: nowIso(), updated_at: nowIso() };
    store.tap_links.push(row);
    persist();
    return row;
  },
  async updateTapLink(id, patch) {
    const row = store.tap_links.find((l) => l.id === id);
    if (!row) throw new Error("Tap link not found");
    return touch(row, patch);
  },

  async recordTap(tapLinkId, meta) {
    store.tap_events.push({ id: uuid(), tap_link_id: tapLinkId, created_at: nowIso(), referrer: meta.referrer, user_agent: meta.userAgent });
    persist();
  },
  async getTapStats(businessId, scope) {
    const ids = new Set(
      store.tap_links.filter((l) => l.business_id === businessId && (scope === "all" || l.type === scope)).map((l) => l.id),
    );
    const events = store.tap_events.filter((e) => ids.has(e.tap_link_id));
    const cutoff = thirtyDaysAgoIso();
    return buildStats(
      events.length,
      events.filter((e) => e.created_at >= cutoff).map((e) => e.created_at),
    );
  },
  async listRecentTaps(businessId, limit) {
    const types = new Map<string, TapLinkType>();
    for (const l of store.tap_links) if (l.business_id === businessId) types.set(l.id, l.type);
    return store.tap_events
      .filter((e) => types.has(e.tap_link_id))
      .sort(byNewest)
      .slice(0, limit)
      .map((e) => ({ ...e, type: types.get(e.tap_link_id)! }));
  },

  async getOrder(id) {
    return store.orders.find((o) => o.id === id) ?? null;
  },
  async getOrderByCheckoutSession(sessionId) {
    return store.orders.find((o) => o.stripe_checkout_session_id === sessionId) ?? null;
  },
  async listOrders() {
    return [...store.orders].sort(byNewest);
  },
  async listOrdersForBusiness(businessId) {
    return store.orders.filter((o) => o.business_id === businessId).sort(byNewest);
  },
  async createOrder(input) {
    const row: Order = { ...input, id: uuid(), created_at: nowIso(), updated_at: nowIso() };
    store.orders.push(row);
    persist();
    return row;
  },
  async updateOrder(id, patch) {
    const row = store.orders.find((o) => o.id === id);
    if (!row) throw new Error("Order not found");
    return touch(row, patch);
  },

  async getSubscription(id) {
    return store.subscriptions.find((s) => s.id === id) ?? null;
  },
  async getSubscriptionByCheckoutSession(sessionId) {
    return store.subscriptions.find((s) => s.stripe_checkout_session_id === sessionId) ?? null;
  },
  async getSubscriptionByStripeId(stripeSubscriptionId) {
    return store.subscriptions.find((s) => s.stripe_subscription_id === stripeSubscriptionId) ?? null;
  },
  async listSubscriptions() {
    return [...store.subscriptions].sort(byNewest);
  },
  async listSubscriptionsForBusiness(businessId) {
    return store.subscriptions.filter((s) => s.business_id === businessId).sort(byNewest);
  },
  async createSubscription(input) {
    const row: Subscription = { ...input, id: uuid(), created_at: nowIso(), updated_at: nowIso() };
    store.subscriptions.push(row);
    persist();
    return row;
  },
  async updateSubscription(id, patch) {
    const row = store.subscriptions.find((s) => s.id === id);
    if (!row) throw new Error("Subscription not found");
    return touch(row, patch);
  },

  async createLead(input) {
    const row: LeadRequest = {
      ...input,
      city: input.city ?? null,
      referral_slug: input.referral_slug ?? null,
      id: uuid(),
      created_at: nowIso(),
    };
    store.lead_requests.push(row);
    persist();
    return row;
  },
  async listLeads() {
    return [...store.lead_requests].sort(byNewest);
  },

  async getUserRole(userId) {
    return store.user_roles.find((r) => r.user_id === userId)?.role ?? null;
  },
  async ensureUser(userId, email) {
    const existing = store.user_roles.find((r) => r.user_id === userId);
    const role: UserRole = adminEmails().includes(email.toLowerCase()) ? "admin" : existing?.role ?? "customer";
    if (existing) {
      if (existing.role !== role) {
        existing.role = role;
        persist();
      }
      return existing.role;
    }
    store.user_roles.push({ user_id: userId, email, role, created_at: nowIso() });
    persist();
    return role;
  },
};
