"use server";

import { revalidatePath } from "next/cache";

import { normalizeLeadStatus, type LeadStatus } from "@/lib/lead-utils";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedWorkspace } from "@/lib/workspace";

const allowedStatuses: LeadStatus[] = [
  "new",
  "needs_reply",
  "waiting",
  "booked",
  "closed",
  "lost",
];

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid lead status.");
  }

  const { business } = await getAuthenticatedWorkspace();

  if (!business) {
    throw new Error("Business workspace is required.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", leadId)
    .eq("business_id", business.id);

  if (error) {
    throw new Error(`Unable to update lead status: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/leads/${leadId}`);
}

export async function addBusinessMessage(leadId: string, body: string) {
  const messageBody = body.trim();

  if (!messageBody) {
    throw new Error("Message body is required.");
  }

  const { business } = await getAuthenticatedWorkspace();

  if (!business) {
    throw new Error("Business workspace is required.");
  }

  const supabase = await createClient();
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("id, status")
    .eq("id", leadId)
    .eq("business_id", business.id)
    .maybeSingle();

  if (leadError) {
    throw new Error(`Unable to load lead: ${leadError.message}`);
  }

  if (!lead) {
    throw new Error("Lead not found.");
  }

  const { data: message, error: messageError } = await supabase
    .from("lead_messages")
    .insert({
      lead_id: lead.id,
      sender: "business",
      body: messageBody,
      direction: "outbound",
    })
    .select("id, created_at")
    .single();

  if (messageError) {
    throw new Error(`Unable to add message: ${messageError.message}`);
  }

  const currentStatus = normalizeLeadStatus(lead.status);
  const nextStatus =
    currentStatus === "new" || currentStatus === "needs_reply"
      ? "waiting"
      : currentStatus;
  const { error: updateError } = await supabase
    .from("leads")
    .update({
      last_message: messageBody,
      last_message_at: new Date().toISOString(),
      status: nextStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", lead.id)
    .eq("business_id", business.id);

  if (updateError) {
    throw new Error(`Unable to update lead: ${updateError.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/leads/${leadId}`);

  return {
    created_at: message.created_at,
    id: message.id,
    status: nextStatus,
  };
}
