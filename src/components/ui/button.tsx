import React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:pointer-events-none [&_svg]:transition-transform hover:[&_svg]:translate-x-0.5",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-orange text-background shadow-[0_8px_24px_-10px_rgb(var(--brand-orange)/0.8)] hover:bg-brand-amber hover:shadow-glow",
        outline:
          "border border-surface-border bg-surface-card/60 text-text-primary backdrop-blur hover:border-brand-orange/60 hover:bg-surface-raised",
        brandOutline:
          "border border-brand-orange/50 bg-brand-orange/10 text-brand-orange hover:bg-brand-orange hover:text-background",
        ghost:
          "text-text-secondary border border-surface-border hover:border-brand-orange/60 hover:text-text-primary",
      },
      size: {
        sm: "px-4 py-2 text-xs",
        md: "px-5 py-2.5",
        lg: "px-7 py-3.5",
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