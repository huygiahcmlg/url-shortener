"use client";

import { useState } from "react";

interface ShortenResult {
  short_code: string;
  short_url: string;
  clicks: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Short URL
          </p>
          <div className="flex items-center gap-2">
            <a
              href={result.short_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 truncate text-sm font-medium text-blue-600 hover:underline"
            >
              {result.short_url}
            </a>
            <button
              onClick={handleCopy}
              className="shrink-0 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium transition hover:bg-gray-200"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {result.clicks} click{result.clicks !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
