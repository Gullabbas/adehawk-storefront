'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CHAPTERS = [
  { id: 'hero-section', label: 'Intro' },
  { id: 'marquee-section', label: 'Ethos' },
  { id: 'collection-section', label: 'Collections' },
  { id: 'craft-section', label: 'The Craft' },
  { id: 'wallets-section', label: 'Wallet Studio' },
  { id: 'lookbook-section', label: 'Spotlight Tour' },
  { id: 'trust-section', label: 'Assurance' },
];

export const ChapterNavigator: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      const progress = total > 0 ? Math.min(1, Math.max(0, current / total)) : 0;
      setScrollProgress(progress);

      // Determine active chapter by section offset
      CHAPTERS.forEach((ch, idx) => {
        const el = document.getElementById(ch.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
            setActiveChapter(idx);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Thin scroll progress line under the header */}
      <div className="fixed top-[69px] sm:top-[77px] left-0 right-0 h-[1.5px] bg-transparent z-[501] pointer-events-none">
        <motion.div
          className="h-full bg-cognac origin-left"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* Right-edge chapter navigator */}
      <nav
        aria-label="Chapter Navigator"
        className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-[450] flex-col space-y-3 pointer-events-auto"
      >
        {CHAPTERS.map((ch, idx) => {
          const isActive = idx === activeChapter;
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={ch.id}
              className="relative flex items-center justify-end"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip Label */}
              <div
                className={`absolute right-6 px-3 py-1 bg-espresso/90 backdrop-blur-md border border-ivory/15 rounded-full text-[10px] uppercase tracking-widest text-ivory font-sans whitespace-nowrap transition-all duration-200 pointer-events-none ${
                  isHovered || isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                }`}
              >
                {ch.label}
              </div>

              {/* Dot */}
              <button
                onClick={() => scrollToSection(ch.id)}
                className="w-4 h-4 flex items-center justify-center cursor-pointer p-0.5"
                aria-label={`Jump to ${ch.label}`}
              >
                <div
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-2.5 h-2.5 bg-cognac ring-4 ring-cognac/25 scale-110'
                      : 'w-1.5 h-1.5 bg-ivory/30 hover:bg-ivory/80'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </nav>
    </>
  );
};
