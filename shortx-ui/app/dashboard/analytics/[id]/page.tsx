'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Summary {
  totalClicks: number;
  uniqueVisitors: number;
  clicksToday: number;
  url: { shortCode: string; originalUrl: string; createdAt: string };
}
interface TimePoint { date: string; clicks: number; }
interface Breakdown {
  byCountry: { country: string; clicks: number }[];
  byBrowser: { browser: string; clicks: number }[];
  byDevice: { device: string; clicks: number }[];
  byReferrer: { referrer: string; clicks: number }[];
}

function BreakdownCard({
  title,
  items,
  labelKey,
  gradient,
}: {
  title: string;
  items: { [key: string]: any }[];
  labelKey: string;
  gradient: string;
}) {
  const max = items[0]?.[Object.keys(items[0]).find((k) => k !== labelKey)!] || 1;
  const valueKey = Object.keys(items[0] || {}).find((k) => k !== labelKey) || 'clicks';

  return (
    <div className="card">
      <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-[var(--color-text-muted)] text-sm">No data yet</p>
      ) : (
        items.slice(0, 5).map((item, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[var(--color-text-primary)] truncate max-w-[180px]" title={item[labelKey]}>
                {item[labelKey] || 'Unknown'}
              </span>
              <span className="text-[var(--color-text-secondary)] ml-2 flex-shrink-0">{item[valueKey]}</span>
            </div>
            <div className="h-1.5 bg-[var(--color-bg-tertiary)] rounded-full">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(item[valueKey] / max) * 100}%`, background: gradient }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

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
      fetch(`${API_URL}/api/analytics/${urlId}`, { headers }).then((r) => r.json()),
      fetch(`${API_URL}/api/analytics/${urlId}/timeseries`, { headers }).then((r) => r.json()),
      fetch(`${API_URL}/api/analytics/${urlId}/breakdown`, { headers }).then((r) => r.json()),
    ])
      .then(([s, ts, bd]) => {
        setSummary(s);
        setTimeSeries(Array.isArray(ts) ? ts : []);
        setBreakdown(bd);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [urlId, router]);

  const maxClicks = Math.max(...timeSeries.map((t) => t.clicks), 1);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="spinner spinner-dark" style={{ width: 40, height: 40 }} />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="alert alert-error">Error: {error}</div>
      </div>
    );

  const statCards = [
    { icon: '📊', value: summary?.totalClicks?.toLocaleString() || '0', label: 'Total Clicks' },
    { icon: '👥', value: summary?.uniqueVisitors?.toLocaleString() || '0', label: 'Unique Visitors' },
    { icon: '📈', value: summary?.clicksToday?.toLocaleString() || '0', label: 'Clicks Today' },
    {
      icon: '📅',
      value: summary?.url.createdAt ? new Date(summary.url.createdAt).toLocaleDateString() : '-',
      label: 'Created',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">ShortX</Link>
          <Link href="/dashboard" className="btn btn-ghost btn-sm">← Back to Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-[1100px] mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] font-schibsted tracking-tight mb-2">
            Analytics: /{summary?.url.shortCode}
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm truncate max-w-[600px]">
            {summary?.url.originalUrl}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Time series chart */}
        <div className="card mb-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-5">
            Clicks Over Time (Last 30 Days)
          </h2>
          {timeSeries.length === 0 ? (
            <p className="text-[var(--color-text-muted)] text-sm text-center py-5">No click data yet.</p>
          ) : (
            <div className="flex items-end gap-1 h-40">
              {timeSeries.map((point, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center"
                  title={`${new Date(point.date).toLocaleDateString()}: ${point.clicks} clicks`}
                >
                  <div
                    className="w-full rounded-t-sm min-h-[4px] transition-all hover:opacity-80"
                    style={{
                      height: `${(point.clicks / maxClicks) * 130}px`,
                      background: 'var(--gradient-brand)',
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Breakdown cards */}
        {breakdown && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <BreakdownCard
              title="By Country"
              items={breakdown.byCountry || []}
              labelKey="country"
              gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
            />
            <BreakdownCard
              title="By Browser"
              items={breakdown.byBrowser || []}
              labelKey="browser"
              gradient="linear-gradient(135deg, #00d4aa, #6c63ff)"
            />
            <BreakdownCard
              title="By Device"
              items={breakdown.byDevice || []}
              labelKey="device"
              gradient="linear-gradient(135deg, #ff7b00, #ff007a)"
            />
            <BreakdownCard
              title="By Referrer"
              items={breakdown.byReferrer || []}
              labelKey="referrer"
              gradient="linear-gradient(135deg, #38ef7d, #11998e)"
            />
          </div>
        )}
      </div>
    </div>
  );
}