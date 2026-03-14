import type { Metadata } from "next";

import { PageHeader } from "@/components/shell/page-header";
import { MetricCard } from "@/components/shell/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireStaffSession } from "@/lib/auth/session";
import { formatScheduleLabel, getDashboardSnapshot } from "@/lib/server/health-data";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await requireStaffSession();
  const snapshot = await getDashboardSnapshot(session.role, session.userId);

  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Operations"
        title="Care team command center"
        description="Monitor today&apos;s patient flow, documentation load, and communication volume from one place."
      />
      <div className="grid gap-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} tone={metric.tone} value={metric.value} />
        ))}
      </div>
      <div className="grid gap-2 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s agenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {snapshot.agenda.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3">
                <div>
                  <p className="font-medium text-[var(--foreground)]">{appointment.appointmentType}</p>
                  <p className="text-sm text-[var(--muted)]">{appointment.visitReason}</p>
                </div>
                <div className="text-right">
                  <Badge variant={appointment.status === "confirmed" ? "success" : "info"}>{appointment.status}</Badge>
                  <p className="mt-2 text-sm text-[var(--muted)]">{formatScheduleLabel(appointment.scheduledStart)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Documentation queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {snapshot.pendingDocumentation.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No pending documentation right now.</p>
            ) : (
              snapshot.pendingDocumentation.map((encounter) => (
                <div key={encounter.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3">
                  <p className="font-medium text-[var(--foreground)]">{encounter.chiefComplaint}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">Encounter {encounter.id.slice(0, 8)} is waiting on a signed SOAP note.</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


