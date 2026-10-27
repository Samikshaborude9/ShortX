'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      id="contact"
      style={{
        width: '100%',
        padding: '60px 120px 40px',
        background: '#ffffff',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '40px',
        }}
      >
        <div>
          <span
            className="font-schibsted tracking-logo"
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#000000',
            }}
          >
            Logoipsum
          </span>
          <p
            className="font-fustat"
            style={{
              fontSize: '14px',
              color: '#505050',
              marginTop: '10px',
              maxWidth: '320px',
              lineHeight: 1.5,
            }}
          >
            Transform data quickly with AI insights, real-time analytics, and lightning fast URL intelligence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '60px' }}>
          <div>
            <div
              className="font-schibsted"
              style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: '#000000' }}
            >
              Product
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <Link href="#platform" style={{ color: '#505050', textDecoration: 'none' }}>
                Platform
              </Link>
              <Link href="#features" style={{ color: '#505050', textDecoration: 'none' }}>
                Features
              </Link>
              <Link href="#projects" style={{ color: '#505050', textDecoration: 'none' }}>
                Projects
              </Link>
            </div>
          </div>

          <div>
            <div
              className="font-schibsted"
              style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: '#000000' }}
            >
              Resources
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <Link href="#community" style={{ color: '#505050', textDecoration: 'none' }}>
                Community
              </Link>
              <Link href="#docs" style={{ color: '#505050', textDecoration: 'none' }}>
                Documentation
              </Link>
              <Link href="#api" style={{ color: '#505050', textDecoration: 'none' }}>
                API Reference
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          width: '100%',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
          color: '#888888',
        }}
      >
        <div>© 2026 Logoipsum Inc. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security</span>
        </div>
      </div>
    </footer>
  );
}
