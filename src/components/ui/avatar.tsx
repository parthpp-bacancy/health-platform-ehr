import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn("inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)]", className)}
      {...props}
    />
  );
}

export function AvatarImage(props: ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image className="h-full w-full object-cover" {...props} />;
}

export function AvatarFallback({ className, ...props }: ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn("flex h-full w-full items-center justify-center bg-[var(--surface-subtle)] text-sm font-semibold text-[var(--foreground)]", className)}
      {...props}
    />
  );
}
