import React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-xs font-bold uppercase tracking-widest transition-colors active:scale-95",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-orange text-background hover:bg-brand-amber",
        outline:
          "border border-surface-border bg-surface-card text-text-primary hover:border-brand-orange hover:text-brand-orange",
        brandOutline:
          "border border-brand-orange bg-brand-orange/10 text-brand-orange hover:bg-brand-orange hover:text-background",
        ghost:
          "text-text-secondary border border-surface-border hover:border-brand-orange hover:text-text-primary",
      },
      size: {
        sm: "px-5 py-2.5",
        md: "px-6 py-3",
        lg: "px-8 py-4",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {}

export function Button({
  className,
  variant,
  size,
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}

interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    ButtonVariants {
  href: string;
}

export function ButtonLink({
  className,
  variant,
  size,
  fullWidth,
  href,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}