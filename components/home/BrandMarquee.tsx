'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PHRASE = 'PURE HANDMADE LEATHER GOODS · CRAFTED FOR EVERYDAY · DESIGNED TO LAST · TIMELESS BRITISH SILHOUETTES · ';

export const BrandMarquee: React.FC = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current || !trackRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const track = trackRef.current;
    let baseSpeed = 0.8;
    let currentSpeed = baseSpeed;
    let progress = 0;

    const tick = () => {
      progress -= currentSpeed;
      if (progress <= -50) {
        progress = 0;
      }
      track.style.transform = `translateX(${progress}%)`;
      // decay speed back to base
      currentSpeed += (baseSpeed - currentSpeed) * 0.05;
    };

    gsap.ticker.add(tick);

    // React to scroll velocity
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const vel = Math.abs(self.getVelocity()) / 400;
        currentSpeed = Math.min(6, baseSpeed + vel);
      },
    });

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);

  return (
    <div
      ref={marqueeRef}
      className="w-full overflow-hidden bg-ivory py-8 sm:py-12 border-b border-ink/10 select-none"
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{ width: 'max-content' }}
      >
        <span className="font-serif text-3xl sm:text-5xl md:text-6xl uppercase font-light text-ink/80 tracking-editorial mr-4">
          {PHRASE}
        </span>
        <span className="font-serif text-3xl sm:text-5xl md:text-6xl uppercase font-light text-ink/80 tracking-editorial mr-4">
          {PHRASE}
        </span>
      </div>
    </div>
  );
};
