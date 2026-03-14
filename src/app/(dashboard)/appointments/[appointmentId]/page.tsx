import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireStaffSession } from "@/lib/auth/session";
import { formatScheduleLabel, getAppointmentDetail } from "@/lib/server/health-data";

export const metadata: Metadata = {
  title: "Appointment Detail",
};

export default async function AppointmentDetailPage({ params }: { params: Promise<{ appointmentId: string }> }) {
  await requireStaffSession();
  const { appointmentId } = await params;
  const detail = await getAppointmentDetail(appointmentId);

  if (!detail) {
    notFound();
  }

  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Appointment"
        title={`${detail.patient?.firstName ?? "Patient"} ${detail.patient?.lastName ?? ""}`.trim()}
        description={`${detail.appointment.appointmentType} - ${formatScheduleLabel(detail.appointment.scheduledStart)}`}
        action={detail.encounter ? <Button asChild><Link href={`/notes/${detail.encounter.id}`}>Open note editor</Link></Button> : undefined}
      />
      <div className="grid gap-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Visit details</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2"><Badge variant="info">{detail.appointment.status}</Badge><Badge variant="neutral">{detail.appointment.locationName}</Badge></div>
            <p className="text-sm leading-6 text-[var(--foreground)]">{detail.appointment.visitReason}</p>
            <p className="text-sm text-[var(--muted)]">Notes: {detail.appointment.notes ?? "No scheduling notes recorded."}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Care team</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-[var(--foreground)]">Provider specialty: {detail.provider?.specialty ?? "Unassigned"}</p>
            <p className="text-sm text-[var(--muted)]">Patient portal is {detail.patient?.consentAcknowledged ? "enabled" : "awaiting consent"}.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
