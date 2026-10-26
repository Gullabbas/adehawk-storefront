'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';

export const CustomCursor: React.FC = () => {
  const { cursorVariant, cursorText } = useUIStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable custom cursor for precision pointer devices (desktop mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handlePointerChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mediaQuery.addEventListener('change', handlePointerChange);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      mediaQuery.removeEventListener('change', handlePointerChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isFinePointer || shouldReduceMotion || !isVisible || cursorVariant === 'hidden') {
    return null;
  }

  const isTextCursor = ['drag', 'view', 'explore'].includes(cursorVariant);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center select-none"
      style={{
        x: cursorX,
        y: cursorY,
      }}
      animate={{
        width: isTextCursor ? 76 : 14,
        height: isTextCursor ? 76 : 14,
        backgroundColor: isTextCursor ? '#12100E' : 'rgba(18, 16, 14, 0.75)',
        color: '#FBF9F5',
        scale: isTextCursor ? 1 : 1,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      {isTextCursor && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="font-sans text-[11px] font-semibold tracking-widest uppercase text-ivory text-center"
        >
          {cursorText || cursorVariant}
        </motion.span>
      )}
    </motion.div>
  );
};
