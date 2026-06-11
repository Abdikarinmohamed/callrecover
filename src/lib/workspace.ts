import "server-only";

import { redirect } from "next/navigation";

import type { Database } from "@/types/database";

import { createClient } from "./supabase/server";

type Business = Database["public"]["Tables"]["businesses"]["Row"];

export async function getAuthenticatedWorkspace() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const business = await getBusinessForUser(user.id);

  return {
    user,
    business,
  };
}

export async function getBusinessForUser(userId: string): Promise<Business | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load business workspace: ${error.message}`);
  }

  return data;
}
