'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/lib/commerce/types';
import { commerce } from '@/lib/commerce';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Button } from '@/components/ui/Button';

export const SearchClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      router.replace(`/search?q=${encodeURIComponent(val)}`, { scroll: false });
    } else {
      router.replace('/search', { scroll: false });
    }
  };

  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24 text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search Input Box */}
        <div className="max-w-2xl mx-auto text-center space-y-6 mb-16">
          <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block">
            Catalogue Search
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ink">
            Find Your Leather Essential
          </h1>

          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search executive briefcases, wallets, belts, duffels..."
              className="w-full bg-ivory-subtle border border-ink/20 focus:border-cognac px-6 py-4 pr-12 text-base md:text-lg font-serif outline-none transition-colors shadow-sm"
              autoFocus
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted">
              <AnimatedIcon type="search" size={20} />
            </div>
          </div>
        </div>

        {/* Results Area */}
        {loading ? (
          <div className="text-center py-20 text-ink-muted font-sans uppercase tracking-widest text-xs">
            Searching genuine leather goods...
          </div>
        ) : !query.trim() ? (
          /* Empty / Zero Query Suggested Collections */
          <div className="max-w-4xl mx-auto text-center space-y-8 py-8">
            <span className="text-xs uppercase tracking-kicker text-ink-muted font-sans">
              Suggested Categories
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { title: 'Executive Bags', handle: 'business-work-bags' },
                { title: 'Travel Duffels', handle: 'bags' },
                { title: 'Wallets & Sets', handle: 'wallets' },
                { title: 'English Belts', handle: 'belts' },
              ].map(item => (
                <Link
                  key={item.handle}
                  href={`/collections/${item.handle}`}
                  className="p-6 bg-ivory-subtle border border-ink/10 hover:border-cognac hover:bg-ivory transition-all group"
                >
                  <p className="font-serif text-lg text-ink group-hover:text-cognac transition-colors">
                    {item.title}
                  </p>
                  <span className="text-[10px] uppercase tracking-kicker text-ink-muted mt-1 block">
                    Explore →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          /* No Matches State */
          <div className="text-center py-16 space-y-4">
            <p className="font-serif text-3xl text-ink">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-sm text-ink-muted max-w-sm mx-auto font-sans">
              We couldn&apos;t find any pieces matching your search. Please check the spelling or explore our popular categories.
            </p>
            <div className="pt-2">
              <Button href="/collections/all" variant="primary" size="md">
                Browse Complete Catalogue
              </Button>
            </div>
          </div>
        ) : (
          /* Results Grid */
          <div>
            <div className="flex justify-between items-center text-xs uppercase tracking-kicker text-ink-muted mb-8 pb-4 border-b border-ink/10">
              <span>{results.length} Pieces Found</span>
              <span>Showing results for &ldquo;{query}&rdquo;</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {results.map(product => {
                const inWishlist = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    className="group bg-ivory-subtle border border-ink/10 flex flex-col justify-between overflow-hidden"
                  >
                    <div className="relative aspect-[4/5] w-full bg-ivory overflow-hidden">
                      <Link href={`/products/${product.handle}`} className="block w-full h-full">
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-luxury"
                        />
                      </Link>

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-3 right-3 p-2 bg-ivory/80 backdrop-blur-sm rounded-full text-ink hover:text-cognac transition-colors border border-ink/10 cursor-pointer z-10"
                        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <AnimatedIcon type="heart" size={16} isActive={inWishlist} />
                      </button>

                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <Button
                          onClick={() =>
                            addItem({
                              productId: product.id,
                              title: product.title,
                              handle: product.handle,
                              price: product.price,
                              image: product.images[0],
                            })
                          }
                          variant="primary"
                          size="sm"
                          className="w-full shadow-lg"
                          icon="plus"
                        >
                          Quick Add · £{product.price.toFixed(2)}
                        </Button>
                      </div>
                    </div>

                    <div className="p-5 space-y-1">
                      <span className="text-[10px] uppercase tracking-kicker text-cognac font-sans font-medium">
                        {product.category}
                      </span>
                      <Link
                        href={`/products/${product.handle}`}
                        className="font-serif text-lg font-normal text-ink hover:text-cognac transition-colors line-clamp-1 block"
                      >
                        {product.title}
                      </Link>
                      <div className="flex items-center justify-between pt-1 border-t border-ink/10 font-sans">
                        <span className="text-sm font-semibold text-ink">
                          £{product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
