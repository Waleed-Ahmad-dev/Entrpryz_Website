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
    "ERP, software development, and IT services — 25+ years of real-world technology experience put to work on your business.",
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
    icon: "/images/logo-transparent.png",
    apple: "/images/logo-main.png",
  },
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
