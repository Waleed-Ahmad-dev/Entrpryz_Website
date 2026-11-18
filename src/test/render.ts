import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect } from "vitest";

const FIXTURES = path.join(__dirname, "fixtures/images");

/**
 * A temporary project directory whose public/images holds the logo fixtures
 * (logo.png, logo.jpg, logo.webp, blank.png) plus two bad files. Point
 * `process.cwd()` at `dir` to make routes read images from it.
 */
export function createImageProject() {
  const dir = mkdtempSync(path.join(tmpdir(), "render-test-"));
  const images = path.join(dir, "public/images");
  cpSync(FIXTURES, images, { recursive: true });
  writeFileSync(path.join(images, "not-an-image.png"), "<svg></svg>");
  cpSync(path.join(FIXTURES, "logo.webp"), path.join(images, "webp-named.png"));
  return { dir, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

/** Width and height from a PNG's IHDR chunk (asserts the PNG signature first). */
export function pngSize(png: Buffer) {
  expect(png.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}
