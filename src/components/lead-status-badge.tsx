import { getLeadStatusLabel, type LeadStatus } from "@/lib/lead-utils";

const statusClasses: Record<LeadStatus, string> = {
  needs_reply: "border-cyan-200 bg-cyan-50 text-cyan-800",
  booked: "border-emerald-200 bg-emerald-50 text-emerald-800",
  waiting: "border-sky-200 bg-sky-50 text-sky-800",
  closed: "border-slate-300 bg-slate-100 text-slate-700",
  lost: "border-red-200 bg-red-50 text-red-700",
  new: "border-slate-200 bg-white text-slate-700",
};

export function LeadStatusBadge({
  status,
  className = "",
}: {
  status: LeadStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[status]} ${className}`}
    >
      {getLeadStatusLabel(status)}
    </span>
  );
}
