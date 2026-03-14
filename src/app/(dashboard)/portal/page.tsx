import type { Metadata } from "next";

import { PageHeader } from "@/components/shell/page-header";
import { MetricCard } from "@/components/shell/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePatientSession } from "@/lib/auth/session";
import { formatScheduleLabel, getPortalSnapshot } from "@/lib/server/health-data";

export const metadata: Metadata = {
  title: "Patient Portal",
};

export default async function PortalPage() {
  const session = await requirePatientSession();
  const portal = await getPortalSnapshot(session.userId);

  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Patient portal"
        title={`Welcome back, ${portal.patient.firstName}`}
        description="Review upcoming visits, visit summaries, care plans, and messages from your care team."
      />
      <div className="grid gap-2 xl:grid-cols-3">
        <MetricCard label="Upcoming visits" tone="info" value={portal.appointments.filter((item) => item.status !== "completed" && item.status !== "cancelled").length} />
        <MetricCard label="Shared care plans" tone="success" value={portal.carePlans.length} />
        <MetricCard label="Shared notes" tone="neutral" value={portal.notes.length} />
      </div>
      <div className="grid gap-2 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {portal.appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3">
                <div>
                  <p className="font-medium text-[var(--foreground)]">{appointment.appointmentType}</p>
                  <p className="text-sm text-[var(--muted)]">{appointment.visitReason}</p>
                </div>
                <div className="text-right">
                  <Badge variant={appointment.status === "completed" ? "success" : "info"}>{appointment.status}</Badge>
                  <p className="mt-2 text-sm text-[var(--muted)]">{formatScheduleLabel(appointment.scheduledStart)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Care plan summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {portal.carePlans.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3">
                <Badge variant="success">{plan.status}</Badge>
                <p className="mt-3 font-medium text-[var(--foreground)]">{plan.goal}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{plan.interventions}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

