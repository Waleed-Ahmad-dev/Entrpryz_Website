import { describe, expect, it } from "vitest";
import { readJsonObjectBody } from "./read-json-body";

const LIMIT = 64;

function request(body: BodyInit | null, headers: Record<string, string> = {}) {
  return new Request("https://example.com/api", { method: "POST", body, headers, duplex: "half" } as RequestInit);
}

/** A streamed body with no Content-Length, delivered in chunks. */
function chunked(...parts: (string | Uint8Array)[]) {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const part of parts) controller.enqueue(typeof part === "string" ? encoder.encode(part) : part);
      controller.close();
    },
  });
}

describe("readJsonObjectBody", () => {
  it("parses a JSON object", async () => {
    expect(await readJsonObjectBody(request('{"a":1,"b":"é"}'), LIMIT)).toEqual({
      ok: true,
      value: { a: 1, b: "é" },
    });
  });

  it("parses a body that arrives in several chunks", async () => {
    expect(await readJsonObjectBody(request(chunked('{"a":', '"hello"}')), LIMIT)).toEqual({
      ok: true,
      value: { a: "hello" },
    });
  });

  it.each(["null", "[]", "[1,2]", "42", '"text"', "true"])("rejects non-object JSON %s", async (body) => {
    expect(await readJsonObjectBody(request(body), LIMIT)).toEqual({ ok: false, reason: "invalid" });
  });

  it.each(["", "{", "{'a':1}", "undefined"])("rejects malformed JSON %j", async (body) => {
    expect(await readJsonObjectBody(request(body), LIMIT)).toEqual({ ok: false, reason: "invalid" });
  });

  it("rejects a missing body", async () => {
    expect(await readJsonObjectBody(request(null), LIMIT)).toEqual({ ok: false, reason: "invalid" });
  });

  it("rejects invalid UTF-8 instead of silently replacing bytes", async () => {
    const bytes = new Uint8Array([0x7b, 0x22, 0x61, 0x22, 0x3a, 0x22, 0xff, 0x22, 0x7d]); // {"a":"\xff"}
    expect(await readJsonObjectBody(request(bytes), LIMIT)).toEqual({ ok: false, reason: "invalid" });
  });

  it("rejects early when the declared Content-Length is over the limit", async () => {
    const req = request("{}", { "content-length": String(LIMIT + 1) });
    expect(await readJsonObjectBody(req, LIMIT)).toEqual({ ok: false, reason: "too_large" });
  });

  it("counts bytes, not characters", async () => {
    // 30 two-byte characters: 38 characters of JSON, but 68 bytes.
    const body = JSON.stringify({ a: "é".repeat(30) });
    expect(body.length).toBeLessThanOrEqual(LIMIT);
    expect(await readJsonObjectBody(request(body), LIMIT)).toEqual({ ok: false, reason: "too_large" });
  });

  it("stops reading a streamed body with no Content-Length once it passes the limit", async () => {
    let pulled = 0;
    const endless = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled += 1;
        controller.enqueue(new Uint8Array(32).fill(0x20));
      },
    });
    expect(await readJsonObjectBody(request(endless), LIMIT)).toEqual({ ok: false, reason: "too_large" });
    expect(pulled).toBeLessThan(10);
  });

  it("accepts a body exactly at the limit", async () => {
    const body = JSON.stringify({ a: "x".repeat(LIMIT - 8) });
    expect(Buffer.byteLength(body)).toBe(LIMIT);
    expect((await readJsonObjectBody(request(body), LIMIT)).ok).toBe(true);
  });
});
