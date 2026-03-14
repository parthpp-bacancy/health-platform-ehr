import { type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="surface-card rounded-xl px-5 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          {eyebrow ? <Badge variant="info">{eyebrow}</Badge> : null}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--muted)]">{description}</p>
          </div>
        </div>
        {action ? <div className="flex items-center gap-3">{action}</div> : null}
      </div>
    </div>
  );
}

export function PlaceholderAction({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild>
      <a href={href}>{label}</a>
    </Button>
  );
}
