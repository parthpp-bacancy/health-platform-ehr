"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveSoapNoteAction } from "@/app/actions/encounters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type SoapNote } from "@/lib/demo/types";
import { soapNoteSchema, type SoapNoteInput } from "@/lib/validations/health";

export function SoapNoteForm({ encounterId, defaultNote }: { encounterId: string; defaultNote?: SoapNote | null }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SoapNoteInput>({
    resolver: zodResolver(soapNoteSchema),
    defaultValues: {
      encounterId,
      subjective: defaultNote?.subjective ?? "",
      objective: defaultNote?.objective ?? "",
      assessment: defaultNote?.assessment ?? "",
      plan: defaultNote?.plan ?? "",
      followUp: defaultNote?.followUp ?? "",
    },
  });

  const onSubmit = (values: SoapNoteInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.set(key, String(value ?? "")));

    startTransition(async () => {
      try {
        const result = await saveSoapNoteAction(formData);
        router.push(`/notes/${result.encounterId}`);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to save SOAP note.");
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Input type="hidden" value={encounterId} {...form.register("encounterId")} />
      <div className="space-y-2">
        <Label>Subjective</Label>
        <Textarea {...form.register("subjective")} />
      </div>
      <div className="space-y-2">
        <Label>Objective</Label>
        <Textarea {...form.register("objective")} />
      </div>
      <div className="space-y-2">
        <Label>Assessment</Label>
        <Textarea {...form.register("assessment")} />
      </div>
      <div className="space-y-2">
        <Label>Plan</Label>
        <Textarea {...form.register("plan")} />
      </div>
      <div className="space-y-2">
        <Label>Follow-up</Label>
        <Textarea {...form.register("followUp")} />
      </div>
      <Button disabled={isSubmitting} type="submit">{isSubmitting ? "Signing note..." : "Sign SOAP note"}</Button>
    </form>
  );
}
