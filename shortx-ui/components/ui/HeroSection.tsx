'use client';

import React, { useState } from 'react';
import {
  StarIcon,
  AISparkleIcon,
  UpArrowIcon,
  PaperclipIcon,
  MicrophoneIcon,
  SearchIcon,
} from './Icons';

interface HeroSectionProps {
  onUpgradeClick?: () => void;
  onSubmitQuery?: (query: string) => void;
}

export default function HeroSection({ onUpgradeClick, onSubmitQuery }: HeroSectionProps) {
  const [query, setQuery] = useState('');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    if (onSubmitQuery) onSubmitQuery(query);

    setTimeout(() => {
      setSubmittedMessage(`Analysis complete for: "${query}". Processing insights with GPT-4o engine...`);
      setIsLoading(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        paddingLeft: '120px',
        paddingRight: '120px',
        marginTop: '-50px', /* Hero content moved up 50px */
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '850px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Header Elements Container with 34px gap between badge, title, subtitle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '34px', /* Gap within header elements: 34px */
          }}
        >
          {/* Badge Component */}
          <div
            className="font-inter"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#ffffff',
              padding: '4px 14px 4px 4px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 400,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            {/* Dark badge with star icon + "New" text */}
            <span
              style={{
                background: '#0e1311',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px',
                fontWeight: 600,
                marginRight: '10px',
              }}
            >
              <StarIcon className="w-3.5 h-3.5 text-white" />
              New
            </span>
            <span style={{ color: '#000000', letterSpacing: '-0.1px' }}>
              Discover what's possible
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className="font-fustat tracking-title"
            style={{
              fontSize: '80px',
              fontWeight: 700,
              lineHeight: 1,
              color: '#000000',
              textAlign: 'center',
              margin: 0,
            }}
          >
            Transform Data Quickly
          </h1>

          {/* Subtitle */}
          <p
            className="font-fustat tracking-subtitle"
            style={{
              fontSize: '20px',
              fontWeight: 500,
              color: '#505050',
              maxWidth: '736px',
              width: '542px',
              textAlign: 'center',
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            Upload your information and get powerful insights right away. Work smarter and achieve goals effortlessly.
          </p>
        </div>

        {/* Gap between header and search box: 44px */}
        <div style={{ height: '44px' }} />

        {/* Search Input Box Component */}
        <div
          style={{
            width: '100%',
            maxWidth: '728px',
            minHeight: '200px',
            background: 'rgba(0, 0, 0, 0.24)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '18px',
            padding: '16px',
            boxSizing: 'border-box',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 2px 10px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Top Row: Credit info & AI Indicator */}
          <div
            className="font-schibsted"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: 500,
              color: '#ffffff',
              padding: '0 4px',
            }}
          >
            {/* Left: "60/450 credits" with green "Upgrade" button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>60/450 credits</span>
              <button
                type="button"
                onClick={onUpgradeClick}
                style={{
                  background: 'rgba(90, 225, 76, 0.89)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'transform 0.15s, filter 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
              >
                Upgrade
              </button>
            </div>

            {/* Right: AI icon + "Powered by GPT-4o" */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: 0.9,
              }}
            >
              <AISparkleIcon className="w-3.5 h-3.5" />
              <span>Powered by GPT-4o</span>
            </div>
          </div>

          {/* Main Input Area */}
          <form
            onSubmit={handleSubmit}
            style={{
              position: 'relative',
              width: '100%',
              background: '#ffffff',
              borderRadius: '12px',
              padding: '12px 56px 12px 16px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => {
                if (e.target.value.length <= 3000) {
                  setQuery(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type question..."
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '16px',
                fontFamily: 'var(--font-inter)',
                color: '#000000',
              }}
            />

            {/* Black circular submit button with up arrow icon (36px size) */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                position: 'absolute',
                right: '12px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isLoading ? (
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
              ) : (
                <UpArrowIcon className="w-4 h-4" />
              )}
            </button>
          </form>

          {/* Bottom Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 4px',
            }}
          >
            {/* Left: Three Action Buttons (gray backgrounds #f8f8f8, rounded 6px) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setActiveModal('attach')}
                style={{
                  background: '#f8f8f8',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'var(--font-schibsted)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#eeeeee')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f8f8f8')}
              >
                <PaperclipIcon className="w-3.5 h-3.5" />
                Attach
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('voice')}
                style={{
                  background: '#f8f8f8',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'var(--font-schibsted)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#eeeeee')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f8f8f8')}
              >
                <MicrophoneIcon className="w-3.5 h-3.5" />
                Voice
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('prompts')}
                style={{
                  background: '#f8f8f8',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'var(--font-schibsted)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#eeeeee')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f8f8f8')}
              >
                <SearchIcon className="w-3.5 h-3.5" />
                Prompts
              </button>
            </div>

            {/* Right: Character Counter "0/3,000" (12px, gray) */}
            <span
              style={{
                fontSize: '12px',
                color: '#ffffff',
                opacity: 0.8,
                fontFamily: 'var(--font-schibsted)',
              }}
            >
              {query.length.toLocaleString()}/3,000
            </span>
          </div>
        </div>

        {/* Output feedback message if query submitted */}
        {submittedMessage && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 20px',
              background: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.08)',
              color: '#000000',
              fontSize: '14px',
              fontWeight: 500,
              maxWidth: '728px',
              width: '100%',
              textAlign: 'left',
              animation: 'fadeIn 0.3s ease forwards',
            }}
          >
            ✨ {submittedMessage}
          </div>
        )}
      </div>

      {/* Interactive Modal for Attach / Voice / Prompts */}
      {activeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              {activeModal === 'attach' && '📎 Attach Data File'}
              {activeModal === 'voice' && '🎙️ Voice Input'}
              {activeModal === 'prompts' && '🔍 Prompt Library'}
            </h3>
            <p style={{ color: '#505050', fontSize: '14px', marginBottom: '20px' }}>
              {activeModal === 'attach' && 'Drag and drop CSV, JSON, or text files to process instantly.'}
              {activeModal === 'voice' && 'Speak directly to analyze data or generate custom short links.'}
              {activeModal === 'prompts' && 'Select pre-configured prompts for rapid data transformation.'}
            </p>
            {activeModal === 'prompts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {[
                  'Summarize traffic sources for short link campaign',
                  'Predict click conversion rates based on geo data',
                  'Optimize custom alias naming for brand reach',
                ].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setQuery(p);
                      setActiveModal(null);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #eee',
                      background: '#f8f8f8',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    💡 {p}
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              style={{
                width: '100%',
                padding: '10px',
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
