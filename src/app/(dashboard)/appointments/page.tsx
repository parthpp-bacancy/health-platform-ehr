import type { Metadata } from "next";

import { AppointmentsTable } from "@/components/appointments/appointments-table";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireStaffSession } from "@/lib/auth/session";
import { readDemoDatabase } from "@/lib/demo/store";
import { listAppointments, listPatients } from "@/lib/server/health-data";

export const metadata: Metadata = {
  title: "Appointments",
};

export default async function AppointmentsPage() {
  await requireStaffSession();
  const [appointments, patients, database] = await Promise.all([
    listAppointments(),
    listPatients(),
    readDemoDatabase(),
  ]);

  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Scheduling"
        title="Appointments"
        description="Manage bookings, review visit statuses, and reserve future virtual care slots."
      />
      <div className="grid gap-2 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader><CardTitle>Schedule a visit</CardTitle></CardHeader>
          <CardContent>
            <AppointmentForm patients={patients.map((item) => item)} providers={database.providers} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Visit board</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto p-4">
              <AppointmentsTable
                rows={appointments.map((appointment) => ({
                  id: appointment.id,
                  patientName: `${appointment.patient?.firstName ?? "Patient"} ${appointment.patient?.lastName ?? ""}`.trim(),
                  appointmentType: appointment.appointmentType,
                  scheduledStart: appointment.scheduledStart,
                  status: appointment.status,
                }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
