import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/auth/session";
import { getReportsSnapshot } from "@/lib/server/health-data";

const staffRoles = ["admin", "provider", "care_coordinator"] as const;

export async function GET() {
  const auth = await requireApiSession(staffRoles);

  if ("response" in auth) {
    return auth.response;
  }

  return NextResponse.json({ reports: await getReportsSnapshot() });
}
