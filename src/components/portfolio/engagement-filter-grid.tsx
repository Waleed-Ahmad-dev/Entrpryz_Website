"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { TableEngagement } from "@/types";

interface EngagementFilterGridProps {
  engagements: TableEngagement[];
}

export function EngagementFilterGrid({
  engagements,
}: EngagementFilterGridProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("ALL");

  const platforms = useMemo(() => {
    const seen = new Set<string>();
    for (const engagement of engagements) {
      if (engagement.platform) seen.add(engagement.platform);
    }
    return ["ALL", ...Array.from(seen).sort()];
  }, [engagements]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return engagements.filter((engagement) => {
      if (platform !== "ALL" && engagement.platform !== platform) return false;
      if (!q) return true;
      return (
        (engagement.client?.toLowerCase().includes(q) ?? false) ||
        (engagement.scope?.toLowerCase().includes(q) ?? false) ||
        (engagement.industry?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [engagements, platform, search]);

  return (
    <div className="border border-surface-border bg-background">
      {/* Toggle header */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-surface-card transition-colors"
        aria-expanded={open}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-text-primary">
          Additional Engagements
          <span className="ml-2 font-mono text-brand-orange">{engagements.length}</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-text-secondary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Expandable panel */}
      {open && (
        <div className="border-t border-surface-border p-6 space-y-5">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients, scope, industry..."
                className="w-full bg-surface-card border border-surface-border pl-9 pr-3 py-2 text-xs rounded-sm text-text-primary placeholder:text-text-secondary focus:border-brand-orange focus:outline-none"
              />
            </div>

            {platforms.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm transition-colors ${
                      platform === p
                        ? "bg-brand-orange text-background"
                        : "bg-surface-card text-text-secondary border border-surface-border hover:text-text-primary"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Count */}
          <p className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">
            Showing {filtered.length} of {engagements.length} engagements
          </p>

          {/* Rows */}
          {filtered.length === 0 ? (
            <p className="text-xs text-text-secondary py-6 text-center border border-dashed border-surface-border">
              No engagements match your filter.
            </p>
          ) : (
            <ul className="divide-y divide-surface-border border border-surface-border">
              {filtered.map((engagement, idx) => (
                <li key={idx} className="flex items-start justify-between gap-4 px-4 py-3">
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary">
                      {engagement.client}
                    </p>
                    <p className="text-[11px] text-text-secondary leading-relaxed">
                      {engagement.scope}
                    </p>
                    {engagement.industry && (
                      <p className="text-[10px] font-mono text-brand-amber uppercase tracking-wider">
                        {engagement.industry}
                      </p>
                    )}
                  </div>
                  {engagement.platform && (
                    <span className="text-[10px] font-mono text-brand-orange rounded-sm border border-brand-orange/40 px-2 py-0.5 shrink-0">
                      {engagement.platform}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}