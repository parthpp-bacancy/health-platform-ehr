import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/lib/auth/session";
import { listMessageThreads } from "@/lib/server/health-data";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function MessagesPage() {
  const session = await requireSession();
  const threads = await listMessageThreads({ userId: session.userId, role: session.role });

  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Messaging"
        title="Secure inbox"
        description="Threaded messaging between the patient and the care team, with lightweight unread tracking."
      />
      <Card>
        <CardHeader><CardTitle>Threads</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {threads.map((thread) => (
            <Link key={thread.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3" href={`/messages/${thread.id}`}>
              <div>
                <p className="font-medium text-[var(--foreground)]">{thread.subject}</p>
                <p className="text-sm text-[var(--muted)]">{thread.patient?.firstName} {thread.patient?.lastName}</p>
              </div>
              <div className="text-right">
                <Badge variant={thread.unreadCount > 0 ? "warning" : "success"}>{thread.unreadCount} unread</Badge>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

