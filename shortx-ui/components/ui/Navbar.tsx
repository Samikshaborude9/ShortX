'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon } from './Icons';

interface NavbarProps {
  onOpenLogin?: () => void;
  onOpenSignup?: () => void;
}

export default function Navbar({ onOpenLogin, onOpenSignup }: NavbarProps) {
  const [featuresOpen, setFeaturesOpen] = useState(false);

  return (
    <nav
      style={{
        position: 'relative',
        zIndex: 50,
        width: '100%',
        padding: '16px 120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
      }}
    >
      {/* Left: Logo */}
      <Link href="/" style={{ textDecoration: 'none', color: '#000000' }}>
        <span
          className="font-schibsted tracking-logo"
          style={{
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          ShortX
        </span>
      </Link>

      {/* Center: Navigation Menu items */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        <Link
          href="#platform"
          className="font-schibsted tracking-menu"
          style={{
            fontSize: '16px',
            fontWeight: 500,
            color: '#000000',
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
        >
          Platform
        </Link>

        {/* Features with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setFeaturesOpen(!featuresOpen)}
            onMouseEnter={() => setFeaturesOpen(true)}
            className="font-schibsted tracking-menu"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              fontWeight: 500,
              color: '#000000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: 0,
            }}
          >
            Features
            <ChevronDownIcon
              className="w-4 h-4"
              style={{
                transform: featuresOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {featuresOpen && (
            <div
              onMouseLeave={() => setFeaturesOpen(false)}
              style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                left: '-16px',
                width: '260px',
                background: '#ffffff',
                borderRadius: '14px',
                padding: '12px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.06)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                animation: 'fadeIn 0.2s ease forwards',
              }}
            >
              {[
                { title: 'Link Shortening', desc: 'Custom aliases & rapid Base62 codes' },
                { title: 'Geo & Device Analytics', desc: 'Real-time clicks, browser & country' },
                { title: 'Redis In-Memory Cache', desc: 'Sub-millisecond redirect lookups' },
                { title: 'Developer REST API', desc: 'Programmatic link creation & stats' },
              ].map((item) => (
                <a
                  key={item.title}
                  href={`#${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f8f8')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#505050', marginTop: '2px' }}>
                    {item.desc}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        <Link
          href="#projects"
          className="font-schibsted tracking-menu"
          style={{
            fontSize: '16px',
            fontWeight: 500,
            color: '#000000',
            textDecoration: 'none',
          }}
        >
          Projects
        </Link>

        <Link
          href="#community"
          className="font-schibsted tracking-menu"
          style={{
            fontSize: '16px',
            fontWeight: 500,
            color: '#000000',
            textDecoration: 'none',
          }}
        >
          Community
        </Link>

        <Link
          href="#contact"
          className="font-schibsted tracking-menu"
          style={{
            fontSize: '16px',
            fontWeight: 500,
            color: '#000000',
            textDecoration: 'none',
          }}
        >
          Contact
        </Link>
      </div>

      {/* Right Side Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* Sign Up Button (transparent background, 82px width) */}
        <button
          type="button"
          onClick={onOpenSignup}
          className="font-schibsted tracking-menu"
          style={{
            width: '82px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 500,
            color: '#000000',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          Sign Up
        </button>

        {/* Log In Button (black background, white text, 101px width) */}
        <button
          type="button"
          onClick={onOpenLogin}
          className="font-schibsted tracking-menu"
          style={{
            width: '101px',
            height: '40px',
            background: '#000000',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'transform 0.15s, opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Log In
        </button>
      </div>
    </nav>
  );
}
