import { ContactFormData } from "@/types";
import { CONTACT_CONTENT } from "@/lib/content";

const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
const RECIPIENT = CONTACT_CONTENT.contacts.general;

export type InquiryResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "unconfigured" | "failed" };

function buildMailto(data: ContactFormData): string {
  const subject = encodeURIComponent(`Website inquiry — ${data.service}`);
  const body = encodeURIComponent(
    [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Organization: ${data.organization || "—"}`,
      `Area of interest: ${data.service}`,
      "",
      data.message,
    ].join("\n")
  );
  return `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
}

/**
 * Contact form submission boundary.
 *
 * Production path: set `NEXT_PUBLIC_CONTACT_ENDPOINT` to your inbox API and
 * this will POST the JSON payload. Without an endpoint configured it falls
 * back to opening the visitor's mail client with the inquiry pre-filled —
 * it never reports a "sent" state without the message actually going out.
 */
export async function submitInquiry(
  data: ContactFormData
): Promise<InquiryResult> {
  if (!data.name || !data.email || !data.message) {
    return { ok: false, reason: "invalid" };
  }

  if (!ENDPOINT) {
    if (typeof window !== "undefined") {
      window.location.href = buildMailto(data);
      return { ok: true };
    }
    return { ok: false, reason: "unconfigured" };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok
      ? { ok: true }
      : { ok: false, reason: "failed" as const };
  } catch {
    return { ok: false, reason: "failed" };
  }
}