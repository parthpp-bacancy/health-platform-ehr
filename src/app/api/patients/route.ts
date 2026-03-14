import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/auth/session";
import { createPatient, findProfileByUserId, listPatients } from "@/lib/server/health-data";
import { patientIntakeSchema } from "@/lib/validations/health";

const staffRoles = ["admin", "provider", "care_coordinator"] as const;

export async function GET() {
  const auth = await requireApiSession(staffRoles);

  if ("response" in auth) {
    return auth.response;
  }

  return NextResponse.json({ patients: await listPatients() });
}

export async function POST(request: Request) {
  const auth = await requireApiSession(staffRoles);

  if ("response" in auth) {
    return auth.response;
  }

  const payload = await request.json();
  const parsed = patientIntakeSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await findProfileByUserId(auth.session.userId);
  const patientId = await createPatient(parsed.data, profile?.id ?? auth.session.userId);
  return NextResponse.json({ patientId }, { status: 201 });
}
