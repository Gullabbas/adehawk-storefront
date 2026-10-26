'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { RollingNumber } from '@/components/ui/RollingNumber';
import { useCartStore } from '@/store/useCartStore';

interface WalletVariant {
  id: string;
  name: string;
  hex: string;
  tint: string;
  image: string;
  handle: string;
}

interface WalletModel {
  id: 'ultra-slim' | 'thick';
  title: string;
  outlineWord: string;
  basePrice: number;
  description: string;
  variants: WalletVariant[];
}

const WALLET_MODELS: WalletModel[] = [
  {
    id: 'ultra-slim',
    title: 'Ultra-Slim Long Wallet & Keychain Gift Set',
    outlineWord: 'Ultra-Slim',
    basePrice: 35,
    description: 'Precision-cut slim profile with multi-card organization and matching solid brass keychain loop.',
    variants: [
      {
        id: 'us-black',
        name: 'Black',
        hex: '#1C1B1A',
        tint: 'rgba(28, 27, 26, 0.16)',
        image: '/assets/products/ultra-slim-black-leather-long-wallet-and-keychain-gift-set.webp',
        handle: 'ultra-slim-black-leather-long-wallet-keychain-gift-set',
      },
      {
        id: 'us-brown',
        name: 'Brown',
        hex: '#4A3324',
        tint: 'rgba(74, 51, 36, 0.18)',
        image: '/assets/products/ultra-slim-brown-leather-long-wallet-and-keychain-gift-set.webp',
        handle: 'ultra-slim-brown-leather-long-wallet-keychain-gift-set',
      },
      {
        id: 'us-olive',
        name: 'Olive Green',
        hex: '#3E4B37',
        tint: 'rgba(62, 75, 55, 0.18)',
        image: '/assets/products/ultra-slim-olive-green-leather-long-wallet-and-keychain-gift-set.webp',
        handle: 'ultra-slim-olive-green-leather-long-wallet-keychain-gift-set',
      },
      {
        id: 'us-red',
        name: 'Red',
        hex: '#872323',
        tint: 'rgba(135, 35, 35, 0.16)',
        image: '/assets/products/ultra-slim-red-leather-long-wallet-and-keychain-gift-set.webp',
        handle: 'ultra-slim-red-leather-long-wallet',
      },
    ],
  },
  {
    id: 'thick',
    title: 'Thick Genuine Leather Long Wallet & Keychain Gift Set',
    outlineWord: 'Thick',
    basePrice: 40,
    description: 'Generous full-capacity dual billfold compartments, reinforced heavy-gauge stitching, and matching handcrafted keychain.',
    variants: [
      {
        id: 'th-black',
        name: 'Black',
        hex: '#1C1B1A',
        tint: 'rgba(28, 27, 26, 0.16)',
        image: '/assets/products/thick-black-leather-long-wallet-and-keychain-gift-set.webp',
        handle: 'thick-black-leather-long-wallet-keychain-gift-set',
      },
      {
        id: 'th-brown',
        name: 'Brown',
        hex: '#4A3324',
        tint: 'rgba(74, 51, 36, 0.18)',
        image: '/assets/products/thick-brown-leather-long-wallet-and-keychain-gift-set.webp',
        handle: 'thick-brown-leather-long-wallet-keychain-gift-set',
      },
      {
        id: 'th-forest',
        name: 'Forest Green',
        hex: '#263B2B',
        tint: 'rgba(38, 59, 43, 0.18)',
        image: '/assets/products/thick-forest-green-leather-long-wallet-and-keychain-gift-set.webp',
        handle: 'thick-forest-green-leather-long-wallet-keychain-gift-set',
      },
      {
        id: 'th-red',
        name: 'Red',
        hex: '#872323',
        tint: 'rgba(135, 35, 35, 0.16)',
        image: '/assets/products/thick-red-genuine-leather-long-wallet-and-keychain-gift-set.webp',
        handle: 'thick-red-genuine-leather-long-wallet-keychain-gift-set',
      },
    ],
  },
];

export const WalletStudio: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<'ultra-slim' | 'thick'>('ultra-slim');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [revealingImage, setRevealingImage] = useState<string | null>(null);
  const [revealOrigin, setRevealOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isAdding, setIsAdding] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const walletImgRef = useRef<HTMLDivElement>(null);
  const filmStripRef = useRef<HTMLDivElement>(null);
  const { addItem, openCart } = useCartStore();

  const currentModel = WALLET_MODELS.find(m => m.id === selectedModelId) || WALLET_MODELS[0];
  const currentVariant = currentModel.variants[selectedVariantIndex] || currentModel.variants[0];

  // Pointer tilt physics for the wallet product stage
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!stageRef.current || !walletImgRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width - 0.5;
    const yRel = (e.clientY - rect.top) / rect.height - 0.5;

    // Max 6 degrees tilt
    gsap.to(walletImgRef.current, {
      rotateY: xRel * 12,
      rotateX: -yRel * 12,
      transformPerspective: 1000,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (!walletImgRef.current) return;
    gsap.to(walletImgRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }, []);

  // Swatch selection with circular clip-path expansion
  const selectVariant = (index: number, event?: React.MouseEvent) => {
    if (index === selectedVariantIndex) return;

    const nextVariant = currentModel.variants[index];
    if (!nextVariant) return;

    if (event && stageRef.current) {
      const stageRect = stageRef.current.getBoundingClientRect();
      const clickX = ((event.clientX - stageRect.left) / stageRect.width) * 100;
      const clickY = ((event.clientY - stageRect.top) / stageRect.height) * 100;
      setRevealOrigin({ x: Math.max(0, Math.min(100, clickX)), y: Math.max(0, Math.min(100, clickY)) });
    } else {
      setRevealOrigin({ x: 50, y: 50 });
    }

    setRevealingImage(nextVariant.image);
    setSelectedVariantIndex(index);

    // Timeout to clear revealing layer after animation
    setTimeout(() => {
      setRevealingImage(null);
    }, 800);
  };

  const handleModelChange = (modelId: 'ultra-slim' | 'thick') => {
    if (modelId === selectedModelId) return;
    setSelectedModelId(modelId);
    setSelectedVariantIndex(0);
    setRevealingImage(null);
  };

  // Fly-to-cart choreography
  const handleAddToCart = () => {
    if (isAdding) return;
    setIsAdding(true);

    const cartIcon = document.querySelector('[data-cart-icon="true"]') as HTMLElement | null;
    const walletEl = walletImgRef.current;

    if (!cartIcon || !walletEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Direct add
      addItem({
        productId: currentVariant.id,
        title: `${currentModel.title} - ${currentVariant.name}`,
        handle: currentVariant.handle,
        price: currentModel.basePrice,
        image: currentVariant.image,
      });
      setIsAdding(false);
      openCart();
      return;
    }

    const startRect = walletEl.getBoundingClientRect();
    const endRect = cartIcon.getBoundingClientRect();

    // Create cloned fly thumbnail
    const clone = document.createElement('div');
    clone.style.position = 'fixed';
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    clone.style.width = '120px';
    clone.style.height = '150px';
    clone.style.left = `${startRect.left + startRect.width / 2 - 60}px`;
    clone.style.top = `${startRect.top + startRect.height / 2 - 75}px`;
    clone.style.backgroundImage = `url("${currentVariant.image}")`;
    clone.style.backgroundSize = 'contain';
    clone.style.backgroundPosition = 'center';
    clone.style.backgroundRepeat = 'no-repeat';
    clone.style.borderRadius = '8px';
    clone.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
    clone.style.transition = 'none';
    document.body.appendChild(clone);

    const tl = gsap.timeline({
      onComplete: () => {
        if (clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
        addItem({
          productId: currentVariant.id,
          title: `${currentModel.title} - ${currentVariant.name}`,
          handle: currentVariant.handle,
          price: currentModel.basePrice,
          image: currentVariant.image,
        });
        setIsAdding(false);

        // Icon bump
        gsap.fromTo(
          cartIcon,
          { scale: 1.35 },
          { scale: 1, duration: 0.45, ease: 'back.out(2)' }
        );
      },
    });

    // Curved bezier path to header cart
    const targetX = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
    const targetY = endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);

    tl.to(clone, {
      x: targetX,
      y: targetY,
      scale: 0.18,
      opacity: 0.4,
      duration: 0.75,
      ease: 'power2.inOut',
    });
  };

  return (
    <section
      id="wallets-section"
      className="relative bg-ivory text-ink py-24 sm:py-32 overflow-hidden border-t border-ink/10 transition-colors duration-700"
      style={{
        backgroundColor: '#FBF9F5',
      }}
    >
      {/* Morphing Background Radial Tint - Tokenized swatch colors, rendered BEHIND product */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out z-0"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${currentVariant.tint} 0%, rgba(251, 249, 245, 0) 65%)`,
        }}
      />

      {/* Giant Parallax Outlined Model Word */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 text-center whitespace-nowrap opacity-[0.05]"
        style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: 'clamp(5rem, 18vw, 15rem)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          WebkitTextStroke: '1.5px currentColor',
          color: 'transparent',
        }}
      >
        {currentModel.outlineWord}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Model Pill Toggle */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
          <span className="text-[11px] uppercase tracking-widest text-cognac font-sans font-semibold mb-3">
            Handmade Leather Goods · Wallet Studio
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-ink tracking-tight mb-4">
            Curated Gift Sets
          </h2>
          <p className="text-sm sm:text-base text-ink-muted max-w-xl font-sans font-normal mb-8">
            Complete leather gift sets featuring an ultra-slim or full-capacity billfold paired with a solid brass handmade keychain.
          </p>

          {/* Model Toggle Pill */}
          <div className="relative inline-flex p-1 rounded-full bg-ink/5 border border-ink/10 backdrop-blur-md">
            <button
              onClick={() => handleModelChange('ultra-slim')}
              className={`relative px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-sans tracking-wide transition-all duration-300 cursor-pointer ${
                selectedModelId === 'ultra-slim'
                  ? 'bg-ink text-ivory font-medium shadow-md'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Ultra-Slim Gift Set
            </button>
            <button
              onClick={() => handleModelChange('thick')}
              className={`relative px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-sans tracking-wide transition-all duration-300 cursor-pointer ${
                selectedModelId === 'thick'
                  ? 'bg-ink text-ivory font-medium shadow-md'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Thick Genuine Leather Set
            </button>
          </div>
        </div>

        {/* Studio Center Stage */}
        <div
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative max-w-4xl mx-auto aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center my-4"
        >
          {/* Main Wallet Stage Container */}
          <div
            ref={walletImgRef}
            className="relative w-full h-full max-w-lg max-h-[460px] flex items-center justify-center transition-transform duration-100 ease-out will-change-transform"
          >
            {/* Primary Base Image (Pixel-true, untouched) */}
            <div className="relative w-full h-full">
              <Image
                src={currentVariant.image}
                alt={`${currentModel.title} in ${currentVariant.name}`}
                fill
                priority
                sizes="(max-width: 768px) 90vw, 520px"
                className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)] select-none pointer-events-none"
              />
            </div>

            {/* Circular Clip-Path Expanding Swatch Reveal Layer */}
            <AnimatePresence>
              {revealingImage && (
                <motion.div
                  key={revealingImage}
                  initial={{
                    clipPath: `circle(0% at ${revealOrigin.x}% ${revealOrigin.y}%)`,
                  }}
                  animate={{
                    clipPath: `circle(150% at ${revealOrigin.x}% ${revealOrigin.y}%)`,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <Image
                    src={revealingImage}
                    alt={`${currentModel.title} Reveal`}
                    fill
                    sizes="(max-width: 768px) 90vw, 520px"
                    className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Model Details & Swatch Controls */}
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center mt-6 space-y-6">
          {/* Title & Rolling Price */}
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-ink">
              {currentModel.title}
            </h3>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="font-sans text-xs text-ink-muted uppercase tracking-wider">GBP</span>
              <RollingNumber
                value={currentModel.basePrice}
                prefix="£"
                className="font-sans text-2xl sm:text-3xl font-semibold text-ink"
              />
              <span className="font-sans text-xs text-ink-muted">.00</span>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted mt-2 max-w-md mx-auto font-sans">
              Selected Color: <strong className="text-ink font-medium">{currentVariant.name}</strong>
            </p>
          </div>

          {/* Magnetic Color Swatches */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 py-2">
            {currentModel.variants.map((variant, idx) => {
              const isSelected = idx === selectedVariantIndex;
              return (
                <button
                  key={variant.id}
                  onClick={(e) => selectVariant(idx, e)}
                  className="group relative flex flex-col items-center cursor-pointer p-1.5 focus:outline-none"
                  aria-label={`Select ${variant.name} leather`}
                >
                  {/* Swatch circle with highlight ring */}
                  <div
                    className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-transform duration-300 flex items-center justify-center shadow-md ${
                      isSelected ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                    style={{ backgroundColor: variant.hex }}
                  >
                    {isSelected && (
                      <span className="absolute -inset-1.5 rounded-full border-2 border-cognac pointer-events-none" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-sans mt-2 transition-colors ${
                      isSelected ? 'text-ink font-semibold' : 'text-ink-muted group-hover:text-ink'
                    }`}
                  >
                    {variant.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full sm:w-auto px-8 py-3.5 bg-ink text-ivory text-xs uppercase tracking-widest font-sans font-medium hover:bg-cognac active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              {isAdding ? 'Adding to bag...' : 'Add to Bag'}
            </button>
            <Link
              href="/collections/wallets"
              className="w-full sm:w-auto px-7 py-3.5 border border-ink/20 text-ink text-xs uppercase tracking-widest font-sans font-medium hover:border-ink hover:bg-ink/5 transition-all text-center"
            >
              View All Wallets
            </Link>
          </div>
        </div>

        {/* Draggable Film Strip */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-ink/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider text-ink-muted font-sans font-medium">
              Variant Strip · {currentModel.variants.length} finishes
            </span>
            <span className="text-[11px] text-ink-muted font-sans hidden sm:inline-block">
              Click thumbnail to swap preview
            </span>
          </div>

          <div
            ref={filmStripRef}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {currentModel.variants.map((v, idx) => {
              const isSelected = idx === selectedVariantIndex;
              return (
                <button
                  key={v.id}
                  onClick={(e) => selectVariant(idx, e)}
                  className={`relative flex-shrink-0 w-36 sm:w-44 p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer snap-start ${
                    isSelected
                      ? 'border-cognac bg-ivory shadow-lg scale-102 ring-1 ring-cognac'
                      : 'border-ink/10 bg-ivory/60 hover:border-ink/30 hover:bg-ivory'
                  }`}
                >
                  <div className="relative w-full aspect-[4/3] bg-ink/5 rounded-lg overflow-hidden mb-2">
                    <Image
                      src={v.image}
                      alt={v.name}
                      fill
                      sizes="180px"
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-medium text-ink">
                      {v.name}
                    </span>
                    <span
                      className="w-3 h-3 rounded-full border border-black/10"
                      style={{ backgroundColor: v.hex }}
                    />
                  </div>
                  <span className="text-[10px] text-ink-muted font-sans mt-0.5 block">
                    £{currentModel.basePrice}.00
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
