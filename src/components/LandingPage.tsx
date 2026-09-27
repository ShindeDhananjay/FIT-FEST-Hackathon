'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Recycle,
  MapPin,
  Calendar,
  Truck,
  Leaf,
  Award,
  ArrowRight,
  ChevronDown,
  Sparkles,
  BarChart3,
  Shield,
  Clock,
  Gift,
  CheckCircle2,
  ChevronRight,
  Scale,
  Zap,
} from 'lucide-react';
import { WASTE_CATEGORIES } from '@/constants/wasteCategories';
import { WasteCategory, CitizenUser } from '@/types/waste';
import { RewardsSection, RecycledRewardItem } from '@/components/RewardsSection';

interface LandingPageProps {
  onStartPickup: (category?: WasteCategory) => void;
  onScrollToHowItWorks: () => void;
  onLoginClick?: () => void;
  currentUser?: CitizenUser | null;
  userEcoPoints?: number;
  onRedeemReward?: (reward: RecycledRewardItem) => void;
  onOpenAiScanner?: () => void;
  onTrackPickup?: () => void;
}

const stagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
  },
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPickup,
  onScrollToHowItWorks,
  onLoginClick,
  currentUser = null,
  userEcoPoints = 0,
  onRedeemReward,
  onOpenAiScanner,
  onTrackPickup,
}) => {
  const categories = Object.entries(WASTE_CATEGORIES).slice(0, 6);

  const handleScrollToCategories = () => {
    const el = document.getElementById('categories');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToRewards = () => {
    const el = document.getElementById('rewards');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToWhyEcoLoop = () => {
    const el = document.getElementById('why-ecoloop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-white">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-32 text-center">
          <motion.div
            variants={stagger.container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center max-w-3xl mx-auto"
          >
            <motion.div variants={stagger.item}>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/80 mb-6 shadow-xs">
                <Recycle className="h-3.5 w-3.5 text-emerald-600 animate-spin-slow" />
                Smart Waste Management & Recycling
              </span>
            </motion.div>

            <motion.h1
              variants={stagger.item}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.12]"
            >
              Turn waste pickup into a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700">
                smarter, cleaner
              </span>{' '}
              experience.
            </motion.h1>

            <motion.p
              variants={stagger.item}
              className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl font-normal"
            >
              Schedule waste collections, track pickups in real time, manage recyclable
              materials and build a cleaner community — all from one simple platform.
            </motion.p>

            <motion.div variants={stagger.item} className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => onStartPickup()}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all active:scale-[0.98] cursor-pointer"
              >
                Request a Pickup
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onLoginClick || (() => onStartPickup())}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-50 hover:bg-teal-100/90 text-teal-800 font-semibold text-sm sm:text-base border border-teal-200/80 transition-all cursor-pointer"
              >
                <span>Citizen Sign In</span>
              </button>

              <button
                onClick={handleScrollToRewards}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-sm sm:text-base border border-amber-200/80 shadow-xs transition-all cursor-pointer"
              >
                <Gift className="h-4 w-4 text-amber-600" />
                <span>Rewards Scheme</span>
              </button>

              <button
                onClick={onScrollToHowItWorks}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm sm:text-base border border-gray-200 shadow-sm transition-all cursor-pointer"
              >
                <span>How It Works</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm sm:text-base border border-slate-200/80 transition-all cursor-pointer"
                title="Municipal Admin Operations Console"
              >
                <Shield className="h-4 w-4 text-indigo-600" />
                <span>Admin</span>
              </a>
            </motion.div>

            {/* Quick Section Jump Pills */}
            <motion.div variants={stagger.item} className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
              <span className="text-gray-400 text-[11px] mr-1">Quick Jump:</span>
              <button
                onClick={onScrollToHowItWorks}
                className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>🔄 How It Works</span>
              </button>
              <button
                onClick={handleScrollToCategories}
                className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80 hover:bg-blue-100 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>♻️ Categories</span>
              </button>
              <button
                onClick={handleScrollToRewards}
                className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>🎁 Rewards 🎁</span>
              </button>
              <button
                onClick={handleScrollToWhyEcoLoop}
                className="px-3 py-1.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 hover:bg-teal-100 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>🛡️ Why EcoLoop</span>
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={stagger.item} className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">Verified recycling</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">Real-time GPS tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">AI Waste Scanner</span>
              </div>
            </motion.div>

            {/* Live Civic Stats Strip */}
            <motion.div
              variants={stagger.item}
              className="mt-12 w-full grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-100/80 shadow-md shadow-emerald-500/5 text-left"
            >
              <div className="p-3 text-center border-r border-gray-100 last:border-r-0">
                <p className="text-2xl font-black text-gray-900">1,400+</p>
                <p className="text-xs text-gray-500 font-medium">Pickups Completed</p>
              </div>
              <div className="p-3 text-center sm:border-r border-gray-100 last:border-r-0">
                <p className="text-2xl font-black text-emerald-600">98.6%</p>
                <p className="text-xs text-gray-500 font-medium">On-Time Arrival</p>
              </div>
              <div className="p-3 text-center border-r border-gray-100 last:border-r-0">
                <p className="text-2xl font-black text-teal-600">14.5 T</p>
                <p className="text-xs text-gray-500 font-medium">Waste Diverted</p>
              </div>
              <div className="p-3 text-center">
                <p className="text-2xl font-black text-amber-600">4.9 ★</p>
                <p className="text-xs text-gray-500 font-medium">Citizen Rating</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              How EcoLoop Works
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              From request to recycling in four simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: Recycle, title: 'Select Waste', desc: 'Choose from categories like plastic, e-waste, organic, or metals.', step: 1, color: 'emerald' },
              { icon: MapPin, title: 'Set Location', desc: 'Pin your pickup address or auto-detect via GPS.', step: 2, color: 'teal' },
              { icon: Calendar, title: 'Schedule Pickup', desc: 'Pick a date and time slot that works for you.', step: 3, color: 'cyan' },
              { icon: Truck, title: 'Track & Earn', desc: 'Track your collector live and earn EcoPoints.', step: 4, color: 'emerald' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative text-center group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-600">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WASTE CATEGORIES ============ */}
      <section id="categories" className="py-20 sm:py-24 bg-gradient-to-b from-gray-50/70 via-white to-gray-50/50 scroll-mt-16 sm:scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200/80 mb-3 shadow-xs">
              <Recycle className="h-3.5 w-3.5 text-emerald-600 animate-spin-slow" />
              <span>Municipal Segregation Guide & Earnings</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Smart Waste Categories & Earning Rates
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Proper segregation ensures maximum recycling efficiency. Click any category to schedule a targeted collection and earn verified <strong>EcoPoints</strong>.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {categories.map(([key, cat], i) => {
              const categoryEmoji = key === 'organic' ? '🌿' : key === 'plastic' ? '♻️' : key === 'ewaste' ? '🔋' : key === 'hazardous' ? '⚠️' : key === 'paper' ? '📄' : '🔩';
              
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => onStartPickup(key as WasteCategory)}
                  className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 cursor-pointer flex flex-col justify-between group active:scale-[0.98]"
                >
                  <div>
                    {/* Header: Icon, Name & Points Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          {categoryEmoji}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {cat.name}
                          </h3>
                          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                            <Leaf className="h-3 w-3" />
                            <span>{cat.co2Factor}kg CO₂ saved/kg</span>
                          </span>
                        </div>
                      </div>

                      <div className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs font-black shrink-0 flex items-center gap-1 shadow-xs">
                        <Award className="h-3.5 w-3.5 text-amber-600" />
                        <span>+{cat.ecoPointsPerKg} pts/kg</span>
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-xs text-gray-500 leading-relaxed font-normal mt-2">
                      {cat.tagline}
                    </p>

                    {/* Examples Pills */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                        Accepted Materials:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.examples.slice(0, 3).map((ex, exIdx) => (
                          <span
                            key={exIdx}
                            className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 text-[11px] border border-gray-100"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="mt-5 pt-3 border-t border-gray-100/80 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                    <span className="flex items-center gap-1">
                      <span>Schedule {cat.name.split(' ')[0]}</span>
                    </span>
                    <div className="w-7 h-7 rounded-full bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ ECOPOINTS & RECYCLED REWARDS SCHEME ============ */}
      <RewardsSection
        currentUser={currentUser}
        userEcoPoints={userEcoPoints}
        onRequestPickup={() => onStartPickup()}
        onLoginClick={onLoginClick}
        onRedeemPoints={onRedeemReward}
      />

      {/* ============ IMPACT SECTION ============ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Environmental Impact
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              Every pickup contributes to a cleaner, greener future.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Leaf, label: 'CO₂ Offset', value: '417 kg', desc: 'Carbon emissions prevented', color: 'emerald' },
              { icon: Recycle, label: 'Waste Diverted', value: '144.5 kg', desc: 'Kept from landfills', color: 'teal' },
              { icon: Award, label: 'EcoPoints Earned', value: '3,600', desc: 'Community rewards given', color: 'amber' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-sm font-semibold text-gray-700 mt-1">{stat.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY ECOLOOP ============ */}
      <section id="why-ecoloop" className="py-20 sm:py-24 bg-gradient-to-b from-emerald-50/60 via-teal-50/30 to-white scroll-mt-16 sm:scroll-mt-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-200/80 mb-3 shadow-xs">
              <Shield className="h-3.5 w-3.5 text-teal-700" />
              <span>Civic Trust & Circular Reliability</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Why EcoLoop Works Properly
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              We eliminated fragmented collections, unverified dumping, and lack of citizen incentives. Here is how EcoLoop guarantees a seamless, rewarded zero-waste cycle from your doorstep.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: AI Scanner */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">AI-Powered Waste Scanner</h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Snap a quick photo with your camera. Our AI classifies polymer resin codes, detects recyclability, and computes your expected EcoPoints automatically.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={onOpenAiScanner}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Try AI Scanner 📷</span>
                </button>
              </div>
            </motion.div>

            {/* Feature 2: Real-time GPS Fleet Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-3xl bg-white border border-teal-100 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Live GPS Fleet Tracking</h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Never wait blindly on the sidewalk. Watch your assigned PMC driver on the live Pune map with turn-by-turn ETA updates and driver phone contact.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={onTrackPickup}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Truck className="h-3.5 w-3.5 text-teal-600" />
                  <span>Track Pickups Live 🚚</span>
                </button>
              </div>
            </motion.div>

            {/* Feature 3: 100% Recycled Rewards Scheme */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="p-6 rounded-3xl bg-white border border-amber-100 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                  <Gift className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Circular Rewards Scheme</h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Earn EcoPoints on every kilogram. Redeem points for backpacks made from recycled PET bottles, plantable seed journals, or Pune Metro rides!
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={handleScrollToRewards}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Gift className="h-3.5 w-3.5 text-amber-600" />
                  <span>Explore Recycled Rewards 🎁</span>
                </button>
              </div>
            </motion.div>

            {/* Feature 4: Doorstep Weighing */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                  <Scale className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Doorstep Digital Scale Weighing</h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Municipal drivers carry certified Bluetooth hanging scales. Bags are weighed in your presence, and points are locked into your account in real time.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 py-2 rounded-xl">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Zero Discrepancy Guarantee</span>
              </div>
            </motion.div>

            {/* Feature 5: Verified Landfill Diversion */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Zero-Landfill Certification</h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Every batch is delivered strictly to PMC-authorized recycling centers and composting hubs. Download verified ESG impact certificates for societies and schools.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 py-2 rounded-xl">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>PMC Authorized Recyclers</span>
              </div>
            </motion.div>

            {/* Feature 6: Dignified Livelihoods */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-3xl bg-white border border-indigo-100 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Supporting Waste Workers</h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  EcoLoop empowers municipal drivers and women's self-help groups with digital route optimization, safety gear, and above-market hourly incentives.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 py-2 rounded-xl">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
                <span>Fair Trade Civic Employment</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight relative z-10">
                Ready for a cleaner community?
              </h2>
              <p className="mt-3 text-emerald-100 text-sm sm:text-base relative z-10 max-w-md mx-auto">
                Schedule your first waste collection in under two minutes.
              </p>
              <button
                onClick={() => onStartPickup()}
                className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-emerald-700 font-bold text-sm shadow-lg transition-all active:scale-[0.97] cursor-pointer relative z-10"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-gray-100 bg-white py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Recycle className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="font-bold text-gray-900">Eco<span className="text-emerald-600">Loop</span></span>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-400">
            <span>© 2026 EcoLoop · Pune Civic Waste Operations</span>
            <span>·</span>
            <a href="/driver" className="font-semibold text-slate-600 hover:text-emerald-600 flex items-center gap-1 transition-colors">
              <Truck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Delivery Partner (/driver)</span>
            </a>
            <span>·</span>
            <a href="/admin" className="font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors">
              <Shield className="h-3.5 w-3.5 text-indigo-600" />
              <span>Admin Operations (/admin)</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};
