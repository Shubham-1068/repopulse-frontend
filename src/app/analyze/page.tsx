"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AnalyzePage() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [repoName, setRepoName] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("rp_google_token") ?? localStorage.getItem("rp_auth_token");
    if (!storedToken) {
      router.replace("/login");
      return;
    }
    setAuthToken(storedToken);
  }, [router]);

  const handleAnalyze = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authToken || !repoName.trim()) return;

    if (!API_BASE_URL) {
      setError("Missing NEXT_PUBLIC_API_BASE_URL. Add it to your .env file and restart the app.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          repoName: repoName.trim(),
          token: githubToken.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analyze failed (${response.status})`);
      }

      const payload = await response.json();
      localStorage.setItem("rp_analysis_data", JSON.stringify(payload));
      localStorage.setItem("rp_repo_name", repoName.trim());
      router.push("/dashboard");
    } catch (analyzeError) {
      setError(analyzeError instanceof Error ? analyzeError.message : "Unable to analyze repository");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8">
        <BrandLogo className="mb-4" />
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Repository Analysis</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Enter repository details</h1>
        <p className="mt-2 text-sm text-neutral-400">Provide your target repo and optional GitHub token if required.</p>

        <form onSubmit={handleAnalyze} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-neutral-300">Repository</label>
            <input
              type="text"
              placeholder="owner/repo (e.g. spring-projects/spring-boot)"
              value={repoName}
              onChange={(event) => setRepoName(event.target.value)}
              className="w-full rounded-md border border-neutral-700 bg-black px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-300">GitHub Token (Optional)</label>
            <input
              type="password"
              placeholder="ghp_..."
              value={githubToken}
              onChange={(event) => setGithubToken(event.target.value)}
              className="w-full rounded-md border border-neutral-700 bg-black px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-violet-500"
            />
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            type="submit"
            disabled={!authToken || !repoName.trim() || loading}
            className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Continue to Dashboard"}
          </button>
        </form>
      </div>
    </section>
  );
}
