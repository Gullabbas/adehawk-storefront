'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { HeroStage } from './HeroStage';
import { HERO_CONFIG } from './hero.config';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const slide1 = HERO_CONFIG.slides[0];

  return (
    <section
      id="hero-section"
      ref={heroRef}
      className="relative w-full h-[100svh] bg-espresso overflow-hidden"
    >
      <div className="relative w-full h-full overflow-hidden origin-center">
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
