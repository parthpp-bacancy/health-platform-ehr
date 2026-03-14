import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireStaffSession } from "@/lib/auth/session";
import { getPatientChart } from "@/lib/server/health-data";

export const metadata: Metadata = {
  title: "Patient Chart",
};

export default async function PatientChartPage({ params }: { params: Promise<{ patientId: string }> }) {
  await requireStaffSession();
  const { patientId } = await params;
  const chart = await getPatientChart(patientId);

  if (!chart) {
    notFound();
  }

  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Clinical chart"
        title={`${chart.patient.firstName} ${chart.patient.lastName}`}
        description={`${chart.patient.mrn} - Intake ${chart.patient.intakeStatus} - ${chart.patient.email}`}
        action={
          <div className="flex gap-3">
            <Button asChild variant="secondary"><Link href={`/care-plans/${chart.patient.id}`}>Care plan</Link></Button>
            <Button asChild><Link href="/appointments">Book visit</Link></Button>
          </div>
        }
      />
      <div className="grid gap-2 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader><CardTitle>Clinical summary</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Medical history</p>
              <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">{chart.patient.medicalHistorySummary}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Allergies</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {chart.allergies.map((item) => <Badge key={item.id} variant="warning">{item.allergen}</Badge>)}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Medications</p>
              <div className="mt-2 space-y-2">
                {chart.medications.map((item) => <p key={item.id} className="text-sm text-[var(--foreground)]">{item.name} - {item.dose} - {item.frequency}</p>)}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Timeline</p>
              <div className="mt-3 space-y-2">
                {chart.encounters.map((encounter) => (
                  <div key={encounter.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3">
                    <p className="font-medium text-[var(--foreground)]">{encounter.chiefComplaint}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{encounter.visitSummary}</p>
                    <Button asChild className="mt-4" size="sm" variant="secondary">
                      <Link href={`/notes/${encounter.id}`}>Open SOAP note</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-2">
          <Card>
            <CardHeader><CardTitle>Portal readiness</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Badge variant={chart.patient.consentAcknowledged ? "success" : "warning"}>{chart.patient.consentAcknowledged ? "Consent acknowledged" : "Consent pending"}</Badge>
              <p className="text-sm text-[var(--muted)]">Insurance placeholder: {chart.patient.insuranceNotes}</p>
              <p className="text-sm text-[var(--muted)]">Emergency contact: {chart.contacts[0]?.fullName ?? "Not provided"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Vitals</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {chart.vitalSigns[0] ? (
                <>
                  <div className="rounded-xl bg-[var(--surface-subtle)] p-4"><p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Blood pressure</p><p className="mt-2 text-lg font-semibold">{chart.vitalSigns[0].systolicBp}/{chart.vitalSigns[0].diastolicBp}</p></div>
                  <div className="rounded-xl bg-[var(--surface-subtle)] p-4"><p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Heart rate</p><p className="mt-2 text-lg font-semibold">{chart.vitalSigns[0].heartRate} bpm</p></div>
                </>
              ) : (
                <p className="col-span-2 text-sm text-[var(--muted)]">No vitals recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

