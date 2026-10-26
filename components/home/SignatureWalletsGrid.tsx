'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/commerce/types';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Button } from '@/components/ui/Button';

interface SignatureWalletsGridProps {
  products: Product[];
}

export const SignatureWalletsGrid: React.FC<SignatureWalletsGridProps> = ({ products }) => {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  // Selected color image map: { [productId]: { image: string, colorName: string } }
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, { image: string; colorName: string }>
  >({});

  const walletProducts = products.filter(p => p.category === 'wallets').slice(0, 6);

  const handleSelectColor = (productId: string, colorName: string, image: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: { image, colorName },
    }));
  };

  return (
    <section className="bg-ivory py-24 sm:py-32 border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block mb-2">
              Everyday Carry Sets
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-ink">
              Signature Wallets & Gifts
            </h2>
          </div>
          <Link
            href="/collections/wallets"
            className="text-xs uppercase tracking-kicker font-sans text-ink-muted hover:text-cognac transition-colors flex items-center gap-2"
          >
            <span>View All Wallet Gift Sets</span>
            <span>→</span>
          </Link>
        </div>

        {/* Refined Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {walletProducts.map(product => {
            const activeVariant = selectedVariants[product.id] || {
              image: product.images[0],
              colorName: product.colors[0]?.name || '',
            };
            const inWishlist = isInWishlist(product.id);

            return (
              <div
                key={product.id}
                className="group bg-ivory-subtle border border-ink/10 flex flex-col justify-between overflow-hidden"
              >
                {/* Image Showcase */}
                <div className="relative aspect-[4/5] w-full bg-ivory overflow-hidden">
                  <Link href={`/products/${product.handle}`} className="block w-full h-full">
                    <Image
                      src={activeVariant.image}
                      alt={`${product.title} - ${activeVariant.colorName}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
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

                  {/* Quick Add Button */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <Button
                      onClick={() =>
                        addItem({
                          productId: product.id,
                          title: product.title,
                          handle: product.handle,
                          price: product.price,
                          image: activeVariant.image,
                          colorName: activeVariant.colorName,
                        })
                      }
                      variant="primary"
                      size="sm"
                      className="w-full shadow-lg"
                      icon="plus"
                    >
                      Add to Bag · £{product.price.toFixed(2)}
                    </Button>
                  </div>
                </div>

                {/* Card Content & Color Swatches */}
                <div className="p-6 space-y-3">
                  {/* Swatches */}
                  {product.colors.length > 0 && (
                    <div className="flex items-center gap-2">
                      {product.colors.map(col => {
                        const isSelected = activeVariant.colorName === col.name;
                        return (
                          <button
                            key={col.name}
                            onClick={() =>
                              handleSelectColor(product.id, col.name, col.image)
                            }
                            title={col.name}
                            className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                              isSelected
                                ? 'scale-115 border-ink ring-2 ring-cognac/40'
                                : 'border-ink/20 opacity-80 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: col.hex }}
                            aria-label={`Select ${col.name} colour`}
                          />
                        );
                      })}
                      <span className="text-[11px] font-sans text-ink-muted ml-1">
                        {activeVariant.colorName}
                      </span>
                    </div>
                  )}

                  <Link
                    href={`/products/${product.handle}`}
                    className="font-serif text-xl font-normal text-ink hover:text-cognac transition-colors block line-clamp-1"
                  >
                    {product.title}
                  </Link>

                  <div className="flex items-center justify-between pt-1 border-t border-ink/10">
                    <span className="text-sm font-sans font-semibold text-ink">
                      £{product.price.toFixed(2)}
                    </span>
                    <span className="text-xs uppercase tracking-kicker text-ink-muted">
                      Set with Key Loop
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
