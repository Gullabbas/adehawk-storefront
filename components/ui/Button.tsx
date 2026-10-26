'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIcon, IconType } from './AnimatedIcon';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: IconType;
  iconPosition?: 'left' | 'right';
  magnetic?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconPosition = 'right',
  magnetic = false,
  type = 'button',
  disabled = false,
  ariaLabel,
}) => {
  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || shouldReduceMotion || !btnRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.25;
    const y = (clientY - (top + height / 2)) * 0.25;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs tracking-kicker',
    md: 'px-7 py-3.5 text-xs tracking-kicker',
    lg: 'px-9 py-4 text-sm tracking-kicker',
  };

  const variantClasses = {
    primary:
      'bg-ink text-ivory border border-ink hover:text-ivory overflow-hidden group',
    secondary:
      'bg-transparent text-ink border border-ink/20 hover:border-ink hover:text-ink group',
    dark:
      'bg-ivory text-espresso border border-ivory hover:text-espresso overflow-hidden group',
    ghost:
      'bg-transparent text-ink hover:text-cognac border-none px-0 py-1 tracking-widest group',
  };

  const content = (
    <motion.span
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      className="relative z-10 flex items-center justify-center gap-3 font-sans font-medium uppercase"
    >
      {icon && iconPosition === 'left' && (
        <AnimatedIcon
          type={icon}
          size={14}
          isHovered={isHovered}
          className="transition-transform duration-300"
        />
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <AnimatedIcon
          type={icon}
          size={14}
          isHovered={isHovered}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </motion.span>
  );

  // Fill sweep layer
  const fillSweep = (variant === 'primary' || variant === 'dark') && (
    <motion.span
      className={`absolute inset-0 z-0 origin-bottom transition-transform duration-500 ease-luxury ${
        variant === 'primary' ? 'bg-cognac' : 'bg-cognac'
      } ${isHovered && !shouldReduceMotion ? 'scale-y-100' : 'scale-y-0'}`}
    />
  );

  const combinedClass = `relative inline-flex items-center justify-center select-none cursor-pointer transition-colors duration-300 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        // @ts-expect-error ref assignment
        ref={btnRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={combinedClass}
        aria-label={ariaLabel}
      >
        {fillSweep}
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      // @ts-expect-error ref assignment
      ref={btnRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${combinedClass} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      aria-label={ariaLabel}
    >
      {fillSweep}
      {content}
    </button>
  );
};
