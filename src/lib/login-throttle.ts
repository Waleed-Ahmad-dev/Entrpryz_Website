/**
 * Failed-login throttle, keyed by client IP.
 *
 * - An IP that fails `maxFailures` times within `windowMs` is locked out until
 *   the window that started with its first failure ends.
 * - Failures are also counted site-wide, but only to raise an alert: a site-wide
 *   *block* would let anyone lock the real admin out by failing on purpose.
 * - Memory is bounded: expired entries are pruned, and if more than
 *   `maxTrackedKeys` IPs are still inside their window, the oldest are dropped.
 *
 * State lives in this server instance's memory. Serverless instances don't share
 * it; remediation step 4.2 moves the counters to a shared store behind this API.
 */

export interface LoginThrottleOptions {
  maxFailures: number;
  windowMs: number;
  /** Site-wide failures per window that trigger `onAlert` (once per window). */
  alertThreshold: number;
  maxTrackedKeys: number;
  now?: () => number;
  onAlert?: (failuresInWindow: number) => void;
}

interface Window {
  count: number;
  start: number;
}

export class LoginThrottle {
  private readonly perKey = new Map<string, Window>();
  private siteWide: Window & { alerted: boolean };
  private readonly now: () => number;
  private readonly onAlert: (failuresInWindow: number) => void;

  constructor(private readonly options: LoginThrottleOptions) {
    this.now = options.now ?? Date.now;
    this.onAlert =
      options.onAlert ??
      ((count) => console.warn(`[admin] ${count} failed sign-ins site-wide in the current window`));
    this.siteWide = { count: 0, start: this.now(), alerted: false };
  }

  isLockedOut(key: string): boolean {
    const entry = this.perKey.get(key);
    if (!entry) return false;
    if (this.expired(entry)) {
      this.perKey.delete(key);
      return false;
    }
    return entry.count >= this.options.maxFailures;
  }

  recordFailure(key: string): void {
    const now = this.now();
    this.recordSiteWide(now);

    const entry = this.perKey.get(key);
    if (entry && !this.expired(entry)) {
      entry.count += 1;
      return;
    }
    // Re-insert so Map order stays "oldest window first" for eviction.
    this.perKey.delete(key);
    this.perKey.set(key, { count: 1, start: now });
    this.enforceSizeLimit();
  }

  /** Forget a key's failures (after a successful sign-in). */
  reset(key: string): void {
    this.perKey.delete(key);
  }

  /** Number of keys currently tracked (for tests and diagnostics). */
  get trackedKeys(): number {
    return this.perKey.size;
  }

  private recordSiteWide(now: number) {
    if (now - this.siteWide.start >= this.options.windowMs) {
      this.siteWide = { count: 0, start: now, alerted: false };
    }
    this.siteWide.count += 1;
    if (!this.siteWide.alerted && this.siteWide.count >= this.options.alertThreshold) {
      this.siteWide.alerted = true;
      this.onAlert(this.siteWide.count);
    }
  }

  private enforceSizeLimit() {
    if (this.perKey.size <= this.options.maxTrackedKeys) return;
    for (const [key, entry] of this.perKey) {
      if (this.expired(entry)) this.perKey.delete(key);
    }
    // Still over the limit: every entry is active. Drop the oldest windows first.
    for (const key of this.perKey.keys()) {
      if (this.perKey.size <= this.options.maxTrackedKeys) break;
      this.perKey.delete(key);
    }
  }

  private expired(entry: Window): boolean {
    return this.now() - entry.start >= this.options.windowMs;
  }
}
