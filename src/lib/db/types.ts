import type {
  Business,
  BusinessInsert,
  BusinessUpdate,
  LeadRequest,
  LeadRequestInsert,
  Order,
  OrderInsert,
  OrderUpdate,
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Subscription,
  SubscriptionInsert,
  SubscriptionUpdate,
  TapEvent,
  TapLink,
  TapLinkInsert,
  TapLinkType,
  TapLinkUpdate,
  TapStats,
  UserRole,
} from "@/types/database";

export type StatsScope = TapLinkType | "all";

/**
 * Everything the app needs from persistence. Implemented twice: Supabase (production)
 * and a JSON-file mock (local development with no credentials).
 */
export interface Db {
  readonly kind: "supabase" | "mock";

  // Businesses
  getBusiness(id: string): Promise<Business | null>;
  getBusinessBySlug(slug: string): Promise<Business | null>;
  listBusinesses(): Promise<Business[]>;
  /** Businesses owned by the user, plus unclaimed ones matching their email (claimed on read). */
  listBusinessesForUser(userId: string, email: string): Promise<Business[]>;
  slugExists(slug: string): Promise<boolean>;
  createBusiness(input: BusinessInsert): Promise<Business>;
  updateBusiness(id: string, patch: BusinessUpdate): Promise<Business>;

  // Profiles
  getProfile(businessId: string): Promise<Profile | null>;
  createProfile(input: ProfileInsert): Promise<Profile>;
  updateProfile(businessId: string, patch: ProfileUpdate): Promise<Profile>;

  // Tap links
  getTapLink(id: string): Promise<TapLink | null>;
  getTapLinkByCode(code: string): Promise<TapLink | null>;
  listTapLinks(businessId: string): Promise<TapLink[]>;
  codeExists(code: string): Promise<boolean>;
  createTapLink(input: TapLinkInsert): Promise<TapLink>;
  updateTapLink(id: string, patch: TapLinkUpdate): Promise<TapLink>;

  // Tap events
  recordTap(tapLinkId: string, meta: { referrer: string | null; userAgent: string | null }): Promise<void>;
  getTapStats(businessId: string, scope: StatsScope): Promise<TapStats>;
  listRecentTaps(businessId: string, limit: number): Promise<Array<TapEvent & { type: TapLinkType }>>;

  // Orders
  getOrder(id: string): Promise<Order | null>;
  getOrderByCheckoutSession(sessionId: string): Promise<Order | null>;
  listOrders(): Promise<Order[]>;
  listOrdersForBusiness(businessId: string): Promise<Order[]>;
  createOrder(input: OrderInsert): Promise<Order>;
  updateOrder(id: string, patch: OrderUpdate): Promise<Order>;

  // Subscriptions (monthly retainers)
  getSubscription(id: string): Promise<Subscription | null>;
  getSubscriptionByCheckoutSession(sessionId: string): Promise<Subscription | null>;
  getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | null>;
  listSubscriptions(): Promise<Subscription[]>;
  listSubscriptionsForBusiness(businessId: string): Promise<Subscription[]>;
  createSubscription(input: SubscriptionInsert): Promise<Subscription>;
  updateSubscription(id: string, patch: SubscriptionUpdate): Promise<Subscription>;

  // Leads
  createLead(input: LeadRequestInsert): Promise<LeadRequest>;
  listLeads(): Promise<LeadRequest[]>;

  // Roles
  getUserRole(userId: string): Promise<UserRole | null>;
  ensureUser(userId: string, email: string): Promise<UserRole>;
}
