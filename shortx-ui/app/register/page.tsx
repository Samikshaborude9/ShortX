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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)' }}>
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link href="/" className="logo">ShortX</Link>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Create your account</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Free forever — no credit card required</p>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {error && <div className="alert alert-error">⚠️ {error}</div>}

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input id="name-input" type="text" className="form-input" placeholder="Jane Smith"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input id="email-input" type="email" className="form-input" placeholder="you@example.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input id="password-input" type="password" className="form-input" placeholder="Min. 8 characters"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>

              <button id="register-btn" type="submit" className="btn btn-primary"
                disabled={loading} style={{ width: '100%', padding: '14px' }}>
                {loading ? <><div className="spinner" /> Creating account...</> : 'Create Account →'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
