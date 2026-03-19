"use client";

import { useState } from "react";

interface OptimizedBullet {
  original: string;
  optimized: string;
  changes: string[];
  keywordsAdded: string[];
}

interface OptimizeResult {
  optimizedBullets: OptimizedBullet[];
  atsScore: number;
  topKeywords: string[];
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-green-400 border-green-400/40 bg-green-400/10"
      : score >= 60
        ? "text-yellow-400 border-yellow-400/40 bg-yellow-400/10"
        : "text-red-400 border-red-400/40 bg-red-400/10";

  return (
    <div
      className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-2 ${color} text-3xl font-bold`}
    >
      {score}
    </div>
  );
}

function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 text-xs rounded-md border border-[#2a2a2a] hover:border-indigo-500/50 hover:bg-indigo-500/10 text-[#a3a3a3] hover:text-indigo-300 transition-all cursor-pointer"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [bulletsText, setBulletsText] = useState("");
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOptimize = async () => {
    setError("");
    setResult(null);

    const bullets = bulletsText
      .split("\n")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    if (!jobDescription.trim()) {
      setError("Please paste a job description.");
      return;
    }
    if (bullets.length === 0) {
      setError("Please add at least one bullet point.");
      return;
    }
    if (bullets.length > 20) {
      setError("Maximum 20 bullet points per request.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jobDescription.trim(), bullets }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const allOptimizedText = result
    ? result.optimizedBullets.map((b) => b.optimized).join("\n")
    : "";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Bullet<span className="text-indigo-400">Pro</span>
            </h1>
          </div>
          <a
            href="https://github.com/maxilylm/su-bulletpro"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#a3a3a3] hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              AI Resume Bullet Optimizer
            </h2>
            <p className="text-[#a3a3a3] max-w-xl mx-auto">
              Paste a job description and your experience bullets. Get
              ATS-optimized rewrites with strong action verbs, quantified
              metrics, and matched keywords.
            </p>
          </div>

          {/* Input Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={10}
                className="w-full rounded-xl bg-[#141414] border border-[#2a2a2a] px-4 py-3 text-sm text-white placeholder-[#525252] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 resize-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
                Your Bullet Points{" "}
                <span className="text-[#525252]">(one per line)</span>
              </label>
              <textarea
                value={bulletsText}
                onChange={(e) => setBulletsText(e.target.value)}
                placeholder={`Managed a team of developers\nImproved sales process\nCreated marketing campaigns\nBuilt customer onboarding flow`}
                rows={10}
                className="w-full rounded-xl bg-[#141414] border border-[#2a2a2a] px-4 py-3 text-sm text-white placeholder-[#525252] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 resize-none transition-all"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-center mb-12">
            <button
              onClick={handleOptimize}
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all cursor-pointer flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin-slow h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="31.4 31.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  Optimizing...
                </>
              ) : (
                "Optimize Bullets"
              )}
            </button>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl animate-shimmer"
                />
              ))}
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="animate-fade-in-up space-y-8">
              {/* Score + Keywords */}
              <div className="flex flex-col sm:flex-row items-center gap-8 p-6 rounded-2xl bg-[#141414] border border-[#2a2a2a]">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-wider text-[#737373] mb-3">
                    ATS Match Score
                  </p>
                  <ScoreBadge score={result.atsScore} />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-[#737373] mb-3">
                    Top ATS Keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.topKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Copy All */}
              <div className="flex justify-end">
                <CopyButton text={allOptimizedText} label="Copy All Optimized Bullets" />
              </div>

              {/* Bullet Cards */}
              <div className="space-y-4">
                {result.optimizedBullets.map((bullet, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-[#141414] border border-[#2a2a2a] overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#2a2a2a]">
                      {/* Original */}
                      <div className="p-5">
                        <p className="text-[10px] uppercase tracking-widest text-[#525252] mb-2">
                          Original
                        </p>
                        <p className="text-sm text-[#737373] leading-relaxed">
                          {bullet.original}
                        </p>
                      </div>
                      {/* Optimized */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-[10px] uppercase tracking-widest text-indigo-400">
                            Optimized
                          </p>
                          <CopyButton text={bullet.optimized} />
                        </div>
                        <p className="text-sm text-white leading-relaxed">
                          {bullet.optimized}
                        </p>
                        {/* Change badges */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {bullet.changes.map((change, j) => (
                            <span
                              key={j}
                              className="px-2 py-0.5 text-[10px] rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            >
                              {change}
                            </span>
                          ))}
                          {bullet.keywordsAdded.map((kw, j) => (
                            <span
                              key={`kw-${j}`}
                              className="px-2 py-0.5 text-[10px] rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                            >
                              +{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] px-6 py-4 text-center text-xs text-[#525252]">
        Powered by{" "}
        <a
          href="https://groq.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#737373] hover:text-white transition-colors"
        >
          Groq
        </a>{" "}
        &middot; Llama 3.3 70B
      </footer>
    </div>
  );
}
