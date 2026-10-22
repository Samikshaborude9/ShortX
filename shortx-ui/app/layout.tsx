import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Logoipsum - Transform Data Quickly with AI & Link Intelligence',
  description: 'Upload your information and get powerful insights right away. Work smarter and achieve goals effortlessly.',
  keywords: 'data analytics, AI insights, URL shortener, link tracking, GPT-4o integration',
  openGraph: {
    title: 'Logoipsum - Transform Data Quickly',
    description: 'Upload your information and get powerful insights right away.',
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
