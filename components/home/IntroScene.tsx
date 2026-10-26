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
    // Check deep-link or scroll restoration or reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasScrolled = window.scrollY > 80;
    const hasHash = window.location.hash.length > 0;

    if (prefersReducedMotion || hasScrolled || hasHash) {
      setIsSkipped(true);
      if (onIntroProgress) onIntroProgress(1.0);
      if (onIntroComplete) onIntroComplete(true);
      return;
    }

    if (!containerRef.current || !logoWrapperRef.current) return;

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
          duration: 1.6,
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
        const headerLogo = document.querySelector('header a img');
        if (headerLogo) {
          return headerLogo.getBoundingClientRect();
        }
        return {
          left: window.innerWidth / 2 - 64,
          top: 36,
          width: 128,
          height: 48,
        };
      };

      // Hide real header logo initially
      const realHeaderLogo = document.querySelector('header a img') as HTMLElement | null;
      if (realHeaderLogo) {
        realHeaderLogo.style.opacity = '0';
      }

      // 3. ScrollTrigger Pinning & Scrub (130vh)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (onIntroProgress) onIntroProgress(p);

            // Circular expansion of background/site
            const homeMask = document.getElementById('home-reveal-mask');
            if (homeMask) {
              const radius = p * 150;
              homeMask.style.clipPath = `circle(${radius}% at 50% 50%)`;
              const blurVal = Math.max(0, (1 - p) * 14);
              const scaleVal = 1.25 - p * 0.25;
              homeMask.style.filter = blurVal > 0.5 ? `blur(${blurVal}px)` : 'none';
              homeMask.style.transform = `scale(${scaleVal})`;
            }

            if (p >= 0.98) {
              if (realHeaderLogo) realHeaderLogo.style.opacity = '1';
              if (onIntroComplete) onIntroComplete(true);
            } else {
              if (realHeaderLogo) realHeaderLogo.style.opacity = '0';
              if (onIntroComplete) onIntroComplete(false);
            }
          },
        },
      });

      if (!logoWrapperRef.current) return;

      // Compute travel coordinates
      const currentRect = logoWrapperRef.current.getBoundingClientRect();
      const targetRect = getHeaderLogoRect();

      const deltaX = targetRect.left + targetRect.width / 2 - (currentRect.left + currentRect.width / 2);
      const deltaY = targetRect.top + targetRect.height / 2 - (currentRect.top + currentRect.height / 2);
      const targetScale = targetRect.width / currentRect.width;

      // 0.00 - 0.40: Fade out cues & tagline
      if (taglineRef.current && cueRef.current) {
        scrollTl.to([taglineRef.current, cueRef.current], {
          opacity: 0,
          y: -15,
          duration: 0.35,
          ease: 'power2.in',
        }, 0);
      }

      // Logo travel to header position
      scrollTl.to(logoWrapperRef.current, {
        x: deltaX,
        y: deltaY,
        scale: targetScale,
        duration: 0.9,
        ease: 'power2.inOut',
      }, 0.05);

      // Intro background dissolves
      scrollTl.to(containerRef.current, {
        backgroundColor: 'rgba(22, 19, 17, 0)',
        duration: 0.95,
        ease: 'none',
      }, 0.05);

    }, containerRef);

    return () => ctx.revert();
  }, [onIntroProgress, onIntroComplete]);

  if (isSkipped) {
    return null;
  }

  return (
    <>
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: '#intro-scene-wrapper { display: none !important; }' }} />
      </noscript>

      <div
        id="intro-scene-wrapper"
        ref={containerRef}
        className="fixed inset-0 z-[650] w-full h-[100svh] bg-espresso flex flex-col items-center justify-center select-none overflow-hidden will-change-transform pointer-events-none"
      >
        {/* Soft Ambient Radial Cognac Glow BEHIND Logo */}
        <div
          ref={glowRef}
          className="absolute w-[450px] h-[450px] rounded-full bg-cognac blur-[90px] pointer-events-none opacity-0 will-change-transform"
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
      </div>
    </>
  );
};
