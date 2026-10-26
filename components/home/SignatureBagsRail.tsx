'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Product } from '@/lib/commerce/types';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Button } from '@/components/ui/Button';

interface SignatureBagsRailProps {
  products: Product[];
}

export const SignatureBagsRail: React.FC<SignatureBagsRailProps> = ({ products }) => {
  const railRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const shouldReduceMotion = useReducedMotion();

  const bagProducts = products.filter(p => p.category === 'bags').slice(0, 8);

  const scrollLeft = () => {
    if (railRef.current) {
      railRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (railRef.current) {
      railRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-ivory py-20 sm:py-28 overflow-hidden border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block mb-2">
            Signature Pieces
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-ink">
            Handcrafted Bags
          </h2>
        </div>

        {/* Rail Arrow Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={scrollLeft}
            className="w-12 h-12 rounded-full border border-ink/20 flex items-center justify-center text-ink hover:border-ink hover:bg-ink hover:text-ivory transition-all cursor-pointer"
            aria-label="Previous bags"
          >
            <AnimatedIcon type="arrow-left" size={18} />
          </button>
          <button
            onClick={scrollRight}
            className="w-12 h-12 rounded-full border border-ink/20 flex items-center justify-center text-ink hover:border-ink hover:bg-ink hover:text-ivory transition-all cursor-pointer"
            aria-label="Next bags"
          >
            <AnimatedIcon type="arrow-right" size={18} />
          </button>
        </div>
      </div>

      {/* Draggable Rail */}
      <div
        ref={railRef}
        className="flex gap-6 overflow-x-auto scrollbar-none px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {bagProducts.map(product => {
          const inWishlist = isInWishlist(product.id);
          return (
            <motion.div
              key={product.id}
              whileHover={shouldReduceMotion ? {} : { y: -6 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start bg-ivory-subtle border border-ink/10 group flex flex-col justify-between"
            >
              {/* Product Card Image Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory">
                <Link href={`/products/${product.handle}`} className="block w-full h-full">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="320px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-luxury"
                  />
                </Link>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-ivory/80 backdrop-blur-sm rounded-full text-ink hover:text-cognac transition-colors border border-ink/10 cursor-pointer z-10"
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <AnimatedIcon type="heart" size={16} isActive={inWishlist} />
                </button>

                {/* Quick Add Overlay on Hover */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <Button
                    onClick={() =>
                      addItem({
                        productId: product.id,
                        title: product.title,
                        handle: product.handle,
                        price: product.price,
                        image: product.images[0],
                        colorName: product.colors[0]?.name,
                      })
                    }
                    variant="primary"
                    size="sm"
                    className="w-full shadow-lg"
                    icon="plus"
                  >
                    Quick Add · £{product.price.toFixed(2)}
                  </Button>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-5 flex flex-col space-y-1">
                <span className="text-[10px] uppercase tracking-kicker text-cognac font-sans font-medium">
                  {product.colors.length > 1
                    ? `${product.colors.length} Colours Available`
                    : 'Artisan Full Grain'}
                </span>
                <Link
                  href={`/products/${product.handle}`}
                  className="font-serif text-lg font-normal text-ink hover:text-cognac transition-colors line-clamp-1"
                >
                  {product.title}
                </Link>
                <div className="flex items-center justify-between pt-1 font-sans">
                  <span className="text-sm font-semibold text-ink">
                    £{product.price.toFixed(2)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xs text-ink-muted line-through">
                      £{product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
