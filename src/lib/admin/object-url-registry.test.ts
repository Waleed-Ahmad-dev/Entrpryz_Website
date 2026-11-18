import { describe, expect, it, vi } from "vitest";
import { ObjectUrlRegistry } from "./object-url-registry";

function fakeApi() {
  let next = 0;
  const live = new Set<string>();
  return {
    live,
    createObjectURL: vi.fn((_blob: Blob) => {
      const url = `blob:test/${next++}`;
      live.add(url);
      return url;
    }),
    revokeObjectURL: vi.fn((url: string) => {
      live.delete(url);
    }),
  };
}

const blob = () => new Blob([new Uint8Array([1, 2, 3])], { type: "image/png" });

describe("ObjectUrlRegistry", () => {
  it("creates a URL per key", () => {
    const api = fakeApi();
    const registry = new ObjectUrlRegistry(api);
    expect(registry.create("/images/uploads/a.png", blob())).toBe("blob:test/0");
    expect(registry.create("/images/uploads/b.png", blob())).toBe("blob:test/1");
    expect(api.live.size).toBe(2);
  });

  it("revokes the previous URL when a key gets a new one", () => {
    const api = fakeApi();
    const registry = new ObjectUrlRegistry(api);
    const first = registry.create("/images/uploads/a.png", blob());
    registry.create("/images/uploads/a.png", blob());
    expect(api.revokeObjectURL).toHaveBeenCalledWith(first);
    expect(api.live.size).toBe(1);
    expect(registry.size).toBe(1);
  });

  it("revokes every URL it created on revokeAll", () => {
    const api = fakeApi();
    const registry = new ObjectUrlRegistry(api);
    for (let i = 0; i < 5; i++) registry.create(`/images/uploads/${i}.png`, blob());
    registry.revokeAll();
    expect(api.live.size).toBe(0);
    expect(registry.size).toBe(0);
  });

  it("ignores revoking an unknown key", () => {
    const api = fakeApi();
    new ObjectUrlRegistry(api).revoke("nope");
    expect(api.revokeObjectURL).not.toHaveBeenCalled();
  });

  it("works with the platform URL API", () => {
    const registry = new ObjectUrlRegistry();
    const url = registry.create("k", blob());
    expect(url).toMatch(/^blob:/);
    registry.revokeAll();
    expect(registry.size).toBe(0);
  });
});
