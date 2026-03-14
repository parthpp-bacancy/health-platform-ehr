"use server";

import { revalidatePath } from "next/cache";

import { findProfileByUserId, saveCarePlan, saveSoapNote } from "@/lib/server/health-data";
import { requireProviderSession, requireStaffSession } from "@/lib/auth/session";
import { carePlanSchema, soapNoteSchema } from "@/lib/validations/health";

export async function saveSoapNoteAction(formData: FormData) {
  const session = await requireProviderSession();
  const profile = await findProfileByUserId(session.userId);
  const parsed = soapNoteSchema.safeParse({
    encounterId: formData.get("encounterId"),
    subjective: formData.get("subjective"),
    objective: formData.get("objective"),
    assessment: formData.get("assessment"),
    plan: formData.get("plan"),
    followUp: formData.get("followUp") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid SOAP note payload.");
  }

  const noteId = await saveSoapNote(parsed.data, profile?.id ?? session.userId);
  revalidatePath(`/notes/${parsed.data.encounterId}`);
  return { noteId, encounterId: parsed.data.encounterId };
}

export async function saveCarePlanAction(formData: FormData) {
  const session = await requireStaffSession();
  const profile = await findProfileByUserId(session.userId);
  const parsed = carePlanSchema.safeParse({
    patientId: formData.get("patientId"),
    encounterId: formData.get("encounterId") || undefined,
    goal: formData.get("goal"),
    interventions: formData.get("interventions"),
    milestones: formData.get("milestones"),
    status: formData.get("status"),
    assignedTo: formData.get("assignedTo") || undefined,
    shareWithPatient: formData.get("shareWithPatient") === "on",
    nextReviewAt: formData.get("nextReviewAt") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid care plan payload.");
  }

  const carePlanId = await saveCarePlan(parsed.data, profile?.id ?? session.userId);
  revalidatePath(`/care-plans/${parsed.data.patientId}`);
  return { carePlanId, patientId: parsed.data.patientId };
}
