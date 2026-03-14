import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.04em]",
  {
    variants: {
      variant: {
        neutral: "border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--foreground)]/80",
        success: "border-[var(--border-strong)] bg-[var(--surface-subtle)] text-[var(--foreground)]/85",
        warning: "border-[var(--border-strong)] bg-[var(--surface-subtle)] text-[var(--foreground)]/90",
        info: "border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--foreground)]/85",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export function Badge({ className, variant, ...props }: HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
