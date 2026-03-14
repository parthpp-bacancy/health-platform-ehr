import type { Metadata } from "next";

import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminSession } from "@/lib/auth/session";
import { readDemoDatabase } from "@/lib/demo/store";
import { listAuditLogs } from "@/lib/server/health-data";

export const metadata: Metadata = {
  title: "Admin Users",
};

export default async function AdminUsersPage() {
  await requireAdminSession();
  const [database, auditLogs] = await Promise.all([readDemoDatabase(), listAuditLogs(8)]);

  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Administration"
        title="Users and settings"
        description="Single-organization user management with role assignment foundations for future invitation flows."
      />
      <div className="grid gap-2 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader><CardTitle>Staff roster</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {database.profiles.filter((profile) => profile.role !== "patient").map((profile) => (
              <div key={profile.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3">
                <div>
                  <p className="font-medium text-[var(--foreground)]">{profile.firstName} {profile.lastName}</p>
                  <p className="text-sm text-[var(--muted)]">{profile.email}</p>
                </div>
                <Badge variant="info">{profile.role}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Organization profile</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--foreground)]">
            <p>Name: {database.organization.name}</p>
            <p>Timezone: {database.organization.timezone}</p>
            <p>Contact: {database.organization.contactEmail}</p>
            <p className="text-[var(--muted)]">Invitation workflows, billing ops, and multi-tenant admin controls are intentionally staged for the roadmap.</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Recent audit activity</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {auditLogs.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3">
              <div>
                <p className="font-medium text-[var(--foreground)]">{entry.action}</p>
                <p className="text-sm text-[var(--muted)]">{entry.actor?.firstName ?? "System"} {entry.actor?.lastName ?? ""} - {entry.entityType}</p>
              </div>
              <Badge variant="neutral">{new Date(entry.createdAt).toLocaleString()}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

