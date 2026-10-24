"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Turnstile, type TurnstileHandle } from "@/components/ui/turnstile";
import { login, type LoginState } from "../actions";

const initialState: LoginState = { error: null };

const inputClass =
  "w-full rounded-xl border border-surface-border bg-background px-4 py-3 text-[15px] text-text-primary focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20";
const labelClass = "text-sm font-medium text-text-primary";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" fullWidth disabled={pending}>
      <span>{pending ? "Signing in..." : "Sign in"}</span>
      <LogIn className="h-4 w-4" />
    </Button>
  );
}

export function LoginForm({ totp }: { totp: boolean }) {
  const [state, formAction] = useFormState(login, initialState);
  const turnstile = useRef<TurnstileHandle>(null);

  // Turnstile tokens are single-use: get a fresh one after a failed attempt.
  useEffect(() => {
    if (state.error) turnstile.current?.reset();
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="admin-username" className={labelClass}>
          Username
        </label>
        <input id="admin-username" name="username" type="text" required autoComplete="username"
          autoCapitalize="none" spellCheck={false} maxLength={256} className={inputClass} />
      </div>

      <div className="space-y-2">
        <label htmlFor="admin-password" className={labelClass}>
          Password
        </label>
        <input id="admin-password" name="password" type="password" required autoComplete="current-password"
          maxLength={256} className={inputClass} />
      </div>

      {totp && (
        <div className="space-y-2">
          <label htmlFor="admin-code" className={labelClass}>
            Authenticator code
          </label>
          <input id="admin-code" name="code" type="text" inputMode="numeric" pattern="[0-9]{6}" required
            autoComplete="one-time-code" maxLength={6} placeholder="123456" className={`${inputClass} tracking-[0.3em]`} />
        </div>
      )}

      <Turnstile ref={turnstile} onToken={() => {}} action="admin-login" />

      {state.error && (
        <p role="alert" className="rounded-xl border border-brand-orange/40 bg-brand-orange/[0.06] px-4 py-3 text-sm text-brand-orange">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
