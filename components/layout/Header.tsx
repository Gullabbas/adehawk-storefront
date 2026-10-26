'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useUIStore } from '@/store/useUIStore';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const { openCart, totalItems } = useCartStore();
  const { totalItems: wishlistTotal } = useWishlistStore();
  const { openSearch, isMenuOpen, toggleMenu, closeMenu } = useUIStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll depth and global scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);

      const total = document.body.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, currentScrollY / total)) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Bags', href: '/collections/bags' },
    { label: 'Wallets', href: '/collections/wallets' },
    { label: 'Belts', href: '/collections/belts' },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[500] translate-y-0 transition-all duration-500 ease-luxury"
      >
        {/* Top Announcement Bar */}
        <div className="bg-espresso text-ivory/90 text-[11px] font-sans uppercase tracking-kicker py-2 px-4 text-center border-b border-ivory/10">
          Pure Handmade Leather Products · Secure Checkout
        </div>

        {/* Main Header Bar */}
        <nav
          className={`relative w-full transition-all duration-400 border-b ${
            isScrolled || !isHome
              ? 'bg-espresso/85 backdrop-blur-md border-ivory/15 text-ivory py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
              : 'bg-espresso/60 backdrop-blur-sm border-ivory/10 text-ivory py-4'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Left Nav (Desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative group py-1 text-xs font-sans uppercase tracking-kicker transition-colors hover:text-cognac"
                  >
                    <span>{link.label}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-[1.5px] bg-cognac transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={toggleMenu}
                className="p-2 text-ivory hover:text-cognac transition-colors cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                <AnimatedIcon type="menu" size={24} isActive={isMenuOpen} />
              </button>
            </div>

            {/* Center Logo */}
            <Link
              href="/"
              className="flex items-center justify-center transition-transform hover:scale-105 duration-300"
              aria-label="Adehawk Leather Goods Home"
            >
              <div className="relative w-28 sm:w-32 h-10 sm:h-12">
                <Image
                  src="/assets/brand/logo.png"
                  alt="ADEHAWK LEATHER GOODS"
                  fill
                  priority
                  sizes="(max-width: 640px) 112px, 128px"
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Right Utility Icons */}
            <div className="flex items-center space-x-2 sm:space-x-5">
              {/* Instant Search */}
              <button
                onClick={openSearch}
                className="p-2 text-ivory hover:text-cognac transition-colors cursor-pointer"
                aria-label="Search collection"
              >
                <AnimatedIcon type="search" size={20} isHovered={false} />
              </button>

              {/* Account Link */}
              <Link
                href="https://adehawk.com/account/login"
                className="p-2 text-ivory hover:text-cognac transition-colors cursor-pointer hidden sm:inline-block"
                aria-label="Customer Account"
                target="_blank"
                rel="noopener noreferrer"
              >
                <AnimatedIcon type="account" size={20} />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-ivory hover:text-cognac transition-colors cursor-pointer"
                aria-label={`Wishlist (${wishlistTotal()} items)`}
              >
                <AnimatedIcon
                  type="heart"
                  size={20}
                  isActive={wishlistTotal() > 0}
                />
                {wishlistTotal() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 bg-cognac text-ivory text-[9px] font-sans font-bold rounded-full flex items-center justify-center">
                    {wishlistTotal()}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                data-cart-icon="true"
                onClick={openCart}
                className="p-2 text-ivory hover:text-cognac transition-colors cursor-pointer"
                aria-label={`Shopping Cart (${totalItems()} items)`}
              >
                <AnimatedIcon
                  type="cart"
                  size={20}
                  badgeCount={totalItems()}
                />
              </button>
            </div>
          </div>
        </nav>

        {/* Global Scroll Progress Bar along the bottom of the Header */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent pointer-events-none overflow-hidden">
          <div
            className="h-full bg-cognac origin-left transition-transform duration-100 ease-out"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      </header>

      {/* Full-Screen Animated Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[490] bg-espresso text-ivory flex flex-col justify-between pt-28 pb-12 px-8 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              <span className="text-[11px] uppercase tracking-kicker text-ivory/50 font-sans">
                Navigation
              </span>
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="font-serif text-3xl font-light hover:text-cognac transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.42 }}
                >
                  <Link
                    href="/collections/keychains"
                    onClick={closeMenu}
                    className="font-serif text-3xl font-light hover:text-cognac transition-colors"
                  >
                    Keychains & Gifts
                  </Link>
                </motion.div>
              </nav>
            </div>

            <div className="space-y-6 pt-8 border-t border-ivory/10">
              <div className="flex flex-col space-y-2 text-xs uppercase tracking-kicker text-ivory/70">
                <Link
                  href="/pages/shipping-policy"
                  onClick={closeMenu}
                  className="hover:text-ivory"
                >
                  Shipping Policy
                </Link>
                <Link
                  href="/pages/return-refund-policy"
                  onClick={closeMenu}
                  className="hover:text-ivory"
                >
                  Return & Refund Policy
                </Link>
                <Link
                  href="/pages/privacy-policy"
                  onClick={closeMenu}
                  className="hover:text-ivory"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/pages/terms-of-service"
                  onClick={closeMenu}
                  className="hover:text-ivory"
                >
                  Terms of Service
                </Link>
              </div>

              <p className="text-[11px] text-ivory/40">
                Copyright © 2026 ADEHAWK LEATHER GOODS all rights reserved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
