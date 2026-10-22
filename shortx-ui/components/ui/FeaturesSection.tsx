'use client';

import React from 'react';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Sub-Millisecond Redirects',
    desc: 'Powered by in-memory Redis caching and edge network distribution for instantaneous redirection.',
  },
  {
    icon: '🤖',
    title: 'GPT-4o Data Insights',
    desc: 'Query traffic streams, convert metrics to summaries, and auto-detect anomalies with natural language.',
  },
  {
    icon: '📊',
    title: 'Real-Time Click Analytics',
    desc: 'Track geographic origin, browser stats, referrer channels, and device breakdown in live time.',
  },
  {
    icon: '🎯',
    title: 'Custom Branded Aliases',
    desc: 'Create memorable, domain-matched short links that enhance brand trust and click-through rates.',
  },
  {
    icon: '⏳',
    title: 'Link Expiration & Passwords',
    desc: 'Set automatic expiration timers or passcode locks for sensitive data campaigns.',
  },
  {
    icon: '🚀',
    title: 'Enterprise REST & Kafka API',
    desc: 'Asynchronous event stream processing with enterprise-grade rate limits and webhook integrations.',
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        width: '100%',
        padding: '80px 120px',
        background: '#f8f8f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span
            className="font-schibsted"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              color: '#505050',
            }}
          >
            Capabilities & Architecture
          </span>
          <h2
            className="font-fustat"
            style={{
              fontSize: '44px',
              fontWeight: 700,
              marginTop: '12px',
              color: '#000000',
              letterSpacing: '-1px',
            }}
          >
            Everything you need to transform data quickly
          </h2>
          <p
            className="font-fustat"
            style={{
              fontSize: '18px',
              color: '#505050',
              marginTop: '12px',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Built for high scale, sub-millisecond response times, and AI-first workflows.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
          }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#f8f8f8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '20px',
                }}
              >
                {f.icon}
              </div>
              <h3
                className="font-fustat"
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#000000',
                  marginBottom: '10px',
                }}
              >
                {f.title}
              </h3>
              <p
                className="font-inter"
                style={{
                  fontSize: '14px',
                  color: '#505050',
                  lineHeight: 1.6,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
