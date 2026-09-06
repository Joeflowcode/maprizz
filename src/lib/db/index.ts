import "server-only";
import { useMockDb } from "@/lib/env";
import type { Db } from "./types";

let instance: Db | null = null;

/** The one place the app decides between Supabase and the local mock database. */
export async function getDb(): Promise<Db> {
  if (instance) return instance;
  if (useMockDb) {
    instance = (await import("./mock")).mockDb;
  } else {
    instance = (await import("./supabase")).supabaseDb;
  }
  return instance;
}

export type { Db, StatsScope } from "./types";
