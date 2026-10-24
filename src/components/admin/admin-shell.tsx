import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/content", label: "Content" },
];

export function AdminShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand-orange focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-background"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-surface-border bg-surface-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-3 shrink-0">
            <Image src="/images/logo-transparent.png" alt="" width={28} height={28} />
            <span className="hidden sm:inline text-sm font-display font-bold uppercase tracking-wider text-text-primary">
              Entrpryz Admin
            </span>
          </Link>
          <nav className="flex items-center gap-4 flex-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-brand-orange"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-brand-orange"
            >
              View site <ExternalLink className="h-3 w-3" />
            </a>
          </nav>
          <span className="hidden md:inline text-xs font-mono text-text-secondary">{username}</span>
          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </form>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-10 flex-1">
        {children}
      </main>
    </div>
  );
}
