import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { IMAGE_MIME_TYPES, sniffImageFormat } from "./image-format";

/**
 * Loads an image from /public as a data URI for `next/og` ImageResponse (the share
 * card and the generated site icons).
 *
 * The renderer (Satori + resvg) draws only PNG and JPEG. A WebP renders as nothing,
 * without an error, so the real bytes are checked here and anything else fails the
 * build with a clear message.
 */
export async function loadRenderableImage(src: string, usedFor: string): Promise<string> {
  const bytes = await readFile(path.join(process.cwd(), "public", src));
  const format = sniffImageFormat(bytes);
  if (format !== "png" && format !== "jpg") {
    throw new Error(`${src} must be a PNG or JPG image for the ${usedFor}.`);
  }
  return `data:${IMAGE_MIME_TYPES[format]};base64,${bytes.toString("base64")}`;
}
