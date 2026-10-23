/** Icons content editors can pick for cards and list items (see components/ui/content-icon). */
export const ICON_NAMES = [
  "database", "workflow", "chart", "stethoscope", "code", "smartphone", "plug", "bot", "server",
  "shield", "cloud", "lifebuoy", "map", "wrench", "message", "file-search", "search", "file-text",
  "bell", "route", "users", "lock", "layers", "gauge", "handshake", "target", "compass", "eye",
  "sparkles", "briefcase", "building", "rocket", "refresh", "clipboard", "book", "cpu", "trending-up",
  "settings", "inbox", "list-checks", "badge-check", "scale", "hard-drive", "network", "presentation",
  "puzzle", "boxes",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
