import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CarePlanForm } from "@/components/forms/care-plan-form";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireStaffSession } from "@/lib/auth/session";
import { readDemoDatabase } from "@/lib/demo/store";

export const metadata: Metadata = {
  title: "Care Plan",
};

export default async function CarePlanPage({ params }: { params: Promise<{ patientId: string }> }) {
  await requireStaffSession();
  const { patientId } = await params;
  const database = await readDemoDatabase();
  const patient = database.patients.find((item) => item.id === patientId);

  if (!patient) {
    notFound();
  }

  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Care planning"
        title={`${patient.firstName} ${patient.lastName}`}
        description="Document goals, interventions, milestones, and the patient-facing care plan summary."
      />
      <div className="grid gap-2 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Active care plans</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {database.carePlans.filter((item) => item.patientId === patientId).map((plan) => (
              <div key={plan.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3">
                <Badge variant="success">{plan.status}</Badge>
                <p className="mt-3 font-medium text-[var(--foreground)]">{plan.goal}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{plan.interventions}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Create care plan</CardTitle></CardHeader>
          <CardContent>
            <CarePlanForm patientId={patientId} staff={database.profiles.filter((profile) => profile.role !== "patient")} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

