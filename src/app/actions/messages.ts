"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/auth/session";
import { findProfileByUserId, sendMessage } from "@/lib/server/health-data";
import { messageSchema } from "@/lib/validations/health";

export async function sendMessageAction(formData: FormData) {
  const session = await requireSession();
  const profile = await findProfileByUserId(session.userId);
  const senderProfileId = profile?.id ?? session.userId;

  const parsed = messageSchema.safeParse({
    threadId: formData.get("threadId"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid message payload.");
  }

  await sendMessage(parsed.data, senderProfileId);
  revalidatePath(`/messages/${parsed.data.threadId}`);
}
