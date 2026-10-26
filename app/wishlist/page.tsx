'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { Product } from '@/lib/commerce/types';
import { commerce } from '@/lib/commerce';
import { Button } from '@/components/ui/Button';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';

export default function WishlistPage() {
  const { productIds, toggleWishlist, totalItems } = useWishlistStore();
  const { addItem } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await commerce.getProducts();
        setProducts(all.filter(p => productIds.includes(p.id)));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productIds]);

  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24 text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-ink/10 pb-8 mb-12">
          <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block mb-2">
            Saved Pieces
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ink">
            My Wishlist
          </h1>
          <p className="text-xs font-sans uppercase tracking-widest text-ink-muted mt-2">
            {totalItems()} saved items
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-ink-muted font-sans uppercase tracking-widest text-xs">
            Loading wishlist...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 space-y-4 max-w-md mx-auto">
            <AnimatedIcon type="heart" size={44} className="text-ink-muted/50 mx-auto" />
            <p className="font-serif text-3xl text-ink">No saved pieces yet</p>
            <p className="text-sm text-ink-muted font-sans">
              Save your favourite leather pieces to review or purchase anytime.
            </p>
            <div className="pt-2">
              <Button href="/collections/all" variant="primary" size="md">
                Browse Complete Catalogue
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <div
                key={product.id}
                className="group bg-ivory-subtle border border-ink/10 flex flex-col justify-between overflow-hidden"
              >
                <div className="relative aspect-[4/5] w-full bg-ivory overflow-hidden">
                  <Link href={`/products/${product.handle}`} className="block w-full h-full">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-luxury"
                    />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-ivory/80 backdrop-blur-sm rounded-full text-cognac hover:text-ink transition-colors border border-ink/10 cursor-pointer"
                    aria-label="Remove from wishlist"
                  >
                    <AnimatedIcon type="heart" size={16} isActive={true} />
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-kicker text-cognac font-sans font-medium">
                      {product.category}
                    </span>
                    <Link
                      href={`/products/${product.handle}`}
                      className="font-serif text-lg font-normal text-ink hover:text-cognac transition-colors line-clamp-1 block"
                    >
                      {product.title}
                    </Link>
                    <span className="text-sm font-sans font-semibold text-ink mt-1 block">
                      £{product.price.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={() =>
                      addItem({
                        productId: product.id,
                        title: product.title,
                        handle: product.handle,
                        price: product.price,
                        image: product.images[0],
                      })
                    }
                    variant="primary"
                    size="sm"
                    className="w-full"
                    icon="cart"
                  >
                    Move to Bag
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
