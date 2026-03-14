"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { roleLabels } from "@/lib/auth/roles";
import { type UserRole } from "@/lib/demo/types";
import { primaryNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  displayName: string;
  role: UserRole;
};

export function AppShell({ children, displayName, role }: AppShellProps) {
  const pathname = usePathname();
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-screen px-2 py-2">
      <div className="grid min-h-[calc(100vh-1rem)] gap-2 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="app-shell-blur surface-panel rounded-xl border px-3 py-4">
          <div className="flex items-center gap-2.5 border-b border-[var(--border)] px-1 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--foreground)] text-xs font-semibold text-[var(--primary-foreground)]">LH</div>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Luma Health OS</p>
              <p className="text-xs text-[var(--muted)]">Virtual primary care</p>
            </div>
          </div>

          <div className="surface-subtle mt-4 flex items-center gap-2.5 rounded-xl p-2.5">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">{displayName}</p>
              <p className="text-xs text-[var(--muted)]">{roleLabels[role]}</p>
            </div>
          </div>

          <nav className="mt-4 flex flex-col gap-0.5">
            {primaryNavigation
              .filter((item) => item.roles.includes(role))
              .map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition",
                      isActive
                        ? "border border-[var(--border-strong)] bg-[var(--surface-subtle)] font-semibold text-[var(--foreground)]"
                        : "text-[var(--muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
          </nav>

          <div className="surface-subtle mt-4 rounded-xl p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Compliance</p>
            <p className="mt-1.5 text-xs leading-5 text-[var(--foreground)]">Audit logging is enabled for future HIPAA hardening.</p>
            <Button asChild className="mt-3 w-full" size="sm" variant="secondary">
              <Link href="/api/auth/sign-out">Sign out</Link>
            </Button>
          </div>
        </aside>

        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );
}
