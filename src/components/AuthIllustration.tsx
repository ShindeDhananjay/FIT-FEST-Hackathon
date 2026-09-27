'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Recycle,
  Truck,
  Gift,
  Sparkles,
  Award,
  Leaf,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AuthIllustrationProps {
  headline?: string;
  subheadline?: string;
  onLogoClick?: () => void;
  speedMs?: number;
}

export const AuthIllustration: React.FC<AuthIllustrationProps> = ({
  onLogoClick,
  speedMs = 1500, // Exactly 1.5 seconds as requested
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // 1.5-second auto carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 4);
    }, speedMs);

    return () => clearInterval(timer);
  }, [speedMs]);

  const slides = [
    {
      id: 'analytics',
      title: 'Smart Waste Management & Recycling Dashboard',
      subtitle: 'Real-time GPS collection tracking, verified municipal recycling, and citizen EcoPoints rewards.',
    },
    {
      id: 'fleet',
      title: 'Zero-Emission Doorstep Collection Fleet',
      subtitle: 'Verified drivers arrive with calibrated IoT digital scales to weigh and log your pickup on the spot.',
    },
    {
      id: 'rewards',
      title: 'Earn Points & Get 100% Recycled Rewards',
      subtitle: 'Redeem EcoPoints for recycled backpacks, seed journals, and flasks delivered on your next collection order.',
    },
    {
      id: 'ai-scanner',
      title: 'AI-Powered Waste & Material Scanner',
      subtitle: 'Snap a photo of any item to classify materials, check contamination risk, and auto-schedule a collection.',
    },
  ];

  return (
    <div className="w-full h-full max-h-screen flex flex-col justify-between p-5 sm:p-6 lg:p-8 xl:p-10 bg-[#edf7f9] relative overflow-hidden select-none">
      
      {/* Background soft ambient blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      {/* Top Header / Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer group z-10 w-fit shrink-0"
        onClick={onLogoClick}
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
          <Recycle className="h-5 w-5 text-white animate-spin-slow" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
              Eco<span className="text-teal-600">Loop</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 tracking-wider uppercase">
              Pune
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium -mt-0.5">
            Smart Municipal Waste & Logistics
          </span>
        </div>
      </div>

      {/* Center Carousel Graphic Container */}
      <div className="my-auto py-1 sm:py-2 flex flex-col items-center justify-center z-10 relative w-full overflow-hidden">
        <div className="w-full max-w-[500px] h-[300px] sm:h-[340px] lg:h-[360px] flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            
            {/* ============ SLIDE 0: ANALYTICS DASHBOARD (Shipmozo Theme) ============ */}
            {activeSlide === 0 && (
              <motion.div
                key="slide-0"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="w-full flex flex-col items-center"
              >
                <svg
                  viewBox="0 0 720 440"
                  className="w-full h-auto drop-shadow-xl"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="500" cy="160" r="140" fill="#d9edf2" opacity="0.6" />
                  <path d="M470 180 L470 120 L490 120 L490 180 Z" fill="#b9dde6" opacity="0.4" />
                  <path d="M495 180 L495 100 L515 100 L515 180 Z" fill="#b9dde6" opacity="0.5" />
                  <path d="M520 180 L520 130 L540 130 L540 180 Z" fill="#b9dde6" opacity="0.4" />

                  {/* Foliage */}
                  <path d="M170 360 Q150 230 160 140 Q165 220 170 360 Z" fill="#1e293b" />
                  <path d="M162 240 C135 220 120 240 115 220 C110 195 140 200 162 230 Z" fill="#0f766e" />
                  <path d="M165 190 C130 170 125 140 145 135 C165 130 170 170 165 190 Z" fill="#115e59" />
                  <path d="M164 280 C125 280 120 310 135 320 C155 330 165 295 164 280 Z" fill="#0d9488" />
                  <path d="M160 140 C145 110 165 90 180 100 C195 110 175 130 160 140 Z" fill="#047857" />

                  {/* Laptop Base Plate */}
                  <path d="M180 370 L620 370 L600 385 L200 385 Z" fill="#cbd5e1" stroke="#1e293b" strokeWidth="3.5" strokeLinejoin="round" />
                  <rect x="360" y="372" width="80" height="4" rx="2" fill="#94a3b8" />

                  {/* Laptop Screen Bezel */}
                  <rect x="200" y="150" width="400" height="220" rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="4" />
                  <circle cx="400" cy="158" r="2.5" fill="#475569" />

                  {/* Display Surface */}
                  <rect x="212" y="168" width="376" height="190" rx="4" fill="#ffffff" />
                  <text x="228" y="195" fill="#0f172a" fontSize="16" fontWeight="bold" fontFamily="sans-serif">14,500 kg Recycled</text>
                  <text x="375" y="193" fill="#059669" fontSize="10" fontWeight="bold" fontFamily="sans-serif">+24.8% Pune PMC</text>
                  <line x1="228" y1="203" x2="395" y2="203" stroke="#e2e8f0" strokeWidth="1.5" />

                  {/* Bar Chart */}
                  <rect x="236" y="280" width="10" height="50" rx="2" fill="#0284c7" />
                  <rect x="254" y="250" width="10" height="80" rx="2" fill="#0284c7" />
                  <rect x="272" y="295" width="10" height="35" rx="2" fill="#0284c7" />
                  <rect x="290" y="230" width="10" height="100" rx="2" fill="#0284c7" />
                  <rect x="308" y="260" width="10" height="70" rx="2" fill="#0284c7" />
                  <rect x="326" y="290" width="10" height="40" rx="2" fill="#0284c7" />
                  <rect x="344" y="240" width="10" height="90" rx="2" fill="#0284c7" />
                  <rect x="362" y="275" width="10" height="55" rx="2" fill="#0284c7" />
                  <line x1="230" y1="332" x2="380" y2="332" stroke="#94a3b8" strokeWidth="1" />

                  {/* Table Grid */}
                  <rect x="410" y="182" width="165" height="150" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                  <rect x="410" y="182" width="165" height="20" rx="4" fill="#0f766e" />
                  <text x="420" y="196" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">MATERIAL</text>
                  <text x="480" y="196" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">TONS</text>
                  <text x="535" y="196" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">POINTS</text>

                  <g transform="translate(415, 212)">
                    <text x="5" y="0" fill="#334155" fontSize="8" fontWeight="600">Dry Plastics</text>
                    <text x="65" y="0" fill="#64748b" fontSize="8">8.5 T</text>
                    <text x="120" y="0" fill="#059669" fontSize="8" fontWeight="bold">+125</text>
                    <line x1="0" y1="6" x2="155" y2="6" stroke="#f1f5f9" strokeWidth="1" />

                    <text x="5" y="20" fill="#334155" fontSize="8" fontWeight="600">E-Waste</text>
                    <text x="65" y="20" fill="#64748b" fontSize="8">14.0 T</text>
                    <text x="120" y="20" fill="#059669" fontSize="8" fontWeight="bold">+560</text>
                    <line x1="0" y1="26" x2="155" y2="26" stroke="#f1f5f9" strokeWidth="1" />

                    <text x="5" y="40" fill="#334155" fontSize="8" fontWeight="600">Organic Mess</text>
                    <text x="65" y="40" fill="#64748b" fontSize="8">22.0 T</text>
                    <text x="120" y="40" fill="#059669" fontSize="8" fontWeight="bold">+220</text>
                    <line x1="0" y1="46" x2="155" y2="46" stroke="#f1f5f9" strokeWidth="1" />

                    <text x="5" y="60" fill="#334155" fontSize="8" fontWeight="600">Paper Scrap</text>
                    <text x="65" y="60" fill="#64748b" fontSize="8">35.0 T</text>
                    <text x="120" y="60" fill="#059669" fontSize="8" fontWeight="bold">+420</text>
                  </g>

                  {/* Character */}
                  <g transform="translate(50, 170)">
                    <circle cx="98" cy="45" r="14" fill="#ffedd5" />
                    <path d="M75 40 C70 20 85 10 100 15 C115 15 125 30 120 50 C110 55 90 60 75 40 Z" fill="#0f172a" />
                    <circle cx="102" cy="44" r="3.5" stroke="#1e293b" strokeWidth="1.2" fill="none" />
                    <path d="M80 62 L116 62 L128 140 L70 140 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                    <polygon points="98,62 90,95 106,95" fill="#ffffff" />
                    <rect x="76" y="140" width="46" height="55" rx="2" fill="#1e293b" />
                    <path d="M78 80 L65 125 L100 125" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="95" y="115" width="30" height="20" rx="2" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
                    <rect x="83" y="195" width="10" height="50" fill="#fed7aa" />
                    <rect x="105" y="195" width="10" height="50" fill="#fed7aa" />
                  </g>

                  {/* Coins */}
                  <g transform="translate(380, 375)">
                    <ellipse cx="60" cy="20" rx="42" ry="15" fill="#cbd5e1" stroke="#334155" strokeWidth="2.5" />
                    <ellipse cx="60" cy="18" rx="34" ry="12" fill="#ffffff" stroke="#0f766e" strokeWidth="2" />
                    <text x="54" y="24" fill="#0f766e" fontSize="18" fontWeight="bold" fontFamily="sans-serif">₹</text>
                  </g>
                </svg>
              </motion.div>
            )}

            {/* ============ SLIDE 1: ZERO-EMISSION ELECTRIC FLEET & DOORSTEP GPS ============ */}
            {activeSlide === 1 && (
              <motion.div
                key="slide-1"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="w-full flex flex-col items-center"
              >
                <svg
                  viewBox="0 0 720 440"
                  className="w-full h-auto drop-shadow-xl"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Backdrop Road & Route */}
                  <path d="M80 340 Q360 380 640 340" stroke="#cbd5e1" strokeWidth="24" strokeLinecap="round" />
                  <path d="M80 340 Q360 380 640 340" stroke="#f8fafc" strokeWidth="2" strokeDasharray="12 12" />

                  {/* Electric Van Body */}
                  <g transform="translate(180, 150)">
                    {/* Shadow */}
                    <ellipse cx="180" cy="200" rx="170" ry="14" fill="#64748b" opacity="0.3" />

                    {/* Main Van Shell */}
                    <rect x="40" y="40" width="280" height="140" rx="20" fill="#ffffff" stroke="#0f766e" strokeWidth="4" />
                    <path d="M220 40 L280 40 C310 40 330 65 330 95 L330 180 L220 180 Z" fill="#0d9488" stroke="#0f766e" strokeWidth="4" />
                    
                    {/* Windshield */}
                    <path d="M230 55 L280 55 C295 55 310 70 315 95 L230 95 Z" fill="#cffafe" stroke="#0e7490" strokeWidth="2" />

                    {/* Green Eco Energy Stripe */}
                    <rect x="40" y="125" width="290" height="16" fill="#10b981" />
                    <text x="60" y="137" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                      ECOLOOP · 100% ELECTRIC ZERO-EMISSION FLEET
                    </text>

                    {/* Wheels */}
                    <circle cx="100" cy="185" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
                    <circle cx="100" cy="185" r="12" fill="#94a3b8" />
                    <circle cx="260" cy="185" r="26" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
                    <circle cx="260" cy="185" r="12" fill="#94a3b8" />

                    {/* Digital Scale Card Floating Beside Van */}
                    <g transform="translate(-100, 20)">
                      <rect x="0" y="0" width="130" height="85" rx="12" fill="#ffffff" stroke="#0284c7" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.07))" />
                      <text x="14" y="24" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="sans-serif">VERIFIED SCALE</text>
                      <text x="14" y="52" fill="#0284c7" fontSize="22" fontWeight="black" fontFamily="sans-serif">8.5 kg</text>
                      <text x="14" y="70" fill="#059669" fontSize="10" fontWeight="bold" fontFamily="sans-serif">✓ Digital Tare Sync</text>
                    </g>

                    {/* Driver Pill floating */}
                    <g transform="translate(180, -30)">
                      <rect x="0" y="0" width="160" height="50" rx="14" fill="#ffffff" stroke="#10b981" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.07))" />
                      <circle cx="25" cy="25" r="15" fill="#10b981" />
                      <text x="20" y="30" fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="sans-serif">RP</text>
                      <text x="48" y="22" fill="#0f172a" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Ramesh Patil</text>
                      <text x="48" y="38" fill="#059669" fontSize="9" fontWeight="600" fontFamily="sans-serif">MH-12-GN-4029 · ETA 14m</text>
                    </g>
                  </g>
                </svg>
              </motion.div>
            )}

            {/* ============ SLIDE 2: 100% RECYCLED REWARDS SCHEME ============ */}
            {activeSlide === 2 && (
              <motion.div
                key="slide-2"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="w-full flex flex-col items-center"
              >
                <svg
                  viewBox="0 0 720 440"
                  className="w-full h-auto drop-shadow-xl"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Central Circular Loop Glow */}
                  <circle cx="360" cy="210" r="130" stroke="#a7f3d0" strokeWidth="3" strokeDasharray="10 8" fill="#ecfdf5" opacity="0.7" />

                  {/* Circular Recycle Arrows */}
                  <path d="M300 90 A130 130 0 0 1 440 100" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
                  <polygon points="445,95 440,110 430,95" fill="#059669" />

                  <path d="M480 230 A130 130 0 0 1 360 340" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
                  <polygon points="360,345 350,335 365,330" fill="#059669" />

                  <path d="M240 230 A130 130 0 0 1 290 100" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
                  <polygon points="290,95 285,110 275,100" fill="#059669" />

                  {/* Gift Box Graphic (Center) */}
                  <g transform="translate(295, 140)">
                    <rect x="15" y="40" width="100" height="90" rx="8" fill="#0284c7" stroke="#0369a1" strokeWidth="3" />
                    <rect x="10" y="25" width="110" height="20" rx="6" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
                    {/* Ribbon */}
                    <rect x="58" y="25" width="14" height="105" fill="#facc15" />
                    <rect x="15" y="70" width="100" height="14" fill="#facc15" />
                    {/* Ribbon Bow */}
                    <circle cx="55" cy="20" r="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                    <circle cx="75" cy="20" r="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                  </g>

                  {/* Left Badge: 450 Points RPET Backpack */}
                  <g transform="translate(100, 150)">
                    <rect x="0" y="0" width="150" height="75" rx="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
                    <text x="16" y="24" fill="#0f766e" fontSize="10" fontWeight="bold" fontFamily="sans-serif">RECYCLED PET</text>
                    <text x="16" y="44" fill="#0f172a" fontSize="13" fontWeight="extrabold" fontFamily="sans-serif">Campus Backpack</text>
                    <text x="16" y="62" fill="#ca8a04" fontSize="11" fontWeight="bold" fontFamily="sans-serif">★ 450 EcoPoints</text>
                  </g>

                  {/* Right Badge: 150 Points Seed Paper Journal */}
                  <g transform="translate(470, 150)">
                    <rect x="0" y="0" width="150" height="75" rx="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
                    <text x="16" y="24" fill="#059669" fontSize="10" fontWeight="bold" fontFamily="sans-serif">PLANTABLE SEEDS</text>
                    <text x="16" y="44" fill="#0f172a" fontSize="13" fontWeight="extrabold" fontFamily="sans-serif">Eco Journal Kit</text>
                    <text x="16" y="62" fill="#ca8a04" fontSize="11" fontWeight="bold" fontFamily="sans-serif">★ 150 EcoPoints</text>
                  </g>

                  {/* Bottom Guarantee Banner */}
                  <g transform="translate(190, 360)">
                    <rect x="0" y="0" width="340" height="42" rx="12" fill="#ffffff" stroke="#059669" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.08))" />
                    <text x="35" y="26" fill="#065f46" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                      🚚 Delivered by your next garbage collection order!
                    </text>
                  </g>
                </svg>
              </motion.div>
            )}

            {/* ============ SLIDE 3: AI WASTE & MATERIAL SCANNER ============ */}
            {activeSlide === 3 && (
              <motion.div
                key="slide-3"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="w-full flex flex-col items-center"
              >
                <svg
                  viewBox="0 0 720 440"
                  className="w-full h-auto drop-shadow-xl"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Phone Bezel */}
                  <g transform="translate(230, 70)">
                    <rect x="0" y="0" width="260" height="340" rx="30" fill="#0f172a" stroke="#334155" strokeWidth="5" />
                    {/* Screen Glass */}
                    <rect x="12" y="14" width="236" height="312" rx="20" fill="#022c22" />

                    {/* Camera view finder corners */}
                    <path d="M40 70 L40 50 L60 50" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M200 70 L200 50 L180 50" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M40 180 L40 200 L60 200" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M200 180 L200 200 L180 200" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />

                    {/* Scanning Laser Beam */}
                    <line x1="30" y1="125" x2="210" y2="125" stroke="#34d399" strokeWidth="2.5" />
                    <rect x="30" y="115" width="180" height="20" fill="#10b981" opacity="0.15" />

                    {/* Scanned Plastic Bottle Silhouette */}
                    <rect x="110" y="80" width="20" height="15" rx="2" fill="#38bdf8" />
                    <path d="M100 95 L140 95 L135 170 L105 170 Z" fill="#0284c7" opacity="0.8" />

                    {/* Scan AI Result Pill */}
                    <g transform="translate(20, 230)">
                      <rect x="0" y="0" width="200" height="70" rx="14" fill="#ffffff" />
                      <text x="14" y="24" fill="#059669" fontSize="12" fontWeight="extrabold" fontFamily="sans-serif">
                        PET Plastic · 99.4%
                      </text>
                      <text x="14" y="42" fill="#334155" fontSize="10" fontFamily="sans-serif">
                        Rinse, crush & place in dry bin
                      </text>
                      <text x="14" y="58" fill="#ca8a04" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                        +15 EcoPoints per kg
                      </text>
                    </g>
                  </g>

                  {/* Floating AI Neural Sparkle Badges */}
                  <g transform="translate(90, 160)">
                    <circle cx="30" cy="30" r="28" fill="#ffffff" stroke="#10b981" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
                    <text x="18" y="38" fill="#10b981" fontSize="24">✨</text>
                  </g>
                  <g transform="translate(560, 200)">
                    <circle cx="30" cy="30" r="28" fill="#ffffff" stroke="#0284c7" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
                    <text x="18" y="38" fill="#0284c7" fontSize="24">⚡</text>
                  </g>
                </svg>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Dynamic Carousel Slide Text */}
        <div className="text-center mt-3 max-w-sm px-2 min-h-[64px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-slate-800 font-bold text-sm sm:text-base tracking-tight leading-snug">
                {slides[activeSlide]?.title}
              </p>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                {slides[activeSlide]?.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Interactive Carousel Dots (Cycling every 1.5s as requested) */}
      <div className="flex items-center justify-center gap-2 pt-2 z-10">
        {slides.map((s, idx) => {
          const isActive = activeSlide === idx;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                isActive
                  ? 'w-7 h-2 bg-[#0284c7] shadow-sm'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
              title={`Slide ${idx + 1}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          );
        })}
      </div>

    </div>
  );
};
