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
  const [bgColor, setBgColor] = useState('#FCFDFF'); // Default to sampled median edge color
  const [radialPos, setRadialPos] = useState({ x: 50, y: 50 });

  // Dynamically sample border pixels on load to ensure 100% seamless background blend
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/products/black-leather-executive-briefcase.jpg';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 1000;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);

        const w = canvas.width;
        const h = canvas.height;
        const samples: [number, number, number][] = [];

        // Sample top and bottom rows
        for (let x = 0; x < w; x += 20) {
          const t = ctx.getImageData(x, 0, 1, 1).data;
          samples.push([t[0], t[1], t[2]]);
          const b = ctx.getImageData(x, h - 1, 1, 1).data;
          samples.push([b[0], b[1], b[2]]);
        }
        // Sample left and right columns
        for (let y = 0; y < h; y += 20) {
          const l = ctx.getImageData(0, y, 1, 1).data;
          samples.push([l[0], l[1], l[2]]);
          const r = ctx.getImageData(w - 1, y, 1, 1).data;
          samples.push([r[0], r[1], r[2]]);
        }

        const rs = samples.map((s) => s[0]).sort((a, b) => a - b);
        const gs = samples.map((s) => s[1]).sort((a, b) => a - b);
        const bs = samples.map((s) => s[2]).sort((a, b) => a - b);
        const mid = Math.floor(samples.length / 2);
        setBgColor(`rgb(${rs[mid]}, ${gs[mid]}, ${bs[mid]})`);
      } catch {
        // Fallback to sampled #FCFDFF
        setBgColor('#FCFDFF');
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !heroImageRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Pin distance: 420vh desktop, 300vh mobile
      const pinDistance = isMobile ? '+=300%' : '+=420%';

      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: pinDistance,
          pin: true,
          pinSpacing: true,
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
          },
        },
      });

      if (heroImageRef.current) {
        // Continuous choreographed keyframes for Chapters 01 -> 02 -> 03 -> 04 -> 05
        // Chapter 1 (0.00 - 0.20): Full view at rest
        scrubTl.to(heroImageRef.current, {
          scale: 1.0,
          xPercent: 0,
          yPercent: 0,
          duration: 0.2,
          ease: 'power1.inOut',
        });

        // Chapter 2 (0.20 - 0.40): Smooth pan & zoom to Natural Grain
        scrubTl.to(heroImageRef.current, {
          scale: 1.45,
          xPercent: 0,
          yPercent: -14,
          duration: 0.2,
          ease: 'power1.inOut',
        });

        // Chapter 3 (0.40 - 0.60): Smooth glide to Reinforced Seam & Stitching
        scrubTl.to(heroImageRef.current, {
          scale: 1.5,
          xPercent: 18,
          yPercent: -22,
          duration: 0.2,
          ease: 'power1.inOut',
        });

        // Chapter 4 (0.60 - 0.80): Smooth zoom to Brass Hardware & Rolled Handle
        scrubTl.to(heroImageRef.current, {
          scale: 1.55,
          xPercent: 0,
          yPercent: 22,
          duration: 0.2,
          ease: 'power1.inOut',
        });

        // Chapter 5 (0.80 - 1.00): Camera glides back out to full view
        scrubTl.to(heroImageRef.current, {
          scale: 1.0,
          xPercent: -12,
          yPercent: 0,
          duration: 0.2,
          ease: 'power1.inOut',
        });
      }

      // Step 5 companion object slides in from the right
      if (companionImageRef.current) {
        scrubTl.fromTo(
          companionImageRef.current,
          { opacity: 0, x: 120 },
          { opacity: 1, x: 0, duration: 0.2, ease: 'power1.out' },
          0.8
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const curChapter = CHAPTERS[activeStep - 1];

  return (
    <section
      id="craft-section"
      ref={containerRef}
      style={{ backgroundColor: bgColor }}
      className="relative w-full min-h-[100svh] text-ink flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 pb-6 sm:pb-8 overflow-hidden select-none rounded-t-[32px] border-t border-ink/10 shadow-[0_-20px_50px_rgba(0,0,0,0.12)] transition-colors duration-500"
    >
      {/* Floating Ambient Cognac Light Drift BEHIND Product */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-cognac blur-[140px] opacity-[0.08] pointer-events-none z-0 transition-all duration-700 ease-out"
        style={{
          left: `${radialPos.x}%`,
          top: `${radialPos.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        aria-hidden="true"
      />

      {/* Top Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-end">
        <div>
          <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block mb-1">
            The Craft · Chapter 0{activeStep} of 05
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-ink tracking-tight">
            Crafted for the Journey
          </h2>
        </div>

        {/* Step Indicator Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink/5 border border-ink/10">
          <span className="font-mono text-xs font-semibold text-cognac">0{activeStep}</span>
          <span className="text-ink/30 text-xs">/</span>
          <span className="font-mono text-xs text-ink/50">05</span>
        </div>
      </div>

      {/* Left-Edge 5-Chapter Vertical Rail (Desktop) */}
      <div className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center space-y-4">
        <span className="font-mono text-xs text-cognac font-bold tracking-widest">
          0{activeStep}
        </span>
        <div className="w-[2px] h-32 bg-ink/10 rounded-full relative overflow-hidden">
          <div
            className="w-full bg-cognac transition-all duration-300 rounded-full"
            style={{ height: `${(activeStep / 5) * 100}%` }}
          />
        </div>
        <span className="font-mono text-xs text-ink/40 tracking-widest">
          05
        </span>
      </div>

      {/* Center Stage: Seamless Hero Briefcase Gallery Canvas */}
      <div
        ref={stageRef}
        className="relative z-10 flex-1 flex items-center justify-center px-4 py-2 sm:px-8"
      >
        <div className="relative w-[280px] sm:w-[380px] md:w-[440px] h-[32vh] sm:h-[36vh] max-h-[350px] aspect-[4/3] flex items-center justify-center">
          {/* Soft Contact Shadow Placed BEHIND the Product */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[85%] h-8 bg-ink/15 blur-xl rounded-full z-0"
            aria-hidden="true"
          />

          {/* Primary Hero Object: Black Leather Executive Briefcase (Transparent Studio Cutout) */}
          <div
            ref={heroImageRef}
            className="relative w-full h-full z-10 will-change-transform transition-transform duration-500 ease-out flex items-center justify-center"
          >
            <Image
              src="/assets/products/black-leather-executive-briefcase-transparent.png"
              alt="Black Leather Executive Briefcase - Artisanal Craftsmanship"
              fill
              priority
              sizes="(max-width: 768px) 280px, 440px"
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
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cognac shadow-[0_0_10px_#8E4A23]" />
                </span>
                <span className="px-2.5 py-1 bg-ivory/95 border border-ink/15 rounded-md text-[10px] uppercase tracking-widest text-ink font-mono font-medium whitespace-nowrap shadow-lg">
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
              alt="Dark Brown Leather Executive Briefcase Companion"
              fill
              sizes="(max-width: 768px) 260px, 400px"
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Bottom Pinned Typography & Magnetic CTA - Dark Espresso Text on Light Gallery Surface */}
      <div className="relative z-20 max-w-3xl mx-auto px-6 text-center space-y-1.5 sm:space-y-2 pb-1">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-kicker text-cognac font-sans font-semibold block">
          Chapter 0{activeStep} · Character & Form
        </span>

        {/* High-Contrast Chapter Heading (18.9:1 contrast against #FCFDFF) */}
        <h3 className="font-serif text-xl sm:text-3xl md:text-4xl font-light text-ink leading-tight transition-all duration-500">
          {curChapter.title}
        </h3>

        <p className="text-xs sm:text-sm text-ink-muted max-w-lg mx-auto font-sans leading-relaxed line-clamp-2">
          {curChapter.body}
        </p>

        {activeStep === 5 && (
          <div className="pt-1 animate-fadeIn flex justify-center">
            <Button
              href="/collections/all"
              variant="dark"
              size="sm"
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
