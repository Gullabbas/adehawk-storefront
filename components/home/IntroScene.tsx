'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

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

  // Compute travel coordinates
  const updateScrollState = useCallback(() => {
    if (!containerRef.current || !logoWrapperRef.current) return;

    const scrollY = window.scrollY;
    const threshold = 380;
    const progress = Math.min(1, Math.max(0, scrollY / threshold));

    if (onIntroProgress) onIntroProgress(progress);
    if (onIntroComplete) onIntroComplete(progress >= 0.9);

    if (progress >= 1.0) {
      containerRef.current.style.display = 'none';
      return;
    } else {
      containerRef.current.style.display = 'flex';
    }

    // 1. Dissolve background color directly over the slider
    const bgAlpha = Math.max(0, 1 - progress * 1.08);
    containerRef.current.style.backgroundColor = `rgba(18, 16, 14, ${bgAlpha})`;

    // 2. Fade out tagline & scroll cue rapidly
    const textAlpha = Math.max(0, 1 - progress * 3.5);
    if (taglineRef.current) {
      taglineRef.current.style.opacity = String(textAlpha);
      taglineRef.current.style.transform = `translateY(${-progress * 20}px)`;
    }
    if (cueRef.current) {
      cueRef.current.style.opacity = String(textAlpha);
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = String(0.12 * (1 - progress));
    }

    // 3. Logo travel: Purely vertical upwards trajectory to the center header logo
    // Header center logo is positioned at ~58px from top of viewport
    const headerLogoCenterY = 58;
    const viewportCenterY = window.innerHeight / 2;
    const deltaY = headerLogoCenterY - viewportCenterY; // Negative value (straight upwards)

    const currentY = progress * deltaY;
    const currentScale = 1 - progress * 0.42; // Scales down from 1.0 to ~0.58 (matching 128px header logo)
    const logoAlpha = progress > 0.82 ? Math.max(0, 1 - (progress - 0.82) / 0.18) : 1;

    logoWrapperRef.current.style.transform = `translate3d(0, ${currentY}px, 0) scale(${currentScale})`;
    logoWrapperRef.current.style.opacity = String(logoAlpha);
  }, [onIntroProgress, onIntroComplete]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasHash = window.location.hash.length > 0;
    const isDebug = window.location.search.includes('debug=1');
    if (isDebug) setShowDebug(true);

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
      return;
    }

    if (!containerRef.current || !logoWrapperRef.current) return;

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

    // 2. Passive scroll listener for smooth real-time dissolution over the slider
    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      entranceTl.kill();
    };
  }, [onIntroProgress, onIntroComplete, updateScrollState]);

  if (isSkipped) {
    return null;
  }

  return (
    <>
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: '#intro-scene-wrapper { display: none !important; }' }} />
      </noscript>

      {/* Full-Viewport Fixed Overlay: Dissolves Directly Over the Slider On Scroll */}
      <aside
        id="intro-scene-wrapper"
        ref={containerRef}
        aria-label="Welcome to Adehawk"
        className="fixed inset-0 z-40 bg-[#12100E] flex flex-col items-center justify-center select-none overflow-hidden pointer-events-none transition-colors duration-75"
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
          className="relative w-44 sm:w-56 h-32 sm:h-40 z-10 will-change-transform flex items-center justify-center origin-center"
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
