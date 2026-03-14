"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createPatientAction } from "@/app/actions/patients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { patientIntakeSchema, type PatientIntakeInput } from "@/lib/validations/health";

function selectClassName() {
  return "field-shell h-9 w-full rounded-xl px-3 text-sm text-[var(--foreground)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--ring)]";
}

export function PatientIntakeForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<PatientIntakeInput>({
    resolver: zodResolver(patientIntakeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      sex: "",
      genderIdentity: "",
      email: "",
      phone: "",
      addressLine1: "",
      city: "",
      state: "",
      postalCode: "",
      medicalHistorySummary: "",
      insuranceNotes: "",
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhone: "",
      consentAcknowledged: false,
    },
  });

  const onSubmit = (values: PatientIntakeInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.set(key, String(value));
    });

    startTransition(async () => {
      try {
        const result = await createPatientAction(formData);
        router.push(`/patients/${result.patientId}`);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to create patient.");
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label>First name</Label>
        <Input {...form.register("firstName")} />
      </div>
      <div className="space-y-2">
        <Label>Last name</Label>
        <Input {...form.register("lastName")} />
      </div>
      <div className="space-y-2">
        <Label>Date of birth</Label>
        <Input type="date" {...form.register("dateOfBirth")} />
      </div>
      <div className="space-y-2">
        <Label>Sex</Label>
        <select className={selectClassName()} {...form.register("sex")}>
          <option value="">Select</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Intersex">Intersex</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label>Gender identity</Label>
        <Input {...form.register("genderIdentity")} />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input type="email" {...form.register("email")} />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input {...form.register("phone")} />
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input {...form.register("addressLine1")} />
      </div>
      <div className="space-y-2">
        <Label>City</Label>
        <Input {...form.register("city")} />
      </div>
      <div className="space-y-2">
        <Label>State</Label>
        <Input {...form.register("state")} />
      </div>
      <div className="space-y-2">
        <Label>Postal code</Label>
        <Input {...form.register("postalCode")} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Medical history summary</Label>
        <Textarea {...form.register("medicalHistorySummary")} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Insurance placeholder notes</Label>
        <Textarea {...form.register("insuranceNotes")} />
      </div>
      <div className="space-y-2">
        <Label>Emergency contact</Label>
        <Input {...form.register("emergencyContactName")} />
      </div>
      <div className="space-y-2">
        <Label>Relationship</Label>
        <Input {...form.register("emergencyContactRelationship")} />
      </div>
      <div className="space-y-2">
        <Label>Emergency phone</Label>
        <Input {...form.register("emergencyContactPhone")} />
      </div>
      <label className="md:col-span-2 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3 text-sm text-[var(--foreground)]">
        <input type="checkbox" className="h-4 w-4" {...form.register("consentAcknowledged")} />
        I acknowledge the intake consent and basic treatment authorization.
      </label>
      <div className="md:col-span-2">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving intake..." : "Create patient chart"}
        </Button>
      </div>
    </form>
  );
}
