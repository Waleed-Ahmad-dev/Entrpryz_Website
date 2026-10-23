import React from "react";
import { cn } from "@/lib/utils";
import { SectionBackground } from "@/components/ui/section-background";

interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /** Slightly lifted background, used to alternate section rhythm. */
  darkSurface?: boolean;
  /** Grid-and-glow backdrop; reserved for headers and calls to action. */
  showBackdrop?: boolean;
}

export function SectionContainer({
  children,
  className,
  darkSurface = false,
  showBackdrop = false,
  ...props
}: SectionContainerProps) {
  return (
    <section
      className={cn(
        "py-16 md:py-24 relative overflow-hidden",
        darkSurface ? "bg-gradient-to-b from-surface-card/70 via-surface-card/40 to-background" : "bg-background",
        className
      )}
      {...props}
    >
      <div className="section-divider absolute inset-x-0 top-0 h-px" aria-hidden="true" />
      {showBackdrop && <SectionBackground />}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
