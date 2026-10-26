'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ROW_1_TEXT =
  'PURE HANDMADE LEATHER PRODUCTS · CRAFTED FOR EVERYDAY · DESIGNED TO LAST · ';
const ROW_2_TEXT =
  'TIMELESS BY DESIGN · EVERYDAY LUXURY · REDEFINING WORKWEAR · ';

export const BrandMarquee: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1TrackRef = useRef<HTMLDivElement>(null);
  const row2TrackRef = useRef<HTMLDivElement>(null);

  const row1SpansRef = useRef<HTMLSpanElement[]>([]);
  const row2SpansRef = useRef<HTMLSpanElement[]>([]);

  const isHoveredRef = useRef(false);
  const pointerPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current || !row1TrackRef.current || !row2TrackRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isMobile = window.innerWidth < 768;
    const baseSpeed = isMobile ? 28 : 40; // px/s
    let currentSpeed = baseSpeed;
    let targetSpeed = baseSpeed;

    let x1 = 0;
    let x2 = -1500;

    let lastTime = performance.now();

    // Scroll velocity integration
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const vel = Math.abs(self.getVelocity()) / 250;
        const extra = Math.min(baseSpeed * 0.6, vel * 8); // at most +60%
        targetSpeed = Math.min(90, baseSpeed + extra);
      },
    });

    const tickerFn = (time: number) => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Handle hover stop/resume easing
      if (isHoveredRef.current) {
        currentSpeed += (0 - currentSpeed) * Math.min(1, dt * 5); // eases to 0 in ~0.6s
      } else {
        currentSpeed += (targetSpeed - currentSpeed) * Math.min(1, dt * 3); // resumes in ~0.8s
        targetSpeed += (baseSpeed - targetSpeed) * Math.min(1, dt * 2); // decay scroll boost
      }

      x1 -= currentSpeed * dt;
      x2 += currentSpeed * dt * 0.85;

      const track1 = row1TrackRef.current;
      const track2 = row2TrackRef.current;

      if (track1) {
        const halfWidth1 = track1.scrollWidth / 2;
        if (Math.abs(x1) >= halfWidth1) x1 = 0;
        track1.style.transform = `translate3d(${x1}px, 0, 0)`;
      }

      if (track2) {
        const halfWidth2 = track2.scrollWidth / 2;
        if (x2 >= 0) x2 = -halfWidth2;
        track2.style.transform = `translate3d(${x2}px, 0, 0)`;
      }

      // Proximity effect batch calculation
      if (pointerPosRef.current) {
        const { x: px, y: py } = pointerPosRef.current;
        const radius = 140;

        // Row 1: solid by default -> outlined, lifted, scaled on proximity
        row1SpansRef.current.forEach((span) => {
          if (!span) return;
          const rect = span.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(px - cx, py - cy);

          if (dist < radius) {
            const factor = 1 - dist / radius;
            const lift = factor * 14;
            const scale = 1 + factor * 0.08;
            span.style.transform = `translate3d(0, -${lift}px, 0) scale(${scale})`;
            span.style.color = factor > 0.4 ? 'transparent' : '#FBF9F5';
            span.style.webkitTextStroke = factor > 0.4 ? '1px #FBF9F5' : 'none';
          } else {
            span.style.transform = 'translate3d(0, 0, 0) scale(1)';
            span.style.color = '#FBF9F5';
            span.style.webkitTextStroke = 'none';
          }
        });

        // Row 2: outlined by default -> filled solid, lifted, scaled on proximity
        row2SpansRef.current.forEach((span) => {
          if (!span) return;
          const rect = span.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(px - cx, py - cy);

          if (dist < radius) {
            const factor = 1 - dist / radius;
            const lift = factor * 14;
            const scale = 1 + factor * 0.08;
            span.style.transform = `translate3d(0, -${lift}px, 0) scale(${scale})`;
            span.style.color = factor > 0.4 ? '#FBF9F5' : 'transparent';
            span.style.webkitTextStroke = factor > 0.4 ? 'none' : '1px rgba(251, 249, 245, 0.45)';
          } else {
            span.style.transform = 'translate3d(0, 0, 0) scale(1)';
            span.style.color = 'transparent';
            span.style.webkitTextStroke = '1px rgba(251, 249, 245, 0.45)';
          }
        });
      }
    };

    gsap.ticker.add(tickerFn);

    return () => {
      gsap.ticker.remove(tickerFn);
      st.kill();
    };
  }, []);

  const handlePointerEnter = () => {
    isHoveredRef.current = true;
  };

  const handlePointerLeave = () => {
    isHoveredRef.current = false;
    pointerPosRef.current = null;
    // Reset spans
    row1SpansRef.current.forEach(s => {
      if (s) {
        s.style.transform = 'translate3d(0, 0, 0) scale(1)';
        s.style.color = '#FBF9F5';
        s.style.webkitTextStroke = 'none';
      }
    });
    row2SpansRef.current.forEach(s => {
      if (s) {
        s.style.transform = 'translate3d(0, 0, 0) scale(1)';
        s.style.color = 'transparent';
        s.style.webkitTextStroke = '1px rgba(251, 249, 245, 0.45)';
      }
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    pointerPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const row1Repeated = ROW_1_TEXT + ROW_1_TEXT;
  const row2Repeated = ROW_2_TEXT + ROW_2_TEXT;

  return (
    <section
      id="marquee-section"
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      className="relative w-full overflow-hidden bg-espresso py-12 sm:py-20 border-b border-ivory/10 select-none z-10"
    >
      {/* Subtle 3.5% SVG Noise Grain on Dark Espresso Surface */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] bg-repeat z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-3 sm:space-y-6">
        {/* Row 1: Solid Ivory by default -> outlined on proximity */}
        <div
          ref={row1TrackRef}
          aria-label={ROW_1_TEXT}
          className="flex whitespace-nowrap will-change-transform"
        >
          {row1Repeated.split('').map((char, i) => (
            <span
              key={i}
              ref={el => {
                if (el) row1SpansRef.current[i] = el;
              }}
              aria-hidden="true"
              className="inline-block font-serif text-[clamp(2.75rem,7vw,7.5rem)] font-light leading-none tracking-tight text-ivory transition-transform duration-300 ease-out will-change-transform"
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>

        {/* Row 2: Outlined by default -> filled solid on proximity */}
        <div
          ref={row2TrackRef}
          aria-label={ROW_2_TEXT}
          className="flex whitespace-nowrap will-change-transform"
        >
          {row2Repeated.split('').map((char, i) => (
            <span
              key={i}
              ref={el => {
                if (el) row2SpansRef.current[i] = el;
              }}
              aria-hidden="true"
              className="inline-block font-serif text-[clamp(2.75rem,7vw,7.5rem)] font-light leading-none tracking-tight text-transparent transition-transform duration-300 ease-out will-change-transform"
              style={{
                WebkitTextStroke: '1px rgba(251, 249, 245, 0.45)',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
