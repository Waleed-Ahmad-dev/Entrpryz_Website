/**
 * Reads a request body as a JSON object without ever buffering more than
 * `maxBytes`. The declared Content-Length is checked first (cheap rejection),
 * but the stream itself is also counted, because the header can be missing
 * (chunked uploads) or wrong.
 */
export type JsonBodyResult =
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; reason: "too_large" | "invalid" };

export async function readJsonObjectBody(req: Request, maxBytes: number): Promise<JsonBodyResult> {
  const declared = req.headers.get("content-length");
  if (declared !== null && Number(declared) > maxBytes) return { ok: false, reason: "too_large" };
  if (!req.body) return { ok: false, reason: "invalid" };

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      return { ok: false, reason: "too_large" };
    }
    chunks.push(value);
  }

  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(concat(chunks, received));
  } catch {
    return { ok: false, reason: "invalid" }; // not valid UTF-8
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: "invalid" };
  }
  // `null`, arrays and primitives are valid JSON but not a form payload.
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, value: parsed as Record<string, unknown> };
}

function concat(chunks: Uint8Array[], length: number): Uint8Array {
  const out = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}
