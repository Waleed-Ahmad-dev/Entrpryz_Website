import { ContactFormData } from "@/types";

/**
 * Submission boundary for the contact inquiry form.
 *
 * The production wire-up is intentionally deferred: the static site has no
 * backend, so this stub validates and resolves locally. Swap the `fetch`
 * call below (or a mail service client) with zero component changes.
 */
export async function submitInquiry(
  form: ContactFormData
): Promise<{ ok: boolean }> {
  if (!form.name || !form.email || !form.message) {
    return { ok: false };
  }

  // TODO: POST to the production endpoint once a mail/inbox API exists.
  // await fetch("/api/contact", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(form),
  // });

  return { ok: true };
}