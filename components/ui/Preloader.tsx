'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export const Preloader: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem('adehawk_preloader_shown');
    if (!hasShown) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem('adehawk_preloader_shown', 'true');
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-espresso pointer-events-none select-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4 text-center px-6"
          >
            <div className="relative w-28 h-20">
              <Image
                src="/assets/brand/logo.png"
                alt="ADEHAWK LEATHER GOODS"
                fill
                priority
                className="object-contain"
              />
            </div>
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.45em' }}
              animate={{ opacity: 0.85, letterSpacing: '0.28em' }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="font-sans text-[11px] uppercase text-ivory tracking-kicker font-light"
            >
              Handmade Leather Goods · Great Britain
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
