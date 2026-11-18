import { ImageResponse } from "next/og";
import { loadRenderableImage } from "@/lib/render-image";
import { SITE_CONTENT } from "@/lib/site-content";

// Browser tab / bookmark icon, generated at build time from the CMS's square
// logo, so changing it in /admin updates the icon on the next deploy, at exactly
// this size.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
  const src = await loadRenderableImage(SITE_CONTENT.images.logoSquare, "site icon");
  return new ImageResponse(<img src={src} width={size.width} height={size.height} alt="" />, size);
}
