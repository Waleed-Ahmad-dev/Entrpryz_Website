import React from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  darkSurface?: boolean;
  borderBottom?: boolean;
}

export function SectionContainer({
  children,
  className,
  darkSurface = false,
  borderBottom = true,
  ...props
}: SectionContainerProps) {
  return (
    <section
      className={cn(
        "py-16 md:py-24 relative overflow-hidden",
        darkSurface ? "bg-surface-card" : "bg-background",
        borderBottom && "border-b border-surface-border",
        className
      )}
      {...props}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
