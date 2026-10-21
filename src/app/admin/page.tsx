import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  // Middleware already guards /admin; re-check here in case it is bypassed.
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell username={session.sub}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold uppercase tracking-tight text-text-primary">
            Dashboard
          </h1>
          <p className="text-sm text-text-secondary">
            Signed in as <span className="font-mono text-brand-orange">{session.sub}</span>.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/content"
            className="group border border-surface-border bg-surface-card p-6 space-y-3 hover:border-brand-orange transition-colors"
          >
            <FileText className="h-6 w-6 text-brand-orange" />
            <h2 className="text-lg font-display font-bold uppercase text-text-primary">Website Content</h2>
            <p className="text-sm text-text-secondary">
              Edit headlines, paragraphs, services, portfolio projects and images across the site.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-brand-orange">
              Open editor <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
