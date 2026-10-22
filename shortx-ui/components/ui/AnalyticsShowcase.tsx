'use client';

import React, { useState } from 'react';

export default function AnalyticsShowcase() {
  const [activeTab, setActiveTab] = useState<'clicks' | 'geo' | 'devices'>('clicks');

  return (
    <section
      id="projects"
      style={{
        width: '100%',
        padding: '100px 120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#ffffff',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
            Live Performance Metrics
          </span>
          <h2
            className="font-fustat"
            style={{
              fontSize: '40px',
              fontWeight: 700,
              marginTop: '12px',
              color: '#000000',
              letterSpacing: '-1px',
            }}
          >
            Real-Time Analytics & Data Intelligence
          </h2>
        </div>

        {/* Dashboard Frame */}
        <div
          style={{
            background: '#0e1311',
            borderRadius: '24px',
            padding: '32px',
            color: '#ffffff',
            boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: '20px',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', color: '#888888', fontWeight: 600 }}>
                PROJECT DASHBOARD
              </div>
              <div className="font-schibsted" style={{ fontSize: '22px', fontWeight: 700 }}>
                Campaign: Summer Launch 2026
              </div>
            </div>

            {/* Tab Toggles */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.06)',
                padding: '4px',
                borderRadius: '10px',
                gap: '4px',
              }}
            >
              {(['clicks', 'geo', 'devices'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === tab ? '#ffffff' : 'transparent',
                    color: activeTab === tab ? '#000000' : '#ffffff',
                    fontWeight: 600,
                    fontSize: '13px',
                    fontFamily: 'var(--font-schibsted)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {[
              { label: 'Total Clicks', val: '142,890', change: '+18.4%' },
              { label: 'Unique Visitors', val: '98,420', change: '+12.1%' },
              { label: 'Avg Latency', val: '0.42 ms', change: '-4.2%' },
              { label: 'Conversion Rate', val: '8.94%', change: '+2.3%' },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  padding: '20px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ fontSize: '12px', color: '#aaaaaa' }}>{m.label}</div>
                <div
                  className="font-schibsted"
                  style={{ fontSize: '28px', fontWeight: 700, margin: '8px 0 4px' }}
                >
                  {m.val}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: m.change.startsWith('+') ? 'rgba(90, 225, 76, 0.89)' : '#505050',
                    fontWeight: 600,
                  }}
                >
                  {m.change} vs last period
                </div>
              </div>
            ))}
          </div>

          {/* Main Visualizer Bar Chart Representation */}
          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: '#dddddd' }}>
              {activeTab === 'clicks' && '📈 Hourly Click Distribution'}
              {activeTab === 'geo' && '🌍 Top Geographic Traffic Sources'}
              {activeTab === 'devices' && '📱 Device & OS Split'}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '16px',
                height: '180px',
                paddingTop: '20px',
              }}
            >
              {[45, 65, 30, 85, 95, 70, 110, 140, 120, 160, 190, 175].map((height, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: `${(height / 200) * 100}%`,
                      background: idx % 2 === 0 ? 'rgba(90, 225, 76, 0.89)' : '#ffffff',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.4s ease',
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#777777' }}>
                    {idx * 2}:00
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
