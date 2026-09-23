"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section id is currently in view for one-pager anchor
 * navigation. Returns a `#id` string matching the nav links.
 */
export function useActiveSection(ids: string[], initial = ids[0] ?? "") {
  const [active, setActive] = useState(initial);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids.join(",")]);

  return active;
}