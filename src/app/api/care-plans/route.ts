import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/auth/session";
import { readDemoDatabase } from "@/lib/demo/store";
import { findProfileByUserId, saveCarePlan } from "@/lib/server/health-data";
import { carePlanSchema } from "@/lib/validations/health";

const staffRoles = ["admin", "provider", "care_coordinator"] as const;

export async function GET() {
  const auth = await requireApiSession(staffRoles);

  if ("response" in auth) {
    return auth.response;
  }

  const database = await readDemoDatabase();
  return NextResponse.json({ carePlans: database.carePlans });
}

export async function POST(request: Request) {
  const auth = await requireApiSession(staffRoles);

  if ("response" in auth) {
    return auth.response;
  }

  const payload = await request.json();
  const parsed = carePlanSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await findProfileByUserId(auth.session.userId);
  const carePlanId = await saveCarePlan(parsed.data, profile?.id ?? auth.session.userId);
  return NextResponse.json({ carePlanId }, { status: 201 });
}
