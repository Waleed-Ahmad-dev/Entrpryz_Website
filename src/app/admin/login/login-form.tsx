"use client";

import { useFormState, useFormStatus } from "react-dom";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { login, type LoginState } from "../actions";

const initialState: LoginState = { error: null };

const inputClass =
  "w-full bg-background border border-surface-border px-4 py-3 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" fullWidth disabled={pending}>
      <span>{pending ? "Signing in..." : "Sign In"}</span>
      <LogIn className="h-4 w-4" />
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="admin-username"
          className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
        >
          Username
        </label>
        <input
          id="admin-username"
          name="username"
          type="text"
          required
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={256}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="admin-password"
          className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
        >
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          maxLength={256}
          className={inputClass}
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="border border-brand-orange/40 bg-background px-4 py-3 text-xs text-brand-orange"
        >
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
