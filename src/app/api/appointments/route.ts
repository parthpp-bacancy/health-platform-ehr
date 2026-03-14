import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/auth/session";
import { createAppointment, findProfileByUserId, listAppointments } from "@/lib/server/health-data";
import { appointmentFormSchema } from "@/lib/validations/health";

const staffRoles = ["admin", "provider", "care_coordinator"] as const;

export async function GET() {
  const auth = await requireApiSession(staffRoles);

  if ("response" in auth) {
    return auth.response;
  }

  return NextResponse.json({ appointments: await listAppointments() });
}

export async function POST(request: Request) {
  const auth = await requireApiSession(staffRoles);

  if ("response" in auth) {
    return auth.response;
  }

  const payload = await request.json();
  const parsed = appointmentFormSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await findProfileByUserId(auth.session.userId);
  const appointmentId = await createAppointment(parsed.data, profile?.id ?? auth.session.userId);
  return NextResponse.json({ appointmentId }, { status: 201 });
}
