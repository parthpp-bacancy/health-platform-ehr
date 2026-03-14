import { describe, expect, it } from "vitest";

import { appointmentFormSchema, patientIntakeSchema, signInSchema } from "@/lib/validations/health";

describe("validation schemas", () => {
  it("accepts a valid sign in payload", () => {
    expect(signInSchema.safeParse({ email: "care@luma.health", password: "strongpassword" }).success).toBe(true);
  });

  it("rejects patient intake submissions without consent", () => {
    const result = patientIntakeSchema.safeParse({
      firstName: "Jordan",
      lastName: "Lee",
      dateOfBirth: "1991-05-14",
      sex: "Female",
      genderIdentity: "Woman",
      email: "patient@luma.health",
      phone: "9175550100",
      addressLine1: "245 Park Avenue",
      city: "New York",
      state: "NY",
      postalCode: "10017",
      medicalHistorySummary: "Mild asthma and seasonal allergies.",
      insuranceNotes: "PPO placeholder",
      emergencyContactName: "Avery Lee",
      emergencyContactRelationship: "Spouse",
      emergencyContactPhone: "9175550101",
      consentAcknowledged: false,
    });

    expect(result.success).toBe(false);
  });

  it("requires UUID identifiers for appointment submissions", () => {
    const result = appointmentFormSchema.safeParse({
      patientId: "not-a-uuid",
      providerId: "also-not-a-uuid",
      appointmentType: "Follow-up",
      visitReason: "Review fatigue symptoms",
      scheduledStart: "2026-03-18T14:00",
      scheduledEnd: "2026-03-18T14:30",
      locationName: "Virtual visit",
    });

    expect(result.success).toBe(false);
  });
});

