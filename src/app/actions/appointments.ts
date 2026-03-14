"use server";

import { revalidatePath } from "next/cache";

import { requireStaffSession } from "@/lib/auth/session";
import { createAppointment, findProfileByUserId } from "@/lib/server/health-data";
import { appointmentFormSchema } from "@/lib/validations/health";

export async function createAppointmentAction(formData: FormData) {
  const session = await requireStaffSession();
  const profile = await findProfileByUserId(session.userId);
  const parsed = appointmentFormSchema.safeParse({
    patientId: formData.get("patientId"),
    providerId: formData.get("providerId"),
    appointmentType: formData.get("appointmentType"),
    visitReason: formData.get("visitReason"),
    scheduledStart: formData.get("scheduledStart"),
    scheduledEnd: formData.get("scheduledEnd"),
    locationName: formData.get("locationName"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid appointment payload.");
  }

  const appointmentId = await createAppointment(parsed.data, profile?.id ?? session.userId);
  revalidatePath("/appointments");
  revalidatePath(`/appointments/${appointmentId}`);
  return { appointmentId };
}
