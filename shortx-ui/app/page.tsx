'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import VideoBackground from '@/components/ui/VideoBackground';
import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/ui/HeroSection';
import ShortenerDemo from '@/components/ui/ShortenerDemo';
import FeaturesSection from '@/components/ui/FeaturesSection';
import AnalyticsShowcase from '@/components/ui/AnalyticsShowcase';
import PricingCreditsSection from '@/components/ui/PricingCreditsSection';
import Footer from '@/components/ui/Footer';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function HomePage() {
  const router = useRouter();
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('Pro Data');

  // Auth form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleOpenLogin = () => { setAuthModal('login'); setAuthError(''); };
  const handleOpenSignup = () => { setAuthModal('signup'); setAuthError(''); };

  const handleSelectUpgrade = (plan: string) => {
    setSelectedPlan(plan);
    router.push('/register');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('shortx_token', data.accessToken);
      localStorage.setItem('shortx_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (signupForm.password.length < 8) { setAuthError('Password must be at least 8 characters'); return; }
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('shortx_token', data.accessToken);
      localStorage.setItem('shortx_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white">
      {/* Hero Container */}
      <div className="relative w-full min-h-screen flex flex-col justify-between pb-[60px]">
        <VideoBackground src={VIDEO_URL} />
        <Navbar onOpenLogin={handleOpenLogin} onOpenSignup={handleOpenSignup} />
        <div className="h-[60px]" />
        <HeroSection onUpgradeClick={() => router.push('/register')} onSubmitQuery={(q) => console.log('Query:', q)} />
      </div>

      <ShortenerDemo />
      <FeaturesSection />
      <AnalyticsShowcase />
      <PricingCreditsSection onUpgradeSelect={handleSelectUpgrade} />
      <Footer />

      {/* Auth Modal */}
      {authModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-6"
          onClick={() => setAuthModal(null)}
        >
          <div
            className="bg-white rounded-3xl p-9 max-w-[440px] w-full shadow-[0_24px_60px_rgba(0,0,0,0.2)] animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold font-schibsted text-lg">
                  S
                </div>
                <span className="font-schibsted tracking-logo text-xl font-semibold text-black">
                  ShortX
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAuthModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            {/* Login */}
            {authModal === 'login' && (
              <div>
                <h3 className="font-fustat text-2xl font-bold mb-1.5 text-black">Welcome back</h3>
                <p className="text-[#505050] text-sm mb-6">
                  Sign in to manage your links and view analytics.
                </p>
                <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
                  {authError && <div className="alert alert-error">⚠️ {authError}</div>}
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="form-input"
                    autoComplete="email"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="form-input"
                    autoComplete="current-password"
                  />
                  <button type="submit" className="btn btn-primary w-full py-3.5 mt-2" disabled={authLoading}>
                    {authLoading ? <><div className="spinner" /> Signing in…</> : 'Sign In →'}
                  </button>
                </form>
                <p className="text-center text-sm text-[#505050] mt-4">
                  No account?{' '}
                  <button
                    onClick={() => { setAuthModal('signup'); setAuthError(''); }}
                    className="text-indigo-600 font-semibold hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Create one free
                  </button>
                </p>
              </div>
            )}

            {/* Sign Up */}
            {authModal === 'signup' && (
              <div>
                <h3 className="font-fustat text-2xl font-bold mb-1.5 text-black">Create your account</h3>
                <p className="text-[#505050] text-sm mb-6">
                  Free forever — no credit card required.
                </p>
                <form onSubmit={handleSignup} className="flex flex-col gap-3.5">
                  {authError && <div className="alert alert-error">⚠️ {authError}</div>}
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    className="form-input"
                    autoComplete="name"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className="form-input"
                    autoComplete="email"
                  />
                  <input
                    type="password"
                    placeholder="Password (min. 8 chars)"
                    required
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    className="form-input"
                    autoComplete="new-password"
                  />
                  <button type="submit" className="btn btn-primary w-full py-3.5 mt-2" disabled={authLoading}>
                    {authLoading ? <><div className="spinner" /> Creating account…</> : 'Get Started Free →'}
                  </button>
                </form>
                <p className="text-center text-sm text-[#505050] mt-4">
                  Already have an account?{' '}
                  <button
                    onClick={() => { setAuthModal('login'); setAuthError(''); }}
                    className="text-indigo-600 font-semibold hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
