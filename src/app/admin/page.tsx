import { redirect } from "next/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminSession } from "@/lib/admin-auth";
import { logout } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  // Middleware already guards /admin; re-check here in case it is bypassed.
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-surface-border bg-surface-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/images/logo-transparent.png" alt="Entrpryz" width={32} height={32} />
            <span className="text-sm font-display font-bold uppercase tracking-wider text-text-primary">
              Entrpryz Admin
            </span>
          </div>
          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </form>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 space-y-2">
        <h1 className="text-3xl font-display font-bold uppercase tracking-tight text-text-primary">
          Dashboard
        </h1>
        <p className="text-sm text-text-secondary">
          Signed in as <span className="font-mono text-brand-orange">{session.sub}</span>.
        </p>
      </div>
    </div>
  );
}
