"use server";

import { redirect } from "next/navigation";

import { getRoleHomePath, normalizeRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/lib/validations/health";

export type FormActionState = {
  error?: string;
  success?: string;
};

export async function signInAction(
  _previousState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid sign-in request." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  const role = normalizeRole(data.user?.user_metadata.role);
  redirect(getRoleHomePath(role));
}

export async function signUpAction(
  _previousState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const parsed = signUpSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid sign-up request." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        role: "patient",
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        phone: parsed.data.phone,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Account created. Sign in to continue into the patient portal." };
}

