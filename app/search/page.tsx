import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { SearchClient } from '@/components/search/SearchClient';

export const metadata: Metadata = {
  title: 'Search | ADEHAWK LEATHER GOODS',
  description: 'Search our catalogue of pure handmade British leather goods.',
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory flex items-center justify-center font-sans text-xs uppercase tracking-kicker text-ink-muted">
          Loading Search...
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
