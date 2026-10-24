import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { HashScroll } from "@/components/layout/hash-scroll";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <HashScroll />
      {/* Cookieless page-view counts; same-origin script, so the CSP is unchanged. */}
      <Analytics />
    </>
  );
}
