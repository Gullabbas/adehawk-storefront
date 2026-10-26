'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/Button';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const BODY_TEXT =
  'Every piece begins with the character of genuine leather and ends with a story of its own. Designed with timeless silhouettes, refined details, and everyday purpose, our leather goods are made to travel with you—and age beautifully along the way.';

export const CraftedForTheJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      wordsRef.current.forEach(w => {
        if (w) w.style.opacity = '1';
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Word-by-word opacity scrub
      gsap.fromTo(
        wordsRef.current,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'center 45%',
            scrub: 0.8,
          },
        }
      );

      // Dual parallax on images
      if (img1Ref.current && img2Ref.current) {
        gsap.to(img1Ref.current, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });

        gsap.to(img2Ref.current, {
          y: -120,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.8,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const words = BODY_TEXT.split(' ');

  return (
    <section
      ref={containerRef}
      className="relative bg-ivory py-24 sm:py-36 overflow-hidden border-b border-ink/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-7 space-y-8">
            <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block">
              The Art of Leather · Crafted for the Journey
            </span>

            {/* Word by word scrubbed typography */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-ink leading-[1.18] tracking-tight">
              {words.map((word, i) => (
                <span
                  key={i}
                  ref={el => {
                    if (el) wordsRef.current[i] = el;
                  }}
                  className="inline-block mr-2.5 transition-colors duration-100"
                >
                  {word}
                </span>
              ))}
            </h2>

            <div className="pt-4">
              <Button
                href="/collections/bags"
                variant="primary"
                size="lg"
                magnetic
                icon="arrow-right"
              >
                Discover the Collection
              </Button>
            </div>
          </div>

          {/* Right Column: Dual Parallax Product Visuals */}
          <div className="lg:col-span-5 relative min-h-[460px] sm:min-h-[580px] flex items-center justify-center">
            {/* Image 1: Crafted For The Journey Editorial Square */}
            <div
              ref={img1Ref}
              className="absolute left-0 top-6 w-[65%] aspect-square bg-ivory-subtle shadow-xl border border-ink/10 overflow-hidden z-10"
            >
              <Image
                src="/assets/products/crafted-for-the-journey.webp"
                alt="Crafted for the Journey"
                fill
                sizes="(max-width: 1024px) 70vw, 380px"
                className="object-cover"
              />
            </div>

            {/* Image 2: Cowhide Duffel Bag Portrait */}
            <div
              ref={img2Ref}
              className="absolute right-0 bottom-4 w-[60%] aspect-[4/5] bg-ivory-subtle shadow-2xl border border-ink/10 overflow-hidden z-20"
            >
              <Image
                src="/assets/products/cowhide-leather-duffle-bag.webp"
                alt="Handmade Cowhide Travel Duffle Bag"
                fill
                sizes="(max-width: 1024px) 60vw, 340px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
