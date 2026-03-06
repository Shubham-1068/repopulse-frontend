"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, TrendingUp, GitPullRequest, AlertCircle, Clock } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type AnalysisRecord = {
  id: number;
  repoName: string;
  totalPRs: number;
  closedPRs: number;
  mergedPRs: number;
  unmergedClosedPRs: number;
  stalePRs: number;
  inactiveIssues: number;
  deadBranches: number;
  healthScore: number;
  aiRecommendations: string;
  analyzedAt: string;
};

export default function HistoryPage() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("rp_google_token") ?? localStorage.getItem("rp_auth_token");
    if (!storedToken) {
      router.replace("/login");
      return;
    }
    setAuthToken(storedToken);
  }, [router]);

  useEffect(() => {
    if (!authToken) return;

    const fetchHistory = async () => {
      if (!API_BASE_URL) {
        setError("Missing NEXT_PUBLIC_API_BASE_URL. Add it to your .env file and restart the app.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/analyze/history`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch history (${response.status})`);
        }

        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to fetch history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [authToken]);

  const viewAnalysis = (record: AnalysisRecord) => {
    localStorage.setItem("rp_analysis_data", JSON.stringify(record));
    localStorage.setItem("rp_repo_name", record.repoName);
    router.push("/dashboard");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-rose-400";
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-700/40";
    if (score >= 60) return "bg-yellow-500/10 border-yellow-700/40";
    return "bg-rose-500/10 border-rose-700/40";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-neutral-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-600 border-t-cyan-500" />
          Loading history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md rounded-2xl border border-rose-900/40 bg-gradient-to-br from-rose-500/10 to-rose-950/20 p-6 text-center">
          <AlertCircle className="mx-auto mb-3 text-rose-400" size={40} />
          <h2 className="mb-2 text-lg font-semibold text-rose-200">Error Loading History</h2>
          <p className="text-sm text-neutral-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-8">
        <BrandLogo className="mb-4" />
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Analysis History</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Your Repository Analysis History</h1>
        <p className="mt-2 text-neutral-400">Review all your previous repository analysis reports</p>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-12 text-center">
          <GitPullRequest className="mx-auto mb-4 text-neutral-600" size={48} />
          <h2 className="mb-2 text-xl font-semibold text-neutral-300">No Analysis History Yet</h2>
          <p className="mb-4 text-sm text-neutral-500">
            You haven&apos;t analyzed any repositories yet. Start by analyzing your first repository!
          </p>
          <button
            onClick={() => router.push("/analyze")}
            className="rounded-md bg-cyan-600 px-6 py-2 text-sm font-medium text-white hover:bg-cyan-700"
          >
            Analyze Repository
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div
              key={record.id}
              className="group cursor-pointer rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition-all hover:border-cyan-700/50 hover:bg-neutral-900"
              onClick={() => viewAnalysis(record)}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Left side - Repo info and date */}
                <div className="flex-1">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400">
                        {record.repoName}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                        <Clock size={12} />
                        {formatDate(record.analyzedAt)}
                      </div>
                    </div>
                    <div className={`rounded-lg border px-3 py-1 ${getHealthBgColor(record.healthScore)}`}>
                      <span className={`text-sm font-bold ${getHealthColor(record.healthScore)}`}>
                        {record.healthScore}
                      </span>
                      <span className="ml-1 text-xs text-neutral-400">Health</span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg border border-neutral-800 bg-black/40 p-3">
                      <div className="mb-1 flex items-center gap-1 text-xs text-neutral-500">
                        <GitPullRequest size={12} />
                        Total PRs
                      </div>
                      <div className="text-lg font-semibold text-cyan-400">{record.totalPRs}</div>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-black/40 p-3">
                      <div className="mb-1 flex items-center gap-1 text-xs text-neutral-500">
                        <TrendingUp size={12} />
                        Merged
                      </div>
                      <div className="text-lg font-semibold text-violet-400">{record.mergedPRs}</div>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-black/40 p-3">
                      <div className="mb-1 flex items-center gap-1 text-xs text-neutral-500">
                        <AlertCircle size={12} />
                        Stale
                      </div>
                      <div className="text-lg font-semibold text-amber-400">{record.stalePRs}</div>
                    </div>

                    <div className="rounded-lg border border-neutral-800 bg-black/40 p-3">
                      <div className="mb-1 flex items-center gap-1 text-xs text-neutral-500">
                        <AlertCircle size={12} />
                        Unmerged
                      </div>
                      <div className="text-lg font-semibold text-rose-400">{record.unmergedClosedPRs}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Recommendations Preview */}
              {record.aiRecommendations && (
                <div className="mt-4 rounded-lg border border-neutral-800 bg-black/30 p-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    AI Recommendations Preview
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-300">
                    {record.aiRecommendations}
                  </p>
                </div>
              )}

              <div className="mt-4 text-right">
                <span className="text-xs text-cyan-400 group-hover:underline">View Full Analysis →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
