import { connection } from "next/server";

import { AppShell } from "@/components/app-shell";
import { getAuthenticatedWorkspace } from "@/lib/workspace";

import { SettingsForm, type SettingsFormValues } from "./settings-form";

export default async function SettingsPage() {
  await connection();

  const { business, user } = await getAuthenticatedWorkspace();
  const businessName = business?.business_name?.trim() || null;
  const initialValues: SettingsFormValues = {
    businessName: business?.business_name ?? "",
    contactEmail: business?.contact_email || user.email || "",
    phoneNumber: business?.phone_number ?? "",
    timezone: business?.timezone || "America/Phoenix",
    autoReplyMessage: business?.auto_reply_message ?? "",
    bookingLink: business?.booking_link ?? "",
    autoTextEnabled: business?.auto_text_enabled ?? true,
  };

  return (
    <AppShell
      businessName={businessName}
      twilioConnected={business?.twilio_connected ?? false}
      userEmail={user.email}
    >
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Settings
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Configure your business profile and missed-call reply workflow.
            </p>
          </div>

          <SettingsForm initialValues={initialValues} />
        </div>
      </main>
    </AppShell>
  );
}
