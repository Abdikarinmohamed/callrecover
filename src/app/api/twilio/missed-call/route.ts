import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const EMPTY_TWIML = "<Response></Response>";
const MISSED_CALL_MESSAGE = "Missed call received via Twilio forwarding.";

export async function POST(request: Request) {
  // TODO: validate X-Twilio-Signature before production.
  const formData = await request.formData();
  const From = getString(formData, "From");
  const To = getString(formData, "To");
  const CallSid = getString(formData, "CallSid");
  const CallStatus = getString(formData, "CallStatus");
  const Direction = getString(formData, "Direction");
  const ForwardedFrom = getString(formData, "ForwardedFrom");
  const CallerName = getString(formData, "CallerName");

  if (process.env.NODE_ENV === "development") {
    console.log({
      From,
      To,
      CallSid,
      CallStatus,
      Direction,
      ForwardedFrom,
      CallerName,
    });
  }

  const supabase = createSupabaseAdminClient();
  const { data: twilioSettings, error: settingsError } = await supabase
    .from("twilio_settings")
    .select("business_id")
    .eq("phone_number", To)
    .limit(1)
    .maybeSingle();

  if (settingsError) {
    console.error("Unable to load Twilio settings for missed call:", {
      message: settingsError.message,
    });

    return twimlResponse();
  }

  if (!twilioSettings) {
    console.warn("No business found for Twilio missed-call number:", { To });

    return twimlResponse();
  }

  if (CallSid) {
    const { data: existingLead, error: existingLeadError } = await supabase
      .from("leads")
      .select("id")
      .eq("twilio_call_sid", CallSid)
      .limit(1)
      .maybeSingle();

    if (existingLeadError) {
      console.error("Unable to check missed-call idempotency:", {
        message: existingLeadError.message,
      });

      return twimlResponse();
    }

    if (existingLead) {
      return twimlResponse();
    }
  }

  const now = new Date().toISOString();
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .insert({
      business_id: twilioSettings.business_id,
      customer_phone: From,
      status: "needs_reply",
      source: "missed_call_forward",
      missed_call_at: now,
      last_message: MISSED_CALL_MESSAGE,
      last_message_at: now,
      twilio_call_sid: CallSid || null,
    })
    .select("id")
    .single();

  if (leadError) {
    if (CallSid && leadError.code === "23505") {
      return twimlResponse();
    }

    console.error("Unable to create missed-call lead:", {
      message: leadError.message,
    });

    return twimlResponse();
  }

  const { error: messageError } = await supabase
    .from("lead_messages")
    .insert({
      lead_id: lead.id,
      sender: "system",
      body: MISSED_CALL_MESSAGE,
      direction: "inbound",
      created_at: now,
    });

  if (messageError) {
    console.error("Unable to create missed-call lead message:", {
      message: messageError.message,
    });
  }

  return twimlResponse();
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function twimlResponse() {
  return new Response(EMPTY_TWIML, {
    status: 200,
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
