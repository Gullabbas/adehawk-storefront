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

  // Ambient wave lighting animation every 3.5 seconds if no interaction
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastInteractionTime.current > 2500) {
        letterRefs.current.forEach((span, idx) => {
          if (!span) return;
          gsap.timeline()
            .to(span, {
              opacity: 0.85,
              y: -8,
              textShadow: '0 0 25px rgba(255, 255, 255, 0.35)',
              duration: 0.35,
              delay: idx * 0.08,
              ease: 'power2.out',
            })
            .to(span, {
              opacity: 0.08,
              y: 0,
              textShadow: '0 0 0px rgba(255, 255, 255, 0)',
              duration: 0.6,
              ease: 'power2.out',
            });
        });
      }
    }, 3500);

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

        {/* Bottom Copyright & Designer Attribution */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory/50 font-sans">
          <p>Copyright © 2026 ADEHAWK LEATHER GOODS all rights reserved.</p>

          <div className="flex flex-col items-center md:items-end gap-1.5">
            <p className="tracking-widest uppercase text-[10px] text-ivory/70">
              Designed by:{' '}
              <a
                href="https://fiverr.com/muhammadraza707"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory font-semibold hover:text-cognac underline underline-offset-4 decoration-cognac/50 hover:decoration-cognac transition-colors cursor-pointer"
                aria-label="Designed by Muhammad Raza on Fiverr"
              >
                MUHAMMAD RAZA
              </a>
            </p>

            {/* Social Icons in same text size */}
            <div className="flex items-center gap-3 text-ivory/60">
              <a
                href="https://www.linkedin.com/in/muhammadraza707/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cognac transition-colors p-1"
                aria-label="Muhammad Raza LinkedIn Profile"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.54-1.54 1.54 1.54 0 0 0-1.54-1.54A1.54 1.54 0 0 0 4.92 7.2a1.54 1.54 0 0 0 1.54 1.56m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                </svg>
              </a>

              <a
                href="https://www.behance.net/muhammadrazaa707"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cognac transition-colors p-1"
                aria-label="Muhammad Raza Behance Profile"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-4.084 0-6.625-2.827-6.625-6.845 0-4.148 2.656-6.885 6.452-6.885 4.316 0 6.166 3.094 5.753 7.086h-9.351c.071 2.309 1.487 3.992 3.864 3.992 1.637 0 2.879-.769 3.486-1.928l1.522 1.58zm-8.835-5.321h6.541c-.059-1.748-1.042-3.159-2.997-3.159-1.979 0-3.188 1.405-3.544 3.159zm-8.891 7.321h-6v-14h6.568c2.899 0 4.932 1.41 4.932 4.025 0 1.633-.827 2.868-2.158 3.492 1.704.57 2.658 2.059 2.658 3.935 0 2.836-2.179 4.548-6 4.548zm-3.327-8.238h3.048c1.554 0 2.457-.68 2.457-1.938 0-1.218-.903-1.87-2.457-1.87h-3.048v3.808zm0 6.289h3.359c1.69 0 2.709-.77 2.709-2.175 0-1.365-1.019-2.164-2.709-2.164h-3.359v4.339z" />
                </svg>
              </a>
            </div>
          </div>
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
