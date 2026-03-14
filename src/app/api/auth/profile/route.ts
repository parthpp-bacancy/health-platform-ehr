import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/auth/session";

export async function GET() {
  const auth = await requireApiSession();

  if ("response" in auth) {
    return auth.response;
  }

  return NextResponse.json({ session: auth.session });
}
