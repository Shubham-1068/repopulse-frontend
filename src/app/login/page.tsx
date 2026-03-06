"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { syncUserProfileFromToken } from "@/lib/user-profile";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const configError = !GOOGLE_CLIENT_ID
    ? "Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID. Add it to your .env file and restart the app."
    : null;

  useEffect(() => {
    const existingToken = localStorage.getItem("rp_google_token") ?? localStorage.getItem("rp_auth_token");
    if (existingToken) {
      syncUserProfileFromToken(existingToken);
      router.replace("/analyze");
    }
  }, [router]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    if (!scriptReady || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: { credential?: string }) => {
        if (!response.credential) {
          setError("Google login failed: token missing");
          return;
        }

        localStorage.setItem("rp_google_token", response.credential);
        localStorage.setItem("rp_auth_token", response.credential);
        syncUserProfileFromToken(response.credential);
        setError(null);
        router.push("/analyze");
      },
    });

    const buttonRoot = document.getElementById("google-signin-button");
    if (buttonRoot) {
      buttonRoot.innerHTML = "";
      window.google.accounts.id.renderButton(buttonRoot, {
        theme: "filled_black",
        size: "large",
        shape: "pill",
        text: "signin_with",
        width: 320,
      });
    }
  }, [scriptReady, router]);

  return (
    <section className="mx-auto w-full max-w-md">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />

      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
        <BrandLogo className="mb-4" />
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">Login</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Google Sign in</h1>
        <p className="mt-2 text-sm text-neutral-400">Login first, then continue to repository analysis.</p>

        <div
          id="g_id_onload"
          data-client_id={GOOGLE_CLIENT_ID}
          className="hidden"
        />

        <div className="mt-6 flex justify-center">
          <div id="google-signin-button" className="g_id_signin" />
        </div>

        {configError ? <p className="mt-4 text-sm text-red-300">{configError}</p> : null}
        {!configError && error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      </div>
    </section>
  );
}
