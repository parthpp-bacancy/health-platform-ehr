"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createAppointmentAction } from "@/app/actions/appointments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Patient, type ProviderProfile } from "@/lib/demo/types";
import { appointmentFormSchema, type AppointmentFormInput } from "@/lib/validations/health";

const selectClassName =
  "field-shell h-9 w-full rounded-xl px-3 text-sm text-[var(--foreground)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

export function AppointmentForm({ patients, providers }: { patients: Patient[]; providers: ProviderProfile[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<AppointmentFormInput>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: patients[0]?.id ?? "",
      providerId: providers[0]?.id ?? "",
      appointmentType: "Follow-up",
      visitReason: "",
      scheduledStart: "",
      scheduledEnd: "",
      locationName: "Virtual visit",
      notes: "",
    },
  });

  const onSubmit = (values: AppointmentFormInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.set(key, String(value ?? ""));
    });

    startTransition(async () => {
      try {
        const result = await createAppointmentAction(formData);
        router.push(`/appointments/${result.appointmentId}`);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to schedule appointment.");
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label>Patient</Label>
        <select className={selectClassName} {...form.register("patientId")}>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>{patient.firstName} {patient.lastName}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label>Provider</Label>
        <select className={selectClassName} {...form.register("providerId")}>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>{provider.specialty} clinician</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label>Appointment type</Label>
        <Input {...form.register("appointmentType")} />
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Input {...form.register("locationName")} />
      </div>
      <div className="space-y-2">
        <Label>Start</Label>
        <Input type="datetime-local" {...form.register("scheduledStart")} />
      </div>
      <div className="space-y-2">
        <Label>End</Label>
        <Input type="datetime-local" {...form.register("scheduledEnd")} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Visit reason</Label>
        <Textarea {...form.register("visitReason")} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Notes</Label>
        <Textarea {...form.register("notes")} />
      </div>
      <div className="md:col-span-2">
        <Button disabled={isSubmitting} type="submit">{isSubmitting ? "Scheduling..." : "Schedule appointment"}</Button>
      </div>
    </form>
  );
}
