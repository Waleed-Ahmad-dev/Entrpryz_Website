import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { IMAGE_MIME_TYPES, sniffImageFormat } from "./image-format";
import { siteContentFixture } from "@/test/fixtures";

const bytes = (...values: number[]) => new Uint8Array(values);
const ascii = (text: string) => new TextEncoder().encode(text);

describe("sniffImageFormat", () => {
  it.each([
    ["jpg", bytes(0xff, 0xd8, 0xff, 0xe0)],
    ["png", bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0)],
    ["webp", new Uint8Array([...ascii("RIFF"), 0, 0, 0, 0, ...ascii("WEBPVP8 ")])],
  ])("detects %s from its signature", (format, data) => {
    expect(sniffImageFormat(data)).toBe(format);
  });

  it.each([
    ["SVG", ascii('<svg xmlns="http://www.w3.org/2000/svg"></svg>')],
    ["GIF", ascii("GIF89a......")],
    ["a WAV file (RIFF but not WEBP)", new Uint8Array([...ascii("RIFF"), 0, 0, 0, 0, ...ascii("WAVEfmt ")])],
    ["a truncated PNG signature", bytes(0x89, 0x50, 0x4e, 0x47)],
    ["an empty file", new Uint8Array()],
  ])("rejects %s", (_case, data) => {
    expect(sniffImageFormat(data)).toBeNull();
  });

  it("maps each format to its MIME type", () => {
    expect(IMAGE_MIME_TYPES).toEqual({ jpg: "image/jpeg", png: "image/png", webp: "image/webp" });
  });

  it("recognizes every image the committed content points at", () => {
    const { images } = siteContentFixture();
    for (const src of Object.values(images)) {
      const data = readFileSync(path.join(process.cwd(), "public", src));
      expect(sniffImageFormat(data), src).not.toBeNull();
    }
  });
});
