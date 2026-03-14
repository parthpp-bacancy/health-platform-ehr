"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveCarePlanAction } from "@/app/actions/encounters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Profile } from "@/lib/demo/types";
import { carePlanSchema, type CarePlanInput } from "@/lib/validations/health";

const selectClassName =
  "field-shell h-9 w-full rounded-xl px-3 text-sm text-[var(--foreground)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

export function CarePlanForm({ patientId, staff }: { patientId: string; staff: Profile[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<CarePlanInput>({
    resolver: zodResolver(carePlanSchema),
    defaultValues: {
      patientId,
      goal: "",
      interventions: "",
      milestones: "",
      status: "active",
      assignedTo: staff[0]?.id,
      shareWithPatient: true,
      nextReviewAt: "",
    },
  });

  const onSubmit = (values: CarePlanInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.set(key, String(value ?? "")));

    if (values.shareWithPatient) {
      formData.set("shareWithPatient", "on");
    }

    startTransition(async () => {
      try {
        const result = await saveCarePlanAction(formData);
        router.push(`/care-plans/${result.patientId}`);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to save care plan.");
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Input type="hidden" value={patientId} {...form.register("patientId")} />
      <div className="space-y-2">
        <Label>Goal</Label>
        <Textarea {...form.register("goal")} />
      </div>
      <div className="space-y-2">
        <Label>Interventions</Label>
        <Textarea {...form.register("interventions")} />
      </div>
      <div className="space-y-2">
        <Label>Milestones</Label>
        <Textarea {...form.register("milestones")} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Status</Label>
          <select className={selectClassName} {...form.register("status")}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Assigned to</Label>
          <select className={selectClassName} {...form.register("assignedTo")}>
            {staff.map((profile) => (
              <option key={profile.id} value={profile.id}>{profile.firstName} {profile.lastName}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Next review date</Label>
        <Input type="date" {...form.register("nextReviewAt")} />
      </div>
      <label className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3 text-sm text-[var(--foreground)]">
        <input type="checkbox" className="h-4 w-4" {...form.register("shareWithPatient")} />
        Share this care plan in the patient portal.
      </label>
      <Button disabled={isSubmitting} type="submit">{isSubmitting ? "Saving care plan..." : "Save care plan"}</Button>
    </form>
  );
}
