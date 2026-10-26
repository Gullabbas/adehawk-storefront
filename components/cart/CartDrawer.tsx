'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Button } from '@/components/ui/Button';

const FREE_SHIPPING_THRESHOLD = 75;

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, totalItems } =
    useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  const currentSubtotal = subtotal();
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - currentSubtotal);
  const freeShippingProgress = Math.min(
    100,
    (currentSubtotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  const formattedSubtotal = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(currentSubtotal);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart"
            className="relative z-10 flex flex-col w-full max-w-md h-full bg-ivory text-ink shadow-2xl border-l border-ink/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
              <div className="flex items-center gap-3">
                <span className="font-serif text-2xl font-light text-ink">
                  Shopping Bag
                </span>
                <span className="text-xs uppercase tracking-kicker font-sans text-ink-muted">
                  ({totalItems()} {totalItems() === 1 ? 'item' : 'items'})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-ink hover:text-cognac transition-colors cursor-pointer"
                aria-label="Close cart drawer"
              >
                <AnimatedIcon type="close" size={20} />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="px-6 py-4 bg-ivory-subtle border-b border-ink/10">
              <div className="flex justify-between items-center text-xs font-sans mb-2">
                <span className="font-medium text-ink">
                  {remainingForFreeShipping > 0
                    ? `Add £${remainingForFreeShipping.toFixed(2)} for Free UK Delivery`
                    : '🎉 You have unlocked Free UK Delivery!'}
                </span>
                <span className="text-ink-muted font-mono text-[11px]">
                  {Math.round(freeShippingProgress)}%
                </span>
              </div>
              <div className="w-full h-1 bg-ink/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cognac"
                  initial={{ width: 0 }}
                  animate={{ width: `${freeShippingProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Items List / Empty State */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-ink/10">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-4">
                  <AnimatedIcon type="cart" size={44} className="text-ink-muted/50" />
                  <p className="font-serif text-2xl text-ink">Your bag is empty</p>
                  <p className="text-sm text-ink-muted max-w-xs font-sans">
                    Handmade British leather essentials await your discovery.
                  </p>
                  <div className="pt-2 flex flex-col gap-2 w-full max-w-xs">
                    <Button href="/collections/bags" onClick={closeCart} variant="primary">
                      Explore Bags
                    </Button>
                    <Button href="/collections/wallets" onClick={closeCart} variant="secondary">
                      Explore Wallets
                    </Button>
                  </div>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="py-4 flex gap-4">
                    <div className="relative w-20 h-24 bg-ivory-subtle shrink-0 border border-ink/10 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            href={`/products/${item.handle}`}
                            onClick={closeCart}
                            className="font-serif text-base font-medium text-ink hover:text-cognac transition-colors line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-ink-muted hover:text-ink text-xs underline p-1 cursor-pointer"
                            aria-label={`Remove ${item.title}`}
                          >
                            Remove
                          </button>
                        </div>
                        {item.colorName && (
                          <p className="text-xs text-ink-muted mt-0.5 font-sans">
                            Colour: {item.colorName}
                          </p>
                        )}
                        <p className="text-sm font-sans font-semibold text-ink mt-1">
                          £{item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-ink/20">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-ink hover:bg-ink/5 transition-colors cursor-pointer text-sm"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-sans font-medium text-ink">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-ink hover:bg-ink/5 transition-colors cursor-pointer text-sm"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs text-ink-muted font-sans">
                          Total: £{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-ink/10 bg-ivory-subtle space-y-4">
                <div className="space-y-1.5 text-sm font-sans">
                  <div className="flex justify-between text-ink-muted text-xs">
                    <span>Taxes & Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-base font-medium text-ink pt-1 border-t border-ink/10">
                    <span className="font-serif text-lg">Subtotal</span>
                    <span className="font-semibold text-lg">{formattedSubtotal}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    href="/cart"
                    onClick={closeCart}
                    variant="primary"
                    className="w-full"
                    icon="arrow-right"
                  >
                    Proceed to Checkout
                  </Button>
                  <p className="text-[11px] text-center text-ink-muted tracking-wider uppercase">
                    🔒 Guaranteed Secure UK & Global Checkout
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
