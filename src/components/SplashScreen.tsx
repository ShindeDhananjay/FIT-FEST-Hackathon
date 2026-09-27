'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'logo' | 'text' | 'exit'>('logo');
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    if (prefersReduced) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setPhase('text'), 500);
    const t2 = setTimeout(() => setPhase('exit'), 1200);
    const t3 = setTimeout(() => onComplete(), 1500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <AnimatePresence>
      {phase !== 'exit' ? null : null}
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-emerald-50/50"
        initial={{ opacity: 1 }}
        animate={phase === 'exit' ? { opacity: 0, scale: 1.05, y: -20 } : { opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        onAnimationComplete={() => phase === 'exit' && onComplete()}
      >
        {/* Soft radial glow */}
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-emerald-400/15 blur-3xl"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Logo Mark */}
        <motion.div
          className="relative z-10"
          initial={{ scale: 0.75, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
              <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
              <path d="m14 16-3 3 3 3" />
              <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
              <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 12 3a1.83 1.83 0 0 1 1.563.919l3.957 6.856" />
              <path d="M17.5 12.5 19.1 10.6l1.093 4.096-4.096 1.098" />
            </svg>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          className="relative z-10 mt-5 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={phase === 'text' || phase === 'exit' ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Eco<span className="text-emerald-600">Loop</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Smarter pickups. Cleaner communities.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
