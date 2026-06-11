import "server-only";

import type { Database } from "@/types/database";

import { createClient } from "./supabase/server";

export type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
export type LeadMessageRow =
  Database["public"]["Tables"]["lead_messages"]["Row"];

export async function getLeadsForBusiness(
  businessId: string,
): Promise<LeadRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load leads: ${error.message}`);
  }

  return data ?? [];
}

export async function getLeadWithMessages({
  businessId,
  leadId,
}: {
  businessId: string;
  leadId: string;
}): Promise<{ lead: LeadRow; messages: LeadMessageRow[] } | null> {
  const supabase = await createClient();

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("business_id", businessId)
    .eq("id", leadId)
    .maybeSingle();

  if (leadError) {
    throw new Error(`Unable to load lead: ${leadError.message}`);
  }

  if (!lead) {
    return null;
  }

  const { data: messages, error: messagesError } = await supabase
    .from("lead_messages")
    .select("*")
    .eq("lead_id", lead.id)
    .order("created_at", { ascending: true });

  if (messagesError) {
    throw new Error(`Unable to load lead messages: ${messagesError.message}`);
  }

  return {
    lead,
    messages: messages ?? [],
  };
}
