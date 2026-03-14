import { redirect } from "next/navigation";

import { getRoleHomePath } from "@/lib/auth/roles";
import { getCurrentSession } from "@/lib/auth/session";

export default async function HomePage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/sign-in");
  }

  redirect(getRoleHomePath(session.role));
}

