"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

import { getSupabasePublicConfig } from "./public-env";

export function createClient() {
  const { supabaseUrl, supabasePublishableKey } = getSupabasePublicConfig();

  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}

export const createSupabaseBrowserClient = createClient;
