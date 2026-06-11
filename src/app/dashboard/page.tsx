import Link from "next/link";
import { connection } from "next/server";
import {
  Activity,
  CalendarClock,
  ChevronRight,
  MessageSquareText,
  Phone,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { darkPrimaryButtonClass } from "@/components/brand";
import { LeadStatusBadge } from "@/components/lead-status-badge";
import { getLeadsForBusiness, type LeadRow } from "@/lib/leads";
import {
  formatLeadDateTime,
  formatRelativeLeadTime,
  normalizeLeadStatus,
} from "@/lib/lead-utils";
import { getAuthenticatedWorkspace } from "@/lib/workspace";

import { createTestLead } from "./actions";
import { SetupSuccessBanner } from "./setup-success-banner";

type DashboardPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  // Protected route logic: this server page verifies the Supabase session and
  // loads only the business whose owner_id matches the authenticated user.
  await connection();

  const { setup } = await searchParams;
  const { business, user } = await getAuthenticatedWorkspace();
  const businessName = business?.business_name?.trim() || null;
  const hasBusinessWorkspace = Boolean(businessName);
  const showSetupSuccess = setup === "success" && hasBusinessWorkspace;
  const leads = business ? await getLeadsForBusiness(business.id) : [];
  const metrics = getMetrics(leads);
  const showCreateTestLead = process.env.NODE_ENV === "development";

  return (
    <AppShell
      businessName={businessName}
      twilioConnected={business?.twilio_connected ?? false}
      userEmail={user.email}
    >
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {showSetupSuccess ? <SetupSuccessBanner /> : null}

          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Today
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Welcome to CallRecover dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Review urgent HVAC leads and keep every follow-up moving.
              </p>
            </div>
            {hasBusinessWorkspace ? (
              <div className="flex items-center gap-2 rounded-lg border border-cyan-100 bg-white px-3 py-2 text-sm font-semibold text-teal-800 shadow-sm">
                <Activity className="size-4 text-teal-700" aria-hidden="true" />
                Auto-text active
              </div>
            ) : null}
          </div>

          {!hasBusinessWorkspace ? (
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Finish setting up your business workspace.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Add your business details before using the recovery workspace.
              </p>
              <Link
                href="/settings"
                className={`${darkPrimaryButtonClass} mt-5`}
              >
                Go to Settings
              </Link>
            </section>
          ) : (
            <>
              <section className="grid gap-4 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5"
                  >
                    <p className="text-sm font-medium text-slate-500">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </section>

              <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
                <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
                  <h2 className="text-base font-semibold text-slate-950">
                    Lead queue
                  </h2>
                </div>
                {leads.length > 0 ? (
                  <>
                    <div className="hidden divide-y divide-slate-200 md:block">
                      <div className="grid grid-cols-[1.1fr_0.7fr_1.6fr_0.7fr_2rem] gap-4 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <span>Customer</span>
                        <span>Status</span>
                        <span>Last message</span>
                        <span className="text-right">Time</span>
                        <span aria-hidden="true" />
                      </div>
                      {leads.map((lead) => (
                        <LeadRowLink key={lead.id} lead={lead} />
                      ))}
                    </div>
                    <div className="divide-y divide-slate-200 md:hidden">
                      {leads.map((lead) => (
                        <MobileLeadLink key={lead.id} lead={lead} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="px-5 py-10 text-center">
                    <h3 className="text-base font-semibold text-slate-950">
                      No leads yet.
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                      Once missed calls are connected, new leads will appear
                      here.
                    </p>
                    {showCreateTestLead ? (
                      <form action={createTestLead} className="mt-5">
                        <button
                          type="submit"
                          className={darkPrimaryButtonClass}
                        >
                          Create test lead
                        </button>
                      </form>
                    ) : null}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </AppShell>
  );
}

function LeadRowLink({ lead }: { lead: LeadRow }) {
  const status = normalizeLeadStatus(lead.status);
  const phone = lead.customer_phone;
  const lastMessage = lead.last_message || "Missed call captured.";

  return (
    <Link
      href={`/leads/${lead.id}`}
      aria-label={`Open lead from ${phone}`}
      className="grid grid-cols-[1.1fr_0.7fr_1.6fr_0.7fr_2rem] items-center gap-4 px-5 py-4 transition hover:bg-cyan-50/45 focus-visible:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-cyan-50 text-teal-700">
          <Phone className="size-4" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold text-slate-950">{phone}</p>
          <p className="text-xs text-slate-500">
            Missed {formatLeadDateTime(lead.missed_call_at)}
          </p>
        </div>
      </div>
      <LeadStatusBadge status={status} />
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <MessageSquareText
          className="size-4 shrink-0 text-slate-400"
          aria-hidden="true"
        />
        <span className="truncate">{lastMessage}</span>
      </div>
      <div className="flex items-center justify-end gap-2 text-sm text-slate-500">
        <CalendarClock className="size-4" aria-hidden="true" />
        {formatRelativeLeadTime(lead.updated_at || lead.created_at)}
      </div>
      <ChevronRight
        className="size-4 justify-self-end text-slate-400"
        aria-hidden="true"
      />
    </Link>
  );
}

function MobileLeadLink({ lead }: { lead: LeadRow }) {
  const status = normalizeLeadStatus(lead.status);

  return (
    <Link
      href={`/leads/${lead.id}`}
      aria-label={`Open lead from ${lead.customer_phone}`}
      className="block px-4 py-4 transition hover:bg-cyan-50/45 focus-visible:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-950">{lead.customer_phone}</p>
          <p className="mt-1 text-sm text-slate-600">
            {lead.last_message || "Missed call captured."}
          </p>
        </div>
        <LeadStatusBadge status={status} className="shrink-0" />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>{formatRelativeLeadTime(lead.updated_at || lead.created_at)}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-teal-800">
          View
          <ChevronRight className="size-3" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function getMetrics(leads: LeadRow[]) {
  const today = new Date();
  const openLeads = leads.filter((lead) => {
    const status = normalizeLeadStatus(lead.status);
    return status !== "booked" && status !== "closed" && status !== "lost";
  }).length;
  const bookedToday = leads.filter((lead) => {
    const status = normalizeLeadStatus(lead.status);
    const updatedAt = lead.updated_at ? new Date(lead.updated_at) : null;

    return status === "booked" && updatedAt && isSameDay(updatedAt, today);
  }).length;

  return [
    { label: "Open leads", value: String(openLeads) },
    { label: "Booked today", value: String(bookedToday) },
    { label: "Avg response", value: "—" },
  ];
}

function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}
