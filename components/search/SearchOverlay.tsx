'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Product } from '@/lib/commerce/types';
import { commerce } from '@/lib/commerce';

const POPULAR_SEARCHES = ['Briefcase', 'Duffle Bag', 'Long Wallet', 'Belt', 'Backpack'];

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const hits = await commerce.search(query);
        setResults(hits);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[9995] flex flex-col">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-espresso/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Search Content Modal */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Instant Search"
            className="relative z-10 w-full max-w-4xl mx-auto mt-6 md:mt-16 bg-ivory text-ink rounded-none shadow-2xl overflow-hidden border border-ink/10 flex flex-col max-h-[85vh]"
          >
            {/* Input Row */}
            <div className="flex items-center px-6 py-5 border-b border-ink/10 gap-4">
              <AnimatedIcon type="search" size={24} className="text-ink-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search leather briefcases, wallets, belts, duffels..."
                className="flex-1 bg-transparent text-lg md:text-xl font-serif text-ink outline-none placeholder:text-ink-muted/60"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs uppercase tracking-kicker text-ink-muted hover:text-ink px-2 py-1"
                >
                  Clear
                </button>
              )}
              <button
                onClick={closeSearch}
                className="p-2 text-ink hover:text-cognac transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <AnimatedIcon type="close" size={22} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {!query.trim() ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-kicker text-ink-muted font-sans mb-3">
                      Popular Searches
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map(item => (
                        <button
                          key={item}
                          onClick={() => setQuery(item)}
                          className="px-4 py-2 text-xs font-sans uppercase tracking-widest bg-ivory-subtle border border-ink/10 hover:border-ink hover:bg-ivory transition-all cursor-pointer"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-kicker text-ink-muted font-sans mb-3">
                      Featured Collections
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { title: 'Executive Bags', href: '/collections/business-work-bags' },
                        { title: 'Signature Wallets', href: '/collections/wallets' },
                        { title: 'Belts', href: '/collections/belts' },
                        { title: 'Travel Duffels', href: '/collections/bags' },
                      ].map(col => (
                        <Link
                          key={col.title}
                          href={col.href}
                          onClick={closeSearch}
                          className="p-4 bg-ivory-subtle border border-ink/10 hover:border-cognac hover:bg-ivory transition-all text-center"
                        >
                          <span className="font-serif text-sm font-medium text-ink">
                            {col.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-16 text-sm text-ink-muted font-sans uppercase tracking-widest">
                  Searching authentic leather goods...
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <p className="font-serif text-2xl text-ink">No pieces found for &ldquo;{query}&rdquo;</p>
                  <p className="text-sm text-ink-muted max-w-sm mx-auto font-sans">
                    Try searching for &ldquo;Briefcase&rdquo;, &ldquo;Duffle&rdquo;, &ldquo;Wallet&rdquo; or &ldquo;Belt&rdquo;.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-ink-muted uppercase tracking-kicker">
                    <span>Results ({results.length})</span>
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      onClick={closeSearch}
                      className="text-cognac hover:underline"
                    >
                      View all in full search →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {results.slice(0, 6).map(prod => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.handle}`}
                        onClick={closeSearch}
                        className="group flex gap-4 p-3 bg-ivory-subtle border border-ink/5 hover:border-ink/20 transition-all"
                      >
                        <div className="relative w-16 h-20 bg-ivory shrink-0 overflow-hidden border border-ink/10">
                          <Image
                            src={prod.images[0]}
                            alt={prod.title}
                            fill
                            sizes="64px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="text-[10px] uppercase tracking-kicker text-cognac font-sans font-medium">
                            {prod.category}
                          </span>
                          <h4 className="font-serif text-sm font-medium text-ink group-hover:text-cognac transition-colors line-clamp-1">
                            {prod.title}
                          </h4>
                          <span className="font-sans text-xs font-semibold text-ink mt-1">
                            £{prod.price.toFixed(2)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
