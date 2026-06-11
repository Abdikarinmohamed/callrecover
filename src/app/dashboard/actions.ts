"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedWorkspace } from "@/lib/workspace";

export async function createTestLead() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const { business } = await getAuthenticatedWorkspace();

  if (!business) {
    return;
  }

  const supabase = await createClient();
  const now = new Date();
  const minutesAgo = (minutes: number) => {
    return new Date(now.getTime() - minutes * 60000).toISOString();
  };

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .insert({
      business_id: business.id,
      customer_phone: "(602) 555-0184",
      customer_name: null,
      status: "needs_reply",
      source: "missed_call",
      missed_call_at: minutesAgo(8),
      last_message: "Hi, our AC stopped cooling this afternoon.",
    })
    .select("id")
    .single();

  if (leadError) {
    throw new Error(`Unable to create test lead: ${leadError.message}`);
  }

  const createdAt = (minutes: number) =>
    new Date(now.getTime() - minutes * 60000).toISOString();

  const { error: messagesError } = await supabase
    .from("lead_messages")
    .insert([
      {
        lead_id: lead.id,
        sender: "system",
        body: "Missed call detected.",
        direction: "inbound",
        created_at: createdAt(8),
      },
      {
        lead_id: lead.id,
        sender: "business",
        body: "Sorry we missed your call. What HVAC issue can we help with?",
        direction: "outbound",
        created_at: createdAt(7),
      },
      {
        lead_id: lead.id,
        sender: "customer",
        body: "Hi, our AC stopped cooling this afternoon.",
        direction: "inbound",
        created_at: createdAt(6),
      },
    ]);

  if (messagesError) {
    throw new Error(`Unable to create test messages: ${messagesError.message}`);
  }

  revalidatePath("/dashboard");
}
