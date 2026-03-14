import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SoapNoteForm } from "@/components/forms/soap-note-form";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireProviderSession } from "@/lib/auth/session";
import { readDemoDatabase } from "@/lib/demo/store";

export const metadata: Metadata = {
  title: "SOAP Note",
};

export default async function SoapNoteEditorPage({ params }: { params: Promise<{ encounterId: string }> }) {
  await requireProviderSession();
  const { encounterId } = await params;
  const database = await readDemoDatabase();
  const encounter = database.encounters.find((item) => item.id === encounterId);

  if (!encounter) {
    notFound();
  }

  const note = database.soapNotes.find((item) => item.encounterId === encounterId) ?? null;

  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Clinical documentation"
        title="SOAP note editor"
        description={`${encounter.chiefComplaint} - ${encounter.status}`}
      />
      <div className="grid gap-2 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader><CardTitle>Encounter context</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Badge variant={encounter.shareableWithPatient ? "success" : "warning"}>{encounter.shareableWithPatient ? "Shareable with patient" : "Internal only"}</Badge>
            <p className="text-sm leading-7 text-[var(--foreground)]">{encounter.visitSummary}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Documentation</CardTitle></CardHeader>
          <CardContent>
            <SoapNoteForm encounterId={encounterId} defaultNote={note} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
