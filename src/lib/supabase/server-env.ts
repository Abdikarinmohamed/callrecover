import "server-only";

import { getSupabasePublicConfig } from "./public-env";

export function getSupabaseServerConfig() {
  const { supabaseUrl, supabasePublishableKey } = getSupabasePublicConfig();
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseSecretKey) {
    throw new Error("Missing SUPABASE_SECRET_KEY.");
  }

  return {
    supabaseUrl,
    supabasePublishableKey,
    supabaseSecretKey,
  };
}
