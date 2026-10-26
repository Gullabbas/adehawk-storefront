'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/commerce/types';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Button } from '@/components/ui/Button';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  relatedProducts,
}) => {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedColor, setSelectedColor] = useState(product.colors[0] || null);
  const [selectedImage, setSelectedImage] = useState(
    selectedColor?.image || product.images[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('specs');
  const [showStickyBar, setShowStickyBar] = useState(false);

  const mainCtaRef = useRef<HTMLDivElement>(null);

  // Update selected image when color changes
  const handleColorChange = (col: typeof product.colors[0]) => {
    setSelectedColor(col);
    if (col.image) {
      setSelectedImage(col.image);
    }
  };

  // Sticky bottom bar trigger on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (mainCtaRef.current) {
        const rect = mainCtaRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const inWishlist = isInWishlist(product.id);

  // Handle Add To Cart
  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      handle: product.handle,
      price: product.price,
      image: selectedImage,
      colorName: selectedColor?.name,
      quantity,
    });
  };

  const allImages = Array.from(
    new Set([
      ...product.images,
      ...product.colors.map(c => c.image).filter(Boolean),
    ])
  );

  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24 text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-xs uppercase tracking-kicker text-ink-muted font-sans">
            <li>
              <Link href="/" className="hover:text-cognac transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/collections/${product.category}`}
                className="hover:text-cognac transition-colors capitalize"
              >
                {product.category}
              </Link>
            </li>
            <li>/</li>
            <li className="text-ink font-semibold truncate max-w-xs">{product.title}</li>
          </ol>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/5] w-full bg-ivory-subtle border border-ink/10 overflow-hidden shadow-sm">
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 650px"
                className="object-cover transition-all duration-500 ease-luxury"
              />

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-3 bg-ivory/80 backdrop-blur-sm rounded-full text-ink hover:text-cognac transition-colors border border-ink/10 cursor-pointer z-10"
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <AnimatedIcon type="heart" size={20} isActive={inWishlist} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-24 flex-shrink-0 bg-ivory-subtle border transition-all cursor-pointer overflow-hidden ${
                      selectedImage === img
                        ? 'border-ink ring-2 ring-cognac/40'
                        : 'border-ink/15 hover:border-ink/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} preview ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block mb-1">
                Pure Handmade Leather · UK Workshop
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-ink leading-tight">
                {product.title}
              </h1>

              {/* Price & Rating */}
              <div className="flex items-center gap-4 mt-3">
                <span className="font-sans text-2xl font-semibold text-ink">
                  £{product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className="font-sans text-base text-ink-muted line-through">
                    £{product.compareAtPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs uppercase tracking-kicker text-green-800 bg-green-50 px-2.5 py-0.5 border border-green-200">
                  In Stock
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-ink/80 leading-relaxed font-sans">
              {product.description}
            </p>

            {/* Color Variant Selector */}
            {product.colors.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-ink/10">
                <div className="flex justify-between items-center text-xs uppercase tracking-kicker font-sans">
                  <span className="font-semibold text-ink">Colour</span>
                  <span className="text-ink-muted">{selectedColor?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map(col => {
                    const isSelected = selectedColor?.name === col.name;
                    return (
                      <button
                        key={col.name}
                        onClick={() => handleColorChange(col)}
                        className={`group relative p-1 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-ink scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                      >
                        <span
                          className="block w-6 h-6 rounded-full border border-black/10"
                          style={{ backgroundColor: col.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & CTA */}
            <div ref={mainCtaRef} className="space-y-4 pt-4 border-t border-ink/10">
              <div className="flex gap-4">
                {/* Quantity Box */}
                <div className="flex items-center border border-ink/20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-12 flex items-center justify-center text-ink hover:bg-ink/5 transition-colors cursor-pointer text-base"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-sans font-medium text-sm text-ink">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-12 flex items-center justify-center text-ink hover:bg-ink/5 transition-colors cursor-pointer text-base"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Cart */}
                <Button
                  onClick={handleAddToCart}
                  variant="primary"
                  size="lg"
                  className="flex-1 shadow-lg"
                  icon="cart"
                >
                  Add to Bag · £{(product.price * quantity).toFixed(2)}
                </Button>
              </div>

              {/* Trust Taglines below CTA */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-ink-muted font-sans uppercase tracking-wider pt-2">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Free UK Shipping over £75</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Secure 256-Bit Checkout</span>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="divide-y divide-ink/10 border-t border-b border-ink/10 pt-2">
              {/* 1. Specifications */}
              <div className="py-4">
                <button
                  onClick={() =>
                    setActiveAccordion(activeAccordion === 'specs' ? null : 'specs')
                  }
                  className="w-full flex justify-between items-center text-left font-serif text-lg text-ink cursor-pointer"
                >
                  <span>Materials & Specifications</span>
                  <AnimatedIcon
                    type="plus"
                    size={18}
                    isActive={activeAccordion === 'specs'}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'specs' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pt-3 text-xs sm:text-sm font-sans text-ink/80 space-y-2"
                    >
                      <ul className="divide-y divide-ink/5">
                        {Object.entries(product.specs).map(([key, value]) => (
                          <li key={key} className="py-1.5 flex justify-between">
                            <span className="text-ink-muted font-medium">{key}</span>
                            <span className="text-ink text-right">{value}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Key Features */}
              {product.features && product.features.length > 0 && (
                <div className="py-4">
                  <button
                    onClick={() =>
                      setActiveAccordion(
                        activeAccordion === 'features' ? null : 'features'
                      )
                    }
                    className="w-full flex justify-between items-center text-left font-serif text-lg text-ink cursor-pointer"
                  >
                    <span>Artisan Features</span>
                    <AnimatedIcon
                      type="plus"
                      size={18}
                      isActive={activeAccordion === 'features'}
                    />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === 'features' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pt-3 text-xs sm:text-sm font-sans text-ink/80 space-y-2"
                      >
                        <ul className="space-y-1.5 list-disc pl-5">
                          {product.features.map((feat, idx) => (
                            <li key={idx}>{feat}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* 3. Shipping & Delivery */}
              <div className="py-4">
                <button
                  onClick={() =>
                    setActiveAccordion(
                      activeAccordion === 'shipping' ? null : 'shipping'
                    )
                  }
                  className="w-full flex justify-between items-center text-left font-serif text-lg text-ink cursor-pointer"
                >
                  <span>Shipping & Delivery</span>
                  <AnimatedIcon
                    type="plus"
                    size={18}
                    isActive={activeAccordion === 'shipping'}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'shipping' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pt-3 text-xs sm:text-sm font-sans text-ink/80 space-y-2"
                    >
                      <p>
                        Orders are processed in 1-2 business days. Standard UK delivery
                        arrives within 2-4 business days. Tracked courier service via
                        Royal Mail or DPD.
                      </p>
                      <Link
                        href="/pages/shipping-policy"
                        className="text-cognac underline block pt-1"
                      >
                        Read full shipping policy →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. Returns & Guarantee */}
              <div className="py-4">
                <button
                  onClick={() =>
                    setActiveAccordion(
                      activeAccordion === 'returns' ? null : 'returns'
                    )
                  }
                  className="w-full flex justify-between items-center text-left font-serif text-lg text-ink cursor-pointer"
                >
                  <span>Returns & Final Sale</span>
                  <AnimatedIcon
                    type="plus"
                    size={18}
                    isActive={activeAccordion === 'returns'}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'returns' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pt-3 text-xs sm:text-sm font-sans text-ink/80 space-y-2"
                    >
                      <p>
                        To maintain direct workshop pricing on handmade pieces, all sales
                        are final once delivered. In the rare case of damaged items,
                        claims are resolved promptly within 48 hours.
                      </p>
                      <Link
                        href="/pages/return-refund-policy"
                        className="text-cognac underline block pt-1"
                      >
                        Read return & refund terms →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 5. Product FAQ */}
              <div className="py-4">
                <button
                  onClick={() =>
                    setActiveAccordion(activeAccordion === 'faq' ? null : 'faq')
                  }
                  className="w-full flex justify-between items-center text-left font-serif text-lg text-ink cursor-pointer"
                >
                  <span>Frequently Asked Questions</span>
                  <AnimatedIcon
                    type="plus"
                    size={18}
                    isActive={activeAccordion === 'faq'}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'faq' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pt-3 text-xs sm:text-sm font-sans text-ink/80 space-y-3"
                    >
                      <div>
                        <p className="font-semibold text-ink">
                          How should I care for this leather piece?
                        </p>
                        <p className="text-ink-muted mt-0.5">
                          Keep away from prolonged dampness or direct heat. Apply natural
                          beeswax or leather balm twice annually to maintain suppleness.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-ink">
                          Is the leather genuine and durable?
                        </p>
                        <p className="text-ink-muted mt-0.5">
                          Yes, 100% full-grain cowhide leather that naturally ages and
                          gains a unique patina with wear.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-28 pt-16 border-t border-ink/10">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block mb-1">
                  Complete The Ensemble
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-light text-ink">
                  Complementary Pieces
                </h3>
              </div>
              <Link
                href={`/collections/${product.category}`}
                className="text-xs uppercase tracking-kicker text-ink-muted hover:text-cognac transition-colors"
              >
                View Category →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map(item => (
                <Link
                  key={item.id}
                  href={`/products/${item.handle}`}
                  className="group bg-ivory-subtle border border-ink/10 flex flex-col justify-between overflow-hidden"
                >
                  <div className="relative aspect-[4/5] w-full bg-ivory overflow-hidden">
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-luxury"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] uppercase tracking-kicker text-cognac font-sans font-medium">
                      {item.category}
                    </span>
                    <h4 className="font-serif text-base font-normal text-ink group-hover:text-cognac transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <span className="text-sm font-sans font-semibold text-ink block mt-1">
                      £{item.price.toFixed(2)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-[400] bg-ivory/95 backdrop-blur-md border-t border-ink/10 p-3 flex items-center justify-between gap-4 shadow-xl lg:hidden"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative w-12 h-14 bg-ivory shrink-0 border border-ink/10 overflow-hidden">
                <Image
                  src={selectedImage}
                  alt={product.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="truncate">
                <p className="font-serif text-sm font-medium text-ink truncate">
                  {product.title}
                </p>
                <p className="text-xs font-sans font-semibold text-ink">
                  £{product.price.toFixed(2)}
                </p>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="sm"
              icon="cart"
              className="shrink-0"
            >
              Add to Bag
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
