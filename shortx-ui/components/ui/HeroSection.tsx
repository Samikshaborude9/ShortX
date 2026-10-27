'use client';

import React, { useState } from 'react';
import {
  StarIcon,
  UpArrowIcon,
} from './Icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface HeroSectionProps {
  onUpgradeClick?: () => void;
  onSubmitQuery?: (query: string) => void;
}

export default function HeroSection({ onUpgradeClick }: HeroSectionProps) {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [showAlias, setShowAlias] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedResult, setShortenedResult] = useState<{
    shortUrl: string;
    originalUrl: string;
    shortCode: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setShortenedResult(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('shortx_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/urls`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          originalUrl: url.trim(),
          ...(customAlias.trim() ? { customAlias: customAlias.trim() } : {}),
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data) {
        setShortenedResult(data);
        setUrl('');
      } else {
        setErrorMessage(data?.message || 'Failed to shorten URL');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortenedResult) return;
    navigator.clipboard.writeText(shortenedResult.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        paddingLeft: '120px',
        paddingRight: '120px',
        marginTop: '-30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '850px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Header Elements Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* Badge Component */}
          <div
            className="font-inter"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#ffffff',
              padding: '4px 14px 4px 4px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 400,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <span
              style={{
                background: '#0e1311',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px',
                fontWeight: 600,
                marginRight: '10px',
              }}
            >
              <StarIcon className="w-3.5 h-3.5 text-white" />
              ShortX
            </span>
            <span style={{ color: '#000000', letterSpacing: '-0.1px' }}>
              Blazing Fast URL Shortener & Analytics
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className="font-fustat tracking-title"
            style={{
              fontSize: '76px',
              fontWeight: 700,
              lineHeight: 1.05,
              color: '#000000',
              textAlign: 'center',
              margin: 0,
            }}
          >
            Shorten Links Rapidly
          </h1>

          {/* Subtitle */}
          <p
            className="font-fustat tracking-subtitle"
            style={{
              fontSize: '20px',
              fontWeight: 500,
              color: '#505050',
              maxWidth: '680px',
              textAlign: 'center',
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            Turn long, messy links into clean short URLs. Track real-time visitor analytics, countries, and devices with sub-millisecond redirects.
          </p>
        </div>

        {/* Gap */}
        <div style={{ height: '36px' }} />

        {/* Shortener Box Component */}
        <div
          style={{
            width: '100%',
            maxWidth: '728px',
            background: 'rgba(0, 0, 0, 0.24)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '18px',
            padding: '16px',
            boxSizing: 'border-box',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 2px 10px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Top Row: Info */}
          <div
            className="font-schibsted"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: 500,
              color: '#ffffff',
              padding: '0 4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚡ Redis In-Memory Speed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.9 }}>
              <span>Real-Time Geo & Device Tracking</span>
            </div>
          </div>

          {/* Main Input Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              position: 'relative',
              width: '100%',
              background: '#ffffff',
              borderRadius: '12px',
              padding: '12px 56px 12px 16px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long link here (e.g. https://yourwebsite.com/very/long/path)..."
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '15px',
                fontFamily: 'var(--font-inter)',
                color: '#000000',
              }}
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                position: 'absolute',
                right: '10px',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isLoading ? (
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
              ) : (
                <UpArrowIcon className="w-4 h-4" />
              )}
            </button>
          </form>

          {/* Custom Alias Option */}
          {showAlias && (
            <div style={{ display: 'flex', gap: '8px', animation: 'fadeIn 0.2s ease' }}>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="Optional custom alias (e.g. my-campaign)"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'var(--font-inter)',
                  color: '#000000',
                }}
              />
            </div>
          )}

          {/* Bottom Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowAlias(!showAlias)}
                style={{
                  background: showAlias ? '#000000' : '#f8f8f8',
                  color: showAlias ? '#ffffff' : '#000000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'var(--font-schibsted)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background 0.15s',
                }}
              >
                🏷️ {showAlias ? 'Hide Alias' : 'Custom Alias'}
              </button>
            </div>

            <span
              style={{
                fontSize: '12px',
                color: '#ffffff',
                opacity: 0.85,
                fontFamily: 'var(--font-schibsted)',
              }}
            >
              100% Free & Instant
            </span>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 20px',
              background: '#fef2f2',
              borderRadius: '12px',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '14px',
              fontWeight: 500,
              maxWidth: '728px',
              width: '100%',
              textAlign: 'left',
              animation: 'fadeIn 0.3s ease forwards',
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Shortened URL Result Card */}
        {shortenedResult && (
          <div
            style={{
              marginTop: '16px',
              padding: '16px 20px',
              background: '#ffffff',
              borderRadius: '14px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.08)',
              maxWidth: '728px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              textAlign: 'left',
              animation: 'fadeIn 0.3s ease forwards',
            }}
          >
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Your shortened link:</div>
              <a
                href={shortenedResult.shortUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#6366f1',
                  textDecoration: 'none',
                }}
              >
                {shortenedResult.shortUrl}
              </a>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: copied ? '#059669' : '#000000',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <a
                href={shortenedResult.shortUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: '#f9fafb',
                  color: '#111827',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Visit ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
