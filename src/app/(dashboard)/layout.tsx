import { type ReactNode } from "react";

import { AppShell } from "@/components/shell/app-shell";
import { requireSession } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();
  const displayName = `${session.firstName} ${session.lastName}`.trim() || session.email;

  return (
    <AppShell displayName={displayName} role={session.role}>
      {children}
    </AppShell>
  );
}

