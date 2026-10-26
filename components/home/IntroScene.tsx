'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface IntroSceneProps {
  onIntroProgress?: (progress: number) => void;
  onIntroComplete?: (complete: boolean) => void;
}

export const IntroScene: React.FC<IntroSceneProps> = ({
  onIntroProgress,
  onIntroComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [isSkipped, setIsSkipped] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugData, setDebugData] = useState<{ scrollY: number; progress: number; triggers: string[] }>({
    scrollY: 0,
    progress: 0,
    triggers: [],
  });

  useEffect(() => {
    // Check deep-link or scroll restoration or reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasHash = window.location.hash.length > 0;
    const isDebug = window.location.search.includes('debug=1');
    if (isDebug) setShowDebug(true);

    // Disable browser scroll restoration on home so reload starts cleanly at top
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    if (!hasHash && window.scrollY > 0) {
      window.scrollTo(0, 0);
    }

    if (prefersReducedMotion || hasHash) {
      setIsSkipped(true);
      if (onIntroProgress) onIntroProgress(1.0);
      if (onIntroComplete) onIntroComplete(true);
      const realHeader = document.querySelector('header') as HTMLElement | null;
      if (realHeader) {
        realHeader.style.visibility = 'visible';
        realHeader.style.opacity = '1';
      }
      return;
    }

    if (!containerRef.current || !logoWrapperRef.current) return;

    // Initially hide header on home so intro logo screen plays first
    const realHeader = document.querySelector('header') as HTMLElement | null;
    if (realHeader) {
      realHeader.style.visibility = 'hidden';
      realHeader.style.opacity = '0';
    }

    const ctx = gsap.context(() => {
      // 1. Initial Entrance Animation (0 - 2.4s)
      const entranceTl = gsap.timeline();

      // Logo wipe & scale
      entranceTl.fromTo(
        logoWrapperRef.current,
        {
          clipPath: 'inset(100% 0 0 0)',
          scale: 0.92,
          opacity: 1,
        },
        {
          clipPath: 'inset(0% 0 0 0)',
          scale: 1.0,
          duration: 1.4,
          ease: 'expo.out',
        }
      );

      // Radial glow breathing behind
      if (glowRef.current) {
        entranceTl.fromTo(
          glowRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 0.12, scale: 1.05, duration: 1.8, ease: 'sine.inOut' },
          0.3
        );
      }

      // Tagline reveal at 1.5s
      if (taglineRef.current) {
        entranceTl.fromTo(
          taglineRef.current,
          { opacity: 0, letterSpacing: '0.5em', y: 10 },
          { opacity: 1, letterSpacing: '0.3em', y: 0, duration: 1.0, ease: 'power2.out' },
          1.5
        );
      }

      // Scroll cue at 2.4s
      if (cueRef.current) {
        entranceTl.fromTo(
          cueRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          2.4
        );
      }

      // 2. Measure Header Logo for 1px accurate handoff
      const getHeaderLogoRect = () => {
        const headerLogo = document.querySelector('header a[aria-label="Adehawk Leather Goods Home"]');
        if (headerLogo) {
          const rect = headerLogo.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) return rect;
        }
        const isSm = window.innerWidth >= 640;
        const w = isSm ? 128 : 112;
        const h = isSm ? 48 : 40;
        return {
          left: (window.innerWidth - w) / 2,
          top: 38,
          width: w,
          height: h,
        };
      };

      // 3. ScrollTrigger Pinning & Scrub (130vh)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (onIntroProgress) onIntroProgress(p);

            if (isDebug) {
              const allTriggers = ScrollTrigger.getAll().map(
                (t) => `${t.trigger?.id || 'trigger'}: ${(t.progress * 100).toFixed(0)}%`
              );
              setDebugData({
                scrollY: window.scrollY,
                progress: Number(p.toFixed(3)),
                triggers: allTriggers,
              });
            }

            // Circular expansion of background / hero
            const heroWrapper = document.getElementById('hero-reveal-wrapper');
            if (heroWrapper) {
              const radius = p * 150;
              heroWrapper.style.clipPath = p >= 0.95 ? 'none' : `circle(${radius}% at 50% 50%)`;
              const blurVal = Math.max(0, (1 - p) * 14);
              const scaleVal = 1.25 - p * 0.25;
              heroWrapper.style.filter = blurVal > 0.5 ? `blur(${blurVal}px)` : 'none';
              heroWrapper.style.transform = p >= 0.95 ? 'none' : `scale(${scaleVal})`;
            }

            // Header fade in as user scrolls down
            const h = document.querySelector('header') as HTMLElement | null;
            if (h) {
              if (p > 0.25) {
                h.style.visibility = 'visible';
                h.style.opacity = String(Math.min(1, (p - 0.25) / 0.65));
              } else {
                h.style.visibility = 'hidden';
                h.style.opacity = '0';
              }
            }

            if (p >= 0.9) {
              if (onIntroComplete) onIntroComplete(true);
            } else {
              if (onIntroComplete) onIntroComplete(false);
            }
          },
        },
      });

      if (!logoWrapperRef.current) return;

      // Compute travel coordinates
      const currentRect = logoWrapperRef.current.getBoundingClientRect();
      const targetRect = getHeaderLogoRect();

      // Ensure deltaX centers cleanly
      const deltaX = (window.innerWidth / 2) - (currentRect.left + currentRect.width / 2);
      const deltaY = targetRect.top + targetRect.height / 2 - (currentRect.top + currentRect.height / 2);
      const targetScale = targetRect.width / currentRect.width;

      // 0.00 - 0.35: Fade out cues & tagline
      if (taglineRef.current && cueRef.current) {
        scrollTl.to(
          [taglineRef.current, cueRef.current],
          {
            opacity: 0,
            y: -15,
            duration: 0.3,
            ease: 'power2.in',
          },
          0
        );
      }

      // Logo travels directly to exact center header coordinates and scales
      scrollTl.to(
        logoWrapperRef.current,
        {
          x: deltaX,
          y: deltaY,
          scale: targetScale,
          duration: 0.85,
          ease: 'power2.inOut',
        },
        0.05
      );

      // Smooth cross-fade out of the intro logo at the very end as header logo takes over
      scrollTl.to(
        logoWrapperRef.current,
        {
          opacity: 0,
          duration: 0.15,
          ease: 'power1.out',
        },
        0.85
      );

      // Intro background dissolves smoothly
      scrollTl.to(
        containerRef.current,
        {
          backgroundColor: 'rgba(22, 19, 17, 0)',
          duration: 0.95,
          ease: 'none',
        },
        0.05
      );
    }, containerRef);

    return () => {
      ctx.revert();
      const realHeader = document.querySelector('header') as HTMLElement | null;
      if (realHeader) {
        realHeader.style.visibility = 'visible';
        realHeader.style.opacity = '1';
      }
    };
  }, [onIntroProgress, onIntroComplete]);

  if (isSkipped) {
    return null;
  }

  return (
    <>
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: '#intro-scene-wrapper { display: none !important; }' }} />
      </noscript>

      <section
        id="intro-scene-wrapper"
        ref={containerRef}
        className="relative w-full h-[100svh] bg-espresso flex flex-col items-center justify-center select-none overflow-hidden z-[50]"
      >
        {/* Soft Ambient Radial Cognac Glow BEHIND Logo */}
        <div
          ref={glowRef}
          className="absolute w-[450px] h-[450px] rounded-full bg-cognac blur-[90px] pointer-events-none opacity-0"
          aria-hidden="true"
        />

        {/* Client Official Brand Logo */}
        <div
          ref={logoWrapperRef}
          className="relative w-44 sm:w-56 h-32 sm:h-40 z-10 will-change-transform flex items-center justify-center"
        >
          <Image
            src="/assets/brand/logo.png"
            alt="ADEHAWK LEATHER GOODS"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 640px) 176px, 224px"
            className="object-contain"
          />
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-xs sm:text-sm font-sans uppercase font-light text-ivory tracking-kicker mt-6 opacity-0 text-center px-4"
        >
          Pure Handmade Leather Products
        </p>

        {/* Scroll Cue */}
        <div
          ref={cueRef}
          className="absolute bottom-10 flex flex-col items-center space-y-2 opacity-0"
        >
          <span className="text-[10px] uppercase tracking-widest text-ivory/60 font-sans">
            Scroll
          </span>
          <div className="w-[1px] h-8 bg-ivory/20 overflow-hidden relative">
            <div className="w-full h-1/2 bg-ivory animate-bounce" />
          </div>
        </div>
      </section>

      {/* Dev Overlay (?debug=1) */}
      {showDebug && (
        <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 text-green-400 p-3 font-mono text-xs rounded-xl border border-green-500/40 shadow-2xl pointer-events-none max-w-xs">
          <div>ScrollY: {debugData.scrollY}px</div>
          <div>Intro Progress: {(debugData.progress * 100).toFixed(1)}%</div>
          <div className="border-t border-green-500/30 mt-2 pt-1">
            Active Triggers:
            {debugData.triggers.map((t, idx) => (
              <div key={idx} className="text-[10px] text-green-300">
                • {t}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
