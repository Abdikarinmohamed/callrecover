import { connection } from "next/server";

import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedWorkspace } from "@/lib/workspace";

import {
  TwilioConnectionForm,
  type TwilioConnectionValues,
} from "./twilio-connection-form";

type TwilioSettingsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function TwilioSettingsPage({
  searchParams,
}: TwilioSettingsPageProps) {
  await connection();

  const [{ disconnected, saved }, { business, user }] = await Promise.all([
    searchParams,
    getAuthenticatedWorkspace(),
  ]);
  const businessName = business?.business_name?.trim() || null;
  const twilioSettings = await getTwilioSettings(business?.id ?? null);
  const isConnected = Boolean(
    business?.twilio_connected && twilioSettings?.is_connected,
  );
  const initialValues: TwilioConnectionValues = {
    accountSid: twilioSettings?.account_sid ?? "",
    phoneNumber: twilioSettings?.phone_number ?? "",
    isConnected,
  };

  return (
    <AppShell
      businessName={businessName}
      twilioConnected={isConnected}
      userEmail={user.email}
    >
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Settings
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Connect Twilio
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Connect the Twilio account your business owns. We&rsquo;ll use
              this number to send missed-call replies.
            </p>
          </div>

          {saved === "1" ? (
            <p
              role="status"
              className="mb-5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800"
            >
              Twilio connection saved.
            </p>
          ) : null}

          {disconnected === "1" ? (
            <p
              role="status"
              className="mb-5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
            >
              Twilio disconnected.
            </p>
          ) : null}

          <TwilioConnectionForm initialValues={initialValues} />
        </div>
      </main>
    </AppShell>
  );
}

async function getTwilioSettings(businessId: string | null) {
  if (!businessId) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("twilio_settings")
    .select("account_sid, phone_number, is_connected")
    .eq("business_id", businessId)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load Twilio settings: ${error.message}`);
  }

  return data;
}
