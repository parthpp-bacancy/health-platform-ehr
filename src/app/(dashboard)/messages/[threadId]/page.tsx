import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MessageComposer } from "@/components/messages/message-composer";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/lib/auth/session";
import { getMessageThread } from "@/lib/server/health-data";

export const metadata: Metadata = {
  title: "Thread",
};

export default async function MessageThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const session = await requireSession();
  const { threadId } = await params;
  const detail = await getMessageThread(threadId, { userId: session.userId, role: session.role });

  if (!detail) {
    notFound();
  }

  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Messaging"
        title={detail.thread.subject}
        description={`Patient: ${detail.patient?.firstName ?? "Patient"} ${detail.patient?.lastName ?? ""}`.trim()}
      />
      <div className="grid gap-2 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader><CardTitle>Conversation</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {detail.messages.map((message) => (
              <div key={message.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-[var(--foreground)]">{message.sender?.firstName ?? "Care team"}</p>
                  <Badge variant={message.readAt ? "success" : "warning"}>{message.readAt ? "Read" : "Unread"}</Badge>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">{message.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Reply</CardTitle></CardHeader>
          <CardContent>
            <MessageComposer threadId={threadId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

