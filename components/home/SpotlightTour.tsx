'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { useCartStore } from '@/store/useCartStore';

gsap.registerPlugin(ScrollTrigger);

interface TourStop {
  id: string;
  number: string;
  title: string;
  color: string;
  price: number;
  handle: string;
  image: string;
  // Normalized coordinates in the lifestyle image (%)
  x: number;
  y: number;
  scale: number;
}

const TOUR_STOPS: TourStop[] = [
  {
    id: 'spot-1',
    number: '01',
    title: 'Dark Brown Executive Briefcase',
    color: 'Dark Brown Cowhide',
    price: 90,
    handle: 'dark-brown-leather-executive-briefcase',
    image: '/assets/products/dark-brown-leather-executive-briefcase.webp',
    x: 39,
    y: 57,
    scale: 1.08,
  },
  {
    id: 'spot-2',
    number: '02',
    title: 'Premium Brown Executive Briefcase',
    color: 'Rich Brown Antique Finish',
    price: 110,
    handle: 'premium-brown-leather-executive-briefcase',
    image: '/assets/products/premium-brown-leather-executive-briefcase.webp',
    x: 39.5,
    y: 29,
    scale: 1.08,
  },
  {
    id: 'spot-3',
    number: '03',
    title: 'Premium Black Executive Briefcase',
    color: 'Sleek Obsidian Grain',
    price: 110,
    handle: 'premium-black-leather-executive-briefcase',
    image: '/assets/products/premium-black-leather-executive-briefcase.webp',
    x: 62,
    y: 31,
    scale: 1.08,
  },
  {
    id: 'spot-4',
    number: '04',
    title: 'Black Executive Briefcase',
    color: 'Classic Black Cowhide',
    price: 90,
    handle: 'black-leather-executive-briefcase',
    image: '/assets/products/black-leather-executive-briefcase.jpg',
    x: 63.5,
    y: 57,
    scale: 1.08,
  },
  {
    id: 'spot-5',
    number: '05',
    title: 'Taupe Grey Laptop Sleeve Bag',
    color: 'Minimalist Taupe Grey',
    price: 80,
    handle: 'taupe-grey-leather-laptop-sleeve-bag',
    image: '/assets/products/taupe-grey-leather-laptop-sleeve-bag.webp',
    x: 52,
    y: 76,
    scale: 1.08,
  },
];

export const SpotlightTour: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isOverview, setIsOverview] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    if (isReducedMotion || !containerRef.current || !cameraRef.current) return;

    const ctx = gsap.context(() => {
      const stopsCount = TOUR_STOPS.length; // 5
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=340%',
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            // 0.00 to 0.85 covers stops 0 to 4; 0.85 to 1.00 is final overview
            if (progress >= 0.88) {
              setIsOverview(true);
            } else {
              setIsOverview(false);
              const stepIndex = Math.min(
                stopsCount - 1,
                Math.max(0, Math.floor((progress / 0.88) * stopsCount))
              );
              setActiveStep(stepIndex);
            }
          },
        },
      });

      // Choreograph smooth camera glide between stops
      TOUR_STOPS.forEach((stop, i) => {
        const nextStop = TOUR_STOPS[i + 1];

        // Origin centering: transform-origin or translate
        const originX = `${stop.x}%`;
        const originY = `${stop.y}%`;

        if (i === 0) {
          tl.set(cameraRef.current, {
            scale: stop.scale,
            transformOrigin: `${originX} ${originY}`,
          });
        } else {
          tl.to(
            cameraRef.current,
            {
              scale: stop.scale,
              transformOrigin: `${originX} ${originY}`,
              duration: 1,
              ease: 'power2.inOut',
            },
            `step-${i}`
          );
        }
      });

      // Final step: camera smoothly zooms out to full overview (1.0x scale centered)
      tl.to(
        cameraRef.current,
        {
          scale: 1.0,
          transformOrigin: '50% 50%',
          duration: 1.2,
          ease: 'power2.inOut',
        },
        'overview'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  const jumpToStop = (index: number) => {
    if (!containerRef.current) return;
    const trigger = ScrollTrigger.getById('spotlight-tour-trigger') || ScrollTrigger.getAll().find(
      st => st.trigger === containerRef.current
    );

    if (trigger) {
      const targetProgress = (index / TOUR_STOPS.length) * 0.84;
      const targetScroll = trigger.start + targetProgress * (trigger.end - trigger.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      setActiveStep(index);
      setIsOverview(false);
    }
  };

  const handleQuickAdd = (stop: TourStop) => {
    addItem({
      productId: stop.id,
      title: stop.title,
      handle: stop.handle,
      price: stop.price,
      image: stop.image,
    });
    openCart();
  };

  const currentStop = TOUR_STOPS[activeStep] || TOUR_STOPS[0];

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0 && activeStep < TOUR_STOPS.length - 1) {
        jumpToStop(activeStep + 1);
      } else if (deltaX > 0 && activeStep > 0) {
        jumpToStop(activeStep - 1);
      }
    }
    touchStartX.current = null;
  };

  // Reduced motion fallback: Clean editorial grid
  if (isReducedMotion) {
    return (
      <section className="bg-espresso text-ivory py-24 px-4 sm:px-6 lg:px-8 border-t border-ivory/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-cognac font-sans font-semibold">
              The Executive Lookbook
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory mt-2">
              Shop the Collection
            </h2>
          </div>

          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-12 border border-ivory/10">
            <Image
              src="/assets/products/shop-the-look-bags.webp"
              alt="Adehawk Executive Bags Collection"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOUR_STOPS.map((stop) => (
              <div
                key={stop.id}
                className="p-5 rounded-2xl bg-ivory/5 border border-ivory/10 flex gap-4 items-center"
              >
                <div className="relative w-20 h-24 bg-ivory/10 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={stop.image}
                    alt={stop.title}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-cognac block">
                    {stop.color}
                  </span>
                  <h4 className="font-serif text-sm font-medium text-ivory line-clamp-1">
                    {stop.title}
                  </h4>
                  <span className="font-sans text-xs font-semibold text-ivory block mt-1">
                    £{stop.price}.00
                  </span>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleQuickAdd(stop)}
                      className="px-3 py-1 bg-cognac text-ivory text-[10px] uppercase tracking-wider font-sans font-medium rounded hover:bg-cognac-light transition-colors"
                    >
                      Quick Add
                    </button>
                    <Link
                      href={`/products/${stop.handle}`}
                      className="px-3 py-1 border border-ivory/20 text-ivory text-[10px] uppercase tracking-wider font-sans rounded hover:border-ivory transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="lookbook-section"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-screen bg-espresso text-ivory overflow-hidden select-none rounded-t-[32px] border-t border-ivory/15 shadow-[0_-25px_60px_rgba(0,0,0,0.35)]"
    >
      {/* Viewport Frame with Camera Zoom */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div
          ref={cameraRef}
          className="relative w-full h-full will-change-transform transition-all"
        >
          {/* Lifestyle Image (Uncompressed authentic resolution preserved) */}
          <Image
            src="/assets/products/shop-the-look-bags.webp"
            alt="Adehawk Executive Leather Goods Collection"
            fill
            priority
            quality={95}
            unoptimized={true}
            sizes="100vw"
            className="object-cover"
          />

          {/* Soft Subtle Radial Spotlight Vignette (Keeps products bright & high-contrast) */}
          <div
            ref={vignetteRef}
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out ${
              isOverview ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              background: `radial-gradient(circle 380px at ${currentStop.x}% ${currentStop.y}%, rgba(0,0,0,0) 0%, rgba(18, 16, 14, 0.28) 100%)`,
            }}
          />

          {/* Pulsing Target Marker on Active Product */}
          {!isOverview && (
            <div
              ref={markerRef}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 ease-out"
              style={{ left: `${currentStop.x}%`, top: `${currentStop.y}%` }}
            >
              <div className="relative w-12 h-12 flex items-center justify-center">
                {/* Radar Pulse Rings */}
                <span className="absolute inset-0 rounded-full border-2 border-cognac/80 animate-ping opacity-75" />
                <span className="absolute inset-2 rounded-full border border-ivory/90 animate-pulse" />
                <span className="w-3.5 h-3.5 rounded-full bg-cognac shadow-[0_0_15px_#A2582A]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Floating Kicker */}
      <div className="absolute top-8 left-6 sm:left-12 z-30 pointer-events-none">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-cognac font-sans font-semibold block mb-1">
          Interactive Guided Tour · Scroll to Explore
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-ivory tracking-tight">
          The Executive Lookbook
        </h2>
      </div>

      {/* Right Edge: Vertical Tour Jump List (Desktop) */}
      <div className="hidden lg:flex flex-col gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-2xl bg-espresso/60 backdrop-blur-xl border border-ivory/10 shadow-2xl">
        <span className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans font-semibold mb-1">
          5 Signature Stops
        </span>
        {TOUR_STOPS.map((stop, idx) => {
          const isActive = idx === activeStep && !isOverview;
          return (
            <button
              key={stop.id}
              onClick={() => jumpToStop(idx)}
              className="group flex items-center gap-3 text-left transition-all py-1 cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-sans font-semibold transition-all ${
                  isActive
                    ? 'bg-cognac text-ivory scale-110 shadow-md'
                    : 'bg-ivory/10 text-ivory/60 group-hover:bg-ivory/20 group-hover:text-ivory'
                }`}
              >
                {stop.number}
              </div>
              <span
                className={`text-xs font-serif transition-colors max-w-[150px] truncate ${
                  isActive
                    ? 'text-ivory font-medium'
                    : 'text-ivory/50 group-hover:text-ivory/80'
                }`}
              >
                {stop.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Liquid-Glass Product Card (Bottom Left Desktop / Bottom Sheet Mobile) */}
      <AnimatePresence mode="wait">
        {!isOverview ? (
          <motion.div
            key={currentStop.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-6 left-4 right-4 sm:left-12 sm:right-auto sm:w-[420px] sm:min-w-[360px] z-30"
          >
            <div
              className="p-5 sm:p-6 rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
              style={{
                background: 'rgba(18, 16, 14, 0.78)',
                backdropFilter: 'blur(24px) saturate(140%)',
                WebkitBackdropFilter: 'blur(24px) saturate(140%)',
                boxShadow: '0 24px 50px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex gap-4 sm:gap-5 items-center">
                {/* Catalog Product Image (Crystal-Clear High-Resolution Product Asset) */}
                <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-xl bg-ivory/10 border border-ivory/15 shrink-0 overflow-hidden flex items-center justify-center p-1.5 shadow-inner">
                  <Image
                    src={currentStop.image}
                    alt={currentStop.title}
                    fill
                    unoptimized={true}
                    sizes="140px"
                    className="object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-cognac font-sans font-semibold">
                      Stop {currentStop.number} of 05
                    </span>
                    <span className="font-sans text-xs font-medium text-ivory/60">
                      {currentStop.color}
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-medium text-ivory leading-tight mt-1 line-clamp-1">
                    {currentStop.title}
                  </h3>

                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xs text-ivory/60 font-sans">GBP</span>
                    <span className="font-sans text-lg sm:text-xl font-bold text-ivory">
                      £{currentStop.price}.00
                    </span>
                  </div>

                  {/* CTAs */}
                  <div className="flex gap-2.5 mt-3 pt-1">
                    <button
                      onClick={() => handleQuickAdd(currentStop)}
                      className="flex-1 py-2 px-3 bg-cognac text-ivory text-[10px] uppercase tracking-wider font-sans font-semibold hover:bg-cognac-light active:scale-95 transition-all rounded shadow-md cursor-pointer text-center"
                    >
                      Add to Bag
                    </button>
                    <Link
                      href={`/products/${currentStop.handle}`}
                      className="py-2 px-4 border border-ivory/30 text-ivory text-[10px] uppercase tracking-wider font-sans font-medium hover:border-ivory hover:bg-ivory/10 transition-colors rounded text-center"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mobile Swipe Cue */}
              <div className="mt-3 pt-2 border-t border-ivory/10 flex items-center justify-between text-[10px] text-ivory/50 font-sans lg:hidden">
                <span>Swipe left / right to change product</span>
                <span>{activeStep + 1} / 5</span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Step 6: Full Overview Card with CTA */
          <motion.div
            key="overview-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center p-4 z-30 pointer-events-none"
          >
            <div
              className="pointer-events-auto p-8 sm:p-10 rounded-3xl border border-white/20 text-center max-w-lg shadow-2xl"
              style={{
                background: 'rgba(18, 16, 14, 0.85)',
                backdropFilter: 'blur(28px) saturate(140%)',
                WebkitBackdropFilter: 'blur(28px) saturate(140%)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.25)',
              }}
            >
              <span className="text-xs uppercase tracking-widest text-cognac font-sans font-semibold block mb-2">
                Pure Handmade Leather Products
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-ivory font-light mb-3">
                The Executive Line
              </h3>
              <p className="text-sm text-ivory/70 font-sans mb-8 leading-relaxed">
                Distinctive briefcases and laptop companions crafted from genuine full-grain leather, built to accompany every business milestone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/collections/bags"
                  className="px-8 py-3.5 bg-cognac text-ivory text-xs uppercase tracking-widest font-sans font-medium hover:bg-cognac-light transition-all rounded shadow-lg text-center"
                >
                  View All Bags
                </Link>
                <button
                  onClick={() => jumpToStop(0)}
                  className="px-6 py-3.5 border border-ivory/20 text-ivory text-xs uppercase tracking-widest font-sans font-medium hover:border-ivory hover:bg-ivory/5 transition-all rounded text-center cursor-pointer"
                >
                  Restart Tour
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
