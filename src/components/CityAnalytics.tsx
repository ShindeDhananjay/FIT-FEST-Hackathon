'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Recycle,
  Award,
  Leaf,
  Zap,
  Droplets,
  BarChart3,
  Trophy,
  ArrowUpRight,
} from 'lucide-react';
import { WastePickupRequest, CitizenImpactProfile } from '@/types/waste';
import { WASTE_CATEGORIES } from '@/constants/wasteCategories';

interface CityAnalyticsProps {
  requests: WastePickupRequest[];
  userProfile: CitizenImpactProfile;
}

const CATEGORY_EMOJI: Record<string, string> = {
  organic: '🌿', plastic: '♻️', ewaste: '🔋', hazardous: '⚠️', paper: '📄', metal: '🔩',
};

const LEADERBOARD_USERS = [
  { rank: 1, name: 'Ananya Deshpande', zone: 'Kothrud', points: 2840, kg: 210, badge: 'Zero-Waste Champion' },
  { rank: 2, name: 'Flora Tech C-Mess Team', zone: 'Campus Hub', points: 2190, kg: 175, badge: 'Eco Pioneer' },
  { rank: 3, name: 'Ravi Mane', zone: 'Shivaji Nagar', points: 1850, kg: 145, badge: 'Green Warrior' },
  { rank: 4, name: 'Priya Joshi', zone: 'Hinjewadi', points: 1450, kg: 115, badge: 'Recycling Pro' },
  { rank: 5, name: 'Sahil Gupta', zone: 'Baner', points: 1100, kg: 92, badge: 'Eco Starter' },
];

export const CityAnalytics: React.FC<CityAnalyticsProps> = ({ requests, userProfile }) => {

  const categoryBreakdown = Object.keys(WASTE_CATEGORIES).map((catKey) => {
    const matching = requests.filter((r) => r.category === catKey);
    const weight = matching.reduce((acc, r) => acc + r.estimatedWeightKg, 0);
    const co2 = matching.reduce((acc, r) => acc + r.co2OffsetKg, 0);
    return {
      category: catKey,
      name: WASTE_CATEGORIES[catKey as keyof typeof WASTE_CATEGORIES].name,
      count: matching.length,
      weight,
      co2,
    };
  });

  const totalKg = requests.reduce((acc, r) => acc + r.estimatedWeightKg, 0);
  const totalCo2 = requests.reduce((acc, r) => acc + r.co2OffsetKg, 0);
  const treesEquivalent = Math.round(totalCo2 / 21);
  const kwhEnergySaved = Math.round(totalKg * 1.8);
  const waterLitersSaved = Math.round(totalKg * 14.5);

  const maxWeight = Math.max(...categoryBreakdown.map((c) => c.weight), 1);

  return (
    <div className="w-full min-h-[calc(100vh-4.5rem)] bg-gradient-to-b from-[#f8faf9] to-[#edf3ef] py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Full-width Header */}
        <div className="mb-8 pb-6 border-b border-gray-200/80">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
              Eco-Metrics & Citizen Ledger
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Environmental Impact Dashboard
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Track your verified carbon offset, materials recycled, and community leaderboard ranking.
          </p>
        </div>

      {/* Your Profile Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'EcoPoints', value: userProfile.ecoPoints.toLocaleString(), icon: Award, color: 'amber' },
          { label: 'Waste Diverted', value: `${userProfile.totalKgRecycled.toFixed(0)} kg`, icon: Recycle, color: 'emerald' },
          { label: 'CO₂ Saved', value: `${userProfile.co2SavedKg.toFixed(0)} kg`, icon: Leaf, color: 'teal' },
          { label: 'Total Pickups', value: userProfile.totalPickups, icon: TrendingUp, color: 'blue' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
              <stat.icon className="h-4.5 w-4.5 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-5">Waste by Category</h2>
          <div className="space-y-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{CATEGORY_EMOJI[cat.category] || '📦'}</span>
                    <span className="text-sm font-medium text-gray-700">{cat.name.split('(')[0].split('&')[0].trim()}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{cat.weight.toFixed(1)} kg</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all"
                    style={{ width: `${(cat.weight / maxWeight) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Equivalencies */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-5">Environmental Equivalencies</h2>
          <div className="space-y-4">
            {[
              { icon: '🌲', label: 'Trees Equivalent', value: `${treesEquivalent} trees/year`, desc: 'CO₂ absorption capacity' },
              { icon: '⚡', label: 'Energy Saved', value: `${kwhEnergySaved} kWh`, desc: 'From recycled materials' },
              { icon: '💧', label: 'Water Saved', value: `${waterLitersSaved} litres`, desc: 'Industrial water offset' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <p className="text-base font-extrabold text-emerald-600">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" /> Community Leaderboard
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-xs font-semibold text-gray-400 uppercase w-12">Rank</th>
                  <th className="text-left py-3 text-xs font-semibold text-gray-400 uppercase">Name</th>
                  <th className="text-left py-3 text-xs font-semibold text-gray-400 uppercase hidden sm:table-cell">Zone</th>
                  <th className="text-left py-3 text-xs font-semibold text-gray-400 uppercase hidden sm:table-cell">Badge</th>
                  <th className="text-right py-3 text-xs font-semibold text-gray-400 uppercase">Points</th>
                  <th className="text-right py-3 text-xs font-semibold text-gray-400 uppercase">Recycled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {LEADERBOARD_USERS.map((user) => (
                  <tr key={user.rank} className="hover:bg-gray-50/50">
                    <td className="py-3">
                      <span className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold ${
                        user.rank === 1 ? 'bg-amber-100 text-amber-700' :
                        user.rank === 2 ? 'bg-gray-100 text-gray-600' :
                        user.rank === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-50 text-gray-400'
                      }`}>
                        {user.rank}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-gray-900">{user.name}</td>
                    <td className="py-3 text-gray-500 hidden sm:table-cell">{user.zone}</td>
                    <td className="py-3 hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">{user.badge}</span>
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-600">{user.points.toLocaleString()}</td>
                    <td className="py-3 text-right text-gray-700">{user.kg} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
