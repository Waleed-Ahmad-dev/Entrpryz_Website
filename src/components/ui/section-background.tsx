import Image from "next/image";

interface SectionBackgroundProps {
  src: string;
  alt?: string;
  opacity?: number;
  overlayStart?: string;
  overlayEnd?: string;
}

export function SectionBackground({
  src,
  alt = "",
  opacity = 0.5,
  overlayStart = "rgba(8, 10, 13, 0.55)",
  overlayEnd = "rgba(8, 10, 13, 0.82)",
}: SectionBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Image
        src={src}
        alt={alt}
        fill
        style={{ opacity }}
        className="object-cover object-center"
        priority
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${overlayStart} 0%, ${overlayEnd} 100%)`,
        }}
      />
    </div>
  );
}