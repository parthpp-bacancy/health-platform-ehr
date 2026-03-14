import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/auth/session";
import { findProfileByUserId, saveSoapNote } from "@/lib/server/health-data";
import { soapNoteSchema } from "@/lib/validations/health";

const providerRoles = ["admin", "provider"] as const;

export async function POST(request: Request) {
  const auth = await requireApiSession(providerRoles);

  if ("response" in auth) {
    return auth.response;
  }

  const payload = await request.json();
  const parsed = soapNoteSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await findProfileByUserId(auth.session.userId);
  const noteId = await saveSoapNote(parsed.data, profile?.id ?? auth.session.userId);
  return NextResponse.json({ noteId }, { status: 201 });
}
