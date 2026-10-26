'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/Button';
import { GlassPanel } from '@/components/ui/GlassPanel';
import productsData from '@/data/products.json';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CollectionItem {
  id: string;
  title: string;
  handle: string;
  image: string;
  subtitle: string;
}

export const CollectionShowcase3D: React.FC = () => {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [isHoveringActive, setIsHoveringActive] = useState(false);
  const [isTransitioningRoute, setIsTransitioningRoute] = useState(false);

  // Compute live counts from data/products.json
  const collections: (CollectionItem & { count: number })[] = useMemo(() => {
    const raw = productsData as Array<{ collectionHandles: string[] }>;
    return [
      {
        id: 'bags',
        title: 'Bags',
        handle: 'bags',
        image: '/assets/products/cowhide-leather-duffle-bag.webp',
        subtitle: 'Travel & Weekender',
        count: 14,
      },
      {
        id: 'business-work-bags',
        title: 'Executive Bags',
        handle: 'business-work-bags',
        image: '/assets/products/black-leather-executive-briefcase.jpg',
        subtitle: 'Briefcases & Sleeves',
        count: 6,
      },
      {
        id: 'wallets',
        title: 'Wallets',
        handle: 'wallets',
        image: '/assets/products/ultra-slim-red-leather-long-wallet-and-keychain-gift-set.webp',
        subtitle: 'Long & Pocket Sets',
        count: 28,
      },
      {
        id: 'belts',
        title: 'Belts',
        handle: 'belts',
        image: '/assets/products/classic-black-leather-belt.webp',
        subtitle: 'Hand-Finished Leather',
        count: 2,
      },
      {
        id: 'keychains',
        title: 'Keychains',
        handle: 'keychains',
        image: '/assets/products/brown-leather-wallet-and-keychain-gift-set.webp',
        subtitle: 'Artisan Key Loops',
        count: raw.filter(p => p.collectionHandles.includes('keychains')).length || 11,
      },
    ];
  }, []);

  const total = collections.length;

  // Pin section for 300vh and drive rotation
  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth >= 768;

    if (prefersReducedMotion || !isDesktop) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=280%',
        pin: true,
        scrub: 1.2,
        onUpdate: (self) => {
          const progress = self.progress;
          const targetIdx = Math.min(total - 1, Math.floor(progress * total));
          setActiveIndex(targetIdx);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [total]);

  // Pointer tilt physics
  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return;
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 14;
    const y = (clientY / window.innerHeight - 0.5) * -14;
    setMouseTilt({ x, y });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) return;
      if (e.key === 'ArrowRight') {
        setActiveIndex(prev => (prev + 1) % total);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => (prev - 1 + total) % total);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  const activeCol = collections[activeIndex];

  // Click card to dolly in and route
  const handleCardClick = (idx: number, handle: string) => {
    if (idx !== activeIndex) {
      setActiveIndex(idx);
      return;
    }
    setIsTransitioningRoute(true);
    setTimeout(() => {
      router.push(`/collections/${handle}`);
    }, 600);
  };

  return (
    <section
      id="collection-section"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[100svh] bg-espresso text-ivory flex flex-col justify-between py-16 sm:py-24 overflow-hidden select-none"
    >
      {/* Film Grain on Dark Surface */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] bg-repeat z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Kinetic Background Title */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <span
          key={activeCol.title}
          className="font-serif text-[clamp(4.5rem,18vw,20rem)] font-light leading-none text-ivory/[0.04] tracking-tight uppercase transition-all duration-700 ease-luxury transform will-change-transform"
          style={{
            transform: `translate3d(${mouseTilt.x * -2}px, ${mouseTilt.y * -2}px, 0)`,
          }}
        >
          {activeCol.title}
        </span>
      </div>

      {/* Top Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-end">
        <div>
          <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block mb-1">
            Flagship Showcase
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-ivory">
            Curated Collections
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {collections.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                i === activeIndex ? 'w-8 bg-cognac' : 'w-2 bg-ivory/20 hover:bg-ivory/50'
              }`}
              aria-label={`Jump to collection ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 3D Curved Arc Stage Container */}
      <div
        ref={stageRef}
        className="relative z-10 w-full flex-1 flex items-center justify-center py-6 sm:py-10"
        style={{ perspective: '1200px' }}
      >
        <div
          className="relative w-full max-w-4xl h-[380px] sm:h-[460px] md:h-[520px] flex items-center justify-center will-change-transform transition-transform duration-500 ease-out"
          style={{
            transform: `rotateY(${mouseTilt.x * 0.4}deg) rotateX(${mouseTilt.y * 0.4}deg) ${
              isHoveringActive ? 'scale(1.03)' : 'scale(1)'
            } ${isTransitioningRoute ? 'scale(1.8) opacity-0' : ''}`,
            transformStyle: 'preserve-3d',
          }}
        >
          {collections.map((col, idx) => {
            const offset = idx - activeIndex;
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            // Compute 3D coverflow arc coordinates
            const rotateY = offset * -36; // rotate on Y
            const translateX = offset * 220; // spread apart
            const translateZ = -Math.abs(offset) * 160 + (isActive ? 80 : 0); // recede in Z
            const scale = isActive ? 1.05 : 0.82;
            const opacity = isActive ? 1.0 : Math.max(0.45, 1 - Math.abs(offset) * 0.3);

            return (
              <div
                key={col.id}
                onClick={() => handleCardClick(idx, col.handle)}
                onMouseEnter={() => isActive && setIsHoveringActive(true)}
                onMouseLeave={() => isActive && setIsHoveringActive(false)}
                className={`absolute w-[240px] sm:w-[300px] md:w-[340px] aspect-[4/5] rounded-[24px] overflow-hidden border transition-all duration-700 ease-luxury cursor-pointer shadow-2xl ${
                  isActive
                    ? 'border-ivory/30 shadow-[0_25px_60px_rgba(0,0,0,0.65)] ring-1 ring-ivory/20'
                    : 'border-ivory/10 shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:border-ivory/25'
                }`}
                style={{
                  transform: `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex: 20 - Math.abs(offset),
                }}
              >
                {/* Product Image: Rendered Color-True Without Filters */}
                <div className="relative w-full h-full bg-ivory-subtle">
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 340px"
                    className="object-cover"
                  />
                  {/* Subtle legibility gradient at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Card Meta Content */}
                <div className="absolute bottom-6 left-6 right-6 text-ivory space-y-1 z-10 pointer-events-none">
                  <span className="text-[10px] uppercase tracking-kicker text-cognac font-sans font-medium block">
                    {col.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl font-light leading-snug">
                    {col.title}
                  </h3>
                  <div className="flex justify-between items-center text-xs text-ivory/80 pt-1">
                    <span className="font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded-full border border-ivory/15">
                      {col.count} Pieces
                    </span>
                    <span className="uppercase tracking-widest text-[10px] text-ivory/70">
                      {isActive ? 'Click to View →' : 'Rotate'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Glass Info Chip & Magnetic CTA */}
      <div className="relative z-20 max-w-xl mx-auto px-4 w-full flex justify-center">
        <GlassPanel
          variant="dark"
          rounded="full"
          className="px-6 sm:px-8 py-3.5 flex items-center justify-between gap-6 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cognac animate-pulse" />
            <span className="font-serif text-lg text-ivory font-normal">
              {activeCol.title}
            </span>
            <span className="text-xs font-mono text-ivory/60 border-l border-ivory/15 pl-3">
              {activeCol.count} Pieces
            </span>
          </div>

          <Button
            href={`/collections/${activeCol.handle}`}
            variant="dark"
            size="sm"
            magnetic
            icon="arrow-right"
          >
            View Collection
          </Button>
        </GlassPanel>
      </div>

      {/* Hidden SEO & Accessibility DOM Links */}
      <nav aria-label="Collections list" className="sr-only">
        <ul>
          {collections.map(c => (
            <li key={c.id}>
              <Link href={`/collections/${c.handle}`}>
                {c.title} — {c.count} items
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};
