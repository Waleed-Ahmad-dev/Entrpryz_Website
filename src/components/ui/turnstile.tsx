"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export const turnstileEnabled = !!SITE_KEY;

export interface TurnstileHandle {
  /** Tokens are single-use: reset after every submit attempt. */
  reset: () => void;
}

/** Cloudflare Turnstile widget; renders nothing when no site key is configured. */
export const Turnstile = forwardRef<TurnstileHandle, { onToken: (token: string) => void; action?: string }>(
  function Turnstile({ onToken, action }, ref) {
    const container = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const onTokenRef = useRef(onToken);
    onTokenRef.current = onToken;

    useImperativeHandle(ref, () => ({
      reset: () => {
        onTokenRef.current("");
        if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
      },
    }));

    useEffect(() => {
      if (!SITE_KEY || !container.current) return;
      let cancelled = false;
      loadScript()
        .then(() => {
          if (cancelled || !container.current || !window.turnstile) return;
          widgetId.current = window.turnstile.render(container.current, {
            sitekey: SITE_KEY,
            action,
            theme: "dark",
            callback: (token: string) => onTokenRef.current(token),
            "expired-callback": () => onTokenRef.current(""),
            "error-callback": () => onTokenRef.current(""),
          });
        })
        .catch(() => onTokenRef.current(""));
      return () => {
        cancelled = true;
        if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      };
    }, [action]);

    if (!SITE_KEY) return null;
    return <div ref={container} className="min-h-[65px]" />;
  }
);
