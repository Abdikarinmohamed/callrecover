import { notFound } from "next/navigation";
import { connection } from "next/server";

import { getLeadWithMessages } from "@/lib/leads";
import { getAuthenticatedWorkspace } from "@/lib/workspace";

import { LeadDetail } from "./lead-detail";

type LeadPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LeadPage({ params }: LeadPageProps) {
  await connection();

  const [{ id }, { business, user }] = await Promise.all([
    params,
    getAuthenticatedWorkspace(),
  ]);

  if (!business) {
    notFound();
  }

  const leadData = await getLeadWithMessages({
    businessId: business.id,
    leadId: id,
  });

  if (!leadData) {
    notFound();
  }

  return (
    <LeadDetail
      businessName={business?.business_name?.trim() || null}
      lead={leadData.lead}
      messages={leadData.messages}
      twilioConnected={business.twilio_connected}
      userEmail={user.email}
    />
  );
}
