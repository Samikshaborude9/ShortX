import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShortX – Intelligent URL Shortener with Real-Time Analytics',
  description:
    'ShortX is a blazing-fast URL shortener with custom aliases, click analytics, geo tracking, and Redis-powered redirects.',
  keywords: 'URL shortener, link shortener, custom alias, analytics, click tracking, geo analytics, ShortX',
  openGraph: {
    title: 'ShortX – Intelligent URL Shortener',
    description: 'Shorten, brand, and track your links with real-time analytics.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fustat:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&family=Schibsted+Grotesk:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
