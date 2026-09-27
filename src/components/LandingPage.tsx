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
} from 'lucide-react';
import { WASTE_CATEGORIES } from '@/constants/wasteCategories';
import { WasteCategory } from '@/types/waste';

interface LandingPageProps {
  onStartPickup: () => void;
  onScrollToHowItWorks: () => void;
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

export const LandingPage: React.FC<LandingPageProps> = ({ onStartPickup, onScrollToHowItWorks }) => {
  const categories = Object.entries(WASTE_CATEGORIES).slice(0, 6);

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
                onClick={onStartPickup}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all active:scale-[0.98] cursor-pointer"
              >
                Request a Pickup
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onScrollToHowItWorks}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm sm:text-base border border-gray-200 shadow-sm transition-all cursor-pointer"
              >
                Explore How It Works
                <ChevronDown className="h-4 w-4" />
              </button>

              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm sm:text-base border border-slate-200/80 transition-all cursor-pointer"
                title="Municipal Admin Operations Console"
              >
                <Shield className="h-4 w-4 text-indigo-600" />
                <span>Admin /admin</span>
              </a>
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
      <section className="py-20 sm:py-24 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Smart Waste Categories
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              Proper segregation means better recycling. We handle every type.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(([key, cat], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-100 transition-colors">
                  <span className="text-xl">
                    {key === 'organic' ? '🌿' : key === 'plastic' ? '♻️' : key === 'ewaste' ? '🔋' : key === 'hazardous' ? '⚠️' : key === 'paper' ? '📄' : '🔩'}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{cat.name.split(' ')[0]}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat.ecoPointsPerKg} pts/kg</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
      <section className="py-20 sm:py-24 bg-emerald-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Why EcoLoop?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'AI-Powered Scanner', desc: 'Snap a photo and let AI identify your waste type and suggest the right category instantly.' },
              { icon: BarChart3, title: 'Impact Dashboard', desc: 'Track your personal carbon offset, recycled materials, and community leaderboard ranking.' },
              { icon: Shield, title: 'Verified Recycling', desc: 'Get digital recycling certificates that prove your waste was properly processed.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
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
                onClick={onStartPickup}
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
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>© 2026 EcoLoop · Pune Civic Waste Operations</span>
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
