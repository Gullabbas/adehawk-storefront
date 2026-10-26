'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface BrandedImageProps extends ImageProps {
  fallbackSrc?: string;
  fallbackText?: string;
}

export const BrandedImage: React.FC<BrandedImageProps> = ({
  src,
  alt,
  fallbackSrc,
  fallbackText = 'ADEHAWK',
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    if (fallbackSrc) {
      return (
        <Image
          src={fallbackSrc}
          alt={alt}
          className={className}
          onError={() => setHasError(true)}
          {...props}
        />
      );
    }

    // Neutral luxury branded tile
    return (
      <div className={`relative w-full h-full bg-ivory-subtle border border-ink/10 flex flex-col items-center justify-center p-4 select-none ${className}`}>
        <span className="font-serif text-xs uppercase tracking-kicker text-cognac font-medium">
          {fallbackText}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-ink-muted/60 mt-1">
          Artisanal Leather
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};
