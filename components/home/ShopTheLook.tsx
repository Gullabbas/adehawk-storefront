'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { useCartStore } from '@/store/useCartStore';

interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  price: number;
  handle: string;
  image: string;
  category: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'spot-1',
    x: 24,
    y: 58,
    title: 'Black Leather Executive Briefcase',
    price: 90,
    handle: 'black-leather-executive-briefcase',
    image: '/assets/products/Black Leather Executive Briefcase.jpg',
    category: 'Executive Briefcase',
  },
  {
    id: 'spot-2',
    x: 52,
    y: 42,
    title: 'Cowhide Leather Duffle Bag',
    price: 130,
    handle: 'cowhide-leather-duffle-bag',
    image: '/assets/products/Cowhide Leather Duffle Bag.webp',
    category: 'Travel Weekender',
  },
  {
    id: 'spot-3',
    x: 78,
    y: 65,
    title: 'Brown Leather Laptop Sleeve Bag',
    price: 80,
    handle: 'brown-leather-laptop-sleeve-bag',
    image: '/assets/products/Brown Leather Laptop Sleeve Bag.webp',
    category: 'Laptop Protection',
  },
];

export const ShopTheLook: React.FC = () => {
  const [activeSpot, setActiveSpot] = useState<Hotspot | null>(null);
  const { addItem } = useCartStore();

  return (
    <section className="bg-ivory py-24 sm:py-32 border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-12 space-y-3">
          <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium">
            Interactive Editorial Lookbook
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-ink">
            Shop the Look
          </h2>
          <p className="text-sm sm:text-base text-ink-muted max-w-lg font-sans">
            Tap the subtle pulse markers to discover handcrafted leather companions in their natural harmony.
          </p>
        </div>

        {/* Interactive Canvas */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-ivory-subtle border border-ink/10 shadow-2xl overflow-hidden">
          <Image
            src="/assets/products/Shop the Look bags.webp"
            alt="Adehawk Leather Goods - Shop the Look Collection"
            fill
            sizes="100vw"
            className="object-cover"
          />

          {/* Hotspots */}
          {HOTSPOTS.map(spot => {
            const isActive = activeSpot?.id === spot.id;
            return (
              <div
                key={spot.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              >
                {/* Hotspot Pulse Trigger Button */}
                <button
                  onClick={() => setActiveSpot(isActive ? null : spot)}
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                    isActive ? 'scale-110 bg-cognac text-ivory' : 'bg-ivory/90 text-ink shadow-lg'
                  }`}
                  aria-label={`View ${spot.title}`}
                >
                  {/* Subtle Radar Ripple */}
                  <span className="absolute inset-0 rounded-full animate-ping bg-cognac/30 pointer-events-none" />
                  <AnimatedIcon
                    type="plus"
                    size={16}
                    isActive={isActive}
                  />
                </button>

                {/* Popover Product Card */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="absolute left-1/2 bottom-12 -translate-x-1/2 w-64 p-3 bg-ivory text-ink border border-ink/15 shadow-2xl z-30 space-y-2 text-left"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-14 h-16 bg-ivory-subtle shrink-0 border border-ink/10 overflow-hidden">
                          <Image
                            src={spot.image}
                            alt={spot.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="text-[9px] uppercase tracking-kicker text-cognac font-sans font-medium">
                            {spot.category}
                          </span>
                          <h4 className="font-serif text-xs font-medium text-ink line-clamp-1">
                            {spot.title}
                          </h4>
                          <span className="font-sans text-xs font-semibold text-ink mt-0.5">
                            £{spot.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() =>
                            addItem({
                              productId: spot.id,
                              title: spot.title,
                              handle: spot.handle,
                              price: spot.price,
                              image: spot.image,
                            })
                          }
                          className="flex-1 py-1.5 px-2 bg-ink text-ivory text-[10px] uppercase tracking-kicker font-sans hover:bg-cognac transition-colors cursor-pointer text-center"
                        >
                          Quick Add
                        </button>
                        <Link
                          href={`/products/${spot.handle}`}
                          className="py-1.5 px-3 border border-ink/20 text-ink text-[10px] uppercase tracking-kicker font-sans hover:border-ink transition-colors text-center"
                        >
                          View
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
