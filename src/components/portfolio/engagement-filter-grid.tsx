"use client";

import { useState, useMemo } from "react";
import { TableEngagement } from "@/types";
import { Search, Filter, Building2, Cpu, CheckCircle } from "lucide-react";

interface EngagementFilterGridProps {
  engagements: TableEngagement[];
  defaultPlatformFilter?: string;
}

export function EngagementFilterGrid({
  engagements,
  defaultPlatformFilter = "ALL",
}: EngagementFilterGridProps) {
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState(defaultPlatformFilter);

  const platforms = useMemo(() => {
    const set = new Set<string>();
    set.add("ALL");
    engagements.forEach((e) => {
      if (e.platform) set.add(e.platform);
    });
    return Array.from(set);
  }, [engagements]);

  const filtered = useMemo(() => {
    return engagements.filter((item) => {
      const matchesSearch =
        item.client.toLowerCase().includes(search.toLowerCase()) ||
        item.scope.toLowerCase().includes(search.toLowerCase()) ||
        (item.industry && item.industry.toLowerCase().includes(search.toLowerCase()));

      const matchesPlatform =
        platformFilter === "ALL" || item.platform === platformFilter;

      return matchesSearch && matchesPlatform;
    });
  }, [engagements, search, platformFilter]);

  return (
    <div className="space-y-6">
      {/* Controls: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border border-surface-border bg-background p-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search client, scope, or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-card border border-surface-border pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-secondary focus:border-brand-orange focus:outline-none"
          />
        </div>

        {/* Platform Selector Buttons */}
        {platforms.length > 2 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs uppercase tracking-label font-bold text-text-secondary flex items-center gap-1 mr-2">
              <Filter className="h-3.5 w-3.5 text-brand-orange" />
              Platform:
            </span>
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                  platformFilter === p
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

      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-text-secondary font-mono px-1">
        <span>Showing {filtered.length} of {engagements.length} engagements</span>
        {search && (
          <button
            onClick={() => {
              setSearch("");
              setPlatformFilter("ALL");
            }}
            className="text-brand-orange underline hover:text-brand-amber"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Engagements Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="border border-surface-border bg-background p-5 space-y-3 hover:border-brand-orange transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Building2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                <h4 className="text-sm font-bold text-text-primary group-hover:text-brand-orange transition-colors">
                  {item.client}
                </h4>
              </div>
              {item.platform && (
                <span className="bg-surface-card border border-surface-border px-2 py-0.5 text-[10px] font-mono text-brand-amber shrink-0">
                  {item.platform}
                </span>
              )}
            </div>

            <p className="text-xs text-text-secondary leading-relaxed pl-6">
              {item.scope}
            </p>

            {item.industry && (
              <div className="pl-6 pt-1 flex items-center gap-1.5 text-[11px] font-mono text-text-secondary">
                <Cpu className="h-3 w-3 text-brand-orange" />
                <span>Industry: {item.industry}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
