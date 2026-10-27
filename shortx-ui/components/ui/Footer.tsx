'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-white border-t border-black/[0.08]">
      <div className="max-w-[1200px] mx-auto px-8 md:px-[120px] py-14 flex flex-col md:flex-row items-start justify-between gap-10">
        {/* Brand */}
        <div className="max-w-xs">
          <Link href="/" className="font-schibsted tracking-logo text-2xl font-semibold text-black no-underline">
            ShortX
          </Link>
          <p className="font-fustat text-sm text-[#505050] mt-2.5 leading-relaxed">
            The fast, intelligent URL shortener with real-time analytics, custom aliases, and geo insights.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-14 flex-shrink-0">
          <div>
            <div className="font-schibsted text-sm font-semibold mb-4 text-black">Product</div>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="#platform" className="text-[#505050] hover:text-black transition-colors no-underline">Platform</Link>
              <Link href="#features" className="text-[#505050] hover:text-black transition-colors no-underline">Features</Link>
              <Link href="/dashboard" className="text-[#505050] hover:text-black transition-colors no-underline">Dashboard</Link>
            </div>
          </div>

          <div>
            <div className="font-schibsted text-sm font-semibold mb-4 text-black">Account</div>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/login" className="text-[#505050] hover:text-black transition-colors no-underline">Sign In</Link>
              <Link href="/register" className="text-[#505050] hover:text-black transition-colors no-underline">Create Account</Link>
            </div>
          </div>

          <div>
            <div className="font-schibsted text-sm font-semibold mb-4 text-black">Resources</div>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="#community" className="text-[#505050] hover:text-black transition-colors no-underline">Community</Link>
              <Link href="#docs" className="text-[#505050] hover:text-black transition-colors no-underline">Documentation</Link>
              <Link href="#api" className="text-[#505050] hover:text-black transition-colors no-underline">API Reference</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1200px] mx-auto px-8 md:px-[120px] py-6 border-t border-black/[0.06] flex flex-col sm:flex-row justify-between items-center gap-3 text-[13px] text-[#888888]">
        <div>© 2026 ShortX Inc. All rights reserved.</div>
        <div className="flex gap-5">
          <span className="cursor-pointer hover:text-black transition-colors">Privacy Policy</span>
          <span className="cursor-pointer hover:text-black transition-colors">Terms of Service</span>
          <span className="cursor-pointer hover:text-black transition-colors">Security</span>
        </div>
      </div>
    </footer>
  );
}
