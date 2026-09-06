import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { siteOrigin } from "@/lib/env";
import { isValidSlug, normalizeSlug } from "./device";
import { JOEY_CARD_SLUG, reservedSlugs, seedCards } from "./seed";
import type {
  CardLead,
  CardStats,
  CardVisit,
  CreateCardInput,
  CreateLeadInput,
  ReferralCard,
  TapStoreState,
} from "./types";

const STORE_KEY = "state";
const BLOBS_STORE = "tap-cards";

function emptyState(): TapStoreState {
  return {
    cards: seedCards.map((card) => ({ ...card })),
    visits: [],
    leads: [],
  };
}

function mergeSeedCards(state: TapStoreState): TapStoreState {
  const bySlug = new Map(state.cards.map((card) => [card.slug, card]));
  for (const seed of seedCards) {
    if (!bySlug.has(seed.slug)) {
      state.cards.push({ ...seed });
    }
  }
  return state;
}

function cardUrl(slug: string) {
  return `${siteOrigin()}/c/${slug}`;
}

function conversionRate(visits: number, leads: number) {
  if (visits <= 0) return 0;
  return Math.round((leads / visits) * 1000) / 10;
}

let memoryState: TapStoreState | null = null;
let writeQueue: Promise<unknown> = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(fn, fn);
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function dataFilePath() {
  const dir = process.env.TAP_CARDS_DATA_DIR?.trim() || path.join(process.cwd(), ".data");
  return path.join(dir, "tap-cards.json");
}

function canUseFiles() {
  return process.env.NETLIFY !== "true";
}

async function readFromFile(): Promise<TapStoreState | null> {
  try {
    const raw = await readFile(dataFilePath(), "utf8");
    return JSON.parse(raw) as TapStoreState;
  } catch {
    return null;
  }
}

async function writeToFile(state: TapStoreState) {
  const file = dataFilePath();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(state, null, 2), "utf8");
}

async function getBlobStore() {
  const { getStore } = await import("@netlify/blobs");
  return getStore({ name: BLOBS_STORE, consistency: "strong" });
}

async function readFromBlobs(): Promise<TapStoreState | null> {
  try {
    const store = await getBlobStore();
    const data = await store.get(STORE_KEY, { type: "json" });
    return (data as TapStoreState | null) ?? null;
  } catch {
    return null;
  }
}

async function writeToBlobs(state: TapStoreState) {
  const store = await getBlobStore();
  await store.setJSON(STORE_KEY, state);
}

async function loadState(): Promise<TapStoreState> {
  const fromFile = canUseFiles() ? await readFromFile() : null;
  if (fromFile) {
    memoryState = mergeSeedCards(fromFile);
    return memoryState;
  }

  const fromBlobs = await readFromBlobs();
  if (fromBlobs) {
    memoryState = mergeSeedCards(fromBlobs);
    return memoryState;
  }

  if (memoryState) return memoryState;
  memoryState = emptyState();
  return memoryState;
}

async function persist(state: TapStoreState) {
  memoryState = state;
  if (canUseFiles()) {
    await writeToFile(state);
    return;
  }
  try {
    await writeToBlobs(state);
  } catch {
    // Keep the in-memory copy so this isolate still works if Blobs is unavailable.
  }
}

export async function listCards() {
  const state = await loadState();
  return [...state.cards].sort((a, b) => a.referrer_name.localeCompare(b.referrer_name));
}

export async function getCardBySlug(slug: string): Promise<ReferralCard | null> {
  const normalized = normalizeSlug(slug);
  if (!normalized) return null;
  const state = await loadState();
  return state.cards.find((card) => card.slug === normalized) ?? null;
}

export async function getActiveCardBySlug(slug: string) {
  const card = await getCardBySlug(slug);
  if (!card || !card.active) return null;
  return card;
}

export async function createCard(input: CreateCardInput): Promise<ReferralCard> {
  return enqueue(async () => {
    const slug = normalizeSlug(input.slug);
    if (!isValidSlug(slug)) {
      throw new Error("Use a short URL like jacqueline or barber-downtown.");
    }
    if (reservedSlugs.has(slug)) {
      throw new Error("That URL is reserved. Try another slug.");
    }

    const state = await loadState();
    if (state.cards.some((card) => card.slug === slug)) {
      throw new Error("That card URL is already in use.");
    }

    const card: ReferralCard = {
      id: crypto.randomUUID(),
      slug,
      referrer_name: input.referrer_name.trim(),
      label: input.label?.trim() || input.referrer_name.trim(),
      created_at: new Date().toISOString(),
      active: true,
    };

    if (!card.referrer_name) {
      throw new Error("Add the referrer name.");
    }

    state.cards.push(card);
    await persist(state);
    return card;
  });
}

export async function setCardActive(slug: string, active: boolean) {
  return enqueue(async () => {
    const state = await loadState();
    const card = state.cards.find((item) => item.slug === normalizeSlug(slug));
    if (!card) throw new Error("Card not found.");
    if (card.slug === JOEY_CARD_SLUG && !active) {
      throw new Error("Joey's card stays active so /card keeps working.");
    }
    card.active = active;
    await persist(state);
    return card;
  });
}

export async function recordVisit(input: {
  card: ReferralCard;
  landing_page: string;
  device: CardVisit["device"];
  source?: string;
}) {
  return enqueue(async () => {
    const state = await loadState();
    const visit: CardVisit = {
      id: crypto.randomUUID(),
      card_id: input.card.id,
      timestamp: new Date().toISOString(),
      source: input.source ?? "tap-or-scan",
      device: input.device,
      landing_page: input.landing_page,
    };
    state.visits.push(visit);
    await persist(state);
    return visit;
  });
}

export async function createLead(input: CreateLeadInput): Promise<CardLead> {
  return enqueue(async () => {
    if (input.company?.trim()) {
      throw new Error("Ignored.");
    }

    const name = input.name.trim();
    const business_name = input.business_name.trim();
    const phone = input.phone.trim();
    const email = input.email.trim();
    const website = input.website?.trim() ?? "";
    const city = input.city?.trim() ?? "";
    const message = input.message?.trim() ?? "";
    const referral_slug = normalizeSlug(input.referral_slug);

    if (!name || !business_name || !email || !city) {
      throw new Error("Name, business name, city, and email are required.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Enter a valid email address.");
    }

    const state = await loadState();
    const card = state.cards.find((item) => item.slug === referral_slug);
    if (!card) {
      throw new Error("This card isn't set up.");
    }
    if (!card.active) {
      throw new Error("This card is no longer active.");
    }

    const lead: CardLead = {
      id: crypto.randomUUID(),
      name,
      business_name,
      phone,
      email,
      website,
      city,
      message,
      referral_card_id: card.id,
      referral_slug: card.slug,
      created_at: new Date().toISOString(),
    };

    state.leads.push(lead);
    await persist(state);
    return lead;
  });
}

export async function listLeadsForCard(cardId: string) {
  const state = await loadState();
  return state.leads
    .filter((lead) => lead.referral_card_id === cardId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getCardStatsList(): Promise<CardStats[]> {
  const state = await loadState();
  return state.cards
    .map((card) => {
      const visits = state.visits.filter((visit) => visit.card_id === card.id).length;
      const leads = state.leads.filter((lead) => lead.referral_card_id === card.id).length;
      return {
        card,
        visits,
        leads,
        conversion_rate: conversionRate(visits, leads),
        url: cardUrl(card.slug),
      };
    })
    .sort((a, b) => b.leads - a.leads || b.visits - a.visits || a.card.referrer_name.localeCompare(b.card.referrer_name));
}

export async function getCardDetail(slug: string) {
  const card = await getCardBySlug(slug);
  if (!card) return null;
  const [stats] = (await getCardStatsList()).filter((item) => item.card.id === card.id);
  const leads = await listLeadsForCard(card.id);
  return {
    card,
    stats: stats ?? {
      card,
      visits: 0,
      leads: 0,
      conversion_rate: 0,
      url: cardUrl(card.slug),
    },
    leads,
  };
}

export { cardUrl };
