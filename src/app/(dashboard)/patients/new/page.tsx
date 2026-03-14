import type { Metadata } from "next";

import { PatientIntakeForm } from "@/components/forms/patient-intake-form";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { requireStaffSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Patient Intake",
};

export default async function PatientIntakePage() {
  await requireStaffSession();

  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Onboarding"
        title="Create patient chart"
        description="Capture demographics, contact details, history summary, placeholder insurance data, and intake consent in one structured workflow."
      />
      <Card>
        <CardContent>
          <PatientIntakeForm />
        </CardContent>
      </Card>
    </div>
  );
}
