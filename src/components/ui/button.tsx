import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
  {
    variants: {
      variant: {
        default:
          "border border-[var(--border-strong)] bg-[var(--surface-strong)] px-4 py-2.5 text-[var(--foreground)] shadow-sm shadow-black/10 hover:bg-[var(--surface-subtle)]",
        secondary:
          "border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-2.5 text-[var(--muted)] shadow-sm hover:bg-[var(--surface-strong)] hover:text-[var(--foreground)]",
        ghost:
          "px-3 py-2 text-[var(--muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)]",
        destructive:
          "border border-[var(--border-strong)] bg-[var(--surface-strong)] px-4 py-2.5 text-[var(--foreground)] shadow-sm shadow-black/10 hover:bg-[var(--surface-subtle)]",
      },
      size: {
        default: "h-9",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
