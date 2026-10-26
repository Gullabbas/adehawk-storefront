'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { commerce } from '@/lib/commerce';

const FREE_SHIPPING_THRESHOLD = 75;

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalItems } =
    useCartStore();

  const currentSubtotal = subtotal();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - currentSubtotal);
  const progress = Math.min(100, (currentSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckout = async () => {
    if (commerce.createCheckoutUrl) {
      const url = await commerce.createCheckoutUrl(items);
      window.location.href = url;
    } else {
      window.location.href = 'https://adehawk.com/cart';
    }
  };

  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24 text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-ink/10 pb-8 mb-10">
          <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block mb-2">
            Order Review
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ink">
            Your Shopping Bag
          </h1>
          <p className="text-xs font-sans uppercase tracking-widest text-ink-muted mt-2">
            {totalItems()} {totalItems() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 space-y-4 max-w-md mx-auto">
            <AnimatedIcon type="cart" size={48} className="text-ink-muted/50 mx-auto" />
            <p className="font-serif text-3xl text-ink">Your bag is currently empty</p>
            <p className="text-sm text-ink-muted font-sans">
              Discover genuine British leather goods crafted to last a lifetime.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Button href="/collections/bags" variant="primary" size="md">
                Explore Bags
              </Button>
              <Button href="/collections/wallets" variant="secondary" size="md">
                Explore Wallets
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Items Table */}
            <div className="lg:col-span-8 divide-y divide-ink/10">
              {/* Shipping Progress */}
              <div className="p-4 mb-6 bg-ivory-subtle border border-ink/10 space-y-2">
                <div className="flex justify-between items-center text-xs font-sans">
                  <span className="font-medium text-ink">
                    {remaining > 0
                      ? `Add £${remaining.toFixed(2)} more for Free UK Delivery`
                      : '🎉 You qualify for Free UK Standard Delivery!'}
                  </span>
                  <span className="font-mono text-ink-muted">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1 bg-ink/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cognac transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {items.map(item => (
                <div key={item.id} className="py-6 flex gap-6 items-center">
                  <div className="relative w-24 h-28 bg-ivory-subtle shrink-0 border border-ink/10 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <Link
                        href={`/products/${item.handle}`}
                        className="font-serif text-lg font-medium text-ink hover:text-cognac transition-colors"
                      >
                        {item.title}
                      </Link>
                      {item.colorName && (
                        <p className="text-xs text-ink-muted font-sans mt-0.5">
                          Colour: {item.colorName}
                        </p>
                      )}
                      <p className="text-sm font-sans font-semibold text-ink mt-1">
                        £{item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Quantity box */}
                      <div className="flex items-center border border-ink/20">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-ink hover:bg-ink/5 transition-colors cursor-pointer text-sm"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-9 text-center text-xs font-sans font-medium text-ink">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-ink hover:bg-ink/5 transition-colors cursor-pointer text-sm"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-base font-sans font-semibold text-ink min-w-[70px] text-right">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-ink-muted hover:text-ink text-xs underline cursor-pointer p-1"
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-6 flex justify-between items-center">
                <Button href="/collections/all" variant="secondary" size="sm">
                  ← Continue Shopping
                </Button>
                <button
                  onClick={clearCart}
                  className="text-xs text-ink-muted hover:text-ink underline uppercase tracking-kicker cursor-pointer"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4">
              <div className="p-8 bg-ivory-subtle border border-ink/10 space-y-6">
                <h3 className="font-serif text-2xl font-light text-ink border-b border-ink/10 pb-4">
                  Summary
                </h3>

                <div className="space-y-3 text-sm font-sans">
                  <div className="flex justify-between text-ink-muted">
                    <span>Subtotal</span>
                    <span className="text-ink font-semibold">£{currentSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-ink-muted">
                    <span>Shipping</span>
                    <span>
                      {remaining === 0 ? 'Free UK Delivery' : 'Calculated at checkout'}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-ink pt-3 border-t border-ink/10">
                    <span className="font-serif text-lg">Estimated Total</span>
                    <span className="text-xl">£{currentSubtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleCheckout}
                    variant="primary"
                    size="lg"
                    className="w-full shadow-lg"
                    icon="arrow-right"
                  >
                    Checkout with Shopify
                  </Button>
                  <p className="text-[11px] text-center text-ink-muted uppercase tracking-wider">
                    🔒 256-Bit SSL Encrypted Checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
