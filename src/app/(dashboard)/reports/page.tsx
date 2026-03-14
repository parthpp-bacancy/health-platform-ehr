import type { Metadata } from "next";

import { PageHeader } from "@/components/shell/page-header";
import { MetricCard } from "@/components/shell/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireStaffSession } from "@/lib/auth/session";
import { getReportsSnapshot } from "@/lib/server/health-data";

export const metadata: Metadata = {
  title: "Reports",
};

export default async function ReportsPage() {
  await requireStaffSession();
  const reports = await getReportsSnapshot();

  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Analytics"
        title="Operational reporting"
        description="MVP-level reporting for patient volume, visit throughput, and documentation load."
      />
      <div className="grid gap-2 xl:grid-cols-4">
        <MetricCard label="Total patients" tone="neutral" value={reports.totalPatients} />
        <MetricCard label="Appointments this week" tone="info" value={reports.appointmentsThisWeek} />
        <MetricCard label="Completed visits" tone="success" value={reports.completedVisits} />
        <MetricCard label="Pending documentation" tone="warning" value={reports.pendingDocumentation} />
      </div>
      <Card>
        <CardHeader><CardTitle>Operational notes</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm leading-7 text-[var(--muted)]">
          <p>Tomorrow&apos;s scheduled appointments: {reports.upcomingTomorrow}</p>
          <p>These KPIs are ready to move to materialized views or dedicated analytics tables once the Supabase schema is applied.</p>
        </CardContent>
      </Card>
    </div>
  );
}
