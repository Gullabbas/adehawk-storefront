'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useUIStore } from '@/store/useUIStore';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const COLLECTIONS_TILES = [
  {
    title: 'Travel & Duffel Bags',
    handle: 'bags',
    count: '14 Pieces',
    image: '/assets/products/cowhide-leather-duffle-bag.webp',
    kicker: 'Weekenders & Adventure',
  },
  {
    title: 'Executive Bags',
    handle: 'business-work-bags',
    count: '6 Pieces',
    image: '/assets/products/black-leather-executive-briefcase.jpg',
    kicker: 'Boardroom & Travel',
  },
  {
    title: 'Signature Wallets',
    handle: 'wallets',
    count: '11 Gift Sets',
    image: '/assets/products/ultra-slim-red-leather-long-wallet-and-keychain-gift-set.webp',
    kicker: 'Pocket & Long Formats',
  },
  {
    title: 'English Bridle Belts',
    handle: 'belts',
    count: '2 Colours',
    image: '/assets/products/classic-black-leather-belt.webp',
    kicker: 'Solid 4mm Hide',
  },
];

export const ShopByCollection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { setCursor } = useUIStore();

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || !pinContainerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth >= 1024;

    if (prefersReducedMotion || !isDesktop) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const totalScroll = track.scrollWidth - window.innerWidth + 120;

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: pinContainerRef.current,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-ivory text-ink py-20 lg:py-0 overflow-hidden">
      {/* Desktop Pinned Horizontal Container */}
      <div ref={pinContainerRef} className="lg:h-[100vh] lg:flex lg:flex-col lg:justify-center">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 lg:mb-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block mb-2">
              Curated Categories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light">
              Shop by Collection
            </h2>
          </div>
          <Link
            href="/collections/all"
            className="text-xs uppercase tracking-kicker font-sans text-ink-muted hover:text-cognac transition-colors flex items-center gap-2"
          >
            <span>Explore All 27 Pieces</span>
            <span>→</span>
          </Link>
        </div>

        {/* Cards Track: Horizontal on desktop, grid on mobile */}
        <div className="lg:overflow-visible">
          <div
            ref={trackRef}
            className="px-4 sm:px-6 lg:px-8 flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row gap-6 sm:gap-8 will-change-transform max-w-7xl mx-auto lg:max-w-none"
          >
            {COLLECTIONS_TILES.map((col, idx) => (
              <Link
                key={col.handle}
                href={`/collections/${col.handle}`}
                onMouseEnter={() => setCursor('view', 'View')}
                onMouseLeave={() => setCursor('default')}
                className="group relative flex-shrink-0 w-full lg:w-[420px] aspect-[4/5] bg-ivory-subtle overflow-hidden border border-ink/10 flex flex-col justify-end p-8"
              >
                {/* Background Image with Hover Scale */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-luxury"
                  />
                  {/* Subtle Gradient Overlay for Text Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                {/* Card Content */}
                <div className="relative z-10 text-ivory space-y-2">
                  <div className="flex justify-between items-center text-xs uppercase tracking-kicker font-sans text-ivory/80">
                    <span>{col.kicker}</span>
                    <span className="text-[11px] bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm border border-ivory/20">
                      {col.count}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light group-hover:text-ivory transition-colors">
                    {col.title}
                  </h3>
                  <div className="pt-2 flex items-center gap-2 text-xs uppercase tracking-kicker font-medium text-ivory/90 group-hover:translate-x-1 transition-transform duration-300">
                    <span>View Collection</span>
                    <span>→</span>
                  </div>
                </div>

                {/* Index Pill */}
                <div className="absolute top-6 right-6 font-mono text-xs text-ivory/50">
                  0{idx + 1}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
