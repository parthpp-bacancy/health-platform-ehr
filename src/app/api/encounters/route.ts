import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/auth/session";
import { readDemoDatabase } from "@/lib/demo/store";

const staffRoles = ["admin", "provider", "care_coordinator"] as const;

export async function GET() {
  const auth = await requireApiSession(staffRoles);

  if ("response" in auth) {
    return auth.response;
  }

  const database = await readDemoDatabase();
  return NextResponse.json({ encounters: database.encounters });
}
