'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  ShoppingBag,
  ExternalLink,
  Info,
  X,
  ChevronRight,
  TrendingUp,
  Leaf,
  Recycle,
  Tag,
  Truck,
  PackageCheck,
} from 'lucide-react';
import { CitizenUser } from '@/types/waste';

export interface RecycledRewardItem {
  id: string;
  title: string;
  points: number;
  category: string;
  badge: string;
  badgeColor: string;
  recycledFrom: string;
  wasteDivertedKg: number;
  description: string;
  keyFeatures: string[];
  imageUrl: string;
}

export const RECYCLED_REWARDS: RecycledRewardItem[] = [
  {
    id: 'RWD-PET-BAG',
    title: '100% Recycled PET Campus & Travel Backpack',
    points: 450,
    category: 'Lifestyle & Travel',
    badge: '🔥 Most Popular',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    recycledFrom: 'Made from 28 recycled PET mineral water bottles',
    wasteDivertedKg: 30,
    description: 'Durable, weather-resistant everyday backpack crafted from post-consumer plastic bottles collected across Pune.',
    keyFeatures: ['Padded 15.6" laptop sleeve', 'Water-repellent coating', 'Ergonomic breathable straps'],
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'RWD-SEED-PAPER',
    title: 'Plantable Seed Paper Journal & Herb Pencils',
    points: 150,
    category: 'Stationery & Study',
    badge: '🌱 Zero-Waste & Plantable',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    recycledFrom: 'Made from 100% college exam papers & cotton rag scrap',
    wasteDivertedKg: 12,
    description: 'Handmade eco-notebook with pages infused with basil and marigold seeds. When filled, plant pages directly in soil to sprout fresh herbs!',
    keyFeatures: ['Zero tree-pulp used', 'Pack of 5 graphite seed pencils', 'Naturally biodegradable binding'],
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'RWD-THERMAL-FLASK',
    title: 'Upcycled Aerospace Aluminum Thermal Flask (750ml)',
    points: 320,
    category: 'Zero-Waste Gear',
    badge: '❄️ 24h Cold / 12h Hot',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    recycledFrom: 'Salvaged from beverage cans & aerospace alloy offcuts',
    wasteDivertedKg: 16,
    description: 'Double-wall vacuum insulated flask designed to keep drinks icy cold for 24 hours. Prevents hundreds of single-use disposable cups.',
    keyFeatures: ['Double-wall vacuum insulation', 'Laser-etched Pune EcoLoop seal', '100% BPA and toxin free'],
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'RWD-COMPOST-BAG',
    title: 'Pune Microbial Rich Organic Garden Compost (5 kg)',
    points: 100,
    category: 'Urban Gardening',
    badge: '🌿 100% Organic Soil Food',
    badgeColor: 'bg-lime-100 text-lime-800 border-lime-200',
    recycledFrom: 'Aerobically converted from canteen organic food scraps',
    wasteDivertedKg: 10,
    description: 'Nutrient-rich, weed-free natural organic fertilizer produced from kitchen leftovers collected through EcoLoop community doorsteps.',
    keyFeatures: ['Rich in nitrogen & friendly microbes', 'Odour-free and sealed package', 'Ideal for balcony pots & herbs'],
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'RWD-DENIM-SLEEVE',
    title: 'Artisan Upcycled Denim Laptop Sleeve & Tote',
    points: 280,
    category: 'Fashion & Tech',
    badge: '✨ Handcrafted by Pune SHGs',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    recycledFrom: 'Crafted from discarded jeans & post-industrial denim cuts',
    wasteDivertedKg: 8,
    description: 'Heavyweight patchwork denim sleeve with protective cushioning, stitched by Pune women artisan self-help cooperatives.',
    keyFeatures: ['Shock-absorbent quilted fleece', 'Heavy-duty brass zipper', 'Includes matching denim tote bag'],
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'RWD-METRO-PASS',
    title: 'Pune Metro Green Commuter Card (10 Free Rides)',
    points: 200,
    category: 'Civic Mobility',
    badge: '🚇 Clean City Transport',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    recycledFrom: 'Sponsored by PMC Green Urban Mobility Fund',
    wasteDivertedKg: 15,
    description: 'Travel clean without traffic emissions. Recharges your MahaMetro transit card with 10 free rides across Purple & Aqua lines.',
    keyFeatures: ['Valid on PCMC-Swargate & Vanaz-Ramwadi lines', 'Instant digital coupon PIN', 'Transfers seamlessly to Metro app'],
    imageUrl: '/images/pune_metro_reward.jpg',
  },
];

interface RewardsSectionProps {
  currentUser: CitizenUser | null;
  userEcoPoints?: number;
  onRequestPickup: () => void;
  onLoginClick?: () => void;
  onRedeemPoints?: (reward: RecycledRewardItem) => void;
}

export const RewardsSection: React.FC<RewardsSectionProps> = ({
  currentUser,
  userEcoPoints = 0,
  onRequestPickup,
  onLoginClick,
  onRedeemPoints,
}) => {
  const [selectedReward, setSelectedReward] = useState<RecycledRewardItem | null>(null);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [insufficientModal, setInsufficientModal] = useState<RecycledRewardItem | null>(null);

  // Dynamic user points balance
  const activePoints = currentUser ? (currentUser.ecoPoints || userEcoPoints) : userEcoPoints;

  const handleRedeemClick = (reward: RecycledRewardItem) => {
    if (!currentUser) {
      if (onLoginClick) onLoginClick();
      else onRequestPickup();
      return;
    }

    if (activePoints < reward.points) {
      setInsufficientModal(reward);
      return;
    }

    // Citizen has enough points! Generate redemption token
    const uniqueToken = `ECO-RWD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setRedeemedCode(uniqueToken);
    setSelectedReward(reward);

    if (onRedeemPoints) {
      onRedeemPoints(reward);
    }
  };

  return (
    <section id="rewards" className="py-20 sm:py-24 bg-gradient-to-b from-white via-emerald-50/30 to-white relative overflow-hidden scroll-mt-16 sm:scroll-mt-20">
      
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200/80 mb-4 shadow-xs"
          >
            <Gift className="h-3.5 w-3.5 text-amber-600" />
            <span>EcoPoints & Circular Rewards Scheme</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Turn Your Waste into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
              100% Recycled Rewards
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
          >
            Every kilogram of sorted waste collected by EcoLoop earns verified <strong>EcoPoints</strong>.
            Redeem points directly for high-utility items manufactured from the very materials Pune citizens recycle!
          </motion.p>

          {/* Citizen Live Status Pill */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {currentUser ? (
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-600/20">
                <Award className="h-4 w-4 text-amber-300" />
                <span>
                  Welcome, <strong>{currentUser.name}</strong> · Your Balance: <strong>{activePoints} EcoPoints</strong>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-ping" />
              </div>
            ) : (
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Sign in to view your balance & claim physical rewards</span>
                {onLoginClick && (
                  <button
                    onClick={onLoginClick}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Sign In →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ============ HOW THE POINTS SCHEME WORKS (4-STEP BANNER) ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 p-6 sm:p-8 rounded-3xl bg-white border border-emerald-100 shadow-xl shadow-emerald-500/5"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Earning Rate Card
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                How Do You Earn EcoPoints?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Points are credited to your citizen wallet automatically as soon as our driver verifies and weighs your pickup.
              </p>
            </div>

            <button
              onClick={onRequestPickup}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Schedule Pickup to Earn</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Points Rates Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
            {[
              { icon: '🔋', name: 'E-Waste', rate: '+40 pts/kg', note: 'Laptops, phones & batteries', highlight: 'text-amber-600' },
              { icon: '⚠️', name: 'Hazardous', rate: '+25 pts/kg', note: 'Safely packed chemicals', highlight: 'text-rose-600' },
              { icon: '🔩', name: 'Metal Scrap', rate: '+20 pts/kg', note: 'Tins, pipes, appliances', highlight: 'text-slate-700' },
              { icon: '♻️', name: 'Plastics', rate: '+15 pts/kg', note: 'Clean PET bottles & tubs', highlight: 'text-sky-600' },
              { icon: '📄', name: 'Paper/Carton', rate: '+12 pts/kg', note: 'Boxes, books, paper', highlight: 'text-amber-700' },
              { icon: '🌿', name: 'Organic Waste', rate: '+10 pts/kg', note: 'Kitchen peels & food', highlight: 'text-emerald-600' },
            ].map((tier, idx) => (
              <div
                key={tier.name}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-center"
              >
                <span className="text-2xl block mb-1">{tier.icon}</span>
                <p className="text-xs font-bold text-slate-800">{tier.name}</p>
                <p className={`text-sm font-black mt-0.5 ${tier.highlight}`}>{tier.rate}</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">{tier.note}</p>
              </div>
            ))}
          </div>

          {/* Step flow */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="flex items-center gap-3 sm:block">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center justify-center mb-1">1</span>
              <p className="text-xs font-bold text-slate-800">Segregate at Home</p>
              <p className="text-[11px] text-slate-500 hidden sm:block">Separate dry, wet, and e-waste.</p>
            </div>
            <div className="flex items-center gap-3 sm:block">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center justify-center mb-1">2</span>
              <p className="text-xs font-bold text-slate-800">Free Doorstep Pickup</p>
              <p className="text-[11px] text-slate-500 hidden sm:block">Collector arrives with digital scale.</p>
            </div>
            <div className="flex items-center gap-3 sm:block">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center justify-center mb-1">3</span>
              <p className="text-xs font-bold text-slate-800">Instant EcoPoints</p>
              <p className="text-[11px] text-slate-500 hidden sm:block">Weight logged & credited instantly.</p>
            </div>
            <div className="flex items-center gap-3 sm:block">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold inline-flex items-center justify-center mb-1">4</span>
              <p className="text-xs font-bold text-slate-800">Get Recycled Rewards</p>
              <p className="text-[11px] text-slate-500 hidden sm:block">Delivered right to your doorstep!</p>
            </div>
          </div>
        </motion.div>

        {/* ============ 6 RECYCLED REWARDS SHOWCASE ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {RECYCLED_REWARDS.map((reward, i) => {
            const canAfford = activePoints >= reward.points;

            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col justify-between bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={reward.imageUrl}
                      alt={reward.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback gracefully to high-res green transit/recycling placeholder
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-xs ${reward.badgeColor}`}>
                        {reward.badge}
                      </span>
                    </div>

                    {/* Points cost tag */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-100 flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-black text-slate-900">{reward.points}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Points</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
                      <span className="uppercase tracking-wider text-emerald-700 font-bold">{reward.category}</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Leaf className="h-3 w-3 text-emerald-500" />
                        <span>~{reward.wasteDivertedKg}kg waste diverted</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {reward.title}
                    </h3>

                    {/* Recycled origin banner */}
                    <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
                      <Recycle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-emerald-900 font-medium leading-tight">
                        {reward.recycledFrom}
                      </span>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {reward.description}
                    </p>

                    {/* Features list */}
                    <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                      {reward.keyFeatures.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer / Action */}
                <div className="p-5 sm:p-6 pt-0 space-y-2">
                  <button
                    onClick={() => handleRedeemClick(reward)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer shadow-sm ${
                      currentUser && canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-md'
                        : currentUser && !canAfford
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="h-4 w-4" />
                      <span>
                        {currentUser
                          ? canAfford
                            ? `Claim Reward (${reward.points} EcoPoints)`
                            : `Need ${reward.points - activePoints} more pts to claim`
                          : `Claim Reward (${reward.points} pts)`}
                      </span>
                    </div>
                  </button>

                  {/* Prominent Next Garbage Collection Delivery Notice */}
                  <div className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50/90 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800 text-center">
                    <Truck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>You’ll get this reward by your next garbage collection order! 🚚</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Motivation Callout */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold">Start Your Circular Recycling Journey Today</h4>
              <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                Every bottle, paper carton, and old smartphone is a ticket to genuine recycled gear.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onRequestPickup}
              className="px-6 py-3 rounded-xl bg-white hover:bg-gray-100 text-emerald-800 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Book Doorstep Collection
            </button>
          </div>
        </div>

      </div>

      {/* ============ SUCCESSFUL REDEMPTION CELEBRATION MODAL ============ */}
      <AnimatePresence>
        {selectedReward && redeemedCode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative"
            >
              <button
                onClick={() => { setSelectedReward(null); setRedeemedCode(null); }}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-9 w-9" />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Reward Claimed Successfully!
                </span>

                <h3 className="text-xl font-extrabold text-slate-900 mt-3">
                  {selectedReward.title}
                </h3>

                <p className="text-xs text-slate-500 mt-2">
                  Deducted <strong>{selectedReward.points} EcoPoints</strong> from your citizen balance.
                </p>

                {/* Delivery by next garbage collection order guarantee */}
                <div className="my-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-left flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950">
                      Delivered by Your Next Garbage Collection Order! 🚚
                    </p>
                    <p className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
                      Our municipal driver will hand over this reward right at your doorstep when collecting your next waste pickup order.
                    </p>
                  </div>
                </div>

                {/* Redemption voucher code */}
                <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-dashed border-emerald-300">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Your Redemption Claim Voucher
                  </span>
                  <span className="text-lg font-mono font-black text-emerald-700 tracking-wider">
                    {redeemedCode}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Quote this code to your driver during collection, or collect directly at Flora Campus Eco-Hub!
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedReward(null);
                      setRedeemedCode(null);
                      onRequestPickup();
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                  >
                    Schedule Pickup to Receive Delivery
                  </button>
                  <button
                    onClick={() => { setSelectedReward(null); setRedeemedCode(null); }}
                    className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Close & Keep Exploring
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============ INSUFFICIENT POINTS MODAL ============ */}
      <AnimatePresence>
        {insufficientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative text-center"
            >
              <button
                onClick={() => setInsufficientModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Award className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Almost There!
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                <strong>{insufficientModal.title}</strong> costs <strong>{insufficientModal.points} EcoPoints</strong>.
                You currently have <strong>{activePoints} points</strong>.
              </p>

              <div className="my-4 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
                You need <strong>{insufficientModal.points - activePoints} more points</strong>.
                Just recycle ~{Math.ceil((insufficientModal.points - activePoints) / 15)} kg of plastics or paper to unlock this item!
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setInsufficientModal(null);
                    onRequestPickup();
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Schedule Pickup to Earn Points
                </button>
                <button
                  onClick={() => setInsufficientModal(null)}
                  className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Explore Other Rewards
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
