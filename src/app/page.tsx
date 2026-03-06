"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { ArrowRight, BarChart3, CircleUserRound, ShieldCheck, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export default function HomePage() {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isAuthed = isClient
    ? Boolean(localStorage.getItem("rp_google_token") ?? localStorage.getItem("rp_auth_token"))
    : false;

  const primaryHref = isAuthed ? "/dashboard" : "/login";
  const primaryLabel = isAuthed ? "Go to Dashboard" : "Start with Login";

  return (
    <>
      <DottedSurface className="z-0" />
      <section className="relative z-10 space-y-6">
        <div className="overflow-hidden rounded-2xl border border-neutral-800/70 bg-black/40 p-6 sm:p-12">
          <div className="max-w-4xl">
            <BrandLogo className="mb-6" />
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Repo analytics with identity-aware dashboards
            </h1>
            <p className="mt-4 text-neutral-300 sm:text-lg">
              Sign in with Google, analyze a repository, then review insights with your profile details and image surfaced directly in the dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black! shadow-sm transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <span className="text-black!">{primaryLabel}</span>
                <ArrowRight size={16} className="text-black!" />
              </Link>
              {isAuthed ? (
                <Link href="/profile" className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-900">
                  Open Profile
                </Link>
              ) : null}
              <Link href="/dashboard" className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-900">
                View Dashboard
              </Link>
              <Link href="/guide" className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-900">
                View Guide
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-cyan-900/50 bg-gradient-to-br from-cyan-500/20 to-cyan-950/20 p-5">
            <div className="mb-3 inline-flex rounded-md bg-cyan-500/20 p-2 text-cyan-300"><ShieldCheck size={18} /></div>
            <h2 className="text-sm font-medium text-white">Secure Login Gate</h2>
            <p className="mt-2 text-sm text-neutral-300">Google login page validates access before analysis.</p>
          </article>
          <article className="rounded-xl border border-violet-900/50 bg-gradient-to-br from-violet-500/20 to-violet-950/20 p-5">
            <div className="mb-3 inline-flex rounded-md bg-violet-500/20 p-2 text-violet-300"><Sparkles size={18} /></div>
            <h2 className="text-sm font-medium text-white">Analyze Step</h2>
            <p className="mt-2 text-sm text-neutral-300">Dedicated page to input repository and optional GitHub token.</p>
          </article>
          <article className="rounded-xl border border-emerald-900/50 bg-gradient-to-br from-emerald-500/20 to-emerald-950/20 p-5">
            <div className="mb-3 inline-flex rounded-md bg-emerald-500/20 p-2 text-emerald-300"><BarChart3 size={18} /></div>
            <h2 className="text-sm font-medium text-white">Visual Dashboard</h2>
            <p className="mt-2 text-sm text-neutral-300">Charts, graphs, and compact KPI tiles for fast decisions.</p>
          </article>
          <article className="rounded-xl border border-amber-900/50 bg-gradient-to-br from-amber-500/20 to-amber-950/20 p-5 sm:col-span-2 xl:col-span-1">
            <div className="mb-3 inline-flex rounded-md bg-amber-500/20 p-2 text-amber-300"><CircleUserRound size={18} /></div>
            <h2 className="text-sm font-medium text-white">Profile Everywhere</h2>
            <p className="mt-2 text-sm text-neutral-300">Your Google profile details and photo are available in the Profile page and shown in Dashboard header.</p>
          </article>
        </div>

      </section>
    </>
  );
}