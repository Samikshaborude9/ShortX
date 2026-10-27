'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ShortUrl {
  id: string;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

interface User { id: string; name: string; email: string; }

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('shortx_token');
    const userData = localStorage.getItem('shortx_user');
    if (!token) { router.push('/login'); return; }
    if (userData) setUser(JSON.parse(userData));
  }, [router]);

  const fetchUrls = useCallback(async () => {
    const token = localStorage.getItem('shortx_token');
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (search) params.set('search', search);
      const res = await fetch(`${API_URL}/api/urls?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { router.push('/login'); return; }
      const data = await res.json();
      setUrls(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, router]);

  useEffect(() => { fetchUrls(); }, [fetchUrls]);

  const handleCopy = async (shortUrl: string, id: string) => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    const token = localStorage.getItem('shortx_token');
    await fetch(`${API_URL}/api/urls/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchUrls();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this link? This cannot be undone.')) return;
    const token = localStorage.getItem('shortx_token');
    setDeleting(id);
    await fetch(`${API_URL}/api/urls/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeleting(null);
    fetchUrls();
  };

  const handleNewUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      setFormError('URL must start with http:// or https://'); return;
    }
    const token = localStorage.getItem('shortx_token');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/urls`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: newUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setNewUrl('');
      setShowForm(false);
      fetchUrls();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try { await fetch(`${API_URL}/api/auth/logout`, { method: 'POST' }); } catch {}
    localStorage.removeItem('shortx_token');
    localStorage.removeItem('shortx_user');
    router.push('/');
  };

  const isExpired = (url: ShortUrl) => url.expiresAt && new Date(url.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">ShortX</Link>
          <div className="flex items-center gap-3">
            <span className="text-[var(--color-text-secondary)] text-sm hidden sm:block">
              👤 {user?.name}
            </span>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1100px] mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] font-schibsted tracking-tight">
              My Links
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">
              {total} link{total !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            id="create-link-btn"
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            + New Link
          </button>
        </div>

        {/* Quick Create Form */}
        {showForm && (
          <div className="card mb-6">
            <form onSubmit={handleNewUrl} className="flex flex-col gap-3">
              {formError && <div className="alert alert-error">⚠️ {formError}</div>}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="new-url-input"
                  type="text"
                  className="form-input"
                  placeholder="https://your-long-url.com/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn btn-primary whitespace-nowrap" disabled={submitting}>
                  {submitting ? <><div className="spinner" /> Creating…</> : '⚡ Shorten'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>✕</button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="flex gap-3 mb-5">
          <input
            id="search-input"
            type="text"
            className="form-input max-w-[400px]"
            placeholder="Search by URL or short code…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
          />
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(searchInput); setPage(1); }}>
            Search
          </button>
          {search && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>
              Clear
            </button>
          )}
        </div>

        {error && <div className="alert alert-error mb-4">⚠️ {error}</div>}

        {/* Table */}
        <div className="url-table-container">
          {loading ? (
            <div className="py-16 text-center text-[var(--color-text-muted)]">
              <div className="spinner spinner-dark mx-auto mb-3" style={{ width: 36, height: 36 }} />
              Loading your links…
            </div>
          ) : urls.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">🔗</div>
              <h3 className="text-lg font-semibold mb-2 text-[var(--color-text-primary)]">No links yet</h3>
              <p className="text-[var(--color-text-secondary)] text-sm mb-5">Create your first short link to get started</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Create Link</button>
            </div>
          ) : (
            <table className="url-table">
              <thead>
                <tr>
                  <th>Original URL</th>
                  <th>Short Link</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr key={url.id}>
                    <td>
                      <div className="url-original" title={url.originalUrl}>{url.originalUrl}</div>
                    </td>
                    <td>
                      <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="url-short">
                        {url.shortCode}
                      </a>
                    </td>
                    <td>
                      {isExpired(url) ? (
                        <span className="badge badge-expired">Expired</span>
                      ) : url.isActive ? (
                        <span className="badge badge-active">● Active</span>
                      ) : (
                        <span className="badge badge-inactive">● Disabled</span>
                      )}
                    </td>
                    <td className="text-[var(--color-text-secondary)] text-sm">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex gap-1.5">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleCopy(url.shortUrl, url.id)}
                          title="Copy"
                        >
                          {copied === url.id ? '✅' : '📋'}
                        </button>
                        <Link href={`/dashboard/analytics/${url.id}`} className="btn btn-ghost btn-sm" title="Analytics">
                          📊
                        </Link>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleToggle(url.id, url.isActive)}
                          title={url.isActive ? 'Disable' : 'Enable'}
                        >
                          {url.isActive ? '⏸' : '▶'}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(url.id)}
                          disabled={deleting === url.id}
                          title="Delete"
                        >
                          {deleting === url.id ? <div className="spinner" style={{ width: 14, height: 14 }} /> : '🗑'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button className="btn btn-secondary btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              ← Prev
            </button>
            <span className="text-[var(--color-text-secondary)] text-sm px-2">
              Page {page} of {totalPages}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
