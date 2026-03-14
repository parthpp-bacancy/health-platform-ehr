"use server";

import { revalidatePath } from "next/cache";

import { requireStaffSession } from "@/lib/auth/session";
import { createPatient, findProfileByUserId } from "@/lib/server/health-data";
import { patientIntakeSchema } from "@/lib/validations/health";

export async function createPatientAction(formData: FormData) {
  const session = await requireStaffSession();
  const profile = await findProfileByUserId(session.userId);
  const consentValue = formData.get("consentAcknowledged");
  const parsed = patientIntakeSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    dateOfBirth: formData.get("dateOfBirth"),
    sex: formData.get("sex"),
    genderIdentity: formData.get("genderIdentity"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    addressLine1: formData.get("addressLine1"),
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    medicalHistorySummary: formData.get("medicalHistorySummary"),
    insuranceNotes: formData.get("insuranceNotes"),
    emergencyContactName: formData.get("emergencyContactName"),
    emergencyContactRelationship: formData.get("emergencyContactRelationship"),
    emergencyContactPhone: formData.get("emergencyContactPhone"),
    consentAcknowledged: consentValue === "on" || consentValue === "true",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid patient intake payload.");
  }

  const patientId = await createPatient(parsed.data, profile?.id ?? session.userId);
  revalidatePath("/patients");
  revalidatePath(`/patients/${patientId}`);
  return { patientId };
}
