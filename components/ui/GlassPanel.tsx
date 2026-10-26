import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'light' | 'chip';
  rounded?: 'sm' | 'md' | 'lg' | 'full' | '3xl';
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  variant = 'dark',
  rounded = '3xl',
}) => {
  const roundedClasses = {
    sm: 'rounded-md',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    '3xl': 'rounded-[24px]',
    full: 'rounded-full',
  };

  const variantStyles = {
    dark: 'bg-[rgba(18,14,12,0.52)] border-[rgba(255,255,255,0.14)] text-ivory shadow-[0_16px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.14)]',
    light: 'bg-[rgba(251,249,245,0.65)] border-[rgba(18,16,14,0.12)] text-ink shadow-[0_12px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6)]',
    chip: 'bg-[rgba(18,14,12,0.45)] border-[rgba(255,255,255,0.16)] text-ivory shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.16)]',
  };

  return (
    <div
      className={`backdrop-blur-[22px] backdrop-saturate-[140%] border ${variantStyles[variant]} ${roundedClasses[rounded]} ${className}`}
    >
      {children}
    </div>
  );
};
