'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type IconType =
  | 'search'
  | 'account'
  | 'heart'
  | 'cart'
  | 'arrow-right'
  | 'arrow-left'
  | 'plus'
  | 'close'
  | 'menu'
  | 'instagram'
  | 'facebook'
  | 'contact';

interface AnimatedIconProps {
  type: IconType;
  size?: number;
  className?: string;
  isHovered?: boolean;
  isActive?: boolean;
  badgeCount?: number;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  type,
  size = 20,
  className = '',
  isHovered = false,
  isActive = false,
  badgeCount,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // 1. Search Lens: tilts and wiggles
  if (type === 'search') {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        animate={
          isHovered && !shouldReduceMotion
            ? {
                rotate: [0, -14, 10, -6, 0],
                scale: [1, 1.08, 1],
                transition: { duration: 0.5, ease: 'easeOut' },
              }
            : { rotate: 0, scale: 1 }
        }
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </motion.svg>
    );
  }

  // 2. Account: silhouette nods
  if (type === 'account') {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <motion.circle
          cx="12"
          cy="7"
          r="4"
          animate={
            isHovered && !shouldReduceMotion
              ? {
                  y: [0, 2.5, -1, 0],
                  transition: { duration: 0.45, ease: 'easeInOut' },
                }
              : { y: 0 }
          }
        />
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      </motion.svg>
    );
  }

  // 3. Heart: fills with a pulse
  if (type === 'heart') {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={isActive ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        animate={
          (isHovered || isActive) && !shouldReduceMotion
            ? {
                scale: [1, 1.25, 0.95, 1.1, 1],
                transition: { duration: 0.55, ease: 'easeOut' },
              }
            : { scale: 1 }
        }
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </motion.svg>
    );
  }

  // 4. Cart Bag: bumps and count springs
  if (type === 'cart') {
    return (
      <div className="relative inline-flex items-center justify-center">
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          animate={
            isHovered && !shouldReduceMotion
              ? {
                  y: [0, -3.5, 2, -1, 0],
                  rotate: [0, -4, 3, 0],
                  transition: { duration: 0.45, ease: 'easeOut' },
                }
              : { y: 0, rotate: 0 }
          }
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </motion.svg>
        {typeof badgeCount === 'number' && badgeCount > 0 && (
          <motion.span
            key={badgeCount}
            initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 bg-ink text-ivory text-[10px] font-sans font-semibold rounded-full flex items-center justify-center"
          >
            {badgeCount}
          </motion.span>
        )}
      </div>
    );
  }

  // 5. Arrow Right: slides & extends
  if (type === 'arrow-right') {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <motion.line
          x1="5"
          y1="12"
          x2="19"
          y2="12"
          animate={
            isHovered && !shouldReduceMotion
              ? { x2: [19, 21, 19], transition: { duration: 0.3 } }
              : { x2: 19 }
          }
        />
        <motion.polyline
          points="12 5 19 12 12 19"
          animate={
            isHovered && !shouldReduceMotion
              ? { x: [0, 3, 0], transition: { duration: 0.3 } }
              : { x: 0 }
          }
        />
      </motion.svg>
    );
  }

  // 6. Arrow Left: slides backward
  if (type === 'arrow-left') {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <motion.line
          x1="19"
          y1="12"
          x2="5"
          y2="12"
          animate={
            isHovered && !shouldReduceMotion
              ? { x2: [5, 3, 5], transition: { duration: 0.3 } }
              : { x2: 5 }
          }
        />
        <motion.polyline
          points="12 19 5 12 12 5"
          animate={
            isHovered && !shouldReduceMotion
              ? { x: [0, -3, 0], transition: { duration: 0.3 } }
              : { x: 0 }
          }
        />
      </motion.svg>
    );
  }

  // 7. Plus: rotates into cross
  if (type === 'plus') {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        animate={
          (isHovered || isActive) && !shouldReduceMotion
            ? { rotate: 45, transition: { duration: 0.35, ease: 'easeOut' } }
            : { rotate: 0 }
        }
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </motion.svg>
    );
  }

  // 8. Close: gentle shrink/expand
  if (type === 'close') {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        animate={
          isHovered && !shouldReduceMotion
            ? { rotate: 90, scale: 0.9, transition: { duration: 0.3 } }
            : { rotate: 0, scale: 1 }
        }
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </motion.svg>
    );
  }

  // 9. Menu / Hamburger: fold animation
  if (type === 'menu') {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <motion.line
          x1="4"
          y1="8"
          x2="20"
          y2="8"
          animate={
            isActive && !shouldReduceMotion
              ? { rotate: 45, y: 4, originX: 0.5, originY: 0.5 }
              : isHovered && !shouldReduceMotion
              ? { x2: 17 }
              : { x2: 20 }
          }
          transition={{ duration: 0.25 }}
        />
        <motion.line
          x1="4"
          y1="16"
          x2="20"
          y2="16"
          animate={
            isActive && !shouldReduceMotion
              ? { rotate: -45, y: -4, originX: 0.5, originY: 0.5 }
              : isHovered && !shouldReduceMotion
              ? { x1: 7 }
              : { x1: 4 }
          }
          transition={{ duration: 0.25 }}
        />
      </motion.svg>
    );
  }

  // 10. Contact / Phone / Mail: ring-shake vibration
  if (type === 'contact') {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        animate={
          isHovered && !shouldReduceMotion
            ? {
                rotate: [0, -12, 12, -8, 8, -4, 0],
                transition: { duration: 0.5 },
              }
            : { rotate: 0 }
        }
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L1 7" />
      </motion.svg>
    );
  }

  // 11. Instagram
  if (type === 'instagram') {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        animate={
          isHovered && !shouldReduceMotion
            ? { scale: 1.15, rotate: -4, transition: { duration: 0.3 } }
            : { scale: 1, rotate: 0 }
        }
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </motion.svg>
    );
  }

  // 12. Facebook
  if (type === 'facebook') {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        animate={
          isHovered && !shouldReduceMotion
            ? { scale: 1.15, y: -2, transition: { duration: 0.3 } }
            : { scale: 1, y: 0 }
        }
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </motion.svg>
    );
  }

  return null;
};
