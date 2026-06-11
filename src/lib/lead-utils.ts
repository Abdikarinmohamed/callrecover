export type LeadStatus =
  | "new"
  | "needs_reply"
  | "booked"
  | "waiting"
  | "closed"
  | "lost";

const leadStatusLabels: Record<LeadStatus, string> = {
  new: "New",
  needs_reply: "Needs reply",
  booked: "Booked",
  waiting: "Waiting",
  closed: "Closed",
  lost: "Lost",
};

export function normalizeLeadStatus(status?: string | null): LeadStatus {
  if (
    status === "needs_reply" ||
    status === "booked" ||
    status === "waiting" ||
    status === "closed" ||
    status === "lost"
  ) {
    return status;
  }

  return "new";
}

export function getLeadStatusLabel(status: LeadStatus) {
  return leadStatusLabels[status];
}

export function formatLeadDateTime(value?: string | null) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatRelativeLeadTime(value?: string | null) {
  if (!value) {
    return "No activity";
  }

  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.max(0, Math.round(diffMs / 60000));

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.round(diffHours / 24);

  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}
