'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/Button';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CRAFT_IMAGES = [
  {
    src: '/assets/products/dark-brown-leather-executive-briefcase.webp',
    caption: 'Full-Grain Pull-Up Leather',
    detail: 'Develops rich patina and amber tones with every journey.',
  },
  {
    src: '/assets/products/classic-brown-leather-belt.webp',
    caption: 'Solid 4mm English Bridle',
    detail: 'Hand-beveled and burnished with natural organic beeswax.',
  },
];

export const TheCraft: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          if (self.progress > 0.5) {
            setActiveImageIdx(1);
          } else {
            setActiveImageIdx(0);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100svh] bg-espresso text-ivory flex flex-col justify-center py-20 lg:py-0 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Craft Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block">
              The Craft · Built to Endure
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-ivory tracking-tight leading-[1.08]">
              CRAFTED WITH CHARACTER
            </h2>
            <p className="text-base sm:text-lg text-ivory/80 leading-relaxed font-sans max-w-xl">
              Every detail matters — from the natural grain of the leather to the
              final stitch. Our pieces are shaped with purpose, refined by hand,
              and designed to develop a character that becomes uniquely yours over
              time.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Button
                href="/collections/all"
                variant="dark"
                size="lg"
                magnetic
                icon="arrow-right"
              >
                Explore Craftsmanship
              </Button>
              <div className="text-xs uppercase tracking-kicker text-ivory/60 font-sans">
                British Workshop · Guaranteed Quality
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Stage Showcase */}
          <div className="lg:col-span-6 relative aspect-[4/5] max-w-md mx-auto w-full bg-espresso-surface border border-ivory/15 shadow-2xl overflow-hidden">
            {CRAFT_IMAGES.map((item, idx) => (
              <div
                key={item.src}
                className={`absolute inset-0 transition-opacity duration-700 ease-luxury ${
                  idx === activeImageIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
                {/* Bottom Caption Pill */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-espresso/80 backdrop-blur-md border border-ivory/15 text-ivory space-y-1">
                  <p className="text-xs uppercase tracking-kicker font-sans font-semibold text-cognac">
                    {item.caption}
                  </p>
                  <p className="text-xs text-ivory/80 font-sans">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
