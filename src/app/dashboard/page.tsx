"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { AlertTriangle, BarChart3, CheckCircle2, GitMerge, GitPullRequest, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { getStoredUserProfile, syncUserProfileFromToken, UserProfile } from "@/lib/user-profile";

type AnalysisData = {
  repoName?: string;
  totalPRs?: number;
  closedPRs?: number;
  mergedPRs?: number;
  unmergedClosedPRs?: number;
  stalePRs?: number;
  deadBranches?: number;
  inactiveIssues?: number;
  healthScore?: number;
  aiRecommendations?: string;
  analyzedAt?: string;
};

const tileConfig = [
  { label: "Health", key: "health", icon: ShieldCheck, style: "from-emerald-500/30 to-emerald-800/20 border-emerald-700/40" },
  { label: "Total PRs", key: "totalPrs", icon: GitPullRequest, style: "from-cyan-500/30 to-cyan-800/20 border-cyan-700/40" },
  { label: "Merged", key: "merged", icon: GitMerge, style: "from-violet-500/30 to-violet-800/20 border-violet-700/40" },
  { label: "Risk", key: "risk", icon: AlertTriangle, style: "from-rose-500/30 to-rose-800/20 border-rose-700/40" },
];

type PieLabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  percent?: number;
  value?: number;
  name?: string;
};

function renderPieLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  outerRadius = 0,
  percent = 0,
  value = 0,
  name = "",
}: PieLabelProps) {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#d4d4d8"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${name}: ${value} (${Math.round(percent * 100)}%)`}
    </text>
  );
}

function getRecommendationMeta(text: string) {
  const normalized = text.toLowerCase();
  if (normalized.includes("reduce") || normalized.includes("fix") || normalized.includes("urgent")) {
    return {
      level: "High",
      badgeClass: "border-rose-700/60 bg-rose-500/15 text-rose-200",
      cardClass: "border-rose-900/40 bg-gradient-to-br from-rose-500/10 to-rose-950/20",
    };
  }

  if (normalized.includes("improve") || normalized.includes("encourage") || normalized.includes("increase")) {
    return {
      level: "Medium",
      badgeClass: "border-amber-700/60 bg-amber-500/15 text-amber-200",
      cardClass: "border-amber-900/40 bg-gradient-to-br from-amber-500/10 to-amber-950/20",
    };
  }

  return {
    level: "Low",
    badgeClass: "border-emerald-700/60 bg-emerald-500/15 text-emerald-200",
    cardClass: "border-emerald-900/40 bg-gradient-to-br from-emerald-500/10 to-emerald-950/20",
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [data, setData] = useState<AnalysisData | null>(() => {
    if (typeof window === "undefined") return null;
    
    const token = localStorage.getItem("rp_google_token") ?? localStorage.getItem("rp_auth_token");
    if (!token) {
      return null;
    }

    const raw = localStorage.getItem("rp_analysis_data");
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AnalysisData;
    } catch {
      return null;
    }
  });
  const [profile] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("rp_google_token") ?? localStorage.getItem("rp_auth_token");
    if (!token) return null;
    const storedProfile = getStoredUserProfile();
    if (!storedProfile || !storedProfile.imageUrl) {
      return syncUserProfileFromToken(token);
    }
    return storedProfile;
  });

  useEffect(() => {
    const token = localStorage.getItem("rp_google_token") ?? localStorage.getItem("rp_auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    if (!data) {
      router.replace("/analyze");
      return;
    }
    
    // Refresh data when page becomes visible to ensure fresh data
    const handleStorageChange = () => {
      const raw = localStorage.getItem("rp_analysis_data");
      if (raw) {
        try {
          setData(JSON.parse(raw) as AnalysisData);
        } catch {
          // Invalid data, redirect to analyze
          router.replace("/analyze");
        }
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router, data]);

  const values = useMemo(() => {
    const totalPrsRaw = data?.totalPRs ?? 0;
    const closedPrsRaw = data?.closedPRs ?? 0;
    const mergedPrs = data?.mergedPRs ?? 0;
    const stalePrs = data?.stalePRs ?? 0;
    const unmergedClosed = data?.unmergedClosedPRs ?? 0;
    const deadBranches = data?.deadBranches ?? 0;
    const inactiveIssues = data?.inactiveIssues ?? 0;
    const healthScore = data?.healthScore ?? 0;

    const closedPrs = Math.max(closedPrsRaw, mergedPrs + unmergedClosed);
    const totalPrs = Math.max(totalPrsRaw, closedPrs);
    const openPrs = Math.max(0, totalPrs - closedPrs);

    return {
      totalPrs,
      closedPrs,
      mergedPrs,
      stalePrs,
      unmergedClosed,
      deadBranches,
      inactiveIssues,
      healthScore,
      openPrs,
      riskCount: stalePrs + deadBranches + inactiveIssues,
    };
  }, [data]);

  const pieData = [
    { name: "Merged", value: values.mergedPrs, color: "#22c55e" },
    { name: "Stale", value: values.stalePrs, color: "#f59e0b" },
    { name: "Unmerged Closed", value: values.unmergedClosed, color: "#ef4444" },
    { name: "Open", value: values.openPrs, color: "#38bdf8" },
  ];

  const barData = [
    { category: "Stale PRs", value: values.stalePrs, fill: "#f59e0b" },
    { category: "Dead Branches", value: values.deadBranches, fill: "#ef4444" },
    { category: "Inactive Issues", value: values.inactiveIssues, fill: "#a855f7" },
  ];

  const recommendations = (data?.aiRecommendations ?? "")
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 6);

  const tileValues = [
    values.healthScore,
    values.totalPrs,
    values.mergedPrs,
    values.riskCount,
  ];

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <BrandLogo className="mb-3" />
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Repository Insights</h1>
          <p className="mt-2 text-sm text-neutral-400">
            {data?.repoName ?? "Repository"} • {data?.analyzedAt ? new Date(data.analyzedAt + 'Z').toLocaleString() : "Latest analysis"}
          </p>
        </div>
        <div className="flex w-full flex-wrap items-start justify-end gap-3 sm:w-auto">
          {profile ? (
            <article className="flex min-w-[260px] items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950/80 px-3 py-2">
              {profile.imageUrl ? (
                <Image
                  src={profile.imageUrl}
                  alt={`${profile.name} profile picture`}
                  width={44}
                  height={44}
                  unoptimized
                  className="h-11 w-11 rounded-full border border-neutral-700 object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-sm font-semibold text-neutral-200">
                  {profile.name.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{profile.name}</p>
                <p className="truncate text-xs text-neutral-400">{profile.email}</p>
              </div>
            </article>
          ) : null}
          <button
            onClick={() => router.push("/profile")}
            className="rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
          >
            View Profile
          </button>
          <button
            onClick={() => router.push("/analyze")}
            className="rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
          >
            Re-analyze
          </button>
        </div>
      </header>

      <article className="overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-cyan-500/15 via-violet-500/10 to-emerald-500/10 p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Overall Health</p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{values.healthScore}/100</h2>
            <p className="mt-2 text-sm text-neutral-300">
              {values.riskCount > 8
                ? "High attention required. Prioritize stale PR cleanup and branch hygiene."
                : values.riskCount > 3
                  ? "Moderate risk detected. Keep reviews and cleanup consistent."
                  : "Repository condition is healthy and operationally stable."}
            </p>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-neutral-300">
              <span>Health Progress</span>
              <span>{values.healthScore}%</span>
            </div>
            <div className="h-3 rounded-full bg-black/50">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400"
                style={{ width: `${Math.max(0, Math.min(values.healthScore, 100))}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-neutral-300">
                Merge Rate
                <p className="mt-1 text-lg font-semibold text-white">
                  {values.closedPrs > 0 ? Math.round((values.mergedPrs / values.closedPrs) * 100) : 0}%
                </p>
              </div>
              <div className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-neutral-300">
                Risk Signals
                <p className="mt-1 text-lg font-semibold text-white">{values.riskCount}</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tileConfig.map((tile, index) => (
          <article key={tile.key} className={`rounded-xl border bg-gradient-to-br p-5 ${tile.style}`}>
            <div className="mb-3 inline-flex rounded-md bg-black/30 p-2 text-white">
              <tile.icon size={17} />
            </div>
            <p className="text-xs uppercase tracking-wide text-neutral-200">{tile.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{tileValues[index]}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-sm text-neutral-300">
            <BarChart3 size={16} /> Pull Request Distribution
          </div>
          <div className="h-72">
            {isClient ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    labelLine
                    label={renderPieLabel}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ color: "#d4d4d8", fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{ background: "#0a0a0a", border: "1px solid #2a2a2a" }}
                    labelStyle={{ color: "#e4e4e7" }}
                    itemStyle={{ color: "#f4f4f5" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full rounded-md border border-neutral-800 bg-black" />
            )}
          </div>
        </article>

        <article className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 sm:p-5">
          <div className="mb-3 text-sm text-neutral-300">Risk & Hygiene Indicators</div>
          <div className="h-72">
            {isClient ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 4 }}>
                  <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fill: "#a3a3a3", fontSize: 12 }} interval={0} angle={-10} textAnchor="end" height={50} />
                  <YAxis tick={{ fill: "#a3a3a3", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "#0a0a0a", border: "1px solid #2a2a2a" }}
                    labelStyle={{ color: "#e4e4e7" }}
                    itemStyle={{ color: "#f4f4f5" }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {barData.map((entry) => (
                      <Cell key={entry.category} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full rounded-md border border-neutral-800 bg-black" />
            )}
          </div>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-white">Actionable Recommendations</h2>
            <span className="rounded-full border border-neutral-700 bg-black px-2.5 py-1 text-[11px] text-neutral-300">
              {recommendations.length} items
            </span>
          </div>
          <ul className="mt-3 space-y-2.5 text-sm text-neutral-300">
            {recommendations.length > 0 ? (
              recommendations.map((item, index) => (
                (() => {
                  const meta = getRecommendationMeta(item);
                  return (
                    <li key={`${item}-${index}`} className={`rounded-md border px-3 py-3 ${meta.cardClass}`}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="leading-relaxed text-neutral-100">{item}</p>
                        <span className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] ${meta.badgeClass}`}>
                          {meta.level}
                        </span>
                      </div>
                    </li>
                  );
                })()
              ))
            ) : (
              <li className="rounded-md border border-emerald-900/40 bg-emerald-500/10 px-3 py-3 text-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  No critical recommendations right now. Repository posture looks stable.
                </div>
              </li>
            )}
          </ul>
        </article>

        <article className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <h2 className="text-sm font-medium text-white">Operational Breakdown</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            <div className="rounded-md border border-cyan-900/60 bg-cyan-500/10 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-cyan-200">Total PRs</p>
              <p className="mt-1 text-lg font-semibold text-white">{values.totalPrs}</p>
            </div>
            <div className="rounded-md border border-emerald-900/60 bg-emerald-500/10 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-emerald-200">Closed PRs</p>
              <p className="mt-1 text-lg font-semibold text-white">{values.closedPrs}</p>
            </div>
            <div className="rounded-md border border-sky-900/60 bg-sky-500/10 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-sky-200">Open PRs</p>
              <p className="mt-1 text-lg font-semibold text-white">{values.openPrs}</p>
            </div>
            <div className="rounded-md border border-amber-900/60 bg-amber-500/10 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-amber-200">Stale PRs</p>
              <p className="mt-1 text-lg font-semibold text-white">{values.stalePrs}</p>
            </div>
            <div className="rounded-md border border-rose-900/60 bg-rose-500/10 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-rose-200">Dead Branches</p>
              <p className="mt-1 text-lg font-semibold text-white">{values.deadBranches}</p>
            </div>
            <div className="rounded-md border border-violet-900/60 bg-violet-500/10 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-violet-200">Inactive Issues</p>
              <p className="mt-1 text-lg font-semibold text-white">{values.inactiveIssues}</p>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-neutral-800 bg-black px-3 py-3">
            <p className="text-[11px] uppercase tracking-wide text-neutral-400">Overall Status</p>
            <p className="mt-1 text-sm text-neutral-200">
              Health score is <span className="font-semibold text-white">{values.healthScore}</span> with
              <span className="font-semibold text-white"> {values.riskCount}</span> active risk indicators.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
