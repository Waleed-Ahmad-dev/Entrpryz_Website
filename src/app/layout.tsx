import type { Metadata } from "next";
import { Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
  title: "Entrpryz — Technology. Simplified.",
  description:
    "25+ Years of Technology & Digital Transformation Experience — Now Focused on Your Business.",
  keywords: [
    "Digital Transformation",
    "ERP Implementation",
    "Software Development",
    "IT Leadership",
    "Oracle NetSuite",
    "SAP Business One",
    "Entrpryz",
  ],
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
        {/* Subtle noise grain texture overlay */}
        <div className="bg-noise" aria-hidden="true" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
