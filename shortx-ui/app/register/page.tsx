'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
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
          <Link href="/login" className="btn btn-ghost btn-sm">
            Already have an account? Sign in →
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
              Create your account
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Free forever — no credit card required
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['✓ Custom aliases', '✓ Click analytics', '✓ Geo tracking'].map((f) => (
              <span key={f} className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full font-medium">
                {f}
              </span>
            ))}
          </div>

          {/* Card */}
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && <div className="alert alert-error">⚠️ {error}</div>}

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  id="name-input"
                  type="text"
                  className="form-input"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  autoComplete="name"
                />
              </div>

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
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                id="register-btn"
                type="submit"
                className="btn btn-primary w-full py-3.5"
                disabled={loading}
              >
                {loading ? <><div className="spinner" /> Creating account…</> : 'Create Account →'}
              </button>

              <p className="text-center text-xs text-[var(--color-text-muted)]">
                By creating an account, you agree to our{' '}
                <span className="text-indigo-600 cursor-pointer hover:underline">Terms of Service</span>
                {' '}and{' '}
                <span className="text-indigo-600 cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
            </form>
          </div>

          <p className="text-center mt-5 text-[var(--color-text-secondary)] text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
