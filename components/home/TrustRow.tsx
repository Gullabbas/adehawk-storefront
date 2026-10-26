'use client';

import React, { useState } from 'react';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';

interface TrustPoint {
  title: string;
  description: string;
  icon: 'arrow-right' | 'heart' | 'cart' | 'contact';
}

const TRUST_POINTS: TrustPoint[] = [
  {
    title: 'Fast Shipping',
    description:
      'We process and ship orders as quickly as possible, so you can enjoy your new leather essential without unnecessary delays.',
    icon: 'arrow-right',
  },
  {
    title: 'Secure Checkout',
    description:
      'Your personal and payment information is protected through secure checkout technology, helping ensure a safe and seamless shopping experience.',
    icon: 'heart',
  },
  {
    title: 'Premium Quality',
    description:
      'Our products are selected with a focus on quality, durability, timeless design, and everyday functionality.',
    icon: 'cart',
  },
  {
    title: 'Customer Support',
    description:
      'Have a question about your order or product? Our customer support team is here to assist and provide a smooth shopping experience.',
    icon: 'contact',
  },
];

export const TrustRow: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="trust-section" className="bg-ivory py-16 sm:py-24 border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-y sm:divide-y-0 sm:divide-x divide-ink/10">
          {TRUST_POINTS.map((item, idx) => (
            <div
              key={item.title}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex flex-col space-y-3 pt-6 sm:pt-0 ${
                idx > 0 ? 'sm:pl-6 lg:pl-8' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-ivory-subtle border border-ink/10 flex items-center justify-center text-cognac mb-1">
                <AnimatedIcon
                  type={item.icon}
                  size={20}
                  isHovered={hoveredIdx === idx}
                />
              </div>
              <h3 className="font-serif text-xl font-normal text-ink">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
