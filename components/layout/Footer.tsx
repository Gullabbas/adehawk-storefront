'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Button } from '@/components/ui/Button';

gsap.registerPlugin(ScrollTrigger);

const LETTERS = ['A', 'D', 'E', 'H', 'A', 'W', 'K'];

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const footerRef = useRef<HTMLElement>(null);
  const linksGridRef = useRef<HTMLDivElement>(null);
  const wordmarkContainerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lastInteractionTime = useRef<number>(Date.now());

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 800);
  };

  // Kinetic proximity wave physics on the wordmark
  const handlePointerInteraction = useCallback((clientX: number, clientY: number) => {
    lastInteractionTime.current = Date.now();
    const radius = 180;

    letterRefs.current.forEach((span) => {
      if (!span) return;
      const rect = span.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(clientX - centerX, clientY - centerY);

      if (dist < radius) {
        const factor = Math.max(0, 1 - dist / radius);
        const smooth = Math.pow(factor, 1.5);

        gsap.to(span, {
          opacity: 0.08 + smooth * 0.92,
          y: -10 * smooth,
          color: '#FFFFFF',
          textShadow: `0 0 30px rgba(255, 255, 255, ${0.35 * smooth})`,
          duration: 0.18,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        // Slow 0.9s trail return
        gsap.to(span, {
          opacity: 0.08,
          y: 0,
          textShadow: '0 0 0px rgba(255, 255, 255, 0)',
          duration: 0.9,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    letterRefs.current.forEach((span) => {
      if (!span) return;
      gsap.to(span, {
        opacity: 0.08,
        y: 0,
        textShadow: '0 0 0px rgba(255, 255, 255, 0)',
        duration: 0.9,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  }, []);

  // Idle wave animation every 6 seconds if no interaction
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastInteractionTime.current > 4500) {
        letterRefs.current.forEach((span, idx) => {
          if (!span) return;
          gsap.timeline()
            .to(span, {
              opacity: 0.85,
              y: -8,
              textShadow: '0 0 25px rgba(255, 255, 255, 0.3)',
              duration: 0.45,
              delay: idx * 0.1,
              ease: 'power2.out',
            })
            .to(span, {
              opacity: 0.08,
              y: 0,
              textShadow: '0 0 0px rgba(255, 255, 255, 0)',
              duration: 0.9,
              ease: 'power2.out',
            });
        });
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Curtain reveal & staggered links on scroll entry
  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      if (linksGridRef.current) {
        const columns = linksGridRef.current.children;
        gsap.fromTo(
          columns,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: linksGridRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative z-0 bg-espresso text-ivory pt-20 pb-12 border-t border-ivory/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Newsletter & Ethos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-ivory/10">
          {/* Brand & Ethos */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block">
              About Adehawk
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-ivory max-w-md">
              Crafted for Everyday. Designed to Last.
            </h3>
            <p className="text-sm text-ivory/70 leading-relaxed max-w-md font-sans">
              We believe great journeys deserve great essentials. Our collection is
              thoughtfully selected to combine timeless style, everyday functionality,
              and reliable quality. From weekend getaways to daily adventures, we&apos;re
              here to help you travel smarter and look good doing it.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://www.instagram.com/adehawk.official?stkn=ODMzMDV1bnRrbGsz&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-ivory/20 hover:border-cognac hover:text-cognac transition-colors"
                aria-label="Follow Adehawk on Instagram"
              >
                <AnimatedIcon type="instagram" size={18} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61594421692815"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-ivory/20 hover:border-cognac hover:text-cognac transition-colors"
                aria-label="Follow Adehawk on Facebook"
              >
                <AnimatedIcon type="facebook" size={18} />
              </a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 lg:pl-12">
            <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block">
              Join Our Journey
            </span>
            <h4 className="font-serif text-xl sm:text-2xl font-light text-ivory">
              Receive exclusive releases, leather care guides, and private previews.
            </h4>
            {status === 'success' ? (
              <div className="p-4 bg-cognac/20 border border-cognac/40 text-ivory text-sm font-sans">
                ✓ Welcome to Adehawk. Your journey with authentic handmade leather begins now.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2 max-w-md">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address for newsletter"
                    className="flex-1 bg-espresso-surface border border-ivory/15 px-4 py-3 text-sm text-ivory placeholder:text-ivory/40 outline-none focus:border-cognac transition-colors"
                  />
                  <Button
                    type="submit"
                    variant="dark"
                    size="md"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Joining...' : 'Subscribe'}
                  </Button>
                </div>
                {status === 'error' && (
                  <p className="text-xs text-red-400 font-sans">
                    Please enter a valid email address.
                  </p>
                )}
                <p className="text-[11px] text-ivory/40">
                  By subscribing, you accept our privacy policy and email terms.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Links Navigation Grid with Entry Stagger */}
        <div
          ref={linksGridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-ivory/10 text-xs uppercase tracking-kicker font-sans"
        >
          {/* Quick Links */}
          <div className="space-y-4">
            <span className="text-ivory font-semibold block text-sm">Quick Links</span>
            <ul className="space-y-2.5 text-ivory/70">
              <li>
                <Link href="/" className="hover:text-cognac transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/collections/bags" className="hover:text-cognac transition-colors">
                  Bags
                </Link>
              </li>
              <li>
                <Link href="/collections/wallets" className="hover:text-cognac transition-colors">
                  Wallets
                </Link>
              </li>
              <li>
                <Link href="/collections/belts" className="hover:text-cognac transition-colors">
                  Belts
                </Link>
              </li>
              <li>
                <Link href="/collections/keychains" className="hover:text-cognac transition-colors">
                  Keychains
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Information */}
          <div className="space-y-4">
            <span className="text-ivory font-semibold block text-sm">Information</span>
            <ul className="space-y-2.5 text-ivory/70">
              <li>
                <Link
                  href="/pages/shipping-policy"
                  className="hover:text-cognac transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/return-refund-policy"
                  className="hover:text-cognac transition-colors"
                >
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/privacy-policy"
                  className="hover:text-cognac transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/terms-of-service"
                  className="hover:text-cognac transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Curated Collections */}
          <div className="space-y-4">
            <span className="text-ivory font-semibold block text-sm">Collections</span>
            <ul className="space-y-2.5 text-ivory/70">
              <li>
                <Link
                  href="/collections/business-work-bags"
                  className="hover:text-cognac transition-colors"
                >
                  Executive Bags
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/bags"
                  className="hover:text-cognac transition-colors"
                >
                  Travel & Duffels
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/wallets"
                  className="hover:text-cognac transition-colors"
                >
                  Slim Wallets
                </Link>
              </li>
              <li>
                <Link href="/collections/all" className="hover:text-cognac transition-colors">
                  Complete Catalogue
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <span className="text-ivory font-semibold block text-sm">Customer Care</span>
            <ul className="space-y-2.5 text-ivory/70">
              <li>
                <Link
                  href="https://adehawk.com/account/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cognac transition-colors"
                >
                  Account Login
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-cognac transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-cognac transition-colors">
                  View Bag
                </Link>
              </li>
              <li className="pt-2 text-[10px] text-ivory/40">
                United Kingdom · GBP (£)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory/50 font-sans">
          <p>Copyright © 2026 ADEHAWK LEATHER GOODS all rights reserved.</p>
          <p className="tracking-widest uppercase text-[10px]">
            Pure Handmade Leather Goods · Secure Checkout
          </p>
        </div>

        {/* Giant Kinetic Proximity Wordmark with 0.9s Trailing Wave */}
        <div
          ref={wordmarkContainerRef}
          onPointerMove={(e) => handlePointerInteraction(e.clientX, e.clientY)}
          onPointerLeave={handlePointerLeave}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            if (touch) handlePointerInteraction(touch.clientX, touch.clientY);
          }}
          onTouchEnd={handlePointerLeave}
          className="w-full text-center select-none mt-12 py-6 overflow-hidden cursor-default"
          aria-label="ADEHAWK"
        >
          <div className="inline-flex items-center justify-center gap-1 sm:gap-2">
            {LETTERS.map((char, index) => (
              <span
                key={index}
                ref={(el) => {
                  letterRefs.current[index] = el;
                }}
                className="font-serif text-[clamp(3.5rem,15vw,14rem)] leading-none font-bold uppercase transition-transform inline-block select-none will-change-transform"
                style={{
                  opacity: 0.08,
                  color: '#FFFFFF',
                  letterSpacing: '0.02em',
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
