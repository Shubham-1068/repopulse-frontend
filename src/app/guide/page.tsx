import { BrandLogo } from "@/components/brand-logo";
import Link from "next/link";
import { ArrowRight, CircleCheckBig, KeyRound, BarChart3, Lightbulb } from "lucide-react";

const steps = [
  {
    badge: "Step 1",
    title: "Login",
    description: "Sign in with Google once. Your session token is stored so you can continue smoothly.",
    href: "/login",
    cta: "Open Login",
    icon: KeyRound,
    style: "from-cyan-500/20 to-cyan-950/20 border-cyan-800/60",
  },
  {
    badge: "Step 2",
    title: "Analyze Repository",
    description: "Enter owner/repo and optional GitHub token for private repos. Run analysis in one click.",
    href: "/analyze",
    cta: "Go to Analyze",
    icon: CircleCheckBig,
    style: "from-violet-500/20 to-violet-950/20 border-violet-800/60",
  },
  {
    badge: "Step 3",
    title: "Read Dashboard Insights",
    description: "Review health score, PR distribution, risk indicators, and recommendations visually.",
    href: "/dashboard",
    cta: "View Dashboard",
    icon: BarChart3,
    style: "from-emerald-500/20 to-emerald-950/20 border-emerald-800/60",
  },
];

const tips = [
  "Use owner/repo format exactly (example: facebook/react).",
  "If repo is private, provide a GitHub token with repo read permissions.",
  "Focus first on stale PRs + dead branches to raise health quickly.",
  "Use Re-analyze after major merges to refresh stats.",
];

export default function GuidePage() {
  return (
    <section className="space-y-8">
      <header>
        <BrandLogo className="mb-4" />
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Guide</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Learn RepoPulse in 2 minutes</h1>
        <p className="mt-3 max-w-3xl text-sm text-neutral-300 sm:text-base">
          Follow this simple roadmap to login, analyze any repository, and understand the dashboard confidently.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((step) => (
          <article key={step.title} className={`rounded-xl border bg-gradient-to-br p-5 ${step.style}`}>
            <div className="mb-3 inline-flex rounded-md bg-black/30 p-2 text-white">
              <step.icon size={17} />
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-300">{step.badge}</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{step.title}</h2>
            <p className="mt-2 text-sm text-neutral-200">{step.description}</p>
            <Link
              href={step.href}
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-white/25 bg-black/30 px-3 py-1.5 text-sm text-white hover:bg-black/45"
            >
              {step.cta}
              <ArrowRight size={14} />
            </Link>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <article className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <div className="mb-3 inline-flex rounded-md bg-amber-500/20 p-2 text-amber-300">
            <Lightbulb size={17} />
          </div>
          <h2 className="text-lg font-semibold text-white">Quick learning tips</h2>
          <ul className="mt-3 space-y-2">
            {tips.map((tip) => (
              <li key={tip} className="rounded-md border border-neutral-800 bg-black px-3 py-2 text-sm text-neutral-300">
                {tip}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <h2 className="text-lg font-semibold text-white">Need a fast start?</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Jump straight into the flow and follow the prompts.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/login" className="rounded-md bg-white px-3 py-2 text-center text-sm font-semibold !text-black opacity-100 hover:bg-neutral-200 hover:!text-black focus:outline-none focus:ring-2 focus:ring-cyan-400">
              Start Login
            </Link>
            <Link href="/analyze" className="rounded-md border border-neutral-700 px-3 py-2 text-center text-sm text-neutral-200 hover:bg-neutral-900">
              Open Analyze
            </Link>
            <Link href="/dashboard" className="rounded-md border border-neutral-700 px-3 py-2 text-center text-sm text-neutral-200 hover:bg-neutral-900">
              View Dashboard
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}