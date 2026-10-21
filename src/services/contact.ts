import { ContactFormData } from "@/types";
import { validateContact } from "@/lib/contact-validation";

export type InquiryResult =
  | { ok: true }
  | {
      ok: false;
      reason: "invalid" | "rate_limited" | "failed";
      fields?: Partial<Record<keyof ContactFormData, string>>;
    };

/**
 * Contact form submission boundary.
 *
 * Validates on the client for fast feedback, then POSTs to `/api/contact`,
 * which re-validates and sends the email over SMTP. It never reports a
 * "sent" state unless the server confirms delivery to the mail server.
 */
export async function submitInquiry(
  data: ContactFormData,
  meta: { website: string; startedAt: number }
): Promise<InquiryResult> {
  const checked = validateContact(data);
  if (!checked.ok) return { ok: false, reason: "invalid", fields: checked.errors };

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...checked.data, ...meta }),
    });
    if (res.ok) return { ok: true };
    if (res.status === 429) return { ok: false, reason: "rate_limited" };
    if (res.status === 400) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, reason: "invalid", fields: body.fields };
    }
    return { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
