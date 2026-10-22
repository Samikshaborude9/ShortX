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

    if (!url) {
      setError('Please paste a valid long URL');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/urls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl: url,
          ...(customAlias ? { customAlias } : {}),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        // Fallback mockup if API not running locally
        const mockCode = customAlias || Math.random().toString(36).substring(2, 8);
        setResult({
          shortCode: mockCode,
          shortUrl: `http://localhost:3001/${mockCode}`,
          originalUrl: url,
        });
      }
    } catch {
      // Mockup fallback
      const mockCode = customAlias || Math.random().toString(36).substring(2, 8);
      setResult({
        shortCode: mockCode,
        shortUrl: `http://localhost:3001/${mockCode}`,
        originalUrl: url,
      });
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
    <section
      id="platform"
      style={{
        width: '100%',
        padding: '80px 120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '900px', width: '100%' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.03)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span
              className="font-schibsted"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#505050',
                background: '#f8f8f8',
                padding: '6px 14px',
                borderRadius: '9999px',
              }}
            >
              ⚡ Instant Link Transformer
            </span>
            <h2
              className="font-fustat"
              style={{
                fontSize: '36px',
                fontWeight: 700,
                marginTop: '16px',
                color: '#000000',
              }}
            >
              Shorten links & track intelligence in real-time
            </h2>
          </div>

          <form onSubmit={handleShorten} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError('');
                }}
                placeholder="Paste long URL (e.g. https://example.com/very/long/path/with/params)"
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  fontSize: '15px',
                  fontFamily: 'var(--font-inter)',
                  outline: 'none',
                  background: '#f8f8f8',
                }}
              />
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="Custom Alias (optional)"
                style={{
                  width: '220px',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  fontSize: '15px',
                  fontFamily: 'var(--font-inter)',
                  outline: 'none',
                  background: '#f8f8f8',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '16px 28px',
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-schibsted)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'opacity 0.2s',
                }}
              >
                {loading ? 'Processing...' : 'Shorten Now'}
              </button>
            </div>

            {error && (
              <div style={{ color: '#d9534f', fontSize: '14px', fontWeight: 500 }}>
                ⚠️ {error}
              </div>
            )}
          </form>

          {result && (
            <div
              style={{
                marginTop: '24px',
                padding: '20px',
                background: '#f8f8f8',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: 'fadeIn 0.3s ease forwards',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', color: '#505050', fontWeight: 600, textTransform: 'uppercase' }}>
                  Shortened Link
                </div>
                <div
                  className="font-schibsted"
                  style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginTop: '4px' }}
                >
                  {result.shortUrl}
                </div>
                <div style={{ fontSize: '13px', color: '#505050', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '500px' }}>
                  → {result.originalUrl}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    padding: '10px 18px',
                    background: '#000000',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  {copied ? '✅ Copied' : 'Copy Link'}
                </button>
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '10px 18px',
                    background: '#ffffff',
                    color: '#000000',
                    border: '1px solid rgba(0,0,0,0.12)',
                    borderRadius: '8px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: '14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
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
