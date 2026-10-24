/** First focusable element on every page: jumps keyboard users past the header. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand-orange focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-background focus:shadow-glow"
    >
      Skip to content
    </a>
  );
}
