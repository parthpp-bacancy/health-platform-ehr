import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

import { hasAnyRole, normalizeRole, getRoleHomePath } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { type UserRole } from "@/lib/demo/types";

export type AppSession = {
  userId: string;
  email: string;
  role: ReturnType<typeof normalizeRole>;
  firstName: string;
  lastName: string;
};

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

export async function getCurrentSession(): Promise<AppSession | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user || !user.email) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    role: normalizeRole(readString(user.user_metadata.role)),
    firstName: readString(user.user_metadata.first_name),
    lastName: readString(user.user_metadata.last_name),
  };
}

export async function requireSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

export async function requireRoles(allowedRoles: readonly UserRole[]) {
  const session = await requireSession();

  if (!hasAnyRole(session.role, allowedRoles)) {
    redirect(getRoleHomePath(session.role));
  }

  return session;
}

export function getUnauthorizedApiResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function getForbiddenApiResponse() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function requireApiSession(allowedRoles?: readonly UserRole[]) {
  const session = await getCurrentSession();

  if (!session) {
    return { response: getUnauthorizedApiResponse() } as const;
  }

  if (allowedRoles && !hasAnyRole(session.role, allowedRoles)) {
    return { response: getForbiddenApiResponse() } as const;
  }

  return { session } as const;
}

export async function requireStaffSession() {
  return requireRoles(["admin", "provider", "care_coordinator"]);
}

export async function requireAdminSession() {
  return requireRoles(["admin"]);
}

export async function requirePatientSession() {
  return requireRoles(["patient"]);
}

export async function requireProviderSession() {
  return requireRoles(["admin", "provider"]);
}
