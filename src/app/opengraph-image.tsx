import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SITE_CONTENT } from "@/lib/site-content";

export const alt = `${SITE_CONTENT.site.name} — ${SITE_CONTENT.site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 1200x630 share card used for every page (Open Graph and Twitter/X). Rendered at build time. */
export default async function OpenGraphImage() {
  const logo = await readFile(path.join(process.cwd(), "public", SITE_CONTENT.images.logo));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const [first, second] = SITE_CONTENT.site.tagline.split(/(?<=\.)\s+/);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#090B0F",
          backgroundImage: "radial-gradient(circle at 85% 15%, rgba(255,122,24,0.35), transparent 45%)",
          color: "#F4F5F7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={96} height={87} alt="" />
          <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>{SITE_CONTENT.site.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 96, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>{first}</span>
          {second && (
            <span style={{ fontSize: 96, fontWeight: 800, letterSpacing: -3, lineHeight: 1, color: "#FF7A18" }}>{second}</span>
          )}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#A8B0BC" }}>
          ERP · Software Development · IT Services · AI Agents
        </div>
      </div>
    ),
    size
  );
}
