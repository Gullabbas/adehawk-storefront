'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { HERO_CONFIG, HeroSlide } from './hero.config';

interface HeroFallbackProps {
  currentIndex: number;
  nextIndex: number;
  progress: number;
  direction: number;
}

export const HeroFallback: React.FC<HeroFallbackProps> = ({
  currentIndex,
  nextIndex,
  progress,
  direction,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const slides: HeroSlide[] = HERO_CONFIG.slides;

  // Clip path calculation based on progress and direction
  const clipPercent = (1 - progress) * 100;
  const clipPath =
    direction > 0
      ? `inset(0 0 0 ${clipPercent}%)` // next slide reveals from right to left
      : `inset(0 ${clipPercent}% 0 0)`; // prev slide reveals from left to right

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-espresso select-none">
      {slides.map((slide, idx) => {
        const isCurrent = idx === currentIndex;
        const isNext = idx === nextIndex && progress > 0;

        if (!isCurrent && !isNext) return null;

        if (shouldReduceMotion) {
          // Plain crossfade for reduced motion
          return (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: isCurrent ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={slide.desktopImage}
                alt={slide.headline}
                fill
                priority={idx === 0}
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          );
        }

        return (
          <div
            key={slide.id}
            className="absolute inset-0 w-full h-full"
            style={{
              zIndex: isNext ? 2 : 1,
              clipPath: isNext ? clipPath : 'none',
            }}
          >
            <motion.div
              className="relative w-full h-full"
              style={{
                scale: isCurrent ? 1.0 + 0.08 * progress : 1.3 - 0.3 * progress,
              }}
            >
              <Image
                src={slide.desktopImage}
                alt={slide.headline}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
