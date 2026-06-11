import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

import { getSupabaseServerConfig } from "./server-env";

export function createSupabaseAdminClient() {
  const { supabaseUrl, supabaseSecretKey } = getSupabaseServerConfig();

  return createClient<Database>(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
