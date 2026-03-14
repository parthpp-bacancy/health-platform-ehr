import { z } from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const signUpSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.email(),
  password: z.string().min(10),
  phone: z.string().min(10),
});

export const patientIntakeSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dateOfBirth: z.string().min(1),
  sex: z.string().min(1),
  genderIdentity: z.string().min(1),
  email: z.email(),
  phone: z.string().min(10),
  addressLine1: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(4),
  medicalHistorySummary: z.string().min(10),
  insuranceNotes: z.string().min(2),
  emergencyContactName: z.string().min(2),
  emergencyContactRelationship: z.string().min(2),
  emergencyContactPhone: z.string().min(10),
  consentAcknowledged: z.boolean().refine((value) => value, "Consent acknowledgement is required."),
});

export const appointmentFormSchema = z.object({
  patientId: z.string().uuid(),
  providerId: z.string().uuid(),
  appointmentType: z.string().min(2),
  visitReason: z.string().min(5),
  scheduledStart: z.string().min(1),
  scheduledEnd: z.string().min(1),
  locationName: z.string().min(2),
  notes: z.string().max(500).optional(),
});

export const soapNoteSchema = z.object({
  encounterId: z.string().uuid(),
  subjective: z.string().min(5),
  objective: z.string().min(5),
  assessment: z.string().min(5),
  plan: z.string().min(5),
  followUp: z.string().optional(),
});

export const carePlanSchema = z.object({
  patientId: z.string().uuid(),
  encounterId: z.string().uuid().optional(),
  goal: z.string().min(5),
  interventions: z.string().min(5),
  milestones: z.string().min(5),
  status: z.enum(["draft", "active", "completed", "archived"]),
  assignedTo: z.string().uuid().optional(),
  shareWithPatient: z.boolean(),
  nextReviewAt: z.string().optional(),
});

export const messageSchema = z.object({
  threadId: z.string().uuid(),
  body: z.string().min(1).max(2000),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type PatientIntakeInput = z.infer<typeof patientIntakeSchema>;
export type AppointmentFormInput = z.infer<typeof appointmentFormSchema>;
export type SoapNoteInput = z.infer<typeof soapNoteSchema>;
export type CarePlanInput = z.infer<typeof carePlanSchema>;
export type MessageInput = z.infer<typeof messageSchema>;


