import { describe, expect, it } from "vitest";
import { CONTACT_AREAS, FIELD_LIMITS, validateContact } from "./contact-validation";

const AREA = CONTACT_AREAS[0];

function valid(overrides: Record<string, unknown> = {}) {
  return {
    name: "Jane Doe",
    email: "jane@example.com",
    organization: "Acme",
    service: AREA,
    message: "We need help with our ERP rollout.",
    ...overrides,
  };
}

describe("validateContact", () => {
  it("accepts a complete inquiry", () => {
    expect(validateContact(valid())).toEqual({ ok: true, data: valid() });
  });

  it("strips CR/LF from single-line fields so they can't inject mail headers", () => {
    const result = validateContact(valid({ name: "Jane\r\nBcc: victim@example.com" }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.name).toBe("Jane Bcc: victim@example.com");
  });

  it("removes non-whitespace control characters from single-line fields", () => {
    const result = validateContact(valid({ name: "Jane\u0000\u0007\u001b Doe", organization: "Acme\u007f Ltd" }));
    expect(result.ok && result.data.name).toBe("Jane Doe");
    expect(result.ok && result.data.organization).toBe("Acme Ltd");
  });

  it("rejects an email address that contains a line break", () => {
    expect(validateContact(valid({ email: "jane@example.com\r\nBcc: x@y.com" })).ok).toBe(false);
  });

  it("lowercases and trims the email", () => {
    const result = validateContact(valid({ email: "  Jane@Example.COM " }));
    expect(result.ok && result.data.email).toBe("jane@example.com");
  });

  it("keeps newlines in the message and drops other control characters", () => {
    const result = validateContact(valid({ message: "Line one\r\nLine two\u0000\u0007 end" }));
    expect(result.ok && result.data.message).toBe("Line one\nLine two end");
  });

  it("only accepts an area of interest from the configured list", () => {
    const result = validateContact(valid({ service: "Something else" }));
    expect(result).toMatchObject({ ok: false, errors: { service: expect.any(String) } });
  });

  it.each([
    ["name", "", "name"],
    ["name", "x".repeat(FIELD_LIMITS.name + 1), "name"],
    ["email", "not-an-email", "email"],
    ["email", `${"x".repeat(250)}@example.com`, "email"],
    ["organization", "x".repeat(FIELD_LIMITS.organization + 1), "organization"],
    ["message", "too short", "message"],
    ["message", "x".repeat(FIELD_LIMITS.message + 1), "message"],
  ])("rejects an invalid %s", (field, value, errorKey) => {
    const result = validateContact(valid({ [field]: value }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toHaveProperty(errorKey);
  });

  it("allows the organization to be left blank", () => {
    expect(validateContact(valid({ organization: "" })).ok).toBe(true);
  });

  it.each([null, undefined, "text", 42, []])("treats non-object input %j as empty", (input) => {
    const result = validateContact(input);
    expect(result.ok).toBe(false);
  });

  it("ignores non-string field values", () => {
    const result = validateContact(valid({ name: { toString: () => "Jane" } }));
    expect(result).toMatchObject({ ok: false, errors: { name: expect.any(String) } });
  });
});
