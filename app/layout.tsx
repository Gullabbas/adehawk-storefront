import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Preloader } from '@/components/ui/Preloader';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://adehawk.com'),
  title: {
    default: 'ADEHAWK | Pure Handmade Leather Goods',
    template: '%s | ADEHAWK LEATHER GOODS',
  },
  description:
    'Artisanal handmade leather goods crafted in Great Britain. Executive briefcases, travel duffels, ultra-slim wallets, and solid English bridle belts.',
  keywords: [
    'Handmade leather goods',
    'Leather briefcases UK',
    'Executive leather bag',
    'Handcrafted leather wallet',
    'English bridle leather belt',
    'Luxury weekender duffle bag',
  ],
  authors: [{ name: 'ADEHAWK LEATHER GOODS' }],
  creator: 'ADEHAWK LEATHER GOODS',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://adehawk.com',
    siteName: 'ADEHAWK LEATHER GOODS',
    title: 'ADEHAWK | Pure Handmade Leather Goods',
    description:
      'Artisanal handmade leather goods crafted in Great Britain. Timeless by design, crafted for everyday, designed to last.',
    images: [
      {
        url: '/assets/products/collection.webp',
        width: 2000,
        height: 734,
        alt: 'ADEHAWK Leather Goods Flagship Collection',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ADEHAWK LEATHER GOODS',
  url: 'https://adehawk.com',
  logo: 'https://adehawk.com/assets/brand/logo.png',
  description: 'Pure Handmade Leather Products crafted in Great Britain.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'GB',
  },
  sameAs: [
    'https://www.facebook.com/profile.php?id=61594421692815',
    'https://www.instagram.com/adehawk.official?stkn=ODMzMDV1bnRrbGsz&utm_source=qr',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-sans antialiased selection:bg-cognac selection:text-ivory">
        <SmoothScrollProvider>
          <Preloader />
          <CustomCursor />
          <Header />
          <CartDrawer />
          <SearchOverlay />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
