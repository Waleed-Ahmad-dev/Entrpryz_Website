import type { Metadata, Viewport } from "next";
import { Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
} from "@/lib/site";
import { SITE_CONTENT } from "@/lib/site-content";
import { assertValidSiteContent } from "@/lib/content-schema";
import { serializeJsonLd, siteGraph } from "@/lib/structured-data";

assertValidSiteContent(SITE_CONTENT);

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // Icons come from the file conventions: app/favicon.ico, app/icon.tsx and
  // app/apple-icon.tsx (generated from the CMS square logo).
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  // Search Console / Bing Webmaster ownership tokens (set in Vercel; DNS verification also works).
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#080A0D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // globals.css sets smooth scrolling for in-page #links; this keeps route
      // changes instant (Next.js 16 no longer overrides it by default).
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${spaceGrotesk.variable} dark`}
    >
      <body className="min-h-screen bg-background text-text-primary antialiased flex flex-col relative selection:bg-brand-orange selection:text-background">
        <script
          type="application/ld+json"
          // serializeJsonLd escapes "<" so editable content can never close the tag.
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteGraph()) }}
        />
        {children}
      </body>
    </html>
  );
}
