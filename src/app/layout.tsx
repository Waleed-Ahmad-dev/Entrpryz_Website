import type { Metadata } from "next";
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
  keywords: [
    "Enterprise Technology",
    "ERP Optimization",
    "Software Development",
    "IT Services",
    "Oracle NetSuite",
    "SAP Business One",
    "Entrpryz",
  ],
  icons: {
    icon: SITE_CONTENT.images.logo,
    apple: SITE_CONTENT.images.logoSquare,
  },
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
    images: [
      {
        url: SITE_CONTENT.images.logoSquare,
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_CONTENT.images.logoSquare],
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#080A0D",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}${SITE_CONTENT.images.logoSquare}`,
  description: SITE_DESCRIPTION,
  founder: {
    "@type": "Person",
    name: "Javed Ahmad Qureshi",
    jobTitle: "Founder & CIO",
  },
  email: SITE_CONTENT.contact.contacts.general,
  areaServed: ["Pakistan", "United Arab Emirates"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${spaceGrotesk.variable} dark`}
    >
      <body className="min-h-screen bg-background text-text-primary antialiased flex flex-col relative selection:bg-brand-orange selection:text-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Escape "<" so editable content can never close the script tag.
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
