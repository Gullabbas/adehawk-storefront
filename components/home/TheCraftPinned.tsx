'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/Button';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CHAPTERS = [
  {
    step: 1,
    title: 'Crafted with character.',
    body: 'Every detail matters — from the initial cut to the final form.',
    origin: '50% 50%',
    scale: 1.0,
  },
  {
    step: 2,
    title: 'From the natural grain of the leather',
    body: 'Hand-selected hides showcasing natural grain depth and resilient texture.',
    origin: '50% 38%',
    scale: 1.75,
    callout: { x: '48%', y: '36%', label: 'Natural Grain' },
  },
  {
    step: 3,
    title: 'to the final stitch.',
    body: 'Heavy-gauge edge stitching reinforced at high-stress structural seams.',
    origin: '28% 68%',
    scale: 1.85,
    callout: { x: '30%', y: '65%', label: 'Reinforced Seam' },
  },
  {
    step: 4,
    title: 'Shaped with purpose, refined by hand.',
    body: 'Solid brass lock and ergonomic rolled leather handle built for daily transit.',
    origin: '50% 18%',
    scale: 1.8,
    callout: { x: '50%', y: '22%', label: 'Brass Hardware & Handle' },
  },
  {
    step: 5,
    title: 'Designed to develop a character that becomes uniquely yours over time.',
    body: 'A timeless silhouette engineered for decades of commanding presence.',
    origin: '50% 50%',
    scale: 1.0,
  },
];

export const TheCraftPinned: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const companionImageRef = useRef<HTMLDivElement>(null);

  const [activeStep, setActiveStep] = useState(1);
  const [radialPos, setRadialPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (!containerRef.current || !heroImageRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const pinDistance = isMobile ? '+=320%' : '+=480%';

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: pinDistance,
        pin: true,
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          const stepIndex = Math.min(4, Math.floor(p * 5));
          setActiveStep(stepIndex + 1);

          // Update radial cognac light position
          setRadialPos({
            x: 50 + Math.sin(p * Math.PI * 2) * 15,
            y: 50 + Math.cos(p * Math.PI * 2) * 15,
          });

          // Scrubbed zoom and pan based on active chapter
          const target = CHAPTERS[stepIndex];
          if (heroImageRef.current) {
            heroImageRef.current.style.transformOrigin = target.origin;
            gsap.to(heroImageRef.current, {
              scale: target.scale,
              duration: 0.6,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }

          // In step 5, slide in dark brown companion briefcase from right
          if (companionImageRef.current) {
            if (p >= 0.8) {
              const compProgress = (p - 0.8) / 0.2;
              gsap.to(companionImageRef.current, {
                opacity: compProgress,
                x: (1 - compProgress) * 120,
                duration: 0.4,
                overwrite: 'auto',
              });
            } else {
              gsap.to(companionImageRef.current, {
                opacity: 0,
                x: 120,
                duration: 0.3,
                overwrite: 'auto',
              });
            }
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const curChapter = CHAPTERS[activeStep - 1];

  return (
    <section
      id="craft-section"
      ref={containerRef}
      className="relative w-full min-h-[100svh] bg-espresso text-ivory flex flex-col justify-between py-16 sm:py-20 overflow-hidden select-none"
    >
      {/* 3.5% Subtle Film Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] bg-repeat z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Floating Ambient Cognac Light Drift BEHIND Product */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-cognac blur-[130px] opacity-[0.08] pointer-events-none z-0 transition-all duration-700 ease-out"
        style={{
          left: `${radialPos.x}%`,
          top: `${radialPos.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        aria-hidden="true"
      />

      {/* Left-Edge 5-Chapter Indicator */}
      <div className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center space-y-4">
        <span className="font-mono text-xs text-cognac font-bold tracking-widest">
          0{activeStep}
        </span>
        <div className="w-[2px] h-32 bg-ivory/15 rounded-full relative overflow-hidden">
          <div
            className="w-full bg-cognac transition-all duration-300 rounded-full"
            style={{ height: `${(activeStep / 5) * 100}%` }}
          />
        </div>
        <span className="font-mono text-xs text-ivory/40 tracking-widest">
          05
        </span>
      </div>

      {/* Center Stage: The Hero Briefcase Canvas */}
      <div
        ref={stageRef}
        className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8"
      >
        <div className="relative w-[300px] sm:w-[420px] md:w-[480px] aspect-[4/5] flex items-center justify-center">
          {/* Soft Contact Shadow Placed BEHIND the Product */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/60 blur-xl rounded-full z-0"
            aria-hidden="true"
          />

          {/* Primary Hero Object: Black Leather Executive Briefcase (Unaltered Pixels) */}
          <div
            ref={heroImageRef}
            className="relative w-full h-full z-10 will-change-transform transition-transform duration-500 ease-out flex items-center justify-center"
          >
            <Image
              src="/assets/products/black-leather-executive-briefcase.jpg"
              alt="Black Leather Executive Briefcase"
              fill
              priority
              sizes="(max-width: 768px) 300px, 480px"
              className="object-contain"
            />

            {/* Micro Callout Marker & Label in Chapters 2, 3, 4 */}
            {curChapter.callout && (
              <div
                className="absolute z-30 pointer-events-none flex items-center gap-3 animate-fadeIn"
                style={{
                  left: curChapter.callout.x,
                  top: curChapter.callout.y,
                }}
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cognac opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cognac" />
                </span>
                <span className="px-2.5 py-1 bg-espresso/90 backdrop-blur-md border border-ivory/20 rounded-md text-[10px] uppercase tracking-widest text-ivory font-mono whitespace-nowrap shadow-xl">
                  {curChapter.callout.label}
                </span>
              </div>
            )}
          </div>

          {/* Step 5 Companion Object: Dark Brown Leather Executive Briefcase */}
          <div
            ref={companionImageRef}
            className="absolute -right-24 sm:-right-40 top-0 w-full h-full z-10 opacity-0 pointer-events-none will-change-transform"
          >
            <Image
              src="/assets/products/dark-brown-leather-executive-briefcase.webp"
              alt="Dark Brown Leather Executive Briefcase"
              fill
              sizes="(max-width: 768px) 260px, 400px"
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Bottom Pinned Typography & Magnetic CTA */}
      <div className="relative z-20 max-w-3xl mx-auto px-6 text-center space-y-4">
        <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block">
          Chapter 0{activeStep} · Crafted with Character
        </span>

        {/* Apple-Style Text Reveal */}
        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light text-ivory leading-tight transition-all duration-500">
          {curChapter.title}
        </h2>

        <p className="text-xs sm:text-sm text-ivory/70 max-w-lg mx-auto font-sans leading-relaxed">
          {curChapter.body}
        </p>

        {activeStep === 5 && (
          <div className="pt-2 animate-fadeIn flex justify-center">
            <Button
              href="/collections/all"
              variant="dark"
              size="lg"
              magnetic
              icon="arrow-right"
            >
              Explore Craftsmanship
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
