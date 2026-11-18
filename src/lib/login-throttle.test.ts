import { describe, expect, it, vi } from "vitest";
import { LoginThrottle, type LoginThrottleOptions } from "./login-throttle";

const WINDOW = 15 * 60 * 1000;

function setup(overrides: Partial<LoginThrottleOptions> = {}) {
  let time = 1_000_000;
  const onAlert = vi.fn();
  const throttle = new LoginThrottle({
    maxFailures: 5,
    windowMs: WINDOW,
    alertThreshold: 20,
    maxTrackedKeys: 100,
    now: () => time,
    onAlert,
    ...overrides,
  });
  return {
    throttle,
    onAlert,
    advance: (ms: number) => {
      time += ms;
    },
    fail: (key: string, times = 1) => {
      for (let i = 0; i < times; i++) throttle.recordFailure(key);
    },
  };
}

describe("LoginThrottle", () => {
  it("locks a key out on its 5th failure, not before", () => {
    const { throttle, fail } = setup();
    fail("a", 4);
    expect(throttle.isLockedOut("a")).toBe(false);
    fail("a");
    expect(throttle.isLockedOut("a")).toBe(true);
  });

  it("only locks out the key that failed", () => {
    const { throttle, fail } = setup();
    fail("a", 5);
    expect(throttle.isLockedOut("b")).toBe(false);
  });

  it("never locks out a key because of failures from other keys", () => {
    const { throttle, fail } = setup();
    for (let i = 0; i < 500; i++) fail(`attacker-${i}`, 4);
    expect(throttle.isLockedOut("admin")).toBe(false);
  });

  it("lifts the lockout when the window that started with the first failure ends", () => {
    const { throttle, fail, advance } = setup();
    fail("a", 5);
    advance(WINDOW - 1);
    expect(throttle.isLockedOut("a")).toBe(true);
    advance(1);
    expect(throttle.isLockedOut("a")).toBe(false);
  });

  it("starts a fresh count after the window ends", () => {
    const { throttle, fail, advance } = setup();
    fail("a", 4);
    advance(WINDOW);
    fail("a", 4);
    expect(throttle.isLockedOut("a")).toBe(false);
  });

  it("clears a key's failures on reset", () => {
    const { throttle, fail } = setup();
    fail("a", 4);
    throttle.reset("a");
    fail("a", 4);
    expect(throttle.isLockedOut("a")).toBe(false);
  });

  it("alerts once per window when site-wide failures reach the threshold", () => {
    const { fail, onAlert, advance } = setup();
    for (let i = 0; i < 19; i++) fail(`ip-${i}`);
    expect(onAlert).not.toHaveBeenCalled();
    fail("ip-19");
    expect(onAlert).toHaveBeenCalledExactlyOnceWith(20);
    fail("ip-20", 10);
    expect(onAlert).toHaveBeenCalledTimes(1);

    advance(WINDOW);
    for (let i = 0; i < 20; i++) fail(`ip-next-${i}`);
    expect(onAlert).toHaveBeenCalledTimes(2);
  });

  describe("memory bound", () => {
    it("prunes expired entries before dropping active ones", () => {
      const { throttle, fail, advance } = setup({ maxTrackedKeys: 3 });
      fail("old-1");
      fail("old-2");
      advance(WINDOW);
      fail("locked", 5);
      fail("new-1");
      expect(throttle.trackedKeys).toBe(2);
      expect(throttle.isLockedOut("locked")).toBe(true);
    });

    it("keeps active lockouts when the limit is exceeded, dropping only the oldest", () => {
      const { throttle, fail, advance } = setup({ maxTrackedKeys: 3 });
      fail("oldest", 5);
      advance(1);
      fail("locked", 5);
      advance(1);
      fail("b");
      advance(1);
      fail("c");
      expect(throttle.trackedKeys).toBe(3);
      expect(throttle.isLockedOut("oldest")).toBe(false); // evicted
      expect(throttle.isLockedOut("locked")).toBe(true); // still enforced
    });

    it("orders eviction by window start, not by last failure", () => {
      const { throttle, fail, advance } = setup({ maxTrackedKeys: 2 });
      fail("first");
      advance(1);
      fail("second");
      advance(1);
      fail("first", 4); // more failures, same window: still the oldest
      advance(1);
      fail("third");
      expect(throttle.isLockedOut("first")).toBe(false);
      expect(throttle.trackedKeys).toBe(2);
    });
  });
});
