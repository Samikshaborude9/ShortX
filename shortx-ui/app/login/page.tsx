'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('shortx_token', data.accessToken);
      localStorage.setItem('shortx_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">ShortX</Link>
          <Link href="/register" className="btn btn-ghost btn-sm">
            Create account →
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Logo + heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold font-schibsted mb-4 shadow-lg">
              S
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2 font-schibsted tracking-tight">
              Welcome back
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Sign in to manage your short links &amp; analytics
            </p>
          </div>

          {/* Card */}
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && <div className="alert alert-error">⚠️ {error}</div>}

              <div className="form-group">
                <label className="form-label">Email address</label>
                <input
                  id="email-input"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  id="password-input"
                  type="password"
                  className="form-input"
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                id="login-btn"
                type="submit"
                className="btn btn-primary w-full py-3.5"
                disabled={loading}
              >
                {loading ? <><div className="spinner" /> Signing in…</> : 'Sign In →'}
              </button>
            </form>
          </div>

          <p className="text-center mt-5 text-[var(--color-text-secondary)] text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
