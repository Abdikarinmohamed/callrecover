"use server";

import { refresh, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { Database } from "@/types/database";
import { createClient } from "@/lib/supabase/server";

type BusinessUpsert = Database["public"]["Tables"]["businesses"]["Insert"];
type BusinessUpdate = Database["public"]["Tables"]["businesses"]["Update"];
type TwilioSettingsUpsert =
  Database["public"]["Tables"]["twilio_settings"]["Insert"];
type TwilioSettingsUpdate =
  Database["public"]["Tables"]["twilio_settings"]["Update"];

export type SettingsFormState = {
  errors?: {
    businessName?: string;
    autoReplyMessage?: string;
    bookingLink?: string;
  };
  message: string;
  status: "idle" | "error";
};

export type TwilioConnectionFormState = {
  errors?: {
    accountSid?: string;
    authToken?: string;
    phoneNumber?: string;
  };
  message: string;
  status: "idle" | "error";
};

export async function saveBusinessSettings(
  _previousState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const businessName = getString(formData, "businessName");
  const contactEmail = getString(formData, "contactEmail");
  const phoneNumber = getString(formData, "phoneNumber");
  const timezone = getString(formData, "timezone") || "America/Phoenix";
  const autoReplyMessage = getString(formData, "autoReplyMessage");
  const bookingLink = getString(formData, "bookingLink");
  const autoTextEnabled = formData.get("autoTextEnabled") === "on";

  const errors: SettingsFormState["errors"] = {};

  if (!businessName) {
    errors.businessName = "Business name is required.";
  }

  if (!autoReplyMessage) {
    errors.autoReplyMessage = "Auto-reply message is required.";
  }

  if (
    bookingLink &&
    !bookingLink.startsWith("http://") &&
    !bookingLink.startsWith("https://")
  ) {
    errors.bookingLink = "Enter a valid URL.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      message: "",
      status: "idle",
    };
  }

  const payload: BusinessUpdate = {
    business_name: businessName,
    contact_email: contactEmail || user.email || null,
    phone_number: phoneNumber || null,
    timezone,
    auto_reply_message: autoReplyMessage,
    booking_link: bookingLink || null,
    auto_text_enabled: autoTextEnabled,
  };
  const insertPayload: BusinessUpsert = {
    ...payload,
    owner_id: user.id,
    business_name: businessName,
  };

  const { data: updatedBusinesses, error: updateError } = await supabase
    .from("businesses")
    .update(payload)
    .eq("owner_id", user.id)
    .select("id");

  if (updateError) {
    return saveFailure(updateError);
  }

  if (!updatedBusinesses?.length) {
    const { error: insertError } = await supabase
      .from("businesses")
      .insert(insertPayload);

    if (insertError) {
      if (!isUniqueViolation(insertError)) {
        return saveFailure(insertError);
      }

      const { error: retryError } = await supabase
        .from("businesses")
        .update(payload)
        .eq("owner_id", user.id);

      if (retryError) {
        return saveFailure(retryError);
      }
    }
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/leads/[id]", "page");
  refresh();

  redirect("/dashboard?setup=success");
}

export async function saveTwilioConnection(
  _previousState: TwilioConnectionFormState,
  formData: FormData,
): Promise<TwilioConnectionFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const accountSid = getString(formData, "twilio_account_sid");
  const authToken = getString(formData, "twilio_auth_token");
  const phoneNumber = getString(formData, "twilio_phone_number");

  const errors: TwilioConnectionFormState["errors"] = {};

  if (!isValidTwilioAccountSid(accountSid)) {
    errors.accountSid =
      "Enter a valid Twilio Account SID. It should start with AC.";
  }

  if (!isValidTwilioPhoneNumber(phoneNumber)) {
    errors.phoneNumber = "Enter phone number in +1XXXXXXXXXX format.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      message: "",
      status: "idle",
    };
  }

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (businessError) {
    return twilioSaveFailure(businessError);
  }

  if (!business) {
    return {
      errors: {},
      message: "Save your business profile before connecting Twilio.",
      status: "error",
    };
  }

  const { data: existingSettings, error: settingsError } = await supabase
    .from("twilio_settings")
    .select("id")
    .eq("business_id", business.id)
    .maybeSingle();

  if (settingsError) {
    return twilioSaveFailure(settingsError);
  }

  if (!existingSettings && !isValidTwilioAuthToken(authToken)) {
    return {
      errors: {
        authToken: "Enter a valid Twilio Auth Token.",
      },
      message: "",
      status: "idle",
    };
  }

  if (existingSettings && authToken && !isValidTwilioAuthToken(authToken)) {
    return {
      errors: {
        authToken: "Enter a valid Twilio Auth Token.",
      },
      message: "",
      status: "idle",
    };
  }

  // TODO: encrypt Twilio auth token before production.
  if (existingSettings) {
    const payload: TwilioSettingsUpdate = {
      account_sid: accountSid,
      phone_number: phoneNumber,
      is_connected: true,
    };

    if (authToken) {
      payload.auth_token = authToken;
    }

    const { error: saveError } = await supabase
      .from("twilio_settings")
      .update(payload)
      .eq("id", existingSettings.id);

    if (saveError) {
      return twilioSaveFailure(saveError);
    }
  } else {
    const payload: TwilioSettingsUpsert = {
      business_id: business.id,
      account_sid: accountSid,
      auth_token: authToken,
      phone_number: phoneNumber,
      is_connected: true,
    };

    const { error: saveError } = await supabase
      .from("twilio_settings")
      .insert(payload);

    if (saveError) {
      return twilioSaveFailure(saveError);
    }
  }

  const { error: updateError } = await supabase
    .from("businesses")
    .update({ twilio_connected: true })
    .eq("id", business.id)
    .eq("owner_id", user.id);

  if (updateError) {
    return twilioSaveFailure(updateError);
  }

  revalidatePath("/settings");
  revalidatePath("/settings/twilio");
  revalidatePath("/dashboard");

  redirect("/settings/twilio?saved=1");
}

export async function disconnectTwilioConnection() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (businessError) {
    throw new Error(
      `Unable to load business workspace: ${businessError.message}`,
    );
  }

  if (business) {
    const { error: deleteError } = await supabase
      .from("twilio_settings")
      .delete()
      .eq("business_id", business.id);

    if (deleteError) {
      throw new Error(`Unable to disconnect Twilio: ${deleteError.message}`);
    }

    const { error: updateError } = await supabase
      .from("businesses")
      .update({ twilio_connected: false })
      .eq("id", business.id)
      .eq("owner_id", user.id);

    if (updateError) {
      throw new Error(`Unable to update Twilio status: ${updateError.message}`);
    }
  }

  revalidatePath("/settings/twilio");
  revalidatePath("/dashboard");

  redirect("/settings/twilio?disconnected=1");
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function isUniqueViolation(error: { code?: string }) {
  return error.code === "23505";
}

function isValidTwilioAccountSid(accountSid: string) {
  return accountSid.startsWith("AC") && accountSid.length >= 34;
}

function isValidTwilioAuthToken(authToken: string) {
  return authToken.length >= 20;
}

function isValidTwilioPhoneNumber(phoneNumber: string) {
  return /^\+[1-9]\d{7,14}$/.test(phoneNumber);
}

function saveFailure(error: { message?: string }): SettingsFormState {
  console.error("Settings save failed:", error);

  return {
    errors: {},
    message:
      process.env.NODE_ENV === "production"
        ? "Please try again."
        : error.message || "Unknown Supabase error.",
    status: "error",
  };
}

function twilioSaveFailure(error: {
  code?: string;
  message?: string;
}): TwilioConnectionFormState {
  console.error("Twilio connection save failed:", {
    code: error.code,
    message: error.message,
  });

  return {
    errors: {},
    message:
      process.env.NODE_ENV === "production"
        ? "Please try again."
        : error.message || "Unknown Supabase error.",
    status: "error",
  };
}
