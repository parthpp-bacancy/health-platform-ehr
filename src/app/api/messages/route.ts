import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/auth/session";
import { findProfileByUserId, listMessageThreads, sendMessage } from "@/lib/server/health-data";
import { messageSchema } from "@/lib/validations/health";

export async function GET() {
  const auth = await requireApiSession();

  if ("response" in auth) {
    return auth.response;
  }

  const threads = await listMessageThreads({
    userId: auth.session.userId,
    role: auth.session.role,
  });

  return NextResponse.json({ threads });
}

export async function POST(request: Request) {
  const auth = await requireApiSession();

  if ("response" in auth) {
    return auth.response;
  }

  const payload = await request.json();
  const parsed = messageSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await findProfileByUserId(auth.session.userId);
  const messageId = await sendMessage(parsed.data, profile?.id ?? auth.session.userId);
  return NextResponse.json({ messageId }, { status: 201 });
}
