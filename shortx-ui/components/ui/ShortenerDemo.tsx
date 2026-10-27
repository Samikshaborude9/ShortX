'use client';

import React, { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ShortenerDemo() {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ shortUrl: string; originalUrl: string; shortCode: string } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    if (!url) { setError('Please paste a valid long URL'); return; }

    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('shortx_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/urls`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ originalUrl: url, ...(customAlias ? { customAlias } : {}) }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data) setResult(data);
      else setError(data?.message || 'Failed to shorten URL');
    } catch (err: any) {
      setError(err?.message || 'Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="platform" className="w-full py-20 px-8 md:px-[120px] flex flex-col items-center relative z-10">
      <div className="max-w-[900px] w-full">
        <div className="bg-white rounded-3xl p-10 shadow-[0_16px_48px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.03)] border border-black/[0.06]">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="font-schibsted text-xs font-semibold uppercase tracking-widest text-[#505050] bg-[#f8f8f8] px-3.5 py-1.5 rounded-full">
              ⚡ Instant Link Transformer
            </span>
            <h2 className="font-fustat text-4xl font-bold mt-4 text-black">
              Shorten links & track intelligence in real-time
            </h2>
            <p className="text-[#505050] mt-2 text-base">
              Paste any URL below and get a blazing-fast short link with analytics.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleShorten} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(''); }}
                placeholder="Paste long URL (e.g. https://example.com/very/long/path)"
                className="flex-1 px-5 py-4 rounded-xl border border-black/[0.12] text-[15px] outline-none bg-[#f8f8f8] font-inter focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 transition-all"
              />
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="Custom alias (optional)"
                className="w-full md:w-[200px] px-5 py-4 rounded-xl border border-black/[0.12] text-[15px] outline-none bg-[#f8f8f8] font-inter focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-7 py-4 bg-black text-white rounded-xl text-[15px] font-semibold font-schibsted cursor-pointer whitespace-nowrap hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing…' : 'Shorten Now →'}
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-sm font-medium flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}
          </form>

          {/* Result */}
          {result && (
            <div className="mt-6 p-5 bg-[#f8f8f8] rounded-2xl border border-black/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
              <div className="min-w-0">
                <div className="text-xs text-[#505050] font-semibold uppercase tracking-wider">Shortened Link</div>
                <div className="font-schibsted text-lg font-bold text-black mt-1 break-all">{result.shortUrl}</div>
                <div className="text-xs text-[#505050] mt-1 truncate max-w-[500px]">→ {result.originalUrl}</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2.5 bg-black text-white rounded-lg font-semibold cursor-pointer text-sm hover:opacity-90 transition-opacity"
                >
                  {copied ? '✅ Copied!' : 'Copy Link'}
                </button>
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-white text-black border border-black/[0.12] rounded-lg font-semibold text-sm no-underline inline-flex items-center hover:bg-gray-50 transition-colors"
                >
                  Open ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
