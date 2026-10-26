'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { HERO_CONFIG } from './hero.config';
import { useHeroController } from './useHeroController';
import { HeroFallback } from './HeroFallback';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/store/useUIStore';

// Dynamically import WebGL renderer client-only
const HeroGL = dynamic(
  () => import('./HeroGL').then(mod => mod.HeroGL),
  { ssr: false }
);

interface HeroStageProps {
  onLcpReady?: () => void;
}

export const HeroStage: React.FC<HeroStageProps> = () => {
  const [isGlReady, setIsGlReady] = useState(false);
  const [isGlDowngraded, setIsGlDowngraded] = useState(false);
  const [autoplayProgress, setAutoplayProgress] = useState(0);

  const [transitionProgress, setTransitionProgress] = useState(0);
  const [transitionDir, setTransitionDir] = useState(1);
  const [transitionVel, setTransitionVel] = useState(0);

  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const { setCursor } = useUIStore();
  const shouldReduceMotion = useReducedMotion();

  // Callbacks for hero controller
  const handleTransitionUpdate = useCallback(
    (progress: number, dir: number, vel: number) => {
      setTransitionProgress(progress);
      setTransitionDir(dir);
      setTransitionVel(vel);
    },
    []
  );

  const handleAutoplayProgress = useCallback((progress: number) => {
    setAutoplayProgress(progress);
  }, []);

  const {
    index,
    nextIndex,
    isPaused,
    go,
    next,
    prev,
    togglePause,
    pointerHandlers,
  } = useHeroController({
    onTransitionUpdate: handleTransitionUpdate,
    onAutoplayProgress: handleAutoplayProgress,
  });

  const currentSlide = HERO_CONFIG.slides[index];

  // Mouse parallax on desktop
  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 768 || shouldReduceMotion) return;
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * -12;
    const y = (clientY / window.innerHeight - 0.5) * -12;
    setMouseOffset({ x, y });
  };

  // Cursor states
  const handleMouseEnter = () => {
    setCursor('drag', 'Drag');
  };
  const handleMouseLeave = () => {
    setCursor('default');
  };

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setIsGlDowngraded(true);
    } catch {
      setIsGlDowngraded(true);
    }
  }, []);

  return (
    <div
      ref={stageRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      {...pointerHandlers}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      style={{ touchAction: 'pan-y' }}
      className="relative w-full h-[100svh] overflow-hidden select-none cursor-grab active:cursor-grabbing outline-none"
    >
      {/* 1. Dynamic WebGL Stage or Fallback */}
      {!isGlDowngraded && !shouldReduceMotion ? (
        <motion.div
          animate={{ opacity: isGlReady ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <HeroGL
            currentIndex={index}
            nextIndex={nextIndex}
            progress={transitionProgress}
            direction={transitionDir}
            velocity={transitionVel}
            onReady={() => setIsGlReady(true)}
            onPerformanceDowngrade={() => setIsGlDowngraded(true)}
          />
        </motion.div>
      ) : (
        <HeroFallback
          currentIndex={index}
          nextIndex={nextIndex}
          progress={transitionProgress}
          direction={transitionDir}
        />
      )}

      {/* 2. Text Legibility Bottom Scrim (Strictly restricted to bottom 40%, 40% max opacity) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[45%] pointer-events-none bg-gradient-to-t from-black/50 via-black/25 to-transparent"
        aria-hidden="true"
      />

      {/* 3. Large Background Numeral (Desktop Outlined 1px Stroke, 12% Opacity) */}
      <div
        className="hidden md:block absolute bottom-8 left-12 select-none pointer-events-none font-serif text-[clamp(8rem,16vw,16rem)] font-light leading-none text-transparent stroke-numeral"
        aria-hidden="true"
        style={{
          WebkitTextStroke: '1px rgba(251, 249, 245, 0.15)',
        }}
      >
        0{index + 1}
      </div>

      {/* 4. Text Choreography Container */}
      <div
        className="absolute inset-0 pointer-events-none flex flex-col justify-end p-6 sm:p-12 md:p-16 lg:p-20 z-10"
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          transition: 'transform 0.12s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="max-w-4xl space-y-4">
          {/* Animated Kicker */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={`kicker-${index}`}
                initial={{ opacity: 0, letterSpacing: '0.45em' }}
                animate={{ opacity: 1, letterSpacing: '0.28em' }}
                exit={{ opacity: 0, letterSpacing: '0.45em' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-xs sm:text-sm font-sans uppercase font-medium text-cognac tracking-kicker"
              >
                {currentSlide.kicker}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Masked Headline Lines */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={`headline-${index}`}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '-110%', opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[clamp(2.75rem,7vw,7.5rem)] font-light leading-[1.02] text-ivory tracking-tight drop-shadow-sm max-w-3xl"
              >
                {currentSlide.headline}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* CTA & Counter Row */}
          <motion.div
            key={`cta-${index}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="pt-2 flex items-center gap-8 pointer-events-auto"
          >
            <Button
              href={currentSlide.ctaHref}
              variant="dark"
              size="lg"
              magnetic
              icon="arrow-right"
            >
              {currentSlide.ctaText}
            </Button>

            {/* Digit-Roll Counter */}
            <div className="flex items-center text-xs font-sans tracking-widest text-ivory/80">
              <span className="font-semibold text-ivory">0{index + 1}</span>
              <span className="mx-2 text-ivory/40">—</span>
              <span className="text-ivory/50">0{HERO_CONFIG.slides.length}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 5. Desktop Right-Side Vertical Rail */}
      <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col space-y-8 z-20 pointer-events-auto">
        {HERO_CONFIG.slides.map((s, idx) => {
          const isActive = idx === index;
          return (
            <button
              key={s.id}
              onClick={() => go(idx, idx > index ? 1 : -1)}
              className="group flex items-center space-x-4 text-left cursor-pointer"
              aria-label={`Go to slide ${idx + 1}: ${s.label}`}
            >
              <div className="relative w-8 h-[2px] bg-ivory/20 overflow-hidden">
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-ivory"
                    style={{
                      transformOrigin: 'left',
                      scaleX: autoplayProgress,
                    }}
                  />
                )}
              </div>
              <span
                className={`text-xs uppercase tracking-kicker font-sans transition-colors duration-300 ${
                  isActive ? 'text-ivory font-medium' : 'text-ivory/40 group-hover:text-ivory/70'
                }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 6. Mobile Horizontal 3-Segment Progress Bar */}
      <div className="lg:hidden absolute bottom-4 left-6 right-6 flex items-center gap-2 z-20 pointer-events-none">
        {HERO_CONFIG.slides.map((s, idx) => {
          const isActive = idx === index;
          return (
            <div
              key={s.id}
              className="flex-1 h-[2px] bg-ivory/20 overflow-hidden rounded-full"
            >
              {isActive ? (
                <div
                  className="h-full bg-ivory transition-all duration-100 ease-linear"
                  style={{ width: `${autoplayProgress * 100}%` }}
                />
              ) : (
                <div
                  className={`h-full bg-ivory/30 ${idx < index ? 'w-full' : 'w-0'}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 7. Bottom-Right Controls: SVG Circular Ring Progress Next + Pause/Play Button */}
      <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 z-20 flex items-center space-x-3 pointer-events-auto">
        {/* Pause / Play Toggle (WCAG 2.2.2) */}
        <button
          onClick={togglePause}
          className="w-10 h-10 rounded-full border border-ivory/25 bg-black/30 backdrop-blur-sm flex items-center justify-center text-ivory hover:border-ivory transition-colors cursor-pointer"
          aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
        >
          {isPaused ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          )}
        </button>

        {/* Circular Next Button with SVG Ring Progress */}
        <button
          onClick={next}
          className="relative w-14 h-14 rounded-full flex items-center justify-center text-ivory group cursor-pointer"
          aria-label="Next slide"
        >
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full bg-black/30 backdrop-blur-sm border border-ivory/20 group-hover:border-ivory/60 transition-colors" />

          {/* SVG Ring Progress */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 56 56"
          >
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="rgba(251, 249, 245, 0.2)"
              strokeWidth="2"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="#8E4A23"
              strokeWidth="2"
              strokeDasharray={150.8}
              strokeDashoffset={150.8 * (1 - autoplayProgress)}
              className="transition-[stroke-dashoffset] duration-75"
            />
          </svg>

          {/* Arrow Icon */}
          <div className="relative z-10">
            <AnimatedIcon type="arrow-right" size={18} />
          </div>
        </button>
      </div>

      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isPaused && `Slide ${index + 1} of ${HERO_CONFIG.slides.length}: ${currentSlide.headline}`}
      </div>
    </div>
  );
};
