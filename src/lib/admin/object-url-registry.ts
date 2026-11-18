/**
 * Owns the `blob:` URLs used to preview uploaded images before they are deployed.
 * Each URL keeps its file in memory until revoked, so a key holds at most one
 * URL (creating a new one revokes the previous) and `revokeAll` frees the rest.
 */
export interface ObjectUrlApi {
  createObjectURL(blob: Blob): string;
  revokeObjectURL(url: string): void;
}

export class ObjectUrlRegistry {
  private readonly urls = new Map<string, string>();

  constructor(private readonly api: ObjectUrlApi = URL) {}

  create(key: string, blob: Blob): string {
    this.revoke(key);
    const url = this.api.createObjectURL(blob);
    this.urls.set(key, url);
    return url;
  }

  revoke(key: string): void {
    const url = this.urls.get(key);
    if (url === undefined) return;
    this.api.revokeObjectURL(url);
    this.urls.delete(key);
  }

  revokeAll(): void {
    for (const url of this.urls.values()) this.api.revokeObjectURL(url);
    this.urls.clear();
  }

  get size(): number {
    return this.urls.size;
  }
}
