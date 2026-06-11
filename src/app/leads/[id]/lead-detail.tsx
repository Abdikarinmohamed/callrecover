"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  MessageSquareText,
  Phone,
  SendHorizontal,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { darkPrimaryButtonClass } from "@/components/brand";
import { LeadStatusBadge } from "@/components/lead-status-badge";
import {
  formatLeadDateTime,
  getLeadStatusLabel,
  normalizeLeadStatus,
  type LeadStatus,
} from "@/lib/lead-utils";
import type { Database } from "@/types/database";

import { addBusinessMessage, updateLeadStatus } from "./actions";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type LeadMessageRow = Database["public"]["Tables"]["lead_messages"]["Row"];

type LeadDetailProps = {
  businessName?: string | null;
  lead: LeadRow;
  messages: LeadMessageRow[];
  twilioConnected?: boolean | null;
  userEmail?: string | null;
};

type ConversationMessage = {
  id: string;
  sender: "system" | "business" | "customer";
  body: string;
  createdAt: string | null;
};

const actionButtons = [
  {
    label: "Mark Waiting",
    status: "waiting",
    icon: CheckCircle2,
  },
  {
    label: "Mark Booked",
    status: "booked",
    icon: CalendarClock,
  },
  {
    label: "Mark Closed",
    status: "closed",
    icon: XCircle,
  },
  {
    label: "Mark Lost",
    status: "lost",
    icon: XCircle,
  },
] satisfies { label: string; status: LeadStatus; icon: LucideIcon }[];

export function LeadDetail({
  businessName,
  lead,
  messages: initialMessages,
  twilioConnected,
  userEmail,
}: LeadDetailProps) {
  const [status, setStatus] = useState<LeadStatus>(
    normalizeLeadStatus(lead.status),
  );
  const [messages, setMessages] = useState<ConversationMessage[]>(
    initialMessages.map((message) => ({
      body: message.body,
      createdAt: message.created_at,
      id: message.id,
      sender: normalizeSender(message.sender),
    })),
  );
  const [draftReply, setDraftReply] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const latestMessage = messages.at(-1)?.body ?? lead.last_message;
  const canSendReply = draftReply.trim().length > 0 && !isPending;

  function handleSendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const reply = draftReply.trim();

    if (!reply) {
      return;
    }

    startTransition(async () => {
      setErrorMessage("");

      try {
        const savedMessage = await addBusinessMessage(lead.id, reply);

        setMessages((currentMessages) => [
          ...currentMessages,
          {
            body: reply,
            createdAt: savedMessage.created_at,
            id: savedMessage.id,
            sender: "business",
          },
        ]);
        setStatus(savedMessage.status);
        setDraftReply("");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to save reply.",
        );
      }
    });
  }

  function handleStatusChange(nextStatus: LeadStatus) {
    startTransition(async () => {
      setErrorMessage("");

      try {
        await updateLeadStatus(lead.id, nextStatus);
        setStatus(nextStatus);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to update status.",
        );
      }
    });
  }

  return (
    <AppShell
      businessName={businessName}
      twilioConnected={twilioConnected}
      userEmail={userEmail}
    >
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-800"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to dashboard
          </Link>

          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                {lead.id}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {lead.customer_phone}
              </h1>
            </div>
            <LeadStatusBadge status={status} className="px-3 py-1 text-sm" />
          </div>

          {errorMessage ? (
            <p
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
            >
              {errorMessage}
            </p>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-5">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    SMS conversation
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Last message: {latestMessage || "No messages yet"}
                  </p>
                </div>
                <MessageSquareText
                  className="size-5 text-teal-700"
                  aria-hidden="true"
                />
              </div>
              <div className="bg-[#f6f9fb] px-4 py-5 sm:px-5">
                <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  {messages.length > 0 ? (
                    messages.map((message) => {
                      const isBusiness = message.sender === "business";
                      const isSystem = message.sender === "system";

                      return (
                        <div
                          key={message.id}
                          className={
                            isSystem
                              ? "flex justify-center"
                              : isBusiness
                                ? "flex justify-end"
                                : "flex justify-start"
                          }
                        >
                          <div
                            className={
                              isSystem
                                ? "rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500"
                                : `max-w-[82%] rounded-lg px-4 py-3 text-sm shadow-sm ${
                                    isBusiness
                                      ? "bg-teal-700 text-white"
                                      : "border border-slate-200 bg-slate-50 text-slate-800"
                                  }`
                            }
                          >
                            {!isSystem && (
                              <p
                                className={`mb-1 text-xs font-semibold ${
                                  isBusiness ? "text-cyan-50" : "text-slate-500"
                                }`}
                              >
                                {isBusiness ? "Business" : "Customer"}
                              </p>
                            )}
                            <p>{message.body}</p>
                            {!isSystem && (
                              <p
                                className={`mt-2 text-xs ${
                                  isBusiness ? "text-cyan-50" : "text-slate-500"
                                }`}
                              >
                                {formatLeadDateTime(message.createdAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-sm text-slate-500">
                      No messages have been recorded for this lead yet.
                    </p>
                  )}
                </div>
                <form
                  onSubmit={handleSendReply}
                  className="mt-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <label htmlFor="reply-message" className="sr-only">
                    Type a reply
                  </label>
                  <textarea
                    id="reply-message"
                    name="replyMessage"
                    value={draftReply}
                    onChange={(event) => setDraftReply(event.target.value)}
                    rows={3}
                    placeholder="Type a reply to the customer..."
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-4 focus:ring-cyan-400/15"
                  />
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                      Saved to this lead only. No SMS will be sent.
                    </p>
                    <button
                      type="submit"
                      disabled={!canSendReply}
                      className={darkPrimaryButtonClass}
                    >
                      <SendHorizontal className="size-4" aria-hidden="true" />
                      {isPending ? "Saving..." : "Send Reply"}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
                <h2 className="text-base font-semibold text-slate-950">
                  Lead details
                </h2>
                <dl className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone
                      className="mt-0.5 size-4 text-teal-700"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Customer phone
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-950">
                        {lead.customer_phone}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarClock
                      className="mt-0.5 size-4 text-teal-700"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Missed call time
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-950">
                        {formatLeadDateTime(lead.missed_call_at)}
                      </dd>
                    </div>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </dt>
                    <dd className="mt-2">
                      <LeadStatusBadge status={status} />
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
                <h2 className="text-base font-semibold text-slate-950">
                  Lead actions
                </h2>
                <div className="mt-4 grid gap-2">
                  {actionButtons.map((action) => {
                    const Icon = action.icon;
                    const isActive = status === action.status;

                    return (
                      <button
                        key={action.status}
                        type="button"
                        onClick={() => handleStatusChange(action.status)}
                        disabled={isPending}
                        className={`flex h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-70 ${
                          isActive
                            ? "border-teal-700 bg-teal-700 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-teal-600 hover:bg-cyan-50 hover:text-teal-800"
                        }`}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                        {isActive
                          ? getLeadStatusLabel(action.status)
                          : action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

function normalizeSender(sender: string): ConversationMessage["sender"] {
  if (sender === "business" || sender === "customer") {
    return sender;
  }

  return "system";
}
