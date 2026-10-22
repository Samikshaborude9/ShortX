'use client';

import React from 'react';

interface PricingCreditsProps {
  onUpgradeSelect?: (plan: string) => void;
}

const TIERS = [
  {
    name: 'Starter',
    credits: '450 credits/mo',
    price: '$0',
    period: 'Forever free',
    features: ['60/450 initial credits', 'Standard short links', 'Basic click analytics', 'GPT-4o standard speed'],
    current: true,
  },
  {
    name: 'Pro Data',
    credits: '5,000 credits/mo',
    price: '$19',
    period: 'per month',
    features: ['Custom branded domains', 'Real-time Kafka streams', 'GPT-4o Priority processing', 'Unlimited custom aliases'],
    recommended: true,
  },
  {
    name: 'Enterprise',
    credits: 'Unlimited credits',
    price: '$99',
    period: 'per month',
    features: ['Dedicated Redis cluster', 'Custom SLA & 99.99% uptime', 'Full Webhook & API access', '24/7 Priority support'],
  },
];

export default function PricingCreditsSection({ onUpgradeSelect }: PricingCreditsProps) {
  return (
    <section
      id="community"
      style={{
        width: '100%',
        padding: '100px 120px',
        background: '#f8f8f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1100px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
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
            Flexible Credit Plans
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
            Upgrade your credit capacity
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            alignItems: 'stretch',
          }}
        >
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '36px 32px',
                boxShadow: tier.recommended
                  ? '0 16px 40px rgba(0,0,0,0.1)'
                  : '0 4px 20px rgba(0,0,0,0.03)',
                border: tier.recommended ? '2px solid #000000' : '1px solid rgba(0,0,0,0.08)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {tier.recommended && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#000000',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '4px 14px',
                    borderRadius: '9999px',
                  }}
                >
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="font-schibsted" style={{ fontSize: '20px', fontWeight: 700 }}>
                  {tier.name}
                </h3>
                <div style={{ fontSize: '13px', color: '#505050', marginTop: '4px' }}>
                  {tier.credits}
                </div>

                <div style={{ margin: '24px 0' }}>
                  <span className="font-fustat" style={{ fontSize: '48px', fontWeight: 800 }}>
                    {tier.price}
                  </span>
                  <span style={{ fontSize: '14px', color: '#505050', marginLeft: '6px' }}>
                    / {tier.period}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '32px',
                  }}
                >
                  {tier.features.map((feat) => (
                    <div
                      key={feat}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#333333',
                      }}
                    >
                      <span>✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onUpgradeSelect && onUpgradeSelect(tier.name)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: tier.recommended ? 'none' : '1px solid #000000',
                  background: tier.recommended ? '#000000' : 'transparent',
                  color: tier.recommended ? '#ffffff' : '#000000',
                  fontWeight: 600,
                  fontSize: '15px',
                  fontFamily: 'var(--font-schibsted)',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
              >
                {tier.current ? 'Current Plan' : `Upgrade to ${tier.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
