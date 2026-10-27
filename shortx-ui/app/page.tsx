'use client';

import React, { useState } from 'react';
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

export default function HomePage() {
  const [authModal, setAuthModal] = useState<'login' | 'signup' | 'upgrade' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('Pro Data');

  const handleOpenLogin = () => setAuthModal('login');
  const handleOpenSignup = () => setAuthModal('signup');
  const handleOpenUpgrade = () => setAuthModal('upgrade');

  const handleSelectUpgrade = (plan: string) => {
    setSelectedPlan(plan);
    setAuthModal('upgrade');
  };

  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        background: '#ffffff',
      }}
    >
      {/* Hero Container wrapping Navbar and HeroSection over Video Background */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingBottom: '60px',
        }}
      >
        {/* Looping Video Background with custom requestAnimationFrame Fade logic */}
        <VideoBackground src={VIDEO_URL} />

        {/* Navigation Bar (120px horizontal padding, 16px vertical padding) */}
        <Navbar onOpenLogin={handleOpenLogin} onOpenSignup={handleOpenSignup} />

        {/* Gap between navigation and hero: 60px (handled inside hero container layout) */}
        <div style={{ height: '60px' }} />

        {/* Hero Section (moved up 50px with negative margin) */}
        <HeroSection
          onUpgradeClick={handleOpenUpgrade}
          onSubmitQuery={(q) => console.log('Query submitted:', q)}
        />
      </div>

      {/* Interactive Platform Demo & Link Shortener */}
      <ShortenerDemo />

      {/* Platform Features */}
      <FeaturesSection />

      {/* Live Analytics Dashboard Showcase */}
      <AnalyticsShowcase />

      {/* Pricing & Credit Capacity Upgrades */}
      <PricingCreditsSection onUpgradeSelect={handleSelectUpgrade} />

      {/* Footer */}
      <Footer />

      {/* Authentication & Upgrade Modal Overlay */}
      {authModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setAuthModal(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '36px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
              animation: 'fadeIn 0.25s ease forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span className="font-schibsted tracking-logo" style={{ fontSize: '22px', fontWeight: 700 }}>
                Logoipsum
              </span>
              <button
                type="button"
                onClick={() => setAuthModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#888888',
                }}
              >
                ✕
              </button>
            </div>

            {authModal === 'login' && (
              <div>
                <h3 className="font-fustat" style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                  Welcome back
                </h3>
                <p style={{ color: '#505050', fontSize: '14px', marginBottom: '24px' }}>
                  Log in to access your data insights and short link management.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); setAuthModal(null); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: '1px solid #ddd',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: '1px solid #ddd',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '14px',
                      background: '#000000',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '15px',
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                  >
                    Log In
                  </button>
                </form>
              </div>
            )}

            {authModal === 'signup' && (
              <div>
                <h3 className="font-fustat" style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                  Create your account
                </h3>
                <p style={{ color: '#505050', fontSize: '14px', marginBottom: '24px' }}>
                  Start with 450 free credits and transform your data quickly.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); setAuthModal(null); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: '1px solid #ddd',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Work email"
                    required
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: '1px solid #ddd',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '14px',
                      background: '#000000',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '15px',
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                  >
                    Get Started Free
                  </button>
                </form>
              </div>
            )}

            {authModal === 'upgrade' && (
              <div>
                <h3 className="font-fustat" style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                  Upgrade Capacity
                </h3>
                <p style={{ color: '#505050', fontSize: '14px', marginBottom: '20px' }}>
                  You selected <strong>{selectedPlan}</strong>. Increase your monthly credit balance from 60/450.
                </p>
                <div
                  style={{
                    background: '#f8f8f8',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    color: '#333333',
                  }}
                >
                  ⚡ Includes 5,000 monthly GPT-4o analysis credits & priority Redis queue execution.
                </div>
                <button
                  type="button"
                  onClick={() => setAuthModal(null)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'rgba(90, 225, 76, 0.89)',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                >
                  Confirm Upgrade to {selectedPlan}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
