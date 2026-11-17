import { describe, expect, it } from "vitest";
import { assertValidSiteContent, siteContentSchema } from "./content-schema";
import { siteContentFixture } from "@/test/fixtures";

function parse(content: unknown) {
  return siteContentSchema.safeParse(content);
}

describe("siteContentSchema", () => {
  it("accepts the committed content/site.json", () => {
    const result = parse(siteContentFixture());
    expect(result.success ? [] : result.error.issues).toEqual([]);
    expect(() => assertValidSiteContent(siteContentFixture())).not.toThrow();
  });

  describe("links", () => {
    it.each([
      "javascript:alert(1)",
      "JavaScript:alert(1)",
      "//evil.com",
      "data:text/html,<script>alert(1)</script>",
      "http://example.com",
      "https://user:pass@example.com",
      "/About",
      "/page with space",
      "mailto:not-an-email",
      "",
    ])("rejects %j", (href) => {
      const content = siteContentFixture();
      content.navigation.cta.href = href;
      expect(parse(content).success).toBe(false);
    });

    it.each(["/about", "/services#software-development", "#faq", "mailto:hello@example.com", "https://example.com/x?y=1"])(
      "accepts %j",
      (href) => {
        const content = siteContentFixture();
        content.navigation.cta.href = href;
        expect(parse(content).success).toBe(true);
      }
    );
  });

  describe("image paths", () => {
    it.each([
      "/images/../secrets.png",
      "/images/logo.svg",
      "/images/logo.gif",
      "https://example.com/logo.png",
      "images/logo.png",
      "/images/Logo.png",
      "/images/uploads/../../x.png",
    ])("rejects %j", (path) => {
      const content = siteContentFixture();
      content.images.logo = path;
      expect(parse(content).success).toBe(false);
    });

    it.each(["/images/logo.png", "/images/photo.jpeg", "/images/uploads/0123456789abcdef01234567.webp"])(
      "accepts %j",
      (path) => {
        const content = siteContentFixture();
        content.images.logo = path;
        expect(parse(content).success).toBe(true);
      }
    );
  });

  it("rejects unknown keys instead of storing them", () => {
    const content = siteContentFixture() as unknown as { site: Record<string, unknown> };
    content.site.injected = "value";
    expect(parse(content).success).toBe(false);
  });

  it("rejects control characters in text", () => {
    const content = siteContentFixture();
    content.site.name = "Entrpryz\u0007";
    expect(parse(content).success).toBe(false);
  });

  it("enforces length limits", () => {
    const content = siteContentFixture();
    content.site.name = "x".repeat(41);
    expect(parse(content).success).toBe(false);
  });

  it("trims text and treats blank optional fields as unset", () => {
    const content = siteContentFixture();
    content.site.tagline = `  ${content.site.tagline}  `;
    content.site.whatsapp.message = "   ";
    const result = parse(content);
    expect(result.success).toBe(true);
    expect(result.data!.site.tagline).toBe(siteContentFixture().site.tagline);
    expect(result.data!.site.whatsapp.message).toBeUndefined();
  });

  it("normalizes the contact email to lowercase", () => {
    const content = siteContentFixture();
    content.contact.email = "  Connect@Entrpryz.COM ";
    expect(parse(content).data?.contact.email).toBe("connect@entrpryz.com");
  });

  it.each(["not-an-email", "a@b", "two@@example.com", "spaces in@example.com"])(
    "rejects the contact email %j",
    (email) => {
      const content = siteContentFixture();
      content.contact.email = email;
      expect(parse(content).success).toBe(false);
    }
  );

  it("rejects an unknown block type", () => {
    const content = siteContentFixture() as unknown as { homePage: { blocks: unknown[] } };
    content.homePage.blocks.push({ type: "html", body: "<script></script>" });
    expect(parse(content).success).toBe(false);
  });

  it("reports the failing path when the bundled content is invalid", () => {
    const content = siteContentFixture();
    content.navigation.cta.href = "javascript:alert(1)";
    expect(() => assertValidSiteContent(content)).toThrow(/navigation\.cta\.href/);
  });
});
