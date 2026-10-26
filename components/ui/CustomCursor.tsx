'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useUIStore } from '@/store/useUIStore';

export const CustomCursor: React.FC = () => {
  const { cursorVariant, cursorText } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  const quickX = useRef<((value: number) => void) | null>(null);
  const quickY = useRef<((value: number) => void) | null>(null);
  const dotX = useRef<((value: number) => void) | null>(null);
  const dotY = useRef<((value: number) => void) | null>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mq.matches);

    const handlePointerChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };
    mq.addEventListener('change', handlePointerChange);

    return () => {
      mq.removeEventListener('change', handlePointerChange);
    };
  }, []);

  useEffect(() => {
    if (!mounted || !isFinePointer || !followerRef.current || !dotRef.current) return;

    // Initialize gsap.quickTo for smooth 60fps tracking
    quickX.current = gsap.quickTo(followerRef.current, 'x', {
      duration: 0.35,
      ease: 'power3.out',
    });
    quickY.current = gsap.quickTo(followerRef.current, 'y', {
      duration: 0.35,
      ease: 'power3.out',
    });

    dotX.current = gsap.quickTo(dotRef.current, 'x', {
      duration: 0.08,
      ease: 'none',
    });
    dotY.current = gsap.quickTo(dotRef.current, 'y', {
      duration: 0.08,
      ease: 'none',
    });

    const handlePointerMove = (e: PointerEvent) => {
      if (dotX.current && dotY.current) {
        dotX.current(e.clientX);
        dotY.current(e.clientY);
      }
      if (quickX.current && quickY.current) {
        quickX.current(e.clientX);
        quickY.current(e.clientY);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [mounted, isFinePointer]);

  if (!mounted || !isFinePointer || cursorVariant === 'hidden') {
    return null;
  }

  const isDrag = cursorVariant === 'drag';
  const isView = cursorVariant === 'view';
  const isExplore = cursorVariant === 'explore';
  const hasLabel = isDrag || isView || isExplore;

  return createPortal(
    <div
      className="pointer-events-none fixed top-0 left-0 z-[99999] select-none will-change-transform"
      aria-hidden="true"
    >
      {/* Precision inner center dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-200 ${
          hasLabel ? 'opacity-0 scale-0' : 'w-1.5 h-1.5 bg-ivory opacity-90'
        }`}
      />

      {/* Outer Follower Ring / Morphing Label */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300 ease-luxury shadow-lg"
        style={{
          width: hasLabel ? 76 : 36,
          height: hasLabel ? 76 : 36,
          backgroundColor: hasLabel
            ? 'rgba(18, 16, 14, 0.90)'
            : 'rgba(251, 249, 245, 0.08)',
          border: hasLabel
            ? '1px solid rgba(255, 255, 255, 0.22)'
            : '1px solid rgba(251, 249, 245, 0.35)',
          backdropFilter: hasLabel ? 'blur(16px)' : 'none',
        }}
      >
        {hasLabel && (
          <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-ivory animate-fadeIn">
            {cursorText || (isDrag ? 'Drag' : isView ? 'View' : 'Explore')}
          </span>
        )}
      </div>
    </div>,
    document.body
  );
};
