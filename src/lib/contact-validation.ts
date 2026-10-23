import type { ContactFormData } from "@/types";
import { SITE_CONTENT } from "./site-content";

/** Allowed "Area of interest" values (editable in /admin) — server rejects anything else. */
export const CONTACT_AREAS: readonly string[] = SITE_CONTENT.contact.form.areas;

export const FIELD_LIMITS = {
  name: 100,
  email: 254,
  organization: 150,
  message: 5000,
} as const;

// Pragmatic email check; the real proof is the reply.
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-zA-Z]{2,}$/;

/** Collapse whitespace and strip control chars (incl. CR/LF) from single-line fields. */
function cleanLine(value: unknown): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim()
    : "";
}

/** Keep newlines/tabs in the message body, strip other control chars. */
function cleanMultiline(value: unknown): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").replace(/\r\n?/g, "\n").trim()
    : "";
}

export type ValidationResult =
  | { ok: true; data: ContactFormData }
  | { ok: false; errors: Partial<Record<keyof ContactFormData, string>> };

export function validateContact(input: unknown): ValidationResult {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const data: ContactFormData = {
    name: cleanLine(raw.name),
    email: cleanLine(raw.email).toLowerCase(),
    organization: cleanLine(raw.organization),
    service: cleanLine(raw.service),
    message: cleanMultiline(raw.message),
  };

  const errors: Partial<Record<keyof ContactFormData, string>> = {};
  if (!data.name) errors.name = "Please enter your name.";
  else if (data.name.length > FIELD_LIMITS.name) errors.name = "Name is too long.";

  if (!data.email || data.email.length > FIELD_LIMITS.email || !EMAIL_RE.test(data.email))
    errors.email = "Please enter a valid email address.";

  if (data.organization.length > FIELD_LIMITS.organization)
    errors.organization = "Organization name is too long.";

  if (!CONTACT_AREAS.includes(data.service))
    errors.service = "Please choose an area of interest.";

  if (data.message.length < 10) errors.message = "Please add a few more details (10+ characters).";
  else if (data.message.length > FIELD_LIMITS.message) errors.message = "Message is too long.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
