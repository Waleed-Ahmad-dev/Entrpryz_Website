"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToHash(behavior: ScrollBehavior) {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (id) document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
}

/**
 * Next.js can drop the browser's jump to `#section` on a full page load or
 * when only the hash changes (smooth scrolling gets cancelled). Re-apply it
 * so links like /services#fixed-scope-reviews always land on the section.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const frame = requestAnimationFrame(() => scrollToHash("instant"));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => scrollToHash("smooth");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
