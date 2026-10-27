'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon } from './Icons';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  onOpenLogin?: () => void;
  onOpenSignup?: () => void;
}

export default function Navbar({ onOpenLogin, onOpenSignup }: NavbarProps) {
  const [featuresOpen, setFeaturesOpen] = useState(false);

  return (
    <nav className="relative z-50 w-full flex items-center justify-between px-8 md:px-[120px] py-4 box-border">
      {/* Left: Logo */}
      <Link href="/" className="no-underline">
        <span className="font-schibsted tracking-logo text-2xl font-semibold text-black leading-none select-none">
          ShortX
        </span>
      </Link>

      {/* Center: Navigation */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="#platform" className="font-schibsted tracking-menu text-base font-medium text-black no-underline hover:opacity-70 transition-opacity">
          Platform
        </Link>

        {/* Features Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setFeaturesOpen(!featuresOpen)}
            onMouseEnter={() => setFeaturesOpen(true)}
            className="font-schibsted tracking-menu text-base font-medium text-black cursor-pointer flex items-center gap-1.5 p-0 bg-transparent border-none"
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
              className="absolute top-[calc(100%+12px)] -left-4 w-64 bg-white rounded-2xl p-3 shadow-[0_12px_32px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.04)] border border-black/[0.06] z-[100] flex flex-col gap-1 animate-fade-in"
            >
              {[
                { title: 'Link Shortening', desc: 'Custom aliases & rapid redirects' },
                { title: 'Geo & Device Analytics', desc: 'Real-time audience tracking' },
                { title: 'API Integration', desc: 'REST API & Webhooks' },
                { title: 'Redis Caching', desc: 'Sub-millisecond redirect speed' },
              ].map((item) => (
                <a
                  key={item.title}
                  href={`#${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-2 rounded-lg no-underline hover:bg-[#f8f8f8] transition-colors"
                >
                  <div className="text-sm font-semibold text-black">{item.title}</div>
                  <div className="text-xs text-[#505050] mt-0.5">{item.desc}</div>
                </a>
              ))}
            </div>
          )}
        </div>

        <Link href="#community" className="font-schibsted tracking-menu text-base font-medium text-black no-underline hover:opacity-70 transition-opacity">
          Community
        </Link>

        <Link href="#contact" className="font-schibsted tracking-menu text-base font-medium text-black no-underline hover:opacity-70 transition-opacity">
          Contact
        </Link>
      </div>

      {/* Right: Auth Buttons & Theme */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          onClick={onOpenSignup}
          className="font-schibsted tracking-menu w-[82px] h-10 bg-transparent border-none rounded-lg text-[15px] font-medium text-black cursor-pointer inline-flex items-center justify-center hover:bg-black/[0.04] transition-colors"
        >
          Sign Up
        </button>

        <button
          type="button"
          onClick={onOpenLogin}
          className="font-schibsted tracking-menu w-[101px] h-10 bg-black text-white border-none rounded-lg text-[15px] font-medium cursor-pointer inline-flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity"
        >
          Log In
        </button>
      </div>
    </nav>
  );
}
