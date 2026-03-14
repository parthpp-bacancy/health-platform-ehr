import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PatientsTable } from "@/components/patients/patients-table";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isStaffRole } from "@/lib/auth/roles";
import { requireSession } from "@/lib/auth/session";
import { listPatients } from "@/lib/server/health-data";

export const metadata: Metadata = {
  title: "Patients",
};

export default async function PatientsPage() {
  const session = await requireSession();
  if (!isStaffRole(session.role)) {
    redirect("/portal");
  }

  const patients = await listPatients();

  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Population"
        title="Patients"
        description="View the active patient roster, intake status, and access each chart from a single list."
        action={
          <Button asChild>
            <Link href="/patients/new">New patient intake</Link>
          </Button>
        }
      />
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto p-4">
            <PatientsTable
              rows={patients.map((patient) => ({
                id: patient.id,
                mrn: patient.mrn,
                name: `${patient.firstName} ${patient.lastName}`,
                intakeStatus: patient.intakeStatus,
                provider: patient.provider?.specialty ?? "Unassigned",
                latestAppointment: patient.latestAppointment?.scheduledStart,
              }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

