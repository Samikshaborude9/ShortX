'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Summary { totalClicks: number; clicksToday: number; url: { shortCode: string; originalUrl: string; createdAt: string }; }
interface TimePoint { date: string; clicks: number; }
interface Breakdown { byCountry: { country: string; clicks: number }[]; byBrowser: { browser: string; clicks: number }[]; }

export default function AnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const urlId = params.id as string;
  const [summary, setSummary] = useState<Summary | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimePoint[]>([]);
  const [breakdown, setBreakdown] = useState<Breakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('shortx_token');
    if (!token) { router.push('/login'); return; }
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API_URL}/api/analytics/${urlId}`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/api/analytics/${urlId}/timeseries`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/api/analytics/${urlId}/breakdown`, { headers }).then(r => r.json()),
    ]).then(([s, ts, bd]) => {
      setSummary(s);
      setTimeSeries(Array.isArray(ts) ? ts : []);
      setBreakdown(bd);
    }).catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [urlId, router]);

  const maxClicks = Math.max(...timeSeries.map(t => t.clicks), 1);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-primary)' }}>
      <div className="spinner" style={{ width: '40px', height: '40px' }} />
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-primary)' }}>
      <div className="alert alert-error">Error: {error}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link href="/" className="logo">ShortX</Link>
          <Link href="/dashboard" className="btn btn-ghost btn-sm">Back to Dashboard</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Analytics: /{summary?.url.shortCode}</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{summary?.url.originalUrl}</p>
        </div>

        <div className="stats-grid" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📊</div>
            <div className="stat-value">{summary?.totalClicks?.toLocaleString() || '0'}</div>
            <div className="stat-label">Total Clicks</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📈</div>
            <div className="stat-value">{summary?.clicksToday?.toLocaleString() || '0'}</div>
            <div className="stat-label">Clicks Today</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📅</div>
            <div className="stat-value">{summary ? new Date(summary.url.createdAt).toLocaleDateString() : '-'}</div>
            <div className="stat-label">Created</div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '20px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            Clicks Over Time (Last 30 Days)
          </h2>
          {timeSeries.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', padding: '20px 0', textAlign: 'center' }}>No click data yet.</p>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '160px' }}>
              {timeSeries.map((point, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  title={`${new Date(point.date).toLocaleDateString()}: ${point.clicks} clicks`}>
                  <div style={{
                    width: '100%',
                    height: `${(point.clicks / maxClicks) * 130}px`,
                    background: 'var(--gradient-brand)',
                    borderRadius: '4px 4px 0 0',
                    minHeight: '4px',
                  }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {breakdown && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="card">
              <h2 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>By Country</h2>
              {breakdown.byCountry.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No data yet</p>
              ) : breakdown.byCountry.slice(0, 5).map((item, i) => {
                const maxC = breakdown.byCountry[0]?.clicks || 1;
                return (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.875rem' }}>
                      <span>{item.country || 'Unknown'}</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{item.clicks}</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--color-bg-tertiary)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: `${(item.clicks / maxC) * 100}%`, background: 'var(--gradient-brand)', borderRadius: '3px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="card">
              <h2 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>By Browser</h2>
              {breakdown.byBrowser.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No data yet</p>
              ) : breakdown.byBrowser.slice(0, 5).map((item, i) => {
                const maxB = breakdown.byBrowser[0]?.clicks || 1;
                return (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.875rem' }}>
                      <span>{item.browser || 'Unknown'}</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{item.clicks}</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--color-bg-tertiary)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: `${(item.clicks / maxB) * 100}%`, background: 'linear-gradient(135deg, #00d4aa, #6c63ff)', borderRadius: '3px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}