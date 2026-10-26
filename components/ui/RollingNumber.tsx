'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RollingNumberProps {
  value: number | string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const RollingNumber: React.FC<RollingNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const str = String(displayValue);

  return (
    <span className={`inline-flex items-center overflow-hidden font-mono ${className}`}>
      {prefix && <span>{prefix}</span>}
      <AnimatePresence mode="popLayout" initial={false}>
        {str.split('').map((char, index) => (
          <span key={`${index}-${char}`} className="inline-block relative overflow-hidden h-[1.2em]">
            <motion.span
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {char}
            </motion.span>
          </span>
        ))}
      </AnimatePresence>
      {suffix && <span>{suffix}</span>}
    </span>
  );
};
