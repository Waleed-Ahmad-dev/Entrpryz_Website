import { cn } from "@/lib/utils";

interface SectionBackgroundProps {
  className?: string;
  glowStrength?: "subtle" | "medium";
}

/**
 * Premium abstract backdrop — soft radial brand glows, a fine fading
 * technical grid, and a subtle bottom vignette. Purely decorative.
 */
export function SectionBackground({
  className,
  glowStrength = "subtle",
}: SectionBackgroundProps) {
  const glowOpacity = glowStrength === "medium" ? "opacity-80" : "opacity-60";
  return (
    <div
      className={cn(
        "absolute inset-0 z-0 pointer-events-none overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Fine technical grid fading toward the bottom */}
      <div className="absolute inset-0 abstract-grid" />

      {/* Soft brand glows anchored away from content */}
      <div
        className={`glow-orb absolute -bottom-48 -left-32 h-[540px] w-[540px] ${glowOpacity}`}
      />
      <div
        className={`glow-orb absolute -top-44 -right-32 h-[560px] w-[560px] ${glowOpacity}`}
      />

      {/* Bottom vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
    </div>
  );
}