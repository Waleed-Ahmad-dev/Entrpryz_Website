import Image from "next/image";
import { totpEnabled } from "@/lib/totp";
import { LoginForm } from "./login-form";

export const metadata = { title: "Admin Login" };
// Read 2FA settings at request time.
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image src="/images/logo-transparent.png" alt="Entrpryz" width={56} height={56} priority />
          <div className="space-y-1">
            <h1 className="text-2xl font-display font-bold tracking-tight text-text-primary">Admin login</h1>
            <p className="text-sm text-text-secondary">Authorized personnel only</p>
          </div>
        </div>
        <div className="rounded-2xl border border-surface-border bg-surface-card p-8">
          <LoginForm totp={totpEnabled()} />
        </div>
      </div>
    </main>
  );
}
