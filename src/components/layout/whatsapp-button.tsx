import { MessageCircle } from "lucide-react";
import { SITE_CONTENT } from "@/lib/site-content";

/** Floating WhatsApp link; hidden until a number is set in /admin. */
export function WhatsAppButton() {
  const { number, message } = SITE_CONTENT.site.whatsapp;
  if (!number || !/^[1-9]\d{7,14}$/.test(number)) return null;
  const href = `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 hover:scale-105 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
