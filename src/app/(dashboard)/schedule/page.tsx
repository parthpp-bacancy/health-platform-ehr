import type { Metadata } from "next";

import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireStaffSession } from "@/lib/auth/session";
import { readDemoDatabase } from "@/lib/demo/store";
import { formatScheduleLabel, listAppointments } from "@/lib/server/health-data";

export const metadata: Metadata = {
  title: "Provider Schedule",
};

export default async function SchedulePage() {
  await requireStaffSession();
  const [database, appointments] = await Promise.all([readDemoDatabase(), listAppointments()]);

  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Provider workflow"
        title="Schedule"
        description="Availability blocks, today's patient queue, and fast access into encounter documentation."
      />
      <div className="grid gap-2 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle>Availability blocks</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {database.availability.map((block) => (
              <div key={block.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3">
                <p className="font-medium text-[var(--foreground)]">Weekday {block.weekday}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{block.startTime} to {block.endTime} - {block.visitMode}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Patient queue</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3">
                <div>
                  <p className="font-medium text-[var(--foreground)]">{appointment.patient?.firstName} {appointment.patient?.lastName}</p>
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
      </div>
    </div>
  );
}

