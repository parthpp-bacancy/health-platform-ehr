"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { sendMessageAction } from "@/app/actions/messages";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema, type MessageInput } from "@/lib/validations/health";

export function MessageComposer({ threadId }: { threadId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues: { threadId, body: "" },
  });

  const onSubmit = (values: MessageInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.set("threadId", values.threadId);
    formData.set("body", values.body);

    startTransition(async () => {
      try {
        await sendMessageAction(formData);
        form.reset({ threadId, body: "" });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to send message.");
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
      <Textarea placeholder="Write a secure reply..." {...form.register("body")} />
      <Button disabled={isSubmitting} type="submit">{isSubmitting ? "Sending..." : "Send message"}</Button>
    </form>
  );
}

