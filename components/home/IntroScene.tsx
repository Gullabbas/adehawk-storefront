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

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasHash = window.location.hash.length > 0;

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
      const headerLogo = document.querySelector('header a[aria-label="Adehawk Leather Goods Home"]') as HTMLElement | null;
      if (headerLogo) {
        headerLogo.style.opacity = '1';
        headerLogo.style.pointerEvents = 'auto';
      }
      return;
    }

    if (!containerRef.current || !logoWrapperRef.current) return;

    // Initially hide header logo so it doesn't appear on first load
    const headerLogo = document.querySelector('header a[aria-label="Adehawk Leather Goods Home"]') as HTMLElement | null;
    if (headerLogo) {
      headerLogo.style.opacity = '0';
      headerLogo.style.pointerEvents = 'none';
    }

    // 1. Initial Logo Entrance Animation (on load)
    const entranceTl = gsap.timeline();

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
        duration: 1.2,
        ease: 'expo.out',
      }
    );

    if (glowRef.current) {
      entranceTl.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 0.12, scale: 1.05, duration: 1.6, ease: 'sine.inOut' },
        0.2
      );
    }

    if (taglineRef.current) {
      entranceTl.fromTo(
        taglineRef.current,
        { opacity: 0, letterSpacing: '0.5em', y: 10 },
        { opacity: 1, letterSpacing: '0.3em', y: 0, duration: 0.9, ease: 'power2.out' },
        1.2
      );
    }

    if (cueRef.current) {
      entranceTl.fromTo(
        cueRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        2.0
      );
    }

    // 2. Trajectory measurement: Measures exact coordinates of the header logo relative to the intro logo
    const measureCoords = () => {
      const hLogo = document.querySelector('header a[aria-label="Adehawk Leather Goods Home"]') as HTMLElement | null;
      const iLogo = logoWrapperRef.current;
      if (!hLogo || !iLogo) {
        return { deltaX: 0, deltaY: -(window.innerHeight / 2 - 73.5), targetScale: 0.30 };
      }

      const origTransform = iLogo.style.transform;
      iLogo.style.transform = 'none';

      const hRect = hLogo.getBoundingClientRect();
      const iRect = iLogo.getBoundingClientRect();

      iLogo.style.transform = origTransform;

      const headerCenterX = hRect.left + hRect.width / 2;
      const headerCenterY = hRect.top + hRect.height / 2;
      const introCenterX = iRect.left + iRect.width / 2;
      const introCenterY = iRect.top + iRect.height / 2;

      let deltaX = headerCenterX - introCenterX;
      if (Math.abs(deltaX) < 1.0) deltaX = 0; // True vertical axis
      const deltaY = headerCenterY - introCenterY; // Straight upwards to header logo center
      const targetScale = iRect.height > 0 ? hRect.height / iRect.height : 0.30;

      return { deltaX, deltaY, targetScale };
    };

    let coords = measureCoords();

    // 3. ScrollTrigger Pin: Pins #intro-hero-wrapper so the slider DOES NOT scroll while intro dissolves!
    const heroWrapper = document.getElementById('intro-hero-wrapper');
    if (!heroWrapper) return;

    const trigger = ScrollTrigger.create({
      trigger: heroWrapper,
      start: 'top top',
      end: '+=800px',
      pin: true,
      pinSpacing: true,
      scrub: 0.6,
      anticipatePin: 1,
      onRefresh: () => {
        coords = measureCoords();
      },
      onUpdate: (self) => {
        const p = self.progress;

        if (onIntroProgress) onIntroProgress(p);
        if (onIntroComplete) onIntroComplete(p >= 0.95);

        // 1. Dissolve background color directly over the slider
        if (containerRef.current) {
          if (p >= 0.99) {
            containerRef.current.style.display = 'none';
          } else {
            containerRef.current.style.display = 'flex';
            const bgAlpha = Math.max(0, 1 - p * 1.05);
            containerRef.current.style.backgroundColor = `rgba(18, 16, 14, ${bgAlpha})`;
          }
        }

        // 2. Fade out tagline & scroll cue rapidly
        const textAlpha = Math.max(0, 1 - p * 3.5);
        if (taglineRef.current) {
          taglineRef.current.style.opacity = String(textAlpha);
          taglineRef.current.style.transform = `translateY(${-p * 20}px)`;
        }
        if (cueRef.current) {
          cueRef.current.style.opacity = String(textAlpha);
        }
        if (glowRef.current) {
          glowRef.current.style.opacity = String(0.12 * (1 - p));
        }

        // 3. Travel trajectory: Arrives at header logo position by p = 0.88
        if (logoWrapperRef.current) {
          const travelProgress = Math.min(1, p / 0.88);
          const currentX = travelProgress * coords.deltaX;
          const currentY = travelProgress * coords.deltaY;
          const currentScale = 1 - travelProgress * (1 - coords.targetScale);

          logoWrapperRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${currentScale})`;

          // Cross-fade intro logo with header logo seamlessly between p = 0.88 and 1.00
          if (p >= 0.88) {
            const fadeT = Math.min(1, Math.max(0, (p - 0.88) / 0.12));
            logoWrapperRef.current.style.opacity = String(Math.max(0, 1 - fadeT));
          } else {
            logoWrapperRef.current.style.opacity = '1';
          }
        }

        // 4. Header menu logo cross-fade:
        // Appears smoothly as traveling logo arrives at the exact header position (p >= 0.88)
        const headerLogoEl = document.querySelector('header a[aria-label="Adehawk Leather Goods Home"]') as HTMLElement | null;
        if (headerLogoEl) {
          if (p >= 0.88) {
            const fadeT = Math.min(1, Math.max(0, (p - 0.88) / 0.12));
            headerLogoEl.style.opacity = String(fadeT);
            headerLogoEl.style.pointerEvents = fadeT > 0.5 ? 'auto' : 'none';
          } else {
            headerLogoEl.style.opacity = '0';
            headerLogoEl.style.pointerEvents = 'none';
          }
        }
      },
    });

    // Refresh triggers to ensure accurate layout geometry
    ScrollTrigger.refresh();

    const handleResize = () => {
      coords = measureCoords();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      trigger.kill();
      entranceTl.kill();
      const headerLogoEl = document.querySelector('header a[aria-label="Adehawk Leather Goods Home"]') as HTMLElement | null;
      if (headerLogoEl) {
        headerLogoEl.style.opacity = '1';
        headerLogoEl.style.pointerEvents = 'auto';
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

      {/* Full-Viewport Absolute Overlay: Sits over the Hero Slider, dissolving smoothly during the pin */}
      <aside
        id="intro-scene-wrapper"
        ref={containerRef}
        aria-label="Welcome to Adehawk"
        className="absolute inset-0 z-40 bg-[#12100E] flex flex-col items-center justify-center select-none overflow-hidden pointer-events-none"
      >
        {/* Soft Ambient Radial Cognac Glow BEHIND Logo */}
        <div
          ref={glowRef}
          className="absolute w-[450px] h-[450px] rounded-full bg-cognac blur-[90px] pointer-events-none opacity-0"
          aria-hidden="true"
        />

        {/* Client Official Brand Logo - Trajectory to Header */}
        <div
          ref={logoWrapperRef}
          className="relative w-[171px] sm:w-[214px] h-[128px] sm:h-[160px] z-10 will-change-transform flex items-center justify-center origin-center"
        >
          <Image
            src="/assets/brand/logo.png"
            alt="ADEHAWK LEATHER GOODS"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 640px) 171px, 214px"
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
            Scroll to explore
          </span>
          <div className="w-[1px] h-8 bg-ivory/20 overflow-hidden relative">
            <div className="w-full h-1/2 bg-ivory animate-bounce" />
          </div>
        </div>
      </aside>
    </>
  );
};
