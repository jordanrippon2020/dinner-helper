import type { Metadata } from 'next';
import { Fraunces, Outfit, Space_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '600', '700'],
  variable: '--font-display',
  display: 'swap'
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap'
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Nourish — Smart Dinner Decisions',
  description: 'Your intelligent evening meal companion — personalized dinner ideas powered by AI',
  keywords: 'dinner recipes, meal planning, AI recipes, healthy dinner, quick meals, personalized nutrition',
  authors: [{ name: 'Nourish Team' }],
  openGraph: {
    title: 'Nourish — Smart Dinner Decisions',
    description: 'Your intelligent evening meal companion — personalized dinner ideas powered by AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nourish — Smart Dinner Decisions',
    description: 'Your intelligent evening meal companion — personalized dinner ideas powered by AI',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1a3a2e'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}