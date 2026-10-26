'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroStage } from './HeroStage';
import { HERO_CONFIG } from './hero.config';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const slide1 = HERO_CONFIG.slides[0];

  useEffect(() => {
    if (!heroRef.current || !pinWrapperRef.current) return;

    // Honor reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth >= 768;

    if (prefersReducedMotion || !isDesktop) {
      return;
    }

    const ctx = gsap.context(() => {
      // ScrollTrigger pin & scale handoff
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1,
        pinSpacing: true,
        animation: gsap
          .timeline()
          .to(pinWrapperRef.current, {
            scale: 0.88,
            borderRadius: '32px',
            ease: 'none',
          }),
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero-section"
      ref={heroRef}
      className="relative w-full h-[100svh] bg-espresso overflow-hidden"
    >
      {/* Pinned Card Scale Wrapper */}
      <div
        ref={pinWrapperRef}
        className="relative w-full h-full overflow-hidden origin-center will-change-transform"
      >
        {/* LCP Server-Rendered Element: Slide 1 image with priority & high fetchPriority */}
        <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none">
          <Image
            src={slide1.desktopImage}
            alt={slide1.headline}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Client WebGL Interactive Stage Controller */}
        <div className="relative z-10 w-full h-full">
          <HeroStage />
        </div>
      </div>
    </section>
  );
};
