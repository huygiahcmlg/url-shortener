"use client";

import { useState } from "react";

interface ShortenResult {
  short_code: string;
  short_url: string;
  clicks: number;
}

const API_URL = "/api/backend";

export default function UrlForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail ?? "Failed to shorten URL");
      }

      const data = await res.json();

      const statsRes = await fetch(`${API_URL}/stats/${data.short_code}`);
      const stats = statsRes.ok ? await statsRes.json() : { clicks: 0 };

      setResult({ ...data, clicks: stats.clicks });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.short_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="url"
          required
          placeholder="https://example.com/very/long/url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full rounded-lg border border-white/30 bg-white/20 backdrop-blur px-4 py-3 text-sm text-white placeholder-white/60 outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Đang rút gọn..." : "Rút gọn"}
        </button>
      </form>

      {error && (
        <p className="mt-3 rounded-lg bg-red-500/80 backdrop-blur px-4 py-3 text-sm text-white">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-4 rounded-lg border border-white/30 bg-white/20 backdrop-blur p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/60">
            Link rút gọn
          </p>
          <div className="flex items-center gap-2">
            <a
              href={result.short_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 truncate text-sm font-medium text-white hover:underline"
            >
              {result.short_url}
            </a>
            <button
              onClick={handleCopy}
              className="shrink-0 rounded-md bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/30"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-xs text-white/50">
            {result.clicks} click{result.clicks !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
